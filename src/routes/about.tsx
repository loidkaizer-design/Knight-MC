import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, FileCheck2, HardDriveDownload, ShieldCheck, Users } from "lucide-react";

import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Knight MC — How the Add-on Library Works" },
      {
        name: "description",
        content:
          "Knight MC is a community add-on library for Minecraft. Learn how submissions are reviewed, how downloads work and how requests get built.",
      },
      { property: "og:title", content: "About Knight MC" },
      { property: "og:description", content: "How the Knight MC add-on library and review process works." },
    ],
  }),
  component: AboutPage,
});

const pillars = [
  {
    icon: ShieldCheck,
    title: "Everything is reviewed",
    body: "Submissions land as Pending. An admin downloads and tests the file, checks the metadata, then approves, rejects or asks for changes.",
  },
  {
    icon: FileCheck2,
    title: "Strict upload rules",
    body: "Only .mcaddon, .mcpack, .mctemplate and .zip files, size-limited, type-checked and scanned before anything is published.",
  },
  {
    icon: HardDriveDownload,
    title: "Fast, tracked downloads",
    body: "Files live with our storage partner; Knight MC keeps the metadata and counts every download itself.",
  },
  {
    icon: Users,
    title: "Community-led",
    body: "Requests let players ask for what's missing and upvote ideas. Creators pick up the most-wanted ones.",
  },
];

function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="A cleaner home for"
        highlight="Minecraft add-ons"
        description="Knight MC is a modern, reviewed library — not an old-fashioned forum full of dead links."
      />

      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2">
          {pillars.map((p) => (
            <div key={p.title} className="rounded-2xl border bg-card-gradient p-6 shadow-elevated">
              <span className="grid size-11 place-items-center rounded-xl bg-violet-gradient shadow-glow">
                <p.icon className="size-5 text-primary-foreground" />
              </span>
              <h2 className="mt-4 font-display text-xl font-bold">{p.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-3xl border bg-hero p-8 md:p-12">
          <h2 className="font-display text-2xl font-black md:text-3xl">The review flow</h2>
          <ol className="mt-6 grid gap-4 md:grid-cols-5">
            {["User submits", "Pending review", "Admin tests file", "Approved", "Published"].map(
              (s, i) => (
                <li
                  key={s}
                  className="rounded-xl border bg-background/40 p-4 text-center text-sm font-medium"
                >
                  <span className="block text-xs text-muted-foreground">Step {i + 1}</span>
                  {s}
                </li>
              ),
            )}
          </ol>
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link
            to="/addons"
            className="inline-flex items-center gap-2 rounded-full bg-violet-gradient px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-smooth hover:opacity-90"
          >
            Browse the library <ArrowRight className="size-4" />
          </Link>
          <Link
            to="/submit"
            className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold transition-smooth hover:bg-secondary"
          >
            Submit an add-on
          </Link>
        </div>
      </section>
    </>
  );
}
