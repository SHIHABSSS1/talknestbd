/**
 * Idempotent admin seed.
 *
 * Reads SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD from .env.local (or .env),
 * creates the user with role="admin" and a Better Auth credential account, and
 * can be re-run to rotate that password. No secret value is ever logged.
 *
 *   npm run db:seed:admin
 */
import { randomUUID } from "node:crypto";

import { config } from "dotenv";
import { hashPassword } from "better-auth/crypto";
import postgres from "postgres";

import { defaultAdminRoles, SUPER_ADMIN_ROLE_ID } from "../admin-defaults";

config({ path: [".env.local", ".env"] });

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in .env.local first.");
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    throw new Error("SEED_ADMIN_EMAIL is not a valid email address.");
  }
  if (password.length < 8) {
    throw new Error("SEED_ADMIN_PASSWORD must be at least 8 characters.");
  }

  const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
  if (!url) {
    throw new Error("Set DATABASE_URL_UNPOOLED or DATABASE_URL before seeding.");
  }

  const sql = postgres(url, { max: 1, prepare: false, onnotice: () => {} });
  const hash = await hashPassword(password);

  try {
    const existing = await sql<{ id: string }[]>`
      select id from "user" where email = ${email} limit 1
    `;
    const userId = existing[0]?.id ?? randomUUID();
    const now = new Date();

    await sql`
      insert into "user" (id, name, email, email_verified, role, created_at, updated_at)
      values (${userId}, ${"TalkNest Admin"}, ${email}, true, ${"admin"}, ${now}, ${now})
      on conflict (email) do update set
        name = excluded.name,
        email_verified = true,
        role = ${"admin"},
        updated_at = excluded.updated_at
    `;

    await sql`
      delete from account where user_id = ${userId} and provider_id = ${"credential"}
    `;
    await sql`
      insert into account (id, user_id, provider_id, account_id, password, created_at, updated_at)
      values (
        ${randomUUID()},
        ${userId},
        ${"credential"},
        ${userId},
        ${hash},
        ${now},
        ${now}
      )
    `;

    // Roles used by /admin/users. Re-running the seed restores the built-ins
    // but leaves any custom roles and their assignments untouched.
    for (const role of defaultAdminRoles) {
      await sql`
        insert into roles (id, name, description, permissions, system, created_at, updated_at)
        values (
          ${role.id},
          ${role.name},
          ${role.description},
          ${JSON.stringify(role.permissions)}::jsonb,
          ${role.system},
          ${now},
          ${now}
        )
        on conflict (id) do update set
          name = excluded.name,
          description = excluded.description,
          permissions = excluded.permissions,
          system = excluded.system,
          updated_at = excluded.updated_at
      `;
    }
    await sql`delete from user_roles where user_id = ${userId}`;
    await sql`
      insert into user_roles (user_id, role_id) values (${userId}, ${SUPER_ADMIN_ROLE_ID})
      on conflict do nothing
    `;

    console.log("Admin ready: role=admin, email verified, Super Admin role assigned.");
  } finally {
    await sql.end({ timeout: 5 });
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
