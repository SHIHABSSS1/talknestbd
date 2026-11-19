/**
 * Shared admin role definitions.
 *
 * Plain data only — no React, no database, no `server-only` — so the seed
 * script, the API routes and the client provider all agree on the same ids.
 */
export const SUPER_ADMIN_ROLE_ID = "super-admin";
export const SUPER_ADMIN_USER_ID = "admin-super";

export interface AdminRole {
  id: string;
  name: string;
  description: string;
  /** Admin page hrefs this role may open. `*` means every page. */
  permissions: string[];
  system: boolean;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  /** Better Auth `user.image` — a /media URL or null. */
  image: string | null;
  roleId: string | null;
  roleName: string | null;
  status: "active" | "invited";
  joinedAt: string;
}

/** Payload accepted by /api/admin/users (never a raw AdminUser). */
export interface AdminUserInput {
  id?: string;
  name: string;
  email: string;
  roleId: string;
  status: "active" | "invited";
  /** Optional credential password. Invited users get none until they set one. */
  password?: string;
}

export interface SaveResult {
  ok: boolean;
  message: string;
}

export const defaultAdminRoles: AdminRole[] = [
  {
    id: SUPER_ADMIN_ROLE_ID,
    name: "Super Admin",
    description: "All admin pages, including users and roles.",
    permissions: ["*"],
    system: true,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "role-content-editor",
    name: "Content Editor",
    description: "Books, blogs and homepage sections.",
    permissions: [
      "/admin",
      "/admin/books",
      "/admin/blogs",
      "/admin/catalog",
      "/admin/sections/hero",
      "/admin/sections/viral-books",
    ],
    system: false,
    createdAt: "2026-01-05T00:00:00.000Z",
  },
  {
    id: "role-order-manager",
    name: "Order Manager",
    description: "Orders, customers and the catalogue.",
    permissions: ["/admin", "/admin/orders", "/admin/customers", "/admin/catalog"],
    system: false,
    createdAt: "2026-01-08T00:00:00.000Z",
  },
];
