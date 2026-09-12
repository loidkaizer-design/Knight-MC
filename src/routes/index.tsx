import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Download, Search, ShieldCheck, Upload } from "lucide-react";

import heroIsland from "@/assets/hero-island.png";
import { AddonCard } from "@/components/site/AddonCard";
import { addons, categories, categoryIcons, formatCount, requests } from "@/lib/lightcraft-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Knight MC — Your Minecraft Add-on Library" },
      {
        name: "description",
        content:
          "Browse hundreds of reviewed Minecraft add-ons, request the ones nobody has built yet, and submit your own creations.",
      },
      { property: "og:title", content: "Knight MC — Your Minecraft Add-on Library" },
      {
        property: "og:description",
        content: "Browse reviewed Minecraft add-ons, request new ones and submit your own.",
      },
    ],
  }),
  component: Home,
});

const steps = [
  {
    icon: Search,
    title: "Discover",
    body: "Filter by Minecraft version, type and category to find add-ons that actually work.",
  },
  {
    icon: Download,
    title: "Download",
    body: "One click, tracked downloads, files served fast from our storage partner.",
  },
  {
    icon: Upload,
    title: "Submit",
    body: "Share your own pack with screenshots, versions and install instructions.",
  },
  {
    icon: ShieldCheck,
    title: "Reviewed",
    body: "Nothing goes public until an admin has checked and tested the file.",
  },
];

function Home() {
  const featured = addons.filter((a) => a.featured).slice(0, 4);
  const topRequests = [...requests].sort((a, b) => b.votes - a.votes).slice(0, 3);
  const totalDownloads = addons.reduce((sum, a) => sum + a.downloads, 0);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-hero">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pt-16 pb-20 lg:grid-cols-2 lg:px-8 lg:pt-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full glass-panel px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="size-1.5 rounded-full bg-success" /> {addons.length} add-ons
              reviewed and published
            </span>
            <h1 className="mt-6 font-display text-5xl leading-[1.05] font-black md:text-6xl">
              Knight MC
              <span className="mt-2 block text-3xl md:text-4xl">
                Your <span className="text-violet-gradient">Minecraft Add-on</span> Library
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground md:text-lg">
              Discover community-made behaviour packs, resource packs and full add-on bundles.
              Request what's missing, submit what you've built — every file checked by a human
              before it appears here.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/addons"
                className="inline-flex items-center gap-2 rounded-full bg-violet-gradient px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-smooth hover:opacity-90"
              >
                Browse Add-ons <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/submit"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold transition-smooth hover:bg-secondary"
              >
                <Upload className="size-4" /> Submit Add-on
              </Link>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4">
              {[
                { k: "Downloads", v: formatCount(totalDownloads) },
                { k: "Creators", v: "6" },
                { k: "Requests", v: String(requests.length) },
              ].map((s) => (
                <div key={s.k} className="rounded-xl border bg-card-gradient p-4">
                  <dt className="text-xs text-muted-foreground">{s.k}</dt>
                  <dd className="font-display text-2xl font-black">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute inset-0 bg-violet-gradient opacity-25 blur-3xl" />
            <img
              src={heroIsland}
              alt="Voxel island with a cabin lit by purple light"
              width={1024}
              height={1024}
              className="relative mx-auto w-full max-w-lg drop-shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-black md:text-4xl">
              Featured <span className="text-violet-gradient">Add-ons</span>
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Hand-picked packs the community keeps coming back to.
            </p>
          </div>
          <Link
            to="/addons"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-smooth hover:opacity-80"
          >
            View all <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((a) => (
            <AddonCard key={a.id} addon={a} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="border-y bg-card-gradient">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
          <h2 className="font-display text-3xl font-black md:text-4xl">
            Popular <span className="text-violet-gradient">Categories</span>
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {categories.slice(0, 12).map((c) => {
              const Icon = categoryIcons[c.icon];
              return (
              <Link
                key={c.slug}
                to="/categories/$category"
                params={{ category: c.slug }}
                className="rounded-2xl border bg-background/40 p-4 text-center transition-smooth hover:-translate-y-1 hover:border-primary/60 hover:shadow-glow"
              >
                <Icon className="mx-auto size-6 text-primary" aria-hidden="true" />
                <p className="mt-2 text-sm font-semibold">{c.name}</p>
              </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <h2 className="font-display text-3xl font-black md:text-4xl">
          How <span className="text-violet-gradient">Knight MC</span> works
        </h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.title} className="rounded-2xl border bg-card-gradient p-6 shadow-elevated">
              <span className="grid size-11 place-items-center rounded-xl bg-violet-gradient shadow-glow">
                <s.icon className="size-5 text-primary-foreground" />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Requests */}
      <section className="border-y bg-card-gradient">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-[1fr_1.2fr] lg:px-8">
          <div>
            <h2 className="font-display text-3xl font-black md:text-4xl">
              Can't find it? <span className="text-violet-gradient">Request it.</span>
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Tell us what you're missing and upvote what others have asked for. Creators pick up
              the most-wanted ideas, and we track them from requested to shipped.
            </p>
            <Link
              to="/requests"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-violet-gradient px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-smooth hover:opacity-90"
            >
              See all requests <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {topRequests.map((r) => (
              <Link
                key={r.id}
                to="/requests/$request"
                params={{ request: r.slug }}
                className="flex items-start gap-4 rounded-2xl border bg-background/40 p-5 transition-smooth hover:border-primary/60"
              >
                <span className="grid shrink-0 place-items-center rounded-xl bg-secondary px-3 py-2 text-center">
                  <span className="font-display text-lg font-black">{r.votes}</span>
                  <span className="text-[10px] text-muted-foreground">votes</span>
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-semibold">{r.title}</span>
                  <span className="mt-1 line-clamp-2 block text-sm text-muted-foreground">
                    {r.description}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border bg-hero p-10 text-center shadow-elevated md:p-16">
          <h2 className="font-display text-3xl font-black md:text-5xl">
            Built something great? <span className="text-violet-gradient">Share it.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground md:text-base">
            Submit your add-on with screenshots and install steps. Our team reviews every upload,
            so players know what they download here is safe.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/submit"
              className="inline-flex items-center gap-2 rounded-full bg-violet-gradient px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-smooth hover:opacity-90"
            >
              Submit Add-on <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold transition-smooth hover:bg-secondary"
            >
              <CheckCircle2 className="size-4" /> How review works
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
