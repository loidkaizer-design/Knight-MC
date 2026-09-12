import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { Field, fieldClass } from "@/components/site/FormBits";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Knight MC" },
      { name: "description", content: "Sign in to your Knight MC account to submit add-ons, save favourites and track requests." },
      { property: "og:title", content: "Sign in — Knight MC" },
      { property: "og:description", content: "Sign in to submit add-ons and track your requests." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });

  return (
    <section className="mx-auto flex max-w-md flex-col px-4 py-20">
      <h1 className="font-display text-3xl font-black">
        Welcome back to <span className="text-violet-gradient">Knight MC</span>
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Sign in to submit add-ons, save favourites and vote on requests.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          toast.info("Accounts arrive with the backend step", {
            description: "The sign-in screen is ready for it.",
          });
        }}
        className="mt-8 space-y-4 rounded-3xl border bg-card-gradient p-6 shadow-elevated"
      >
        <Field label="Email">
          <input
            type="email"
            value={form.email}
            maxLength={255}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
            className={fieldClass}
          />
        </Field>
        <Field label="Password">
          <input
            type="password"
            value={form.password}
            maxLength={72}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••"
            className={fieldClass}
          />
        </Field>
        <button
          type="submit"
          className="w-full rounded-full bg-violet-gradient px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-smooth hover:opacity-90"
        >
          Sign in
        </button>
        <p className="text-center text-sm text-muted-foreground">
          No account yet?{" "}
          <Link to="/register" className="text-primary-glow hover:underline">
            Create one
          </Link>
        </p>
      </form>
    </section>
  );
}
