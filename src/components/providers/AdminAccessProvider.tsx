"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  adminNavGroups,
  canRoleAccess,
  findRole,
  type AdminRole,
  type AdminUser,
  type AdminUserInput,
  type SaveResult,
} from "@/lib/admin-access";

type AccessResponse = {
  currentUser: AdminUser | null;
  currentRole: AdminRole | null;
  roles: AdminRole[];
  users: AdminUser[];
};

type RoleInput = Pick<AdminRole, "name" | "description" | "permissions"> & { id?: string };

interface AdminAccessContextValue {
  hydrated: boolean;
  error: string | null;
  users: AdminUser[];
  roles: AdminRole[];
  currentUser: AdminUser | undefined;
  currentRole: AdminRole | undefined;
  isSuperAdmin: boolean;
  canAccessPage: (href: string) => boolean;
  visibleNavGroups: typeof adminNavGroups;
  refresh: () => Promise<void>;
  updateProfile: (values: { name: string; email: string }) => Promise<SaveResult>;
  changePassword: (current: string, next: string) => Promise<SaveResult>;
  setAvatar: (url: string | null) => Promise<SaveResult>;
  saveRole: (role: RoleInput) => Promise<SaveResult>;
  deleteRole: (id: string) => Promise<SaveResult>;
  saveUser: (user: AdminUserInput) => Promise<SaveResult>;
  deleteUser: (id: string) => Promise<SaveResult>;
}

const AdminAccessContext = createContext<AdminAccessContextValue | null>(null);

async function apiRequest<T>(url: string, init?: RequestInit): Promise<SaveResult & { data?: T }> {
  try {
    const response = await fetch(url, {
      ...init,
      cache: "no-store",
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
    const payload = (await response.json().catch(() => null)) as
      | (T & { error?: string })
      | { error?: string }
      | null;
    if (!response.ok) {
      const message =
        payload && "error" in payload && typeof payload.error === "string"
          ? payload.error
          : "The request could not be completed.";
      return { ok: false, message };
    }
    return { ok: true, message: "Saved.", data: payload as T };
  } catch {
    return { ok: false, message: "Could not reach the server. Check your connection." };
  }
}

export function AdminAccessProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AccessResponse>({
    currentUser: null,
    currentRole: null,
    roles: [],
    users: [],
  });
  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const result = await apiRequest<AccessResponse>("/api/admin/access");
    if (result.ok && result.data) {
      setData(result.data);
      setError(null);
      setHydrated(true);
      return;
    }
    setError(result.message);
    setHydrated(true);
    if (result.message === "Sign in required." || result.message === "Admin access required.") {
      window.location.assign("/admin/login");
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const currentUser = data.currentUser ?? undefined;
  const currentRole = data.currentRole ?? undefined;
  const isSuperAdmin = currentRole?.permissions.includes("*") ?? false;

  const canAccessPage = useCallback(
    (href: string) => canRoleAccess(currentRole, href),
    [currentRole],
  );

  const visibleNavGroups = useMemo(
    () =>
      adminNavGroups
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => canAccessPage(item.href)),
        }))
        .filter((group) => group.items.length > 0),
    [canAccessPage],
  );

  const updateProfile = useCallback(
    async (values: { name: string; email: string }) => {
      const result = await apiRequest("/api/admin/profile", {
        method: "PATCH",
        body: JSON.stringify({ ...values, image: data.currentUser?.image ?? null }),
      });
      if (result.ok) await refresh();
      return { ok: result.ok, message: result.ok ? "Profile saved." : result.message };
    },
    [data.currentUser?.image, refresh],
  );

  const changePassword = useCallback(async (current: string, next: string) => {
    const result = await apiRequest("/api/admin/profile/password", {
      method: "POST",
      body: JSON.stringify({ currentPassword: current, newPassword: next }),
    });
    return { ok: result.ok, message: result.ok ? "Password updated." : result.message };
  }, []);

  const setAvatar = useCallback(
    async (url: string | null) => {
      const result = await apiRequest("/api/admin/profile", {
        method: "PATCH",
        body: JSON.stringify({
          name: data.currentUser?.name ?? "Admin",
          email: data.currentUser?.email ?? "",
          image: url,
        }),
      });
      if (result.ok) await refresh();
      return { ok: result.ok, message: result.ok ? "Profile picture saved." : result.message };
    },
    [data.currentUser?.name, data.currentUser?.email, refresh],
  );

  const saveRole = useCallback(
    async (role: RoleInput) => {
      const result = await apiRequest(
        role.id ? `/api/admin/roles/${encodeURIComponent(role.id)}` : "/api/admin/roles",
        {
          method: role.id ? "PATCH" : "POST",
          body: JSON.stringify({
            name: role.name,
            description: role.description,
            permissions: role.permissions,
          }),
        },
      );
      if (result.ok) await refresh();
      return { ok: result.ok, message: result.ok ? "Role saved." : result.message };
    },
    [refresh],
  );

  const deleteRole = useCallback(
    async (id: string) => {
      const result = await apiRequest(`/api/admin/roles/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (result.ok) await refresh();
      return { ok: result.ok, message: result.ok ? "Role deleted." : result.message };
    },
    [refresh],
  );

  const saveUser = useCallback(
    async (user: AdminUserInput) => {
      const result = await apiRequest(
        user.id ? `/api/admin/users/${encodeURIComponent(user.id)}` : "/api/admin/users",
        {
          method: user.id ? "PATCH" : "POST",
          body: JSON.stringify(user),
        },
      );
      if (result.ok) await refresh();
      return { ok: result.ok, message: result.ok ? "Admin user saved." : result.message };
    },
    [refresh],
  );

  const deleteUser = useCallback(
    async (id: string) => {
      const result = await apiRequest(`/api/admin/users/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (result.ok) await refresh();
      return { ok: result.ok, message: result.ok ? "Admin user deleted." : result.message };
    },
    [refresh],
  );

  const value = useMemo<AdminAccessContextValue>(
    () => ({
      hydrated,
      error,
      users: data.users,
      roles: data.roles,
      currentUser,
      currentRole,
      isSuperAdmin,
      canAccessPage,
      visibleNavGroups,
      refresh,
      updateProfile,
      changePassword,
      setAvatar,
      saveRole,
      deleteRole,
      saveUser,
      deleteUser,
    }),
    [
      hydrated,
      error,
      data.users,
      data.roles,
      currentUser,
      currentRole,
      isSuperAdmin,
      canAccessPage,
      visibleNavGroups,
      refresh,
      updateProfile,
      changePassword,
      setAvatar,
      saveRole,
      deleteRole,
      saveUser,
      deleteUser,
    ],
  );

  return (
    <AdminAccessContext.Provider value={value}>{children}</AdminAccessContext.Provider>
  );
}

export function useAdminAccess(): AdminAccessContextValue {
  const context = useContext(AdminAccessContext);
  if (!context) {
    throw new Error("useAdminAccess must be used within an AdminAccessProvider");
  }
  return context;
}

/** Convenience for components that only need to find a role in the loaded list. */
export function useAdminRole(id: string | null | undefined): AdminRole | undefined {
  const { roles } = useAdminAccess();
  return findRole(roles, id);
}
