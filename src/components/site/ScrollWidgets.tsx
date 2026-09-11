import { Link } from "@tanstack/react-router";
import { ArrowUp, Compass } from "lucide-react";
import { useEffect, useState } from "react";

function useScrollPast(threshold: number) {
  const [past, setPast] = useState(false);
  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return past;
}

export function BackToTop() {
  const show = useScrollPast(300);
  if (!show) return null;
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="fixed bottom-5 left-5 z-40 grid size-11 place-items-center rounded-full glass-panel text-foreground shadow-elevated transition-smooth hover:bg-secondary"
    >
      <ArrowUp className="size-5" />
    </button>
  );
}

/** Floating CTA — hidden on mobile to keep pinned elements minimal. */
export function FloatingCTA() {
  const show = useScrollPast(600);
  if (!show) return null;
  return (
    <Link
      to="/addons"
      className="fixed right-5 bottom-5 z-40 hidden items-center gap-2 rounded-full bg-violet-gradient px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-smooth hover:opacity-90 md:inline-flex"
    >
      <Compass className="size-4" /> Browse Add-ons
    </Link>
  );
}
