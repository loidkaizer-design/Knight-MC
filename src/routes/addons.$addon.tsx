import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  Download,
  Flag,
  Heart,
  RefreshCw,
  Star,
} from "lucide-react";
import { toast } from "sonner";

import { AddonCard } from "@/components/site/AddonCard";
import {
  addonBySlug,
  addonsByCategory,
  categoryBySlug,
  formatCount,
  formatDate,
} from "@/lib/lightcraft-data";

export const Route = createFileRoute("/addons/$addon")({
  loader: ({ params }) => {
    const addon = addonBySlug(params.addon);
    if (!addon) throw notFound();
    return { addon };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Add-on not found — Knight MC" }, { name: "robots", content: "noindex" }],
      };
    }
    const { addon } = loaderData;
    return {
      meta: [
        { title: `${addon.title} — Knight MC Add-on` },
        { name: "description", content: addon.tagline },
        { property: "og:title", content: `${addon.title} — Knight MC` },
        { property: "og:description", content: addon.tagline },
        { property: "og:image", content: addon.screenshots[0] ?? "" },
        { name: "twitter:image", content: addon.screenshots[0] ?? "" },
      ],
    };
  },
  component: AddonPage,
  notFoundComponent: AddonNotFound,
});

function AddonNotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="font-display text-3xl font-black">Add-on not found</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        This add-on may have been removed or renamed.
      </p>
      <Link
        to="/addons"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-violet-gradient px-5 py-2.5 text-sm font-semibold text-primary-foreground"
      >
        <ArrowLeft className="size-4" /> Back to library
      </Link>
    </div>
  );
}

function AddonPage() {
  const { addon } = Route.useLoaderData();
  const category = categoryBySlug(addon.category);
  const related = addonsByCategory(addon.category)
    .filter((a) => a.slug !== addon.slug)
    .slice(0, 3);

  const facts = [
    { k: "Creator", v: addon.creator },
    { k: "Category", v: `${category?.emoji ?? ""} ${category?.name ?? addon.category}` },
    { k: "Add-on type", v: addon.type },
    { k: "Minecraft versions", v: addon.versions.join(", ") },
    { k: "Add-on version", v: addon.addonVersion },
    { k: "File size", v: addon.fileSize },
    { k: "Last updated", v: formatDate(addon.updated) },
    { k: "Downloads", v: formatCount(addon.downloads) },
  ];

  return (
    <>
      <section className="border-b bg-hero">
        <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
          <Link
            to="/addons"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-smooth hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Library
          </Link>
          <div className="mt-6 grid items-start gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <span className="inline-flex rounded-full glass-panel px-3 py-1 text-xs font-medium">
                {category?.emoji} {category?.name}
              </span>
              <h1 className="mt-4 font-display text-4xl font-black md:text-5xl">{addon.title}</h1>
              <p className="mt-3 max-w-2xl text-muted-foreground">{addon.tagline}</p>
              <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1 text-warning">
                  <Star className="size-4 fill-current" /> {addon.rating}
                </span>
                <span className="flex items-center gap-1">
                  <Download className="size-4" /> {formatCount(addon.downloads)} downloads
                </span>
                <Link
                  to="/creators/$creator"
                  params={{ creator: addon.creatorSlug }}
                  className="transition-smooth hover:text-foreground"
                >
                  by {addon.creator}
                </Link>
              </div>
            </div>
            <img
              src={addon.screenshots[0]}
              alt={`${addon.title} cover`}
              width={960}
              height={540}
              className="w-full rounded-2xl border object-cover shadow-elevated"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-10">
            <div>
              <h2 className="font-display text-2xl font-bold">About this add-on</h2>
              <p className="mt-3 text-muted-foreground">{addon.description}</p>
            </div>

            {addon.screenshots.length > 1 && (
              <div>
                <h2 className="font-display text-2xl font-bold">Screenshots</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {addon.screenshots.map((s, i) => (
                    <img
                      key={s}
                      src={s}
                      alt={`${addon.title} screenshot ${i + 1}`}
                      loading="lazy"
                      width={960}
                      height={540}
                      className="w-full rounded-xl border object-cover"
                    />
                  ))}
                </div>
              </div>
            )}

            <div>
              <h2 className="font-display text-2xl font-bold">Requirements</h2>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {addon.requirements.map((r) => (
                  <li key={r} className="flex gap-2">
                    <span className="text-primary">•</span> {r}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold">Installation</h2>
              <ol className="mt-3 space-y-3">
                {addon.installation.map((step, i) => (
                  <li key={step} className="flex gap-3 text-sm text-muted-foreground">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-secondary text-xs font-bold text-foreground">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Sticky action panel */}
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border bg-card-gradient p-5 shadow-elevated">
              <button
                type="button"
                onClick={() => toast.success("Download starting", { description: addon.title })}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-violet-gradient px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-smooth hover:opacity-90"
              >
                <Download className="size-4" /> Download ({addon.fileSize})
              </button>
              <div className="mt-3 grid gap-2">
                <button
                  type="button"
                  onClick={() => toast.success("Added to favourites")}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm transition-smooth hover:bg-secondary"
                >
                  <Heart className="size-4" /> Add to favourites
                </button>
                <button
                  type="button"
                  onClick={() => toast.success("Update request sent to the creator")}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm transition-smooth hover:bg-secondary"
                >
                  <RefreshCw className="size-4" /> Request an update
                </button>
                <button
                  type="button"
                  onClick={() => toast.success("Report sent to moderators")}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm text-muted-foreground transition-smooth hover:bg-secondary"
                >
                  <Flag className="size-4" /> Report
                </button>
              </div>
            </div>

            <dl className="rounded-2xl border bg-card-gradient p-5 text-sm">
              {facts.map((f) => (
                <div key={f.k} className="flex justify-between gap-3 border-b py-2 last:border-0">
                  <dt className="text-muted-foreground">{f.k}</dt>
                  <dd className="text-right font-medium">{f.v}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-2xl font-bold">More in {category?.name}</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((a) => (
                <AddonCard key={a.id} addon={a} />
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
