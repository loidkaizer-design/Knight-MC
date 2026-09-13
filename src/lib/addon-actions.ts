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

    const { error } = await db().from("addons").insert({
      slug,
      name: data.title,
      description: data.description,
      author_name: data.creator,
      author_clerk_id: session.userId,
      submitted_by: session.userId,
      category: data.category,
      version: data.addonVersion,
      file_path: fileBlob.pathname,
      image_path: thumbnailPath,
      thumbnail_data: thumbnailPath,
      addon_file_name: data.addonFile.name,
      addon_type: data.type,
      installation: data.installation,
      hashtags: data.hashtags,
      tags: data.tags,
      credits: data.credits,
      changelog: data.changelog,
      compatibility: data.compatibility,
      readme_content: data.readmeContent,
      status: "pending",
      downloads: 0,
      viewers: 0,
      stats_initialized: true,
    });
    if (error) throw new Error("Could not save your submission.");
    return { slug };
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
        clerk_user_id: session.userId ?? null,
        download_token: crypto.randomUUID(),
      })
      .select("id")
      .single();
    if (insertError || !download) throw new Error("Download could not be started.");
    await client.rpc("increment_addon_downloads", { addon_id_input: addon.id });
    return { pathname: addon.file_path, name: addon.name };
  });
