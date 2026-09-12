import { Link, createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/site/PageHeader";
import { addonsByCategory, categories } from "@/lib/lightcraft-data";

export const Route = createFileRoute("/categories/")({
  head: () => ({
    meta: [
      { title: "Add-on Categories — Knight MC" },
      {
        name: "description",
        content:
          "Browse Minecraft add-ons by category: weapons, building, mobs, world, textures, magic, vehicles and more.",
      },
      { property: "og:title", content: "Add-on Categories — Knight MC" },
      { property: "og:description", content: "Browse Minecraft add-ons by category." },
    ],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Library"
        title="Add-on"
        highlight="Categories"
        description="Pick a lane — from dragon packs to inventory tweaks."
      />
      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => {
            const count = addonsByCategory(c.slug).length;
            return (
              <Link
                key={c.slug}
                to="/categories/$category"
                params={{ category: c.slug }}
                className="rounded-2xl border bg-card-gradient p-6 transition-smooth hover:-translate-y-1 hover:border-primary/60 hover:shadow-glow"
              >
                <c.icon className="size-8 text-primary" aria-hidden="true" />
                <h2 className="mt-3 font-display text-xl font-bold">{c.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{c.blurb}</p>
                <p className="mt-4 text-xs text-muted-foreground">
                  {count} add-on{count === 1 ? "" : "s"}
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
