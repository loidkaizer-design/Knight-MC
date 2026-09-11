import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { Field, fieldClass } from "@/components/site/FormBits";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create an account — LightCraft" },
      {
        name: "description",
        content: "Create a LightCraft account to submit Minecraft add-ons, request new ones and save favourites.",
      },
      { property: "og:title", content: "Create an account — LightCraft" },
      { property: "og:description", content: "Join LightCraft to submit and request Minecraft add-ons." },
    ],
  }),
  component: RegisterPage,
});

const schema = z.object({
  username: z.string().trim().min(3, "Username must be at least 3 characters").max(24),
  email: z.string().trim().email("Enter a valid email address").max(255),
  password: z.string().min(8, "Use at least 8 characters").max(72),
});

function RegisterPage() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  return (
    <section className="mx-auto flex max-w-md flex-col px-4 py-20">
      <h1 className="font-display text-3xl font-black">
        Join <span className="text-violet-gradient">LightCraft</span>
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Free account — submit add-ons, request packs and keep a download history.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const parsed = schema.safeParse(form);
          if (!parsed.success) {
            toast.error(parsed.error.issues[0]!.message);
            return;
          }
          toast.info("Accounts arrive with the backend step");
        }}
        className="mt-8 space-y-4 rounded-3xl border bg-card-gradient p-6 shadow-elevated"
      >
        <Field label="Username">
          <input
            value={form.username}
            maxLength={24}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            placeholder="BlockBuilder"
            className={fieldClass}
          />
        </Field>
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
            placeholder="At least 8 characters"
            className={fieldClass}
          />
        </Field>
        <button
          type="submit"
          className="w-full rounded-full bg-violet-gradient px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-smooth hover:opacity-90"
        >
          Create account
        </button>
        <p className="text-center text-sm text-muted-foreground">
          Already registered?{" "}
          <Link to="/login" className="text-primary-glow hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </section>
  );
}
