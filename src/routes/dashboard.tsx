import { Link, createFileRoute } from "@tanstack/react-router";
import { Download, Heart, MessageSquare, Package } from "lucide-react";
import { useState } from "react";

import { PageHeader } from "@/components/site/PageHeader";
import { StatusPill } from "@/components/site/FormBits";
import { addons, formatDate, requests, submissions } from "@/lib/lightcraft-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Your Dashboard — LightCraft" },
      {
        name: "description",
        content: "Track your submitted add-ons, requests, favourites and download history on LightCraft.",
      },
      { property: "og:title", content: "Your Dashboard — LightCraft" },
      { property: "og:description", content: "Track your submissions, requests and favourites." },
    ],
  }),
  component: DashboardPage,
});

const tabs = [
  { key: "submissions", label: "My submissions", icon: Package },
  { key: "requests", label: "My requests", icon: MessageSquare },
  { key: "favorites", label: "Favourites", icon: Heart },
  { key: "downloads", label: "Downloads", icon: Download },
] as const;

function DashboardPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]["key"]>("submissions");
  const mySubmissions = submissions.slice(0, 3);
  const myRequests = requests.slice(0, 2);
  const favourites = addons.slice(0, 3);
  const history = addons.slice(2, 6);

  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="Your"
        highlight="Dashboard"
        description="Everything you've submitted, asked for and downloaded."
      />
      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <nav className="flex gap-2 overflow-x-auto lg:flex-col">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTab(t.key)}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm transition-smooth",
                    tab === t.key
                      ? "bg-secondary font-semibold text-foreground"
                      : "text-muted-foreground hover:bg-secondary/60",
                  )}
                >
                  <t.icon className="size-4" /> {t.label}
                </button>
              ))}
            </nav>
          </aside>

          <div className="space-y-4">
            {tab === "submissions" &&
              mySubmissions.map((s) => (
                <div
                  key={s.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card-gradient p-5"
                >
                  <div className="min-w-0">
                    <p className="truncate font-display text-lg font-bold">{s.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {s.version} · {s.category} · submitted {formatDate(s.submittedAt)}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium",
                      s.status === "pending" && "bg-warning/15 text-warning",
                      s.status === "changes-requested" && "bg-primary/20 text-primary-glow",
                      s.status === "approved" && "bg-success/15 text-success",
                      s.status === "rejected" && "bg-destructive/15 text-destructive",
                    )}
                  >
                    {s.status.replace("-", " ")}
                  </span>
                </div>
              ))}

            {tab === "requests" &&
              myRequests.map((r) => (
                <Link
                  key={r.id}
                  to="/requests/$request"
                  params={{ request: r.slug }}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card-gradient p-5 transition-smooth hover:border-primary/60"
                >
                  <div className="min-w-0">
                    <p className="truncate font-display text-lg font-bold">{r.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{r.votes} votes</p>
                  </div>
                  <StatusPill status={r.status} />
                </Link>
              ))}

            {tab === "favorites" &&
              favourites.map((a) => (
                <Link
                  key={a.id}
                  to="/addons/$addon"
                  params={{ addon: a.slug }}
                  className="flex items-center gap-4 rounded-2xl border bg-card-gradient p-4 transition-smooth hover:border-primary/60"
                >
                  <img
                    src={a.screenshots[0]}
                    alt={a.title}
                    loading="lazy"
                    width={160}
                    height={90}
                    className="size-16 shrink-0 rounded-xl object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{a.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{a.tagline}</p>
                  </div>
                </Link>
              ))}

            {tab === "downloads" && (
              <div className="overflow-x-auto rounded-2xl border bg-card-gradient">
                <table className="w-full text-sm">
                  <thead className="text-left text-xs text-muted-foreground uppercase">
                    <tr>
                      <th className="px-5 py-3">Add-on</th>
                      <th className="px-5 py-3">Version</th>
                      <th className="px-5 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((a) => (
                      <tr key={a.id} className="border-t">
                        <td className="px-5 py-3 font-medium">{a.title}</td>
                        <td className="px-5 py-3 text-muted-foreground">{a.addonVersion}</td>
                        <td className="px-5 py-3 text-muted-foreground">{formatDate(a.updated)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
