import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { PageHeader } from "@/components/site/PageHeader";
import { Field, fieldClass } from "./requests.index";
import { addonTypes, categories, minecraftVersions } from "@/lib/lightcraft-data";

export const Route = createFileRoute("/submit")({
  head: () => ({
    meta: [
      { title: "Submit an Add-on — Knight MC" },
      {
        name: "description",
        content:
          "Share your Minecraft add-on with the Knight MC community. Every submission is reviewed by an admin before publishing.",
      },
      { property: "og:title", content: "Submit an Add-on — Knight MC" },
      {
        property: "og:description",
        content: "Share your Minecraft add-on — reviewed before publishing.",
      },
    ],
  }),
  component: SubmitPage,
});

const schema = z.object({
  title: z.string().trim().min(3, "Add-on name is too short").max(100),
  creator: z.string().trim().min(2, "Creator name is required").max(60),
  description: z
    .string()
    .trim()
    .min(30, "Describe your add-on in at least 30 characters")
    .max(2000),
  category: z.string().min(1),
  version: z.string().min(1),
  addonVersion: z.string().trim().min(1, "Add-on version is required").max(20),
  type: z.string().min(1),
  installation: z.string().trim().min(10, "Add installation instructions").max(1000),
});

const allowedExtensions = [".mcaddon", ".mcpack", ".mctemplate", ".zip"];
const maxSizeMb = 200;

function SubmitPage() {
  const [form, setForm] = useState({
    title: "",
    creator: "",
    description: "",
    category: categories[0]!.slug,
    version: minecraftVersions[0]!,
    addonVersion: "1.0.0",
    type: addonTypes[0]!,
    installation: "",
  });
  const [fileName, setFileName] = useState("");
  const [shots, setShots] = useState<string[]>([]);
  const [preview, setPreview] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      toast.error(`Only ${allowedExtensions.join(", ")} files are accepted.`);
      e.target.value = "";
      return;
    }
    if (file.size > maxSizeMb * 1024 * 1024) {
      toast.error(`File is too large — the limit is ${maxSizeMb} MB.`);
      e.target.value = "";
      return;
    }
    setFileName(file.name);
  };

  const onShots = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 6);
    const bad = files.find((f) => !f.type.startsWith("image/"));
    if (bad) {
      toast.error("Screenshots must be image files.");
      return;
    }
    setShots(files.map((f) => f.name));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]!.message);
      return;
    }
    if (!fileName) {
      toast.error("Attach your add-on file.");
      return;
    }
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (submitted) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-20 text-center lg:px-8">
        <div className="rounded-3xl border bg-card-gradient p-8 shadow-elevated md:p-12">
          <ShieldCheck className="mx-auto size-14 text-primary" />
          <h1 className="mt-6 font-display text-3xl font-bold">
            You&apos;ve successfully submitted an Add-on
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            We will be in touch before 24 hours.
          </p>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
            Our admins will inspect your submission for anything that bypasses our Terms of Service
            before it goes public.
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="mt-8 rounded-full bg-violet-gradient px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow"
          >
            Upload another add-on
          </button>
        </div>
      </section>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Creators"
        title="Submit an"
        highlight="Add-on"
        description="Fill in the details, attach your pack and we'll review it. Nothing goes public until it's checked."
      />

      <section className="mx-auto max-w-5xl px-4 py-12 lg:px-8">
        {preview && (
          <div
            className="mb-8 rounded-3xl border bg-card-gradient p-6 shadow-elevated"
            aria-live="polite"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Upload preview
                </p>
                <h2 className="mt-2 font-display text-2xl font-bold">
                  {form.title || "Untitled add-on"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setPreview(false)}
                className="rounded-full border border-border px-4 py-2 text-sm hover:bg-secondary"
              >
                Close
              </button>
            </div>
            <p className="mt-4 text-muted-foreground">
              {form.description || "Your description will appear here."}
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="rounded-full border px-3 py-1">{form.creator || "Creator"}</span>
              <span className="rounded-full border px-3 py-1">{form.category}</span>
              <span className="rounded-full border px-3 py-1">Minecraft {form.version}</span>
              <span className="rounded-full border px-3 py-1">v{form.addonVersion}</span>
            </div>
          </div>
        )}
        <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
          <form
            onSubmit={submit}
            className="space-y-5 rounded-3xl border bg-card-gradient p-6 shadow-elevated md:p-8"
          >
            <Field label="Add-on name">
              <input
                value={form.title}
                maxLength={100}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Dragon Expansion"
                className={fieldClass}
              />
            </Field>
            <Field label="Creator name">
              <input
                value={form.creator}
                maxLength={60}
                onChange={(e) => setForm({ ...form, creator: e.target.value })}
                placeholder="EmberForge"
                className={fieldClass}
              />
            </Field>
            <Field label="Description">
              <textarea
                value={form.description}
                maxLength={2000}
                rows={5}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="What does your add-on add? Mobs, items, mechanics…"
                className={fieldClass}
              />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Category">
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className={fieldClass}
                >
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Add-on type">
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className={fieldClass}
                >
                  {addonTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Minecraft version">
                <select
                  value={form.version}
                  onChange={(e) => setForm({ ...form, version: e.target.value })}
                  className={fieldClass}
                >
                  {minecraftVersions.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Add-on version">
                <input
                  value={form.addonVersion}
                  maxLength={20}
                  onChange={(e) => setForm({ ...form, addonVersion: e.target.value })}
                  className={fieldClass}
                />
              </Field>
            </div>
            <Field label="Installation instructions">
              <textarea
                value={form.installation}
                maxLength={1000}
                rows={4}
                onChange={(e) => setForm({ ...form, installation: e.target.value })}
                placeholder="Step by step, one per line."
                className={fieldClass}
              />
            </Field>
            <Field label="Screenshots (up to 6 images)">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={onShots}
                className={fieldClass}
              />
            </Field>
            {shots.length > 0 && (
              <p className="text-xs text-muted-foreground">{shots.join(", ")}</p>
            )}
            <Field label={`Add-on file (${allowedExtensions.join(", ")} · max ${maxSizeMb} MB)`}>
              <input
                type="file"
                accept={allowedExtensions.join(",")}
                onChange={onFile}
                className={fieldClass}
              />
            </Field>
            {fileName && <p className="text-xs text-muted-foreground">Attached: {fileName}</p>}

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setPreview(true)}
                className="inline-flex w-full items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-semibold transition-smooth hover:bg-secondary"
              >
                Preview upload
              </button>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-violet-gradient px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-smooth hover:opacity-90"
              >
                <Upload className="size-4" /> Upload for review
              </button>
            </div>
          </form>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border bg-card-gradient p-5">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold">
                <ShieldCheck className="size-4 text-primary-glow" /> Review checklist
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>• Original work, or permission to publish</li>
                <li>• Working file, tested in the version you list</li>
                <li>• Clear screenshots, no misleading covers</li>
                <li>• No external installers or paywalled links</li>
              </ul>
            </div>
            <div className="rounded-2xl border bg-card-gradient p-5 text-sm text-muted-foreground">
              Submissions start as <span className="text-foreground">Pending</span>. Track status
              any time from your dashboard.
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
