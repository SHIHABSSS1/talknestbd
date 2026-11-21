import type { Metadata } from "next";
import { MyStories } from "@/components/account/MyStories";
import { requireUser } from "@/lib/auth-guards";

export const metadata: Metadata = { title: "My stories", robots: { index: false, follow: false } };

export default async function AccountStoriesPage() {
  await requireUser("/account/stories");
  return <MyStories />;
}
