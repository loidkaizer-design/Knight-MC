import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { AddonCard } from "@/components/site/AddonCard";
import { addonsByCreator, creatorBySlug, formatCount, formatDate } from "@/lib/lightcraft-data";

export const Route = createFileRoute("/creators/$creator")({
  loader: ({ params }) => {
    const creator = creatorBySlug(params.creator);
    if (!creator) throw notFound();
    return { creator, addons: addonsByCreator(creator.slug) };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Creator not found — LightCraft" }, { name: "robots", content: "noindex" }],
      };
    }
    const { creator } = loaderData;
    return {
      meta: [
        { title: `${creator.name} — LightCraft Creator` },
        { name: "description", content: creator.bio },
        { property: "og:title", content: `${creator.name} — LightCraft Creator` },
        { property: "og:description", content: creator.bio },
      ],
    };
  },
  component: CreatorPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="font-display text-3xl font-black">Creator not found</h1>
      <Link to="/creators" className="mt-6 inline-flex text-sm text-primary">
        All creators
      </Link>
    </div>
  ),
});

function CreatorPage() {
  const { creator, addons } = Route.useLoaderData();
  const downloads = addons.reduce((s, a) => s + a.downloads, 0);

  return (
    <>
      <section className="border-b bg-hero">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
          <Link
            to="/creators"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-smooth hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Creators
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-5">
            <span className="grid size-20 shrink-0 place-items-center rounded-2xl bg-violet-gradient font-display text-3xl font-black text-primary-foreground shadow-glow">
              {creator.name.charAt(0)}
            </span>
            <div className="min-w-0">
              <h1 className="font-display text-3xl font-black md:text-4xl">{creator.name}</h1>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">{creator.bio}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {addons.length} published add-ons · {formatCount(downloads)} downloads · joined{" "}
                {formatDate(creator.joined)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <h2 className="font-display text-2xl font-bold">Published add-ons</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {addons.map((a) => (
            <AddonCard key={a.id} addon={a} />
          ))}
        </div>
      </section>
    </>
  );
}
