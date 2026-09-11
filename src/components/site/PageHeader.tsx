import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  highlight,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  highlight?: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b bg-hero">
      <div className="mx-auto max-w-7xl px-4 py-14 md:py-20 lg:px-8">
        {eyebrow && (
          <span className="inline-flex rounded-full glass-panel px-3 py-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {eyebrow}
          </span>
        )}
        <h1 className="mt-4 font-display text-4xl font-black md:text-5xl">
          {title} {highlight && <span className="text-violet-gradient">{highlight}</span>}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-base text-muted-foreground">{description}</p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
