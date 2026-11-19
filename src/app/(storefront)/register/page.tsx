import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Register",
  description: "Create your TalkNest BD reader account.",
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return (
    <section className="py-8 sm:py-12">
      <Container className="max-w-4xl">
        <RegisterForm />
      </Container>
    </section>
  );
}
