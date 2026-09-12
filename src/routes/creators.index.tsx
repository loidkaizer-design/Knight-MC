import { Link, createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/site/PageHeader";
import { addonsByCreator, creators, formatCount } from "@/lib/lightcraft-data";

export const Route = createFileRoute("/creators/")({
  head: () => ({
    meta: [
      { title: "Creators — Knight MC" },
      {
        name: "description",
        content: "Meet the creators publishing Minecraft add-ons on Knight MC.",
      },
      { property: "og:title", content: "Creators — Knight MC" },
      { property: "og:description", content: "Meet the creators publishing add-ons on Knight MC." },
    ],
  }),
  component: CreatorsPage,
});

function CreatorsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Community"
        title="Knight MC"
        highlight="Creators"
        description="The people building the packs in this library."
      />
      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {creators.map((c) => {
            const packs = addonsByCreator(c.slug);
            const downloads = packs.reduce((s, a) => s + a.downloads, 0);
            return (
              <Link
                key={c.slug}
                to="/creators/$creator"
                params={{ creator: c.slug }}
                className="rounded-2xl border bg-card-gradient p-6 transition-smooth hover:-translate-y-1 hover:border-primary/60 hover:shadow-glow"
              >
                <span className="grid size-12 place-items-center rounded-full bg-violet-gradient font-display text-lg font-black text-primary-foreground">
                  {c.name.charAt(0)}
                </span>
                <h2 className="mt-4 font-display text-xl font-bold">{c.name}</h2>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{c.bio}</p>
                <p className="mt-4 text-xs text-muted-foreground">
                  {packs.length} add-ons · {formatCount(downloads)} downloads
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
