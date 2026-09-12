import { SignUp } from "@clerk/react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create an account — Knight MC" },
      { name: "description", content: "Create a Knight MC account." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  return (
    <section className="mx-auto flex max-w-md justify-center px-4 py-16">
      <SignUp routing="hash" signInUrl="/login" fallbackRedirectUrl="/" />
    </section>
  );
}
