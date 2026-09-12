import { Link } from "@tanstack/react-router";
import { Menu, Search, X } from "lucide-react";
import { useEffect, useState } from "react";

import knightMcLogo from "@/assets/knight-mc-logo.png";
import { AuthControls } from "@/components/auth/AuthControls";
import { cn } from "@/lib/utils";

const navLinks = [
  { to: "/addons", label: "Browse" },
  { to: "/categories", label: "Categories" },
  { to: "/requests", label: "Requests" },
  { to: "/submit", label: "Submit" },
  { to: "/about", label: "About" },
  { to: "/admin", label: "Admin" },
] as const;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-smooth",
        scrolled ? "glass-panel border-b shadow-elevated" : "border-b border-transparent",
      )}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 lg:flex lg:justify-between lg:px-8">
        <Link to="/" className="flex min-w-0 items-center" aria-label="Knight MC home">
          <img
            src={knightMcLogo}
            alt="Knight MC"
            width={1920}
            height={450}
            className="h-10 w-auto max-w-[13rem] object-contain sm:h-11 sm:max-w-[16rem]"
          />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-full px-3 py-2 text-sm text-muted-foreground transition-smooth hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "text-foreground bg-secondary" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            to="/addons"
            className="grid size-9 place-items-center rounded-full border border-border text-muted-foreground transition-smooth hover:text-foreground"
            aria-label="Search add-ons"
          >
            <Search className="size-4" />
          </Link>
          <AuthControls />
          <Link
            to="/submit"
            className="hidden rounded-full bg-violet-gradient px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow transition-smooth hover:opacity-90 lg:inline-flex"
          >
            Submit Add-on
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="grid size-10 shrink-0 place-items-center rounded-lg border border-border md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="glass-panel border-t px-4 pb-4 md:hidden">
          <nav className="flex flex-col py-2">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm text-muted-foreground transition-smooth hover:bg-secondary hover:text-foreground"
                activeProps={{ className: "text-foreground bg-secondary" }}
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full border border-border px-4 py-2.5 text-center text-sm font-medium"
            >
              Account
            </Link>
            <Link
              to="/submit"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-violet-gradient px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground"
            >
              Submit Add-on
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
