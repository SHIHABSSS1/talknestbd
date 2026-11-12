import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Log In",
  description: "Log in to your TalkNest BD account — orders, wishlist and audio library.",
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
