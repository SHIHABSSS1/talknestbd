import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { AccountNav } from "@/components/account/AccountNav";

export const metadata: Metadata = {
  title: "আমার অ্যাকাউন্ট",
  description: "TalkNest BD অ্যাকাউন্ট — অর্ডার, ঠিকানা, উইশলিস্ট ও প্রোফাইল সেটিংস।",
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageHeader
        eyebrow="My Account"
        title="আমার TalkNest অ্যাকাউন্ট"
        description="অর্ডার ট্র্যাক করুন, সংরক্ষিত ঠিকানা দেখুন, উইশলিস্ট সাজান আর প্রোফাইল সেটিংস বদলান — সব এক জায়গায়।"
        crumbs={[{ label: "আমার অ্যাকাউন্ট" }]}
      />
      <section className="py-8 sm:py-10">
        <Container>
          <div className="grid gap-5 lg:grid-cols-[250px_1fr] lg:items-start">
            <AccountNav />
            <div className="min-w-0">{children}</div>
          </div>
        </Container>
      </section>
    </>
  );
}
