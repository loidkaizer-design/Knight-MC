import { createFileRoute } from "@tanstack/react-router";
import {
  ShieldCheck,
  Upload,
  Eye,
  Code2,
  ImagePlus,
  Bold,
  Italic,
  Link2,
  Minus,
  Undo2,
  Redo2,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { PageHeader } from "@/components/site/PageHeader";
import { Field, fieldClass } from "./requests.index";
import { addonTypes, categories, minecraftVersions } from "@/lib/lightcraft-data";
import { submitAddon } from "@/lib/addon-actions";

export const Route = createFileRoute("/submit")({
  head: () => ({ meta: [{ title: "Submit an Add-on — Knight MC" }] }),
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
const imageTypes = ["image/png", "image/jpeg", "image/webp", "image/gif"];

type UploadValue = { name: string; type: string; data: string };

function readFile(file: File): Promise<UploadValue> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      resolve({
        name: file.name,
        type: file.type || "application/octet-stream",
        data: String(reader.result),
      });
    reader.onerror = () => reject(new Error("Could not read that file."));
    reader.readAsDataURL(file);
  });
}

function SubmitPage() {
  const [mode, setMode] = useState<"simple" | "advanced">("simple");
  const [form, setForm] = useState({
    title: "",
    creator: "",
    description: "",
    category: categories[0]!.slug,
    version: minecraftVersions[0]!,
    addonVersion: "1.0.0",
    type: addonTypes[0]!,
    installation: "",
    hashtags: "",
    tags: "",
    credits: "",
    changelog: "",
    compatibility: "",
  });
  const [addonFile, setAddonFile] = useState<UploadValue | null>(null);
  const [thumbnail, setThumbnail] = useState<UploadValue | undefined>();
  const [screenshots, setScreenshots] = useState<UploadValue[]>([]);
  const [readme, setReadme] = useState(
    "# My add-on\n\nDescribe what makes your add-on special.\n\n## Features\n- Feature one\n- Feature two",
  );
  const [preview, setPreview] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  const updateReadme = (value: string) => {
    setHistory((items) => [...items.slice(0, historyIndex + 1), value].slice(-30));
    setHistoryIndex((index) => Math.min(index + 1, 29));
    setReadme(value);
  };
  const insert = (value: string) => {
    const editor = editorRef.current;
    const start = editor?.selectionStart ?? readme.length;
    updateReadme(`${readme.slice(0, start)}${value}${readme.slice(editor?.selectionEnd ?? start)}`);
  };
  const onAddonFile = async (file?: File) => {
    if (!file) return;
    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (!allowedExtensions.includes(ext) || file.size > maxSizeMb * 1024 * 1024)
      return toast.error(`Use ${allowedExtensions.join(", ")} files under ${maxSizeMb} MB.`);
    setAddonFile(await readFile(file));
  };
  const onImage = async (file?: File) => {
    if (!file || !imageTypes.includes(file.type) || file.size > 8 * 1024 * 1024)
      return toast.error("Use PNG, JPG, WEBP, or GIF images under 8 MB.");
    const value = await readFile(file);
    setThumbnail(value);
    insert(`\n![${file.name}](${value.data})\n`);
  };
  const onScreenshots = async (files: FileList | null) => {
    if (!files) return;
    const incoming = Array.from(files);
    if (screenshots.length + incoming.length > 8) return toast.error("Add up to 8 screenshots.");
    if (incoming.some((file) => !imageTypes.includes(file.type) || file.size > 8 * 1024 * 1024))
      return toast.error("Use PNG, JPG, WEBP, or GIF screenshots under 8 MB each.");
    const values = await Promise.all(incoming.map(readFile));
    setScreenshots((current) => [...current, ...values]);
  };
  const tags = (value: string) =>
    value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
      .slice(0, 20);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) return toast.error(parsed.error.issues[0]!.message);
    if (!addonFile) return toast.error("Attach your add-on file.");
    if (!preview) return toast.error("Preview your add-on before submitting.");
    setLoading(true);
    try {
      await submitAddon({
        data: {
          ...form,
          hashtags: tags(form.hashtags),
          tags: tags(form.tags),
          readmeContent: readme,
          addonFile,
          thumbnail,
          screenshots,
        },
      });
      setSubmitted(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Submission failed.");
    } finally {
      setLoading(false);
    }
  };
  const previewTitle = useMemo(() => form.title || "Untitled add-on", [form.title]);

  if (submitted)
    return (
      <section className="mx-auto max-w-3xl px-4 py-20 text-center">
        <div className="rounded-3xl border bg-card-gradient p-8 shadow-elevated md:p-12">
          <ShieldCheck className="mx-auto size-14 text-primary" />
          <h1 className="mt-6 font-display text-3xl font-bold">
            You&apos;ve successfully submitted an Add-on
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            We will be in touch before 24 hours.
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="mt-8 rounded-full bg-violet-gradient px-6 py-3 text-sm font-semibold text-primary-foreground"
          >
            Upload another add-on
          </button>
        </div>
      </section>
    );

  return (
    <>
      <PageHeader
        eyebrow="Creators"
        title="Submit an"
        highlight="Add-on"
        description="Choose a simple upload or build a complete README-style add-on page. Every submission is reviewed before publishing."
      />
      <section className="mx-auto max-w-6xl px-4 py-12 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border bg-card-gradient p-3">
          <div className="flex gap-2">
            <button
              type="button"
              className={`rounded-xl px-4 py-2 text-sm font-semibold ${mode === "simple" ? "bg-secondary" : ""}`}
              onClick={() => setMode("simple")}
            >
              Simple
            </button>
            <button
              type="button"
              className={`rounded-xl px-4 py-2 text-sm font-semibold ${mode === "advanced" ? "bg-secondary" : ""}`}
              onClick={() => setMode("advanced")}
            >
              Advanced README
            </button>
          </div>
          <span className="text-xs text-muted-foreground">
            Autosave enabled locally · Preview required
          </span>
        </div>
        {preview && (
          <div className="mb-8 rounded-3xl border bg-card-gradient p-6 shadow-elevated">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Public preview
                </p>
                <h2 className="mt-2 font-display text-3xl font-bold">{previewTitle}</h2>
              </div>
              <button
                type="button"
                className="rounded-full border px-4 py-2 text-sm"
                onClick={() => setPreview(false)}
              >
                Edit
              </button>
            </div>
            <p className="mt-4 max-w-3xl text-muted-foreground">
              {form.description || "Your description will appear here."}
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="rounded-full border px-3 py-1">{form.creator || "Creator"}</span>
              <span className="rounded-full border px-3 py-1">{form.category}</span>
              <span className="rounded-full border px-3 py-1">Minecraft {form.version}</span>
              <span className="rounded-full border px-3 py-1">v{form.addonVersion}</span>
            </div>
            {thumbnail && (
              <img
                src={thumbnail.data}
                alt="Thumbnail preview"
                className="mt-6 max-h-80 w-full rounded-2xl object-cover"
              />
            )}
            {screenshots.length > 0 && (
              <div className="mt-6">
                <h3 className="font-display text-lg font-bold">Screenshots</h3>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {screenshots.map((screenshot, index) => (
                    <img
                      key={`${screenshot.name}-${index}`}
                      src={screenshot.data}
                      alt={`Screenshot ${index + 1}`}
                      className="aspect-video w-full rounded-xl border object-cover"
                    />
                  ))}
                </div>
              </div>
            )}
            {mode === "advanced" && (
              <pre className="mt-6 whitespace-pre-wrap rounded-2xl bg-secondary p-5 text-sm">
                {readme}
              </pre>
            )}
          </div>
        )}
        <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1fr_280px]">
          <div className="space-y-5 rounded-3xl border bg-card-gradient p-6 shadow-elevated md:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Add-on name">
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className={fieldClass}
                  placeholder="Dragon Expansion"
                />
              </Field>
              <Field label="Creator name">
                <input
                  required
                  value={form.creator}
                  onChange={(e) => setForm({ ...form, creator: e.target.value })}
                  className={fieldClass}
                  placeholder="EmberForge"
                />
              </Field>
            </div>
            <Field label="Description">
              <textarea
                required
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={5}
                className={fieldClass}
                placeholder="What does your add-on add?"
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
                    <option key={t}>{t}</option>
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
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </Field>
              <Field label="Add-on version">
                <input
                  value={form.addonVersion}
                  onChange={(e) => setForm({ ...form, addonVersion: e.target.value })}
                  className={fieldClass}
                />
              </Field>
            </div>
            {mode === "simple" ? (
              <>
                <Field label="Hashtags">
                  <input
                    value={form.hashtags}
                    onChange={(e) => setForm({ ...form, hashtags: e.target.value })}
                    className={fieldClass}
                    placeholder="dragons, fantasy, mobs"
                  />
                </Field>
                <Field label="Tags">
                  <input
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    className={fieldClass}
                    placeholder="survival, adventure"
                  />
                </Field>
              </>
            ) : (
              <div className="rounded-2xl border p-4">
                <div className="mb-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => insert("**bold**")}
                    className="rounded-lg border p-2"
                    aria-label="Bold"
                  >
                    <Bold className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insert("_italic_")}
                    className="rounded-lg border p-2"
                    aria-label="Italic"
                  >
                    <Italic className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insert("\n## Heading\n")}
                    className="rounded-lg border p-2"
                    aria-label="Heading"
                  >
                    H
                  </button>
                  <button
                    type="button"
                    onClick={() => insert("\n---\n")}
                    className="rounded-lg border p-2"
                    aria-label="Divider"
                  >
                    <Minus className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insert("[Link](https://example.com)")}
                    className="rounded-lg border p-2"
                    aria-label="Link"
                  >
                    <Link2 className="size-4" />
                  </button>
                  <label className="cursor-pointer rounded-lg border p-2" aria-label="Upload image">
                    <ImagePlus className="size-4" />
                    <input
                      type="file"
                      accept={imageTypes.join(",")}
                      className="hidden"
                      onChange={(e) => void onImage(e.target.files?.[0])}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setReadme(history[historyIndex - 1] ?? readme)}
                    className="rounded-lg border p-2"
                    aria-label="Undo"
                  >
                    <Undo2 className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setReadme(history[historyIndex + 1] ?? readme)}
                    className="rounded-lg border p-2"
                    aria-label="Redo"
                  >
                    <Redo2 className="size-4" />
                  </button>
                </div>
                <textarea
                  ref={editorRef}
                  value={readme}
                  onChange={(e) => updateReadme(e.target.value)}
                  className={`${fieldClass} min-h-72 font-mono text-sm`}
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  Markdown, code blocks, headings, links, images, GIFs, quotes, lists, and tables
                  are supported.
                </p>
              </div>
            )}
            <Field label="Installation instructions">
              <textarea
                required
                value={form.installation}
                onChange={(e) => setForm({ ...form, installation: e.target.value })}
                rows={4}
                className={fieldClass}
                placeholder="Step by step, one per line."
              />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Credits">
                <textarea
                  value={form.credits}
                  onChange={(e) => setForm({ ...form, credits: e.target.value })}
                  className={fieldClass}
                />
              </Field>
              <Field label="Changelog">
                <textarea
                  value={form.changelog}
                  onChange={(e) => setForm({ ...form, changelog: e.target.value })}
                  className={fieldClass}
                />
              </Field>
              <Field label="Compatibility">
                <input
                  value={form.compatibility}
                  onChange={(e) => setForm({ ...form, compatibility: e.target.value })}
                  className={fieldClass}
                />
              </Field>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Thumbnail">
                <input
                  type="file"
                  accept={imageTypes.join(",")}
                  onChange={(e) => void onImage(e.target.files?.[0])}
                  className={fieldClass}
                />
              </Field>
              <Field label="Screenshots (up to 8)">
                <input
                  type="file"
                  multiple
                  accept={imageTypes.join(",")}
                  onChange={(e) => void onScreenshots(e.target.files)}
                  className={fieldClass}
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  PNG, JPG, WEBP, or GIF · max 8 MB each
                </p>
                {screenshots.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {screenshots.map((screenshot, index) => (
                      <div key={`${screenshot.name}-${index}`} className="group relative">
                        <img
                          src={screenshot.data}
                          alt={screenshot.name}
                          className="aspect-video w-full rounded-lg border object-cover"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setScreenshots((items) =>
                              items.filter((_, itemIndex) => itemIndex !== index),
                            )
                          }
                          className="absolute right-1 top-1 rounded-full bg-background/90 px-2 py-1 text-xs opacity-0 transition group-hover:opacity-100"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </Field>
              <Field label={`Add-on file (${allowedExtensions.join(", ")} · max ${maxSizeMb} MB)`}>
                <input
                  required
                  type="file"
                  accept={allowedExtensions.join(",")}
                  onChange={(e) => void onAddonFile(e.target.files?.[0])}
                  className={fieldClass}
                />
              </Field>
            </div>
            {addonFile && (
              <p className="text-xs text-muted-foreground">Attached: {addonFile.name}</p>
            )}
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setPreview(true)}
                className="inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold hover:bg-secondary"
              >
                <Eye className="size-4" /> Preview upload
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-violet-gradient px-6 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
              >
                {loading ? (
                  <span className="loader" aria-label="Uploading" />
                ) : (
                  <>
                    <Upload className="size-4" /> Upload for review
                  </>
                )}
              </button>
            </div>
          </div>
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border bg-card-gradient p-5">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold">
                <ShieldCheck className="size-4 text-primary-glow" /> Review checklist
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>Original work or permission to publish</li>
                <li>Working file and clear compatibility</li>
                <li>No external installers or paywalled links</li>
                <li>Preview before final submission</li>
              </ul>
            </div>
            <div className="rounded-2xl border bg-card-gradient p-5 text-sm text-muted-foreground">
              <Code2 className="mb-2 size-5 text-primary" />{" "}
              {mode === "advanced"
                ? "Advanced mode saves a README-style presentation with your addon."
                : "Simple mode is the fastest way to submit your addon."}
            </div>
          </aside>
        </form>
      </section>
    </>
  );
}
