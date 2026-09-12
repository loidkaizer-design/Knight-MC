import { SignIn } from "@clerk/react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Knight MC" },
      { name: "description", content: "Sign in to your Knight MC account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  return (
    <section className="mx-auto flex max-w-md justify-center px-4 py-16">
      <SignIn routing="hash" signUpUrl="/register" fallbackRedirectUrl="/" />
    </section>
  );
}
