import { Link } from "@tanstack/react-router";
import { Download, Star } from "lucide-react";

import { categoryBySlug, formatCount, type Addon } from "@/lib/lightcraft-data";

export function AddonCard({ addon }: { addon: Addon }) {
  const category = categoryBySlug(addon.category);
  return (
    <Link
      to="/addons/$addon"
      params={{ addon: addon.slug }}
      className="group flex flex-col overflow-hidden rounded-2xl border bg-card-gradient shadow-elevated transition-smooth hover:-translate-y-1 hover:border-primary/60 hover:shadow-glow"
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={addon.screenshots[0]}
          alt={`${addon.title} screenshot`}
          loading="lazy"
          width={960}
          height={540}
          className="size-full object-cover transition-smooth group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 rounded-full glass-panel px-3 py-1 text-xs font-medium">
          {category?.icon && <category.icon className="mr-1 inline size-3.5" aria-hidden="true" />} {category?.name}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 truncate font-display text-lg font-bold">{addon.title}</h3>
          <span className="flex shrink-0 items-center gap-1 text-sm text-warning">
            <Star className="size-3.5 fill-current" /> {addon.rating}
          </span>
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">{addon.tagline}</p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-2 text-xs text-muted-foreground">
          <span className="truncate">by {addon.creator}</span>
          <span className="flex shrink-0 items-center gap-3">
            <span className="rounded-full bg-secondary px-2 py-1">{addon.versions[0]}</span>
            <span className="flex items-center gap-1">
              <Download className="size-3.5" /> {formatCount(addon.downloads)}
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}
