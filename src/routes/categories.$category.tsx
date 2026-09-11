import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { AddonCard } from "@/components/site/AddonCard";
import { PageHeader } from "@/components/site/PageHeader";
import { addonsByCategory, categories, categoryBySlug } from "@/lib/lightcraft-data";

export const Route = createFileRoute("/categories/$category")({
  loader: ({ params }) => {
    const category = categoryBySlug(params.category);
    if (!category) throw notFound();
    return { category, addons: addonsByCategory(category.slug) };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Category not found — LightCraft" }, { name: "robots", content: "noindex" }],
      };
    }
    const { category } = loaderData;
    return {
      meta: [
        { title: `${category.name} Add-ons — LightCraft` },
        { name: "description", content: `${category.name} Minecraft add-ons: ${category.blurb}` },
        { property: "og:title", content: `${category.name} Add-ons — LightCraft` },
        { property: "og:description", content: category.blurb },
      ],
    };
  },
  component: CategoryPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="font-display text-3xl font-black">Category not found</h1>
      <Link to="/categories" className="mt-6 inline-flex text-sm text-primary">
        All categories
      </Link>
    </div>
  ),
});

function CategoryPage() {
  const { category, addons } = Route.useLoaderData();
  return (
    <>
      <PageHeader
        eyebrow={`${category.emoji} Category`}
        title={category.name}
        highlight="Add-ons"
        description={category.blurb}
      />
      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <Link
          to="/categories"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-smooth hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> All categories
        </Link>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {addons.map((a) => (
            <AddonCard key={a.id} addon={a} />
          ))}
        </div>
        {addons.length === 0 && (
          <p className="mt-10 rounded-2xl border bg-card-gradient p-10 text-center text-sm text-muted-foreground">
            No add-ons here yet — be the first to submit one.
          </p>
        )}

        <div className="mt-14">
          <h2 className="font-display text-xl font-bold">Other categories</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {categories
              .filter((c) => c.slug !== category.slug)
              .map((c) => (
                <Link
                  key={c.slug}
                  to="/categories/$category"
                  params={{ category: c.slug }}
                  className="rounded-full border border-border px-4 py-2 text-sm transition-smooth hover:bg-secondary"
                >
                  {c.emoji} {c.name}
                </Link>
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
