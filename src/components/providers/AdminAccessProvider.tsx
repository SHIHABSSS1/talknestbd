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
  ADMIN_ACCESS_KEY,
  SUPER_ADMIN_ROLE_ID,
  SUPER_ADMIN_USER_ID,
  adminNavGroups,
  canRoleAccess,
  defaultAdminAccessState,
  findRole,
  readAdminAccess,
  writeAdminAccess,
  type AdminAccessState,
  type AdminRole,
  type AdminUser,
} from "@/lib/admin-access";

interface AdminAccessContextValue {
  hydrated: boolean;
  users: AdminUser[];
  roles: AdminRole[];
  currentUser: AdminUser | undefined;
  currentRole: AdminRole | undefined;
  isSuperAdmin: boolean;
  canAccessPage: (href: string) => boolean;
  visibleNavGroups: typeof adminNavGroups;
  updateProfile: (values: { name: string; email: string }) => void;
  changePassword: (current: string, next: string) => { ok: boolean; message: string };
  setAvatar: (dataUrl: string | null) => void;
  saveRole: (role: AdminRole) => void;
  deleteRole: (id: string) => void;
  saveUser: (user: AdminUser) => void;
  deleteUser: (id: string) => void;
  switchUser: (id: string) => void;
  resetDemo: () => void;
}

const AdminAccessContext = createContext<AdminAccessContextValue | null>(null);

export function AdminAccessProvider({ children }: { children: ReactNode }) {
  // Start from the same defaults on server and client; load localStorage after
  // hydration so the rendered markup always matches.
  const [state, setState] = useState<AdminAccessState>(() => defaultAdminAccessState());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(readAdminAccess());
    setHydrated(true);
    const onStorage = (event: StorageEvent) => {
      if (event.key === ADMIN_ACCESS_KEY || event.key === null) {
        setState(readAdminAccess());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const persist = useCallback((next: AdminAccessState) => {
    writeAdminAccess(next);
    setState(next);
  }, []);

  const currentUser = useMemo(
    () => state.users.find((user) => user.id === state.currentUserId),
    [state.users, state.currentUserId],
  );
  const currentRole = useMemo(
    () => (currentUser ? findRole(state, currentUser.roleId) : undefined),
    [currentUser, state],
  );
  const isSuperAdmin = currentUser?.roleId === SUPER_ADMIN_ROLE_ID;

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
    (values: { name: string; email: string }) => {
      setState((current) => {
        const next = {
          ...current,
          users: current.users.map((user) =>
            user.id === current.currentUserId ? { ...user, ...values } : user,
          ),
        };
        writeAdminAccess(next);
        return next;
      });
    },
    [],
  );

  const changePassword = useCallback(
    (currentPassword: string, nextPassword: string) => {
      if (!currentUser) return { ok: false, message: "No admin is signed in." };
      if (currentPassword !== currentUser.password) {
        return { ok: false, message: "Current password does not match." };
      }
      if (nextPassword.length < 6) {
        return { ok: false, message: "New password must be at least 6 characters." };
      }
      persist({
        ...state,
        users: state.users.map((user) =>
          user.id === currentUser.id ? { ...user, password: nextPassword } : user,
        ),
      });
      return { ok: true, message: "Password updated in this browser." };
    },
    [currentUser, persist, state],
  );

  const setAvatar = useCallback(
    (dataUrl: string | null) => {
      setState((current) => {
        const next = {
          ...current,
          users: current.users.map((user) =>
            user.id === current.currentUserId
              ? { ...user, avatar: dataUrl ?? undefined }
              : user,
          ),
        };
        writeAdminAccess(next);
        return next;
      });
    },
    [],
  );

  const saveRole = useCallback(
    (role: AdminRole) => {
      setState((current) => {
        const exists = current.roles.some(
          (item) => item.id === role.id && item.id !== SUPER_ADMIN_ROLE_ID,
        );
        const next = {
          ...current,
          roles: exists
            ? current.roles.map((item) => (item.id === role.id ? role : item))
            : [...current.roles, role],
        };
        writeAdminAccess(next);
        return next;
      });
    },
    [],
  );

  const deleteRole = useCallback(
    (id: string) => {
      setState((current) => {
        if (id === SUPER_ADMIN_ROLE_ID) return current;
        const next = {
          ...current,
          roles: current.roles.filter((role) => role.id !== id),
          users: current.users.map((user) =>
            user.roleId === id ? { ...user, roleId: SUPER_ADMIN_ROLE_ID } : user,
          ),
        };
        writeAdminAccess(next);
        return next;
      });
    },
    [],
  );

  const saveUser = useCallback(
    (user: AdminUser) => {
      setState((current) => {
        const exists = current.users.some((item) => item.id === user.id);
        const next = {
          ...current,
          users: exists
            ? current.users.map((item) => (item.id === user.id ? user : item))
            : [...current.users, user],
        };
        writeAdminAccess(next);
        return next;
      });
    },
    [],
  );

  const deleteUser = useCallback(
    (id: string) => {
      setState((current) => {
        if (id === SUPER_ADMIN_USER_ID) return current;
        const next = {
          ...current,
          users: current.users.filter((user) => user.id !== id),
          currentUserId:
            current.currentUserId === id ? SUPER_ADMIN_USER_ID : current.currentUserId,
        };
        writeAdminAccess(next);
        return next;
      });
    },
    [],
  );

  const switchUser = useCallback(
    (id: string) => {
      setState((current) => {
        if (!current.users.some((user) => user.id === id)) return current;
        const next = { ...current, currentUserId: id };
        writeAdminAccess(next);
        return next;
      });
    },
    [],
  );

  const resetDemo = useCallback(() => {
    persist(defaultAdminAccessState());
  }, [persist]);

  const value = useMemo<AdminAccessContextValue>(
    () => ({
      hydrated,
      users: state.users,
      roles: state.roles,
      currentUser,
      currentRole,
      isSuperAdmin,
      canAccessPage,
      visibleNavGroups,
      updateProfile,
      changePassword,
      setAvatar,
      saveRole,
      deleteRole,
      saveUser,
      deleteUser,
      switchUser,
      resetDemo,
    }),
    [
      hydrated,
      state.users,
      state.roles,
      currentUser,
      currentRole,
      isSuperAdmin,
      canAccessPage,
      visibleNavGroups,
      updateProfile,
      changePassword,
      setAvatar,
      saveRole,
      deleteRole,
      saveUser,
      deleteUser,
      switchUser,
      resetDemo,
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
