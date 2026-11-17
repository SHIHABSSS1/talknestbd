import type { Metadata } from "next";
import { UsersRolesManager } from "@/components/admin/UsersRolesManager";

export const metadata: Metadata = {
  title: "Users & roles",
};

export default function AdminUsersPage() {
  return <UsersRolesManager />;
}
