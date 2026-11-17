/**
 * Demo-only admin identity, roles and page permissions.
 *
 * There is no backend: everything lives in this browser's localStorage. The
 * built-in super admin is the default signed-in identity so the whole panel
 * stays usable, while custom roles can be given access to selected pages.
 */
import { adminNavGroups, type AdminNavItem } from "@/lib/admin-nav";

export { adminNavGroups };

export const ADMIN_ACCESS_KEY = "talknest-admin-access-v1";
export const SUPER_ADMIN_ROLE_ID = "super-admin";
export const SUPER_ADMIN_USER_ID = "admin-super";

export interface AdminRole {
  id: string;
  name: string;
  description: string;
  /** Admin page hrefs this role may open. `*` means every page. */
  permissions: string[];
  system?: boolean;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  /** JPEG data URL produced by fileToDataUrl. */
  avatar?: string;
  roleId: string;
  batch: string;
  status: "active" | "invited";
  joinedAt: string;
  /** Demo password only — never a real credential. */
  password: string;
}

export interface AdminAccessState {
  users: AdminUser[];
  roles: AdminRole[];
  currentUserId: string;
}

const defaultRoles: AdminRole[] = [
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
    createdAt: "2026-01-05T00:00:00.000Z",
  },
  {
    id: "role-order-manager",
    name: "Order Manager",
    description: "Orders, customers and the catalogue.",
    permissions: ["/admin", "/admin/orders", "/admin/customers", "/admin/catalog"],
    createdAt: "2026-01-08T00:00:00.000Z",
  },
];

const defaultUsers: AdminUser[] = [
  {
    id: SUPER_ADMIN_USER_ID,
    name: "Admin",
    email: "admin@talknestbd.com",
    roleId: SUPER_ADMIN_ROLE_ID,
    batch: "Batch 01",
    status: "active",
    joinedAt: "2026-01-01T00:00:00.000Z",
    password: "demo1234",
  },
  {
    id: "user-sadia",
    name: "Sadia Rahman",
    email: "sadia@talknestbd.com",
    roleId: "role-content-editor",
    batch: "Batch 02",
    status: "active",
    joinedAt: "2026-02-12T00:00:00.000Z",
    password: "demo1234",
  },
  {
    id: "user-tanvir",
    name: "Tanvir Ahmed",
    email: "tanvir@talknestbd.com",
    roleId: "role-order-manager",
    batch: "Batch 02",
    status: "invited",
    joinedAt: "2026-03-03T00:00:00.000Z",
    password: "demo1234",
  },
];

export function defaultAdminAccessState(): AdminAccessState {
  return {
    users: defaultUsers.map((user) => ({ ...user })),
    roles: defaultRoles.map((role) => ({ ...role, permissions: [...role.permissions] })),
    currentUserId: SUPER_ADMIN_USER_ID,
  };
}

export function readAdminAccess(): AdminAccessState {
  const fallback = defaultAdminAccessState();
  if (typeof window === "undefined") return fallback;

  try {
    const raw = window.localStorage.getItem(ADMIN_ACCESS_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<AdminAccessState>;
    const roles = Array.isArray(parsed.roles) ? parsed.roles : fallback.roles;
    const users = Array.isArray(parsed.users) ? parsed.users : fallback.users;

    // Always keep the built-in super admin available, even after bad edits.
    const hasSuperRole = roles.some((role) => role.id === SUPER_ADMIN_ROLE_ID);
    const hasSuperUser = users.some((user) => user.id === SUPER_ADMIN_USER_ID);
    const safeRoles = hasSuperRole
      ? roles
      : [...fallback.roles.filter((role) => role.id === SUPER_ADMIN_ROLE_ID), ...roles];
    const safeUsers = hasSuperUser
      ? users
      : [...fallback.users.filter((user) => user.id === SUPER_ADMIN_USER_ID), ...users];

    return {
      roles: safeRoles,
      users: safeUsers,
      currentUserId:
        typeof parsed.currentUserId === "string" &&
        safeUsers.some((user) => user.id === parsed.currentUserId)
          ? parsed.currentUserId
          : SUPER_ADMIN_USER_ID,
    };
  } catch {
    return fallback;
  }
}

export function writeAdminAccess(state: AdminAccessState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(ADMIN_ACCESS_KEY, JSON.stringify(state));
  } catch {
    // A full localStorage quota must not break the demo UI.
  }
}

export function createId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

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

export function canRoleAccess(role: AdminRole | undefined, href: string): boolean {
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

export function findUser(state: AdminAccessState, id: string): AdminUser | undefined {
  return state.users.find((user) => user.id === id);
}

export function findRole(state: AdminAccessState, id: string): AdminRole | undefined {
  return state.roles.find((role) => role.id === id);
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
