import { Link, createFileRoute } from "@tanstack/react-router";
import { ChevronUp, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/site/PageHeader";
import { categories, formatDate, requests, type AddonRequest } from "@/lib/lightcraft-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/requests/")({
  head: () => ({
    meta: [
      { title: "Add-on Requests — Knight MC" },
      {
        name: "description",
        content:
          "Request a Minecraft add-on nobody has built yet, upvote existing ideas and follow them from requested to completed.",
      },
      { property: "og:title", content: "Add-on Requests — Knight MC" },
      { property: "og:description", content: "Request Minecraft add-ons and upvote community ideas." },
    ],
  }),
  component: RequestsPage,
});

export const statusLabels: Record<AddonRequest["status"], string> = {
  requested: "Requested",
  "under-consideration": "Under consideration",
  "in-development": "In development",
  completed: "Completed",
  rejected: "Rejected",
};

export function StatusPill({ status }: { status: AddonRequest["status"] }) {
  return (
    <span
      className={cn(
        "rounded-full px-3 py-1 text-xs font-medium",
        status === "completed" && "bg-success/15 text-success",
        status === "in-development" && "bg-primary/20 text-primary-glow",
        status === "under-consideration" && "bg-warning/15 text-warning",
        status === "requested" && "bg-secondary text-muted-foreground",
        status === "rejected" && "bg-destructive/15 text-destructive",
      )}
    >
      {statusLabels[status]}
    </span>
  );
}

const tabs = [
  { key: "most", label: "Most requested" },
  { key: "new", label: "New requests" },
  { key: "done", label: "Completed" },
] as const;

function RequestsPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]["key"]>("most");
  const [voted, setVoted] = useState<string[]>([]);
  const [form, setForm] = useState({
    title: "",
    version: minecraftDefault,
    category: "gameplay",
    description: "",
    reference: "",
  });

  const list = useMemo(() => {
    if (tab === "done") return requests.filter((r) => r.status === "completed");
    const open = requests.filter((r) => r.status !== "completed");
    return tab === "most"
      ? [...open].sort((a, b) => b.votes - a.votes)
      : [...open].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [tab]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.title.trim().length < 8) {
      toast.error("Give your request a clearer title (at least 8 characters).");
      return;
    }
    toast.success("Request posted", { description: "Others can now upvote your idea." });
    setForm({ ...form, title: "", description: "", reference: "" });
  };

  return (
    <>
      <PageHeader
        eyebrow="Community"
        title="Add-on"
        highlight="Requests"
        description="Ask for what's missing. Upvote instead of posting duplicates — the most-wanted ideas get picked up first."
      />

      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          <div>
            <div className="flex flex-wrap gap-2">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTab(t.key)}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm transition-smooth",
                    tab === t.key
                      ? "bg-violet-gradient font-semibold text-primary-foreground"
                      : "border border-border text-muted-foreground hover:bg-secondary",
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="mt-6 space-y-4">
              {list.map((r) => {
                const has = voted.includes(r.id);
                return (
                  <div
                    key={r.id}
                    className="flex items-start gap-4 rounded-2xl border bg-card-gradient p-5 transition-smooth hover:border-primary/50"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setVoted((v) => {
                          const next = has ? v.filter((x) => x !== r.id) : [...v, r.id];
                          toast.success(has ? "Vote removed" : "Interest registered");
                          return next;
                        })
                      }
                      className={cn(
                        "grid shrink-0 place-items-center rounded-xl border px-3 py-2 transition-smooth",
                        has ? "border-primary bg-primary/20" : "border-border hover:bg-secondary",
                      )}
                      aria-label="Upvote request"
                    >
                      <ChevronUp className="size-4" />
                      <span className="font-display text-sm font-black">
                        {r.votes + (has ? 1 : 0)}
                      </span>
                    </button>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          to="/requests/$request"
                          params={{ request: r.slug }}
                          className="font-display text-lg font-bold transition-smooth hover:text-primary-glow"
                        >
                          {r.title}
                        </Link>
                        <StatusPill status={r.status} />
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {r.description}
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {r.version} · {r.category} · asked {formatDate(r.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Request form */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <form
              onSubmit={submit}
              className="space-y-4 rounded-2xl border bg-card-gradient p-6 shadow-elevated"
            >
              <h2 className="font-display text-xl font-bold">Request an add-on</h2>
              <Field label="What add-on are you looking for?">
                <input
                  value={form.title}
                  maxLength={120}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Realistic trains for Bedrock"
                  className={fieldClass}
                />
              </Field>
              <Field label="Minecraft version">
                <select
                  value={form.version}
                  onChange={(e) => setForm({ ...form, version: e.target.value })}
                  className={fieldClass}
                >
                  {["1.21.x", "1.20.x", "1.19.x", "1.18.x"].map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Category">
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className={fieldClass}
                >
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Description">
                <textarea
                  value={form.description}
                  maxLength={1000}
                  rows={4}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe what it should do…"
                  className={fieldClass}
                />
              </Field>
              <Field label="Reference link (optional)">
                <input
                  value={form.reference}
                  maxLength={255}
                  onChange={(e) => setForm({ ...form, reference: e.target.value })}
                  placeholder="https://"
                  className={fieldClass}
                />
              </Field>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-violet-gradient px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-smooth hover:opacity-90"
              >
                <Plus className="size-4" /> Post request
              </button>
            </form>
          </aside>
        </div>
      </section>
    </>
  );
}

const minecraftDefault = "1.21.x";

export const fieldClass =
  "w-full rounded-xl border border-input bg-background/60 px-3 py-2.5 text-sm outline-none transition-smooth focus:border-primary";

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-muted-foreground uppercase">{label}</span>
      <span className="mt-2 block">{children}</span>
    </label>
  );
}
