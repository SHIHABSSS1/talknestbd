/**
 * Demo-only admin session. There is no backend — the "login" is a flag stored
 * in localStorage so the panel can show a signed-in state across reloads.
 */
export const ADMIN_SESSION_KEY = "talknest_admin_session";

export function isAdminLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(ADMIN_SESSION_KEY) === "active";
}

export function loginAdmin(): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ADMIN_SESSION_KEY, "active");
}

export function logoutAdmin(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ADMIN_SESSION_KEY);
}
