import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Reset your TalkNest BD account password with an email code.",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <section className="py-8 sm:py-12">
      <Container className="max-w-4xl">
        <ForgotPasswordForm />
      </Container>
    </section>
  );
}
