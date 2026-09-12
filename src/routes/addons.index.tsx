import { createFileRoute } from "@tanstack/react-router";
import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";

import { AddonCard } from "@/components/site/AddonCard";
import { PageHeader } from "@/components/site/PageHeader";
import { addonTypes, addons, categories, minecraftVersions } from "@/lib/lightcraft-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/addons/")({
  head: () => ({
    meta: [
      { title: "Browse Minecraft Add-ons — Knight MC" },
      {
        name: "description",
        content:
          "Search and filter the Knight MC library by Minecraft version, add-on type, category and popularity.",
      },
      { property: "og:title", content: "Browse Minecraft Add-ons — Knight MC" },
      {
        property: "og:description",
        content: "Search and filter reviewed Minecraft add-ons by version, type and category.",
      },
    ],
  }),
  component: BrowsePage,
});

const sorts = [
  { key: "downloads", label: "Most downloaded" },
  { key: "created", label: "Recently added" },
  { key: "updated", label: "Recently updated" },
  { key: "rating", label: "Highest rated" },
] as const;

const selectClass =
  "w-full rounded-xl border border-input bg-card px-3 py-2.5 text-sm text-foreground outline-none transition-smooth focus:border-primary";

function BrowsePage() {
  const [query, setQuery] = useState("");
  const [version, setVersion] = useState("all");
  const [type, setType] = useState("all");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<(typeof sorts)[number]["key"]>("downloads");
  const [openFilters, setOpenFilters] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = addons.filter((a) => {
      if (a.status !== "published") return false;
      if (q && !`${a.title} ${a.tagline} ${a.creator}`.toLowerCase().includes(q)) return false;
      if (version !== "all" && !a.versions.includes(version)) return false;
      if (type !== "all" && a.type !== type) return false;
      if (category !== "all" && a.category !== category) return false;
      return true;
    });
    return list.sort((a, b) => {
      if (sort === "downloads") return b.downloads - a.downloads;
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "created") return b.created.localeCompare(a.created);
      return b.updated.localeCompare(a.updated);
    });
  }, [query, version, type, category, sort]);

  return (
    <>
      <PageHeader
        eyebrow="Library"
        title="Browse"
        highlight="Add-ons"
        description="Every add-on here has been reviewed and tested by the Knight MC team."
      />

      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          {/* Filters */}
          <div>
            <button
              type="button"
              onClick={() => setOpenFilters((v) => !v)}
              className="mb-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium lg:hidden"
            >
              <SlidersHorizontal className="size-4" /> Filters
            </button>
            <aside
              className={cn(
                "space-y-5 rounded-2xl border bg-card-gradient p-5 lg:sticky lg:top-24",
                openFilters ? "block" : "hidden lg:block",
              )}
            >
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Minecraft version
                </label>
                <select
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  className={cn(selectClass, "mt-2")}
                >
                  <option value="all">All versions</option>
                  {minecraftVersions.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Add-on type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className={cn(selectClass, "mt-2")}
                >
                  <option value="all">All types</option>
                  {addonTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={cn(selectClass, "mt-2")}
                >
                  <option value="all">All categories</option>
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.emoji} {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Sort by
                </label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as typeof sort)}
                  className={cn(selectClass, "mt-2")}
                >
                  {sorts.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </aside>
          </div>

          {/* Results */}
          <div>
            <div className="relative">
              <Search className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                maxLength={80}
                placeholder="Search add-ons, creators…"
                className="w-full rounded-full border border-input bg-card py-3 pr-4 pl-11 text-sm outline-none transition-smooth focus:border-primary"
              />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              {results.length} add-on{results.length === 1 ? "" : "s"} found
            </p>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((a) => (
                <AddonCard key={a.id} addon={a} />
              ))}
            </div>
            {results.length === 0 && (
              <div className="mt-10 rounded-2xl border bg-card-gradient p-10 text-center">
                <p className="font-display text-lg font-bold">Nothing matches those filters</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try a broader search — or request the add-on you're after.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
