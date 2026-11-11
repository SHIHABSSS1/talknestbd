import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "লগইন",
  description: "TalkNest BD অ্যাকাউন্টে লগইন করুন — অর্ডার, উইশলিস্ট ও অডিও লাইব্রেরি।",
};

export default function LoginPage() {
  return (
    <section className="py-8 sm:py-12">
      <Container className="max-w-4xl">
        <LoginForm />
      </Container>
    </section>
  );
}
