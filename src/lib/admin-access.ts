/**
 * Admin navigation and role helpers shared by the server and the browser.
 *
 * The old browser-local demo store lived here. Users and roles now come from
 * Postgres through /api/admin/*; this module keeps only the pure, client-safe
 * pieces — the nav catalogue and the permission check.
 */
import { adminNavGroups, type AdminNavItem } from "@/lib/admin-nav";
import {
  SUPER_ADMIN_ROLE_ID,
  type AdminRole,
  type AdminUser,
  type AdminUserInput,
  type SaveResult,
} from "@/lib/admin-defaults";

export { adminNavGroups } from "@/lib/admin-nav";
export {
  SUPER_ADMIN_ROLE_ID,
  SUPER_ADMIN_USER_ID,
  defaultAdminRoles,
  type AdminRole,
  type AdminUser,
  type AdminUserInput,
  type SaveResult,
} from "@/lib/admin-defaults";

/** Every admin page a role can be granted, grouped for the permission editor. */
export const adminPageOptions: AdminNavGroupOption[] = [
  ...adminNavGroups.map((group) => ({
    label: group.label,
    items: group.items.map((item: AdminNavItem) => ({
      label: item.label,
      href: item.href,
    })),
  })),
];

export interface AdminNavGroupOption {
  label: string;
  items: { label: string; href: string }[];
}

export function allPageHrefs(): string[] {
  return adminPageOptions.flatMap((group) => group.items.map((item) => item.href));
}

/** Users & roles is deliberately reserved for the built-in super admin. */
export function isSuperOnlyPage(href: string): boolean {
  return href === "/admin/users";
}

export function canRoleAccess(role: AdminRole | null | undefined, href: string): boolean {
  if (!role) return false;
  if (role.id === SUPER_ADMIN_ROLE_ID || role.permissions.includes("*")) return true;
  if (isSuperOnlyPage(href)) return false;
  if (role.permissions.includes(href)) return true;
  // A role granted a section route also reaches its child routes.
  if (href.startsWith("/admin/sections/")) {
    return role.permissions.some(
      (permission) => permission === href || permission === "/admin/sections/" + href.split("/").pop(),
    );
  }
  return false;
}

export function findRole(roles: AdminRole[], id: string | null | undefined): AdminRole | undefined {
  return id ? roles.find((role) => role.id === id) : undefined;
}

export function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function formatJoined(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}
