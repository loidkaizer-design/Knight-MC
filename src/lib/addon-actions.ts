import { put } from "@vercel/blob";
import { createServerFn } from "@tanstack/react-start";
import { auth } from "@clerk/tanstack-react-start/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const addonInput = z.object({
  title: z.string().trim().min(3).max(100),
  creator: z.string().trim().min(2).max(60),
  description: z.string().trim().min(30).max(2000),
  category: z.string().min(1),
  version: z.string().min(1),
  addonVersion: z.string().trim().min(1).max(20),
  type: z.string().min(1),
  installation: z.string().trim().min(10).max(1000),
  hashtags: z.array(z.string().trim().max(40)).max(20).default([]),
  tags: z.array(z.string().trim().max(40)).max(20).default([]),
  credits: z.string().max(1000).optional().default(""),
  changelog: z.string().max(2000).optional().default(""),
  compatibility: z.string().max(500).optional().default(""),
  readmeContent: z.string().max(50000).optional().default(""),
  addonFile: z.object({ name: z.string(), type: z.string(), data: z.string() }),
  thumbnail: z.object({ name: z.string(), type: z.string(), data: z.string() }).optional(),
  screenshots: z
    .array(z.object({ name: z.string(), type: z.string(), data: z.string() }))
    .max(8)
    .default([]),
});

function db() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function decodeDataUrl(data: string) {
  const match = data.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) throw new Error("Invalid uploaded file");
  return { type: match[1]!, bytes: Buffer.from(match[2]!, "base64") };
}

export const submitAddon = createServerFn({ method: "POST" })
  .validator(addonInput)
  .handler(async ({ data }) => {
    const session = await auth();
    if (!session.userId) throw new Error("You must be signed in to submit an add-on.");

    const addonFile = decodeDataUrl(data.addonFile.data);
    if (addonFile.bytes.byteLength > 200 * 1024 * 1024)
      throw new Error("Add-on files must be 200 MB or smaller.");
    const allowed = [".mcaddon", ".mcpack", ".mctemplate", ".zip"];
    if (!allowed.some((ext) => data.addonFile.name.toLowerCase().endsWith(ext)))
      throw new Error("Unsupported add-on file type.");

    const slug = `${data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")}-${crypto.randomUUID().slice(0, 8)}`;
    const fileBlob = await put(
      `addons/${session.userId}/${slug}/${data.addonFile.name}`,
      addonFile.bytes,
      { access: "private", contentType: addonFile.type },
    );
    let thumbnailPath: string | null = null;
    if (data.thumbnail) {
      const thumbnail = decodeDataUrl(data.thumbnail.data);
      if (thumbnail.bytes.byteLength > 8 * 1024 * 1024 || !thumbnail.type.startsWith("image/"))
        throw new Error("Thumbnail must be an image under 8 MB.");
      const blob = await put(
        `addons/${session.userId}/${slug}/thumbnail-${data.thumbnail.name}`,
        thumbnail.bytes,
        { access: "private", contentType: thumbnail.type },
      );
      thumbnailPath = blob.pathname;
    }

    for (const screenshot of data.screenshots) {
      const image = decodeDataUrl(screenshot.data);
      if (!image.type.startsWith("image/") || image.bytes.byteLength > 8 * 1024 * 1024) {
        throw new Error("Screenshots must be images under 8 MB each.");
      }
    }

    const { data: insertedAddon, error } = await db()
      .from("addons")
      .insert({
        slug,
        title: data.title,
        description: data.description,
        author_name: data.creator,
        submitter_id: session.userId,
        category: data.category,
        addon_type: data.type,
        addon_version: data.addonVersion,
        versions: [data.version],
        installation: data.installation
          .split("\\n")
          .map((step) => step.trim())
          .filter(Boolean),
        file_url: fileBlob.pathname,
        cover_url: thumbnailPath,
        tagline: data.description.slice(0, 140),
        status: "pending",
        downloads: 0,
        viewers: 0,
      })
      .select("id")
      .single();
    if (error || !insertedAddon) {
      console.error("[v0] Addon insert failed", error);
      throw new Error(error?.message ?? "Could not save your submission.");
    }

    if (data.screenshots.length > 0) {
      const screenshotRows = [];
      for (const [index, screenshot] of data.screenshots.entries()) {
        const image = decodeDataUrl(screenshot.data);
        const blob = await put(
          `addons/${session.userId}/${slug}/screenshots/${index + 1}-${screenshot.name}`,
          image.bytes,
          { access: "private", contentType: image.type },
        );
        screenshotRows.push({
          addon_id: insertedAddon.id,
          image_url: blob.pathname,
          sort_order: index,
        });
      }
      const { error: screenshotError } = await db()
        .from("addon_screenshots")
        .insert(screenshotRows);
      if (screenshotError) {
        console.error("[v0] Screenshot insert failed", screenshotError);
        throw new Error(screenshotError.message);
      }
    }
    return { slug };
  });

const adminEmails = new Set([
  "loidkaizer@gmail.com",
  "niethanbabor@gmail.com",
  "nathanbabor5@gmail.com",
]);

async function requireAdmin() {
  const session = await auth();
  if (!session.userId) throw new Error("Sign in required.");
  const { currentUser } = await import("@clerk/tanstack-react-start/server");
  const user = await currentUser();
  const email = user?.emailAddresses
    .find((item) => item.id === user.primaryEmailAddressId)
    ?.emailAddress.toLowerCase();
  if (!email || !adminEmails.has(email)) throw new Error("Administrator access required.");
  return session.userId;
}

export const getPendingAddons = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const { data, error } = await db()
    .from("addons")
    .select(
      "id,slug,name,description,author_name,category,version,status,created_at,downloads,viewers",
    )
    .eq("status", "pending")
    .order("created_at", { ascending: true });
  if (error) throw new Error("Could not load moderation queue.");
  return data ?? [];
});

export const moderateAddon = createServerFn({ method: "POST" })
  .validator(
    z.object({
      id: z.string().uuid(),
      status: z.enum(["approved", "rejected"]),
      reason: z.string().max(500).optional(),
    }),
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    const { error } = await db()
      .from("addons")
      .update({
        status: data.status,
        moderation_notes: data.reason ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.id);
    if (error) throw new Error("Could not update addon moderation status.");
    return { ok: true };
  });

export const submitAddonRating = createServerFn({ method: "POST" })
  .validator(
    z.object({
      addonId: z.string().uuid(),
      stars: z.number().int().min(1).max(5),
      comment: z.string().trim().max(2000).optional(),
    }),
  )
  .handler(async ({ data }) => {
    const session = await auth();
    if (!session.userId) throw new Error("Sign in to rate or comment.");
    const { data: download } = await db()
      .from("addon_downloads")
      .select("id")
      .eq("addon_id", data.addonId)
      .eq("user_id", session.userId)
      .maybeSingle();
    if (!download) throw new Error("Download the addon before sharing your experience.");
    const { error } = await db()
      .from("addon_ratings")
      .upsert(
        {
          addon_id: data.addonId,
          user_id: session.userId,
          stars: data.stars,
          comment: data.comment ?? null,
        },
        { onConflict: "addon_id,user_id" },
      );
    if (error) throw new Error("Could not save your rating.");
    return { ok: true };
  });

export const recordAddonDownload = createServerFn({ method: "POST" })
  .validator(z.object({ addonId: z.string().uuid() }))
  .handler(async ({ data }) => {
    const session = await auth();
    const client = db();
    const { data: addon, error } = await client
      .from("addons")
      .select("id,file_path,status,name")
      .eq("id", data.addonId)
      .eq("status", "approved")
      .maybeSingle();
    if (error || !addon?.file_path) throw new Error("Add-on is not available.");
    const { data: download, error: insertError } = await client
      .from("addon_downloads")
      .insert({
        addon_id: addon.id,
        user_id: session.userId ?? null,
        visitor_key: crypto.randomUUID(),
      })
      .select("id")
      .single();
    if (insertError || !download) throw new Error("Download could not be started.");
    await client.rpc("increment_addon_downloads", { addon_id_input: addon.id });
    return { pathname: addon.file_path, name: addon.name };
  });
