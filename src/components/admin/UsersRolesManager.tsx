"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check,
  ChevronRight,
  KeyRound,
  Layers3,
  LockKeyhole,
  Pencil,
  Plus,
  RotateCcw,
  Save,
  ShieldCheck,
  Trash2,
  UserCog,
  UsersRound,
  X,
} from "lucide-react";
import { useAdminAccess } from "@/components/providers/AdminAccessProvider";
import {
  adminPageOptions,
  createId,
  formatJoined,
  initials,
  isSuperOnlyPage,
  SUPER_ADMIN_ROLE_ID,
  SUPER_ADMIN_USER_ID,
  type AdminRole,
  type AdminUser,
} from "@/lib/admin-access";

const inputClass =
  "w-full rounded-[4px] border border-line bg-white px-3 py-2.5 text-[12px] text-ink placeholder:text-muted/60 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/15";
const labelClass = "mb-1.5 block text-[11px] font-semibold text-ink";
const primaryBtn =
  "inline-flex h-9 items-center gap-1.5 rounded-[4px] bg-brand-600 px-4 text-[11px] font-semibold text-white transition-colors hover:bg-brand-700";
const secondaryBtn =
  "inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-line px-4 text-[11px] font-medium text-ink transition-colors hover:border-brand-300 hover:bg-brand-50";
const iconBtn =
  "grid h-7 w-7 place-items-center rounded-[4px] text-muted transition-colors hover:bg-brand-50 hover:text-brand-700";

export function UsersRolesManager() {
  const {
    hydrated,
    users,
    roles,
    currentUser,
    isSuperAdmin,
    saveRole,
    deleteRole,
    saveUser,
    deleteUser,
    switchUser,
    resetDemo,
  } = useAdminAccess();

  // Role editor state
  const [roleFormOpen, setRoleFormOpen] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [roleName, setRoleName] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [rolePermissions, setRolePermissions] = useState<string[]>([]);
  const [roleNotice, setRoleNotice] = useState("");

  // User editor state
  const [userFormOpen, setUserFormOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userBatch, setUserBatch] = useState("Batch 03");
  const [userRoleId, setUserRoleId] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userStatus, setUserStatus] = useState<AdminUser["status"]>("active");
  const [userNotice, setUserNotice] = useState("");

  const closeRoleForm = () => {
    setRoleFormOpen(false);
    setEditingRoleId(null);
    setRoleName("");
    setRoleDescription("");
    setRolePermissions([]);
    setRoleNotice("");
  };

  const openRoleForm = (role?: AdminRole) => {
    setEditingRoleId(role?.id ?? null);
    setRoleName(role?.name ?? "");
    setRoleDescription(role?.description ?? "");
    setRolePermissions(role ? [...role.permissions] : []);
    setRoleNotice("");
    setRoleFormOpen(true);
  };

  const closeUserForm = () => {
    setUserFormOpen(false);
    setEditingUserId(null);
    setUserName("");
    setUserEmail("");
    setUserBatch("Batch 03");
    setUserRoleId("");
    setUserPassword("");
    setUserStatus("active");
    setUserNotice("");
  };

  const openUserForm = (user?: AdminUser) => {
    setEditingUserId(user?.id ?? null);
    setUserName(user?.name ?? "");
    setUserEmail(user?.email ?? "");
    setUserBatch(user?.batch ?? "Batch 03");
    setUserRoleId(user?.roleId ?? roles[0]?.id ?? "");
    setUserPassword("");
    setUserStatus(user?.status ?? "active");
    setUserNotice("");
    setUserFormOpen(true);
  };

  const togglePermission = (href: string) => {
    if (isSuperOnlyPage(href)) return;
    setRolePermissions((current) =>
      current.includes(href)
        ? current.filter((item) => item !== href)
        : [...current, href],
    );
    setRoleNotice("");
  };

  const selectAllPermissions = () => {
    setRolePermissions(
      adminPageOptions
        .flatMap((group) => group.items)
        .filter((item) => !isSuperOnlyPage(item.href))
        .map((item) => item.href),
    );
  };

  const saveRoleForm = (event: React.FormEvent) => {
    event.preventDefault();
    if (!roleName.trim()) {
      setRoleNotice("Enter a role name.");
      return;
    }
    if (rolePermissions.length === 0) {
      setRoleNotice("Select access to at least one page.");
      return;
    }
    const existing = roles.find((role) => role.id === editingRoleId);
    const role: AdminRole = {
      id: existing?.id ?? createId("role"),
      name: roleName.trim(),
      description: roleDescription.trim() || "Custom admin role",
      permissions: rolePermissions,
      createdAt: existing?.createdAt ?? new Date().toISOString(),
    };
    saveRole(role);
    closeRoleForm();
  };

  const saveUserForm = (event: React.FormEvent) => {
    event.preventDefault();
    if (!userName.trim() || !/^\S+@\S+\.\S+$/.test(userEmail.trim())) {
      setUserNotice("Enter a valid name and email address.");
      return;
    }
    if (!userRoleId) {
      setUserNotice("Choose a role first.");
      return;
    }
    const existing = users.find((user) => user.id === editingUserId);
    const user: AdminUser = {
      id: existing?.id ?? createId("user"),
      name: userName.trim(),
      email: userEmail.trim(),
      avatar: existing?.avatar,
      roleId: userRoleId,
      batch: userBatch.trim() || "Batch —",
      status: userStatus,
      joinedAt: existing?.joinedAt ?? new Date().toISOString(),
      password: userPassword.trim() || existing?.password || "demo1234",
    };
    saveUser(user);
    closeUserForm();
  };

  // Only the built-in super admin may manage users and roles.
  if (hydrated && !isSuperAdmin) {
    return (
      <div className="mx-auto max-w-xl">
        <section className="rounded-[10px] border border-line bg-white p-6 sm:p-8">
          <span className="grid h-11 w-11 place-items-center rounded-[9px] bg-brand-50 text-brand-700">
            <LockKeyhole size={20} />
          </span>
          <h1 className="mt-4 font-display text-xl font-bold text-ink">
            Super admin only
          </h1>
          <p className="mt-2 text-[12px] leading-relaxed text-muted">
            You are previewing as{" "}
            <span className="font-semibold text-ink">
              {currentUser?.name ?? "another user"}
            </span>
            . Return to the super admin account to manage users and roles.
          </p>
          <button
            type="button"
            onClick={() => switchUser(SUPER_ADMIN_USER_ID)}
            className={`${primaryBtn} mt-5`}
          >
            <RotateCcw size={13} /> Back to super admin
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-1.5 text-[11px] text-muted">
          <Link href="/admin" className="hover:text-brand-700">
            Dashboard
          </Link>
          <span>/</span>
          <span className="font-semibold text-ink">Users &amp; roles</span>
        </div>
        <h1 className="mt-2 font-display text-2xl font-bold text-ink">
          Users &amp; roles
        </h1>
        <p className="mt-1 text-[12px] text-muted">
          Create custom roles and grant each role access to specific admin pages.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[8px] border border-brand-100 bg-brand-50 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-600 text-white">
            <ShieldCheck size={16} />
          </span>
          <div>
            <p className="text-[11px] font-semibold text-brand-900">
              Signed in as super admin
            </p>
            <p className="text-[9px] text-brand-800">
              {currentUser?.name ?? "Admin"} · {currentUser?.batch ?? "Batch 01"} ·
              full access to every page
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={resetDemo}
          className={`${secondaryBtn} border-brand-200 bg-white`}
        >
          <RotateCcw size={12} /> Reset demo
        </button>
      </div>

      <div className="rounded-[8px] border border-brand-100 bg-white px-4 py-3">
        <p className="text-[10px] leading-relaxed text-muted">
          <span className="font-semibold text-ink">Demo note:</span> users, roles
          and permissions live only in this browser&apos;s localStorage. No
          accounts are created on a server and no real login is used.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total users", value: users.length, icon: UsersRound },
          {
            label: "Active",
            value: users.filter((user) => user.status === "active").length,
            icon: Check,
          },
          { label: "Roles", value: roles.length, icon: Layers3 },
          {
            label: "Admin pages",
            value: adminPageOptions.flatMap((group) => group.items).length,
            icon: ShieldCheck,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-[8px] border border-line bg-white px-3 py-3"
          >
            <div className="flex items-center gap-2 text-muted">
              <stat.icon size={13} />
              <span className="text-[9px] font-medium">{stat.label}</span>
            </div>
            <p className="mt-1.5 font-display text-lg font-bold text-ink">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {/* Roles */}
        <section className="h-fit rounded-[10px] border border-line bg-white">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3.5 sm:px-5">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-[8px] bg-brand-50 text-brand-700">
                <Layers3 size={15} />
              </span>
              <div>
                <h2 className="text-[13px] font-semibold text-ink">Custom roles</h2>
                <p className="text-[10px] text-muted">
                  Set page-by-page permissions
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => (roleFormOpen ? closeRoleForm() : openRoleForm())}
              className={primaryBtn}
            >
              {roleFormOpen ? <X size={13} /> : <Plus size={13} />}
              {roleFormOpen ? "Cancel" : "New role"}
            </button>
          </div>

          <div className="p-4 sm:p-5">
            {roleFormOpen && (
              <form
                onSubmit={saveRoleForm}
                className="mb-5 rounded-[8px] border border-brand-100 bg-brand-50/40 p-4"
              >
                <p className="mb-3 text-[11px] font-semibold text-ink">
                  {editingRoleId ? "Edit role" : "Create a new role"}
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className={labelClass}>Custom role name</span>
                    <input
                      value={roleName}
                      onChange={(event) => {
                        setRoleName(event.target.value);
                        setRoleNotice("");
                      }}
                      placeholder="e.g. Inventory Manager"
                      className={inputClass}
                      required
                    />
                  </label>
                  <label className="block">
                    <span className={labelClass}>Description</span>
                    <input
                      value={roleDescription}
                      onChange={(event) => setRoleDescription(event.target.value)}
                      placeholder="What this role handles"
                      className={inputClass}
                    />
                  </label>
                </div>

                <div className="mt-4 flex items-center justify-between gap-2">
                  <p className="text-[10px] font-semibold text-ink">
                    Page access ({rolePermissions.length} selected)
                  </p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={selectAllPermissions}
                      className="text-[10px] font-semibold text-brand-700 hover:underline"
                    >
                      Select all
                    </button>
                    <button
                      type="button"
                      onClick={() => setRolePermissions([])}
                      className="text-[10px] font-semibold text-muted hover:underline"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="mt-2 max-h-64 space-y-3 overflow-y-auto rounded-[6px] border border-line bg-white p-3">
                  {adminPageOptions.map((group) => (
                    <div key={group.label}>
                      <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-wide text-muted">
                        {group.label}
                      </p>
                      <div className="grid gap-1 sm:grid-cols-2">
                        {group.items.map((item) => {
                          const locked = isSuperOnlyPage(item.href);
                          const checked = rolePermissions.includes(item.href);
                          return (
                            <label
                              key={item.href}
                              className={`flex items-center gap-2 rounded-[4px] px-2 py-1.5 text-[10px] ${
                                locked
                                  ? "cursor-not-allowed text-muted"
                                  : "cursor-pointer text-body hover:bg-brand-50"
                              }`}
                              title={
                                locked
                                  ? "Super admin access only"
                                  : undefined
                              }
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                disabled={locked}
                                onChange={() => togglePermission(item.href)}
                                className="h-3.5 w-3.5 shrink-0 accent-brand-600"
                              />
                              <span className="truncate">{item.label}</span>
                              {locked && <LockKeyhole size={10} className="ml-auto" />}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <button type="submit" className={primaryBtn}>
                    <Save size={13} /> Save role
                  </button>
                  <button type="button" onClick={closeRoleForm} className={secondaryBtn}>
                    Cancel
                  </button>
                  {roleNotice && (
                    <span className="text-[10px] font-medium text-clay-600">
                      {roleNotice}
                    </span>
                  )}
                </div>
              </form>
            )}

            <div className="space-y-3">
              {roles.map((role) => {
                const isSystem = role.id === SUPER_ADMIN_ROLE_ID;
                const firstPages = adminPageOptions
                  .flatMap((group) => group.items)
                  .filter(
                    (item) =>
                      role.permissions.includes("*") ||
                      role.permissions.includes(item.href),
                  )
                  .slice(0, 3);
                return (
                  <div
                    key={role.id}
                    className="rounded-[8px] border border-line p-3.5 transition-colors hover:border-brand-200"
                  >
                    <div className="flex items-start gap-2.5">
                      <span
                        className={`grid h-8 w-8 shrink-0 place-items-center rounded-[7px] ${
                          isSystem
                            ? "bg-brand-100 text-brand-700"
                            : "bg-canvas text-muted"
                        }`}
                      >
                        {isSystem ? <ShieldCheck size={14} /> : <Layers3 size={14} />}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-[11px] font-semibold text-ink">
                            {role.name}
                          </p>
                          {isSystem && (
                            <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[8px] font-semibold text-brand-700">
                              Built-in
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-[9px] leading-relaxed text-muted">
                          {role.description}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[8px] font-medium text-brand-700">
                            {role.permissions.includes("*")
                              ? "All pages"
                              : `${role.permissions.length} pages`}
                          </span>
                          {!role.permissions.includes("*") &&
                            firstPages.map((item) => (
                              <span
                                key={item.href}
                                className="rounded-full bg-canvas px-2 py-0.5 text-[8px] text-muted"
                              >
                                {item.label}
                              </span>
                            ))}
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-0.5">
                        {!isSystem && (
                          <>
                            <button
                              type="button"
                              onClick={() => openRoleForm(role)}
                              className={iconBtn}
                              aria-label={`Edit ${role.name}`}
                            >
                              <Pencil size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteRole(role.id)}
                              className={`${iconBtn} hover:bg-clay-500/5 hover:text-clay-600`}
                              aria-label={`Delete ${role.name}`}
                            >
                              <Trash2 size={13} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Users */}
        <section className="h-fit rounded-[10px] border border-line bg-white">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3.5 sm:px-5">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-[8px] bg-brand-50 text-brand-700">
                <UsersRound size={15} />
              </span>
              <div>
                <h2 className="text-[13px] font-semibold text-ink">Admin users</h2>
                <p className="text-[10px] text-muted">
                  Assign roles and batches
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => (userFormOpen ? closeUserForm() : openUserForm())}
              className={primaryBtn}
            >
              {userFormOpen ? <X size={13} /> : <Plus size={13} />}
              {userFormOpen ? "Cancel" : "New user"}
            </button>
          </div>

          <div className="p-4 sm:p-5">
            {userFormOpen && (
              <form
                onSubmit={saveUserForm}
                className="mb-5 rounded-[8px] border border-brand-100 bg-brand-50/40 p-4"
              >
                <p className="mb-3 text-[11px] font-semibold text-ink">
                  {editingUserId ? "Edit user" : "Add a new admin"}
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className={labelClass}>Name</span>
                    <input
                      value={userName}
                      onChange={(event) => setUserName(event.target.value)}
                      className={inputClass}
                      required
                    />
                  </label>
                  <label className="block">
                    <span className={labelClass}>Email</span>
                    <input
                      type="email"
                      value={userEmail}
                      onChange={(event) => setUserEmail(event.target.value)}
                      className={inputClass}
                      required
                    />
                  </label>
                  <label className="block">
                    <span className={labelClass}>Batch</span>
                    <input
                      value={userBatch}
                      onChange={(event) => setUserBatch(event.target.value)}
                      className={inputClass}
                      placeholder="Batch 03"
                    />
                  </label>
                  <label className="block">
                    <span className={labelClass}>Role</span>
                    <select
                      value={userRoleId}
                      onChange={(event) => setUserRoleId(event.target.value)}
                      className={inputClass}
                      required
                    >
                      <option value="">Select a role</option>
                      {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className={labelClass}>Demo password</span>
                    <input
                      value={userPassword}
                      onChange={(event) => setUserPassword(event.target.value)}
                      className={inputClass}
                      placeholder={editingUserId ? "Leave blank to keep" : "demo1234"}
                    />
                  </label>
                  <label className="block">
                    <span className={labelClass}>Status</span>
                    <select
                      value={userStatus}
                      onChange={(event) =>
                        setUserStatus(event.target.value as AdminUser["status"])
                      }
                      className={inputClass}
                    >
                      <option value="active">Active</option>
                      <option value="invited">Invited</option>
                    </select>
                  </label>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <button type="submit" className={primaryBtn}>
                    <Save size={13} /> Save user
                  </button>
                  <button type="button" onClick={closeUserForm} className={secondaryBtn}>
                    Cancel
                  </button>
                  {userNotice && (
                    <span className="text-[10px] font-medium text-clay-600">
                      {userNotice}
                    </span>
                  )}
                </div>
              </form>
            )}

            <div className="space-y-3">
              {users.map((user) => {
                const role = roles.find((item) => item.id === user.roleId);
                const isSuperUser = user.id === SUPER_ADMIN_USER_ID;
                const isCurrent = user.id === currentUser?.id;
                return (
                  <div
                    key={user.id}
                    className={`rounded-[8px] border p-3.5 transition-colors ${
                      isCurrent
                        ? "border-brand-300 bg-brand-50/40"
                        : "border-line hover:border-brand-200"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full bg-brand-600 text-[10px] font-bold text-white">
                        {user.avatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={user.avatar} alt="" className="h-full w-full object-cover" />
                        ) : (
                          initials(user.name)
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-[11px] font-semibold text-ink">
                            {user.name}
                          </p>
                          {isSuperUser && (
                            <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[8px] font-semibold text-brand-700">
                              Super Admin
                            </span>
                          )}
                          {isCurrent && (
                            <span className="rounded-full bg-mint/25 px-2 py-0.5 text-[8px] font-semibold text-forest-700">
                              Signed in
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 break-all text-[9px] text-muted">
                          {user.email}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 rounded-full bg-canvas px-2 py-0.5 text-[8px] text-body">
                            <UserCog size={10} /> {role?.name ?? "Unknown role"}
                          </span>
                          <span className="rounded-full bg-gold-500/10 px-2 py-0.5 text-[8px] font-medium text-gold-600">
                            {user.batch}
                          </span>
                          <span className="text-[8px] text-muted">
                            Joined: {formatJoined(user.joinedAt)}
                          </span>
                        </div>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1.5">
                        <select
                          value={user.status}
                          onChange={(event) =>
                            saveUser({
                              ...user,
                              status: event.target.value as AdminUser["status"],
                            })
                          }
                          className="rounded-[4px] border border-line bg-white px-2 py-1 text-[9px] text-ink focus:border-brand-400 focus:outline-none"
                          aria-label={`Status for ${user.name}`}
                        >
                          <option value="active">Active</option>
                          <option value="invited">Invited</option>
                        </select>
                        <div className="flex gap-0.5">
                          <button
                            type="button"
                            onClick={() => openUserForm(user)}
                            className={iconBtn}
                            aria-label={`Edit ${user.name}`}
                          >
                            <Pencil size={13} />
                          </button>
                          {!isSuperUser && (
                            <button
                              type="button"
                              onClick={() => deleteUser(user.id)}
                              className={`${iconBtn} hover:bg-clay-500/5 hover:text-clay-600`}
                              aria-label={`Delete ${user.name}`}
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    {!isCurrent && (
                      <button
                        type="button"
                        onClick={() => switchUser(user.id)}
                        className="mt-2.5 inline-flex items-center gap-1 text-[9px] font-semibold text-brand-700 hover:underline"
                      >
                        Preview this role <ChevronRight size={11} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <p className="mt-4 flex items-start gap-1.5 border-t border-line pt-3 text-[9px] leading-relaxed text-muted">
              <KeyRound size={11} className="mt-0.5 shrink-0" />
              Demo passwords are stored in this browser only. Use &quot;Preview
              this role&quot; to test a role&apos;s page access; return to super
              admin using the banner or the access-denied page.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
