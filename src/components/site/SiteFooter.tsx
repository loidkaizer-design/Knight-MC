import { Link } from "@tanstack/react-router";
import { Github, Twitter, Youtube } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t bg-card-gradient">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4 lg:px-8">
        <div>
          <Link to="/" className="font-display text-2xl font-black">
            Knight <span className="text-violet-gradient">MC</span>
          </Link>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Your Minecraft add-on library. Discover, download, request and share community
            creations — every upload reviewed before it goes public.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Library</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/addons" className="transition-smooth hover:text-foreground">
                Browse add-ons
              </Link>
            </li>
            <li>
              <Link to="/categories" className="transition-smooth hover:text-foreground">
                Categories
              </Link>
            </li>
            <li>
              <Link to="/creators" className="transition-smooth hover:text-foreground">
                Creators
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Community</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/requests" className="transition-smooth hover:text-foreground">
                Requests
              </Link>
            </li>
            <li>
              <Link to="/submit" className="transition-smooth hover:text-foreground">
                Submit an add-on
              </Link>
            </li>
            <li>
              <Link to="/about" className="transition-smooth hover:text-foreground">
                About Knight MC
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Follow along</h3>
          <div className="mt-3 flex gap-2">
            {[Twitter, Youtube, Github].map((Icon, i) => (
              <span
                key={i}
                className="grid size-9 place-items-center rounded-full border border-border text-muted-foreground transition-smooth hover:text-foreground"
              >
                <Icon className="size-4" />
              </span>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Knight MC</p>
        </div>
      </div>

      <div className="border-t px-4 py-6 text-center text-xs text-muted-foreground">
        Knight MC is a community project and is not affiliated with Mojang or Microsoft.
      </div>
    </footer>
  );
}
