"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Camera,
  Check,
  KeyRound,
  Mail,
  Save,
  ShieldCheck,
  Trash2,
  UserRound,
} from "lucide-react";
import { useAdminAccess } from "@/components/providers/AdminAccessProvider";
import { allPageHrefs, formatJoined, initials } from "@/lib/admin-access";
import { dataUrlSizeLabel, fileToDataUrl } from "@/lib/image";

const inputClass =
  "w-full rounded-[4px] border border-line bg-white px-3 py-2.5 text-[12px] text-ink placeholder:text-muted/60 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/15";
const labelClass = "mb-1.5 block text-[11px] font-semibold text-ink";
const primaryBtn =
  "inline-flex h-9 items-center gap-1.5 rounded-[4px] bg-brand-600 px-4 text-[11px] font-semibold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60";
const secondaryBtn =
  "inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-line px-4 text-[11px] font-medium text-ink transition-colors hover:border-brand-300 hover:bg-brand-50";

function SectionCard({
  icon: Icon,
  title,
  hint,
  children,
}: {
  icon: typeof UserRound;
  title: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[10px] border border-line bg-white">
      <div className="flex items-center gap-3 border-b border-line px-4 py-3.5 sm:px-5">
        <span className="grid h-9 w-9 place-items-center rounded-[8px] bg-brand-50 text-brand-700">
          <Icon size={15} />
        </span>
        <div>
          <h2 className="text-[13px] font-semibold text-ink">{title}</h2>
          <p className="text-[10px] text-muted">{hint}</p>
        </div>
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}

export function AdminProfile() {
  const {
    hydrated,
    currentUser,
    currentRole,
    isSuperAdmin,
    canAccessPage,
    updateProfile,
    changePassword,
    setAvatar,
  } = useAdminAccess();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileNotice, setProfileNotice] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordNotice, setPasswordNotice] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);
  const [photoNotice, setPhotoNotice] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!currentUser) return;
    setName(currentUser.name);
    setEmail(currentUser.email);
  }, [currentUser?.id, currentUser?.name, currentUser?.email]); // eslint-disable-line react-hooks/exhaustive-deps

  const allowedPages = allPageHrefs().filter((href) => canAccessPage(href)).length;
  const avatar = currentUser?.avatar;
  const displayName = currentUser?.name ?? "Admin";

  const onSaveProfile = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      setProfileNotice("Enter a valid name and email address.");
      return;
    }
    updateProfile({ name: name.trim(), email: email.trim() });
    setProfileNotice("Profile and email saved in this browser.");
  };

  const onUploadPhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setPhotoNotice("");
    try {
      const dataUrl = await fileToDataUrl(file);
      setAvatar(dataUrl);
      setPhotoNotice(`Profile picture saved (${dataUrlSizeLabel(dataUrl)}).`);
    } catch (error) {
      setPhotoNotice(
        error instanceof Error ? error.message : "Could not upload that image.",
      );
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const onSavePassword = (event: React.FormEvent) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordNotice({ ok: false, message: "New passwords do not match." });
      return;
    }
    const result = changePassword(currentPassword, newPassword);
    setPasswordNotice(result);
    if (result.ok) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-1.5 text-[11px] text-muted">
          <Link href="/admin" className="hover:text-brand-700">
            Dashboard
          </Link>
          <span>/</span>
          <span className="font-semibold text-ink">Admin profile</span>
        </div>
        <h1 className="mt-2 font-display text-2xl font-bold text-ink">
          Admin profile
        </h1>
        <p className="mt-1 text-[12px] text-muted">
          Manage your picture, email, password and admin identity.
        </p>
      </div>

      <div className="rounded-[8px] border border-brand-100 bg-brand-50 px-4 py-3">
        <p className="text-[10px] leading-relaxed text-brand-800">
          <span className="font-semibold">Demo note:</span> all changes are saved
          only in this browser&apos;s localStorage; nothing is sent to a server.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
        {/* Identity / admin batch card */}
        <section className="h-fit rounded-[10px] border border-line bg-white p-5">
          <div className="flex flex-col items-center text-center">
            <span className="grid h-20 w-20 place-items-center overflow-hidden rounded-full bg-brand-600 text-xl font-bold text-white ring-4 ring-brand-50">
              {avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatar} alt="" className="h-full w-full object-cover" />
              ) : (
                initials(displayName)
              )}
            </span>
            <h2 className="mt-3 font-display text-base font-bold text-ink">
              {displayName}
            </h2>
            <p className="mt-0.5 break-all text-[10px] text-muted">
              {currentUser?.email ?? "—"}
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-[9px] font-semibold text-brand-700">
                <ShieldCheck size={11} />
                {isSuperAdmin ? "Super Admin" : (currentRole?.name ?? "Admin")}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-gold-500/10 px-2.5 py-1 text-[9px] font-semibold text-gold-600">
                {currentUser?.batch ?? "Batch —"}
              </span>
            </div>
          </div>

          <div className="mt-5 space-y-2 border-t border-line pt-4">
            <div className="flex items-center justify-between gap-2 text-[10px]">
              <span className="text-muted">Role</span>
              <span className="font-semibold text-ink">
                {currentRole?.name ?? "—"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 text-[10px]">
              <span className="text-muted">Admin batch</span>
              <span className="font-semibold text-ink">
                {currentUser?.batch ?? "—"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 text-[10px]">
              <span className="text-muted">Joined</span>
              <span className="font-semibold text-ink">
                {formatJoined(currentUser?.joinedAt ?? "")}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 text-[10px]">
              <span className="text-muted">Pages accessible</span>
              <span className="font-semibold text-ink">
                {isSuperAdmin ? "All" : `${allowedPages}`}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 text-[10px]">
              <span className="text-muted">Status</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${
                  currentUser?.status === "active"
                    ? "bg-mint/25 text-forest-700"
                    : "bg-gold-500/10 text-gold-600"
                }`}
              >
                {currentUser?.status === "active" ? "Active" : "Invited"}
              </span>
            </div>
          </div>

          <p className="mt-4 rounded-[6px] bg-canvas px-3 py-2.5 text-[9px] leading-relaxed text-muted">
            Hydration: {hydrated ? "complete" : "loading…"} · page access follows
            your assigned role.
          </p>
          {isSuperAdmin && (
            <Link
              href="/admin/users"
              className={`${secondaryBtn} mt-3 w-full justify-center`}
            >
              <ShieldCheck size={13} /> Users &amp; roles
            </Link>
          )}
        </section>

        <div className="space-y-5">
          <SectionCard
            icon={UserRound}
            title="Profile & email"
            hint="Update your display name and email address"
          >
            <form onSubmit={onSaveProfile} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className={labelClass}>Full name</span>
                  <input
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value);
                      setProfileNotice("");
                    }}
                    className={inputClass}
                    required
                  />
                </label>
                <label className="block">
                  <span className={labelClass}>Email address</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setProfileNotice("");
                    }}
                    className={inputClass}
                    required
                  />
                </label>
              </div>
              <div>
                <span className={labelClass}>Admin batch</span>
                <input
                  value={currentUser?.batch ?? ""}
                  readOnly
                  aria-readonly
                  className={`${inputClass} cursor-not-allowed bg-canvas text-muted`}
                />
                <span className="mt-1 block text-[9px] leading-relaxed text-muted">
                  The batch is assigned by a super admin — change it on the Users
                  &amp; roles page.
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button type="submit" className={primaryBtn}>
                  <Save size={13} /> Save changes
                </button>
                {profileNotice && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-brand-700">
                    <Check size={12} /> {profileNotice}
                  </span>
                )}
              </div>
            </form>
          </SectionCard>

          <SectionCard
            icon={Camera}
            title="Profile picture"
            hint="Images are compressed in the browser before saving"
          >
            <div className="flex flex-wrap items-center gap-4">
              <span className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full bg-brand-600 text-sm font-bold text-white">
                {avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatar} alt="" className="h-full w-full object-cover" />
                ) : (
                  initials(displayName)
                )}
              </span>
              <div className="min-w-0">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={onUploadPhoto}
                  className="block max-w-full text-[10px] text-muted file:mr-3 file:rounded-[4px] file:border file:border-line file:bg-white file:px-3 file:py-2 file:text-[10px] file:font-semibold file:text-ink hover:file:bg-brand-50"
                />
                <p className="mt-2 text-[9px] leading-relaxed text-muted">
                  JPG, PNG or WebP · up to 15 MB · stored as a compressed data URL.
                </p>
                {avatar && (
                  <p className="mt-1 text-[9px] text-muted">
                    Current picture: {dataUrlSizeLabel(avatar)}
                  </p>
                )}
              </div>
              {avatar && (
                <button
                  type="button"
                  onClick={() => {
                    setAvatar(null);
                    setPhotoNotice("Profile picture removed.");
                  }}
                  className={`${secondaryBtn} ml-auto text-clay-600`}
                >
                  <Trash2 size={13} /> Remove picture
                </button>
              )}
            </div>
            {photoNotice && (
              <p className="mt-3 text-[10px] font-medium text-brand-700">
                {uploading ? "Processing image…" : photoNotice}
              </p>
            )}
          </SectionCard>

          <SectionCard
            icon={KeyRound}
            title="Change password"
            hint="Demo password is stored only in this browser"
          >
            <form onSubmit={onSavePassword} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <label className="block">
                  <span className={labelClass}>Current password</span>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                    className={inputClass}
                    placeholder="demo1234"
                    required
                  />
                </label>
                <label className="block">
                  <span className={labelClass}>New password</span>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    className={inputClass}
                    minLength={6}
                    required
                  />
                </label>
                <label className="block">
                  <span className={labelClass}>Confirm new password</span>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    className={inputClass}
                    minLength={6}
                    required
                  />
                </label>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button type="submit" className={primaryBtn}>
                  <KeyRound size={13} /> Update password
                </button>
                {passwordNotice && (
                  <span
                    className={`text-[10px] font-medium ${
                      passwordNotice.ok ? "text-brand-700" : "text-clay-600"
                    }`}
                  >
                    {passwordNotice.message}
                  </span>
                )}
              </div>
              <p className="flex items-center gap-1.5 text-[9px] leading-relaxed text-muted">
                <Mail size={11} /> This is a demo: no real login or email is used.
                Default password: demo1234
              </p>
            </form>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
