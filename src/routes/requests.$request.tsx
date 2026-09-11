import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft, ChevronUp, MessageSquare } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { StatusPill } from "./requests.index";
import { categoryBySlug, formatDate, requestBySlug } from "@/lib/lightcraft-data";

export const Route = createFileRoute("/requests/$request")({
  loader: ({ params }) => {
    const request = requestBySlug(params.request);
    if (!request) throw notFound();
    return { request };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Request not found — LightCraft" }, { name: "robots", content: "noindex" }],
      };
    }
    const { request } = loaderData;
    return {
      meta: [
        { title: `${request.title} — LightCraft Request` },
        { name: "description", content: request.description },
        { property: "og:title", content: `${request.title} — LightCraft Request` },
        { property: "og:description", content: request.description },
      ],
    };
  },
  component: RequestPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="font-display text-3xl font-black">Request not found</h1>
      <Link to="/requests" className="mt-6 inline-flex text-sm text-primary">
        All requests
      </Link>
    </div>
  ),
});

function RequestPage() {
  const { request } = Route.useLoaderData();
  const [voted, setVoted] = useState(false);
  const category = categoryBySlug(request.category);

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
      <Link
        to="/requests"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-smooth hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> All requests
      </Link>

      <div className="mt-6 rounded-3xl border bg-card-gradient p-8 shadow-elevated">
        <div className="flex flex-wrap items-center gap-3">
          <StatusPill status={request.status} />
          <span className="text-xs text-muted-foreground">
            {category?.emoji} {category?.name} · {request.version}
          </span>
        </div>
        <h1 className="mt-4 font-display text-3xl font-black md:text-4xl">{request.title}</h1>
        <p className="mt-4 text-muted-foreground">{request.description}</p>
        <p className="mt-4 text-xs text-muted-foreground">
          Asked by {request.createdBy} on {formatDate(request.createdAt)}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setVoted((v) => !v);
              toast.success(voted ? "Vote removed" : "You're interested in this request");
            }}
            className="inline-flex items-center gap-2 rounded-full bg-violet-gradient px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-smooth hover:opacity-90"
          >
            <ChevronUp className="size-4" /> {request.votes + (voted ? 1 : 0)} interested
          </button>
          <span className="text-sm text-muted-foreground">
            Upvote instead of posting a duplicate request.
          </span>
        </div>
      </div>

      {request.officialResponse && (
        <div className="mt-6 rounded-2xl border border-primary/40 bg-primary/10 p-6">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold">
            <MessageSquare className="size-4" /> Official response
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{request.officialResponse}</p>
        </div>
      )}

      <div className="mt-6 rounded-2xl border bg-card-gradient p-6">
        <h2 className="font-display text-lg font-bold">Progress</h2>
        <ol className="mt-4 grid gap-3 sm:grid-cols-4">
          {["requested", "under-consideration", "in-development", "completed"].map((s, i) => {
            const order = ["requested", "under-consideration", "in-development", "completed"];
            const active = order.indexOf(request.status) >= i;
            return (
              <li
                key={s}
                className={`rounded-xl border p-3 text-center text-xs ${
                  active ? "border-primary/60 bg-primary/15 text-foreground" : "text-muted-foreground"
                }`}
              >
                {s.replace("-", " ")}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
