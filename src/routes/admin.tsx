import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Check, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useUser } from "@clerk/react";

import { PageHeader } from "@/components/site/PageHeader";
import { getPendingAddons, moderateAddon } from "@/lib/addon-actions";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Panel — Knight MC" }] }),
  loader: async () => ({ queue: await getPendingAddons().catch(() => []) }),
  component: AdminPage,
});

const adminEmails = new Set([
  "loidkaizer@gmail.com",
  "niethanbabor@gmail.com",
  "nathanbabor5@gmail.com",
]);

function AdminPage() {
  const { queue: initialQueue } = Route.useLoaderData();
  const { isLoaded, isSignedIn, user } = useUser();
  const [queue, setQueue] = useState(initialQueue);
  const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase();
  const isAdmin = Boolean(email && adminEmails.has(email));

  const moderate = async (id: string, status: "approved" | "rejected") => {
    try {
      await moderateAddon({ data: { id, status } });
      setQueue((items) => items.filter((item) => item.id !== id));
      toast.success(status === "approved" ? "Addon approved" : "Addon rejected");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Moderation failed");
    }
  };
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
          <AccessCard
            title="Sign in to continue"
            description="Only authorized Knight MC administrators can access moderation."
          />
        ) : !isAdmin ? (
          <AccessCard
            title="Admin access required"
            description="Your account is signed in, but it is not on the administrator allowlist."
          />
        ) : (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold">Pending submissions</h2>
                <p className="mt-1 text-sm text-muted-foreground">{queue.length} awaiting review</p>
              </div>
              <Link
                to="/submit"
                className="rounded-full border px-4 py-2 text-sm hover:bg-secondary"
              >
                Open upload flow
              </Link>
            </div>
            {queue.length === 0 ? (
              <div className="rounded-3xl border border-dashed p-10 text-center text-muted-foreground">
                The moderation queue is clear.
              </div>
            ) : (
              queue.map((addon) => (
                <article
                  key={addon.id}
                  className="rounded-3xl border bg-card-gradient p-6 shadow-elevated"
                >
                  <div className="flex flex-col justify-between gap-5 md:flex-row">
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-primary">
                        {addon.category} · v{addon.version}
                      </p>
                      <h3 className="mt-2 font-display text-xl font-bold">{addon.name}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">by {addon.author_name}</p>
                      <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
                        {addon.description}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2 md:self-start">
                      <button
                        type="button"
                        onClick={() => void moderate(addon.id, "approved")}
                        className="inline-flex items-center gap-2 rounded-full bg-violet-gradient px-4 py-2 text-sm font-semibold text-primary-foreground"
                      >
                        <Check className="size-4" /> Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => void moderate(addon.id, "rejected")}
                        className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold hover:bg-secondary"
                      >
                        <X className="size-4" /> Reject
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        )}
      </section>
    </>
  );
}

function AccessCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-3xl border bg-card-gradient p-8 text-center">
      <ShieldCheck className="mx-auto size-10 text-primary" />
      <h2 className="mt-4 font-display text-2xl font-bold">{title}</h2>
      <p className="mt-2 text-muted-foreground">{description}</p>
    </div>
  );
}
