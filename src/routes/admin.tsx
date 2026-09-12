import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { useUser } from "@clerk/react";

import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Panel — Knight MC" }] }),
  component: AdminPage,
});

const adminEmails = new Set([
  "loidkaizer@gmail.com",
  "niethanbabor@gmail.com",
  "nathanbabor5@gmail.com",
]);

function AdminPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase();
  const isAdmin = Boolean(email && adminEmails.has(email));

  if (!isLoaded) return <div className="loader mx-auto my-24" aria-label="Loading admin panel" />;

  return (
    <>
      <PageHeader
        eyebrow="Administration"
        title="Addon"
        highlight="Review"
        description="Review submissions, publish approved addons, and keep the library safe."
      />
      <section className="mx-auto max-w-5xl px-4 py-12 lg:px-8">
        {!isSignedIn ? (
          <div className="rounded-3xl border bg-card-gradient p-8 text-center">
            <ShieldCheck className="mx-auto size-10 text-primary" />
            <h2 className="mt-4 font-display text-2xl font-bold">Sign in to continue</h2>
            <p className="mt-2 text-muted-foreground">
              Only authorized Knight MC administrators can access moderation.
            </p>
          </div>
        ) : !isAdmin ? (
          <div className="rounded-3xl border bg-card-gradient p-8 text-center">
            <ShieldCheck className="mx-auto size-10 text-destructive" />
            <h2 className="mt-4 font-display text-2xl font-bold">Admin access required</h2>
            <p className="mt-2 text-muted-foreground">
              Your account is signed in, but it is not on the administrator allowlist.
            </p>
          </div>
        ) : (
          <div className="rounded-3xl border bg-card-gradient p-8">
            <h2 className="font-display text-2xl font-bold">Pending submissions</h2>
            <p className="mt-2 text-muted-foreground">
              The moderation queue is ready for the connected Supabase addon records.
            </p>
            <div className="mt-6 rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
              Moderation actions are protected by the administrator identity and will include
              approve, deny with explanation, edit, publish, and remove.
            </div>
            <Link
              to="/submit"
              className="mt-6 inline-flex rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-secondary"
            >
              Open upload flow
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
