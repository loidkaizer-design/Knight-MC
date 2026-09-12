export type AddonStatus = "published" | "pending" | "rejected";

export type Category = {
  slug: string;
  name: string;
  emoji: string;
  blurb: string;
};

export const categories: Category[] = [
  { slug: "weapons", name: "Weapons", emoji: "⚔️", blurb: "Swords, bows, guns and combat gear." },
  { slug: "building", name: "Building", emoji: "🧱", blurb: "Blocks, furniture and build helpers." },
  { slug: "mobs", name: "Mobs", emoji: "🐉", blurb: "New creatures, bosses and pets." },
  { slug: "world", name: "World", emoji: "🌎", blurb: "Biomes, dimensions and generation." },
  { slug: "textures", name: "Textures", emoji: "🎨", blurb: "Resource packs and shaders." },
  { slug: "magic", name: "Magic", emoji: "🧙", blurb: "Spells, wands and enchantments." },
  { slug: "vehicles", name: "Vehicles", emoji: "🚗", blurb: "Cars, planes, boats and trains." },
  { slug: "survival", name: "Survival", emoji: "🌱", blurb: "Harder survival and progression." },
  { slug: "gameplay", name: "Gameplay", emoji: "🎮", blurb: "Mechanics, minigames and quests." },
  { slug: "utility", name: "Utility", emoji: "🔧", blurb: "Quality of life and tools." },
  { slug: "other", name: "Other", emoji: "✨", blurb: "Everything else worth trying." },
];

export const minecraftVersions = ["1.21.x", "1.20.x", "1.19.x", "1.18.x"];
export const addonTypes = ["Behaviour Pack", "Resource Pack", "Add-on Bundle", "World"];

export type Addon = {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  creator: string;
  creatorSlug: string;
  category: string;
  type: string;
  versions: string[];
  addonVersion: string;
  fileSize: string;
  updated: string;
  created: string;
  downloads: number;
  rating: number;
  featured: boolean;
  status: AddonStatus;
  requirements: string[];
  installation: string[];
  screenshots: string[];
};

const shot = (seed: string) => `https://picsum.photos/seed/${seed}/960/540`;

export const addons: Addon[] = [
  {
    id: "a1",
    slug: "dragon-expansion",
    title: "Dragon Expansion",
    tagline: "Adds new dragons, items, weapons and structures to Minecraft Bedrock.",
    description:
      "Dragon Expansion brings six tameable dragon species to Bedrock Edition, each with unique abilities, breath attacks and nests. Hunt down dragon lairs, collect scales and forge late-game weapons and armour that rival the Ender Dragon itself.",
    creator: "EmberForge",
    creatorSlug: "emberforge",
    category: "mobs",
    type: "Add-on Bundle",
    versions: ["1.21.x", "1.20.x"],
    addonVersion: "3.2.1",
    fileSize: "48.2 MB",
    updated: "2026-08-28",
    created: "2025-11-02",
    downloads: 184320,
    rating: 4.8,
    featured: true,
    status: "published",
    requirements: ["Minecraft Bedrock 1.20+", "Experimental features enabled"],
    installation: [
      "Download the .mcaddon file.",
      "Open it with Minecraft — packs import automatically.",
      "Create a new world and enable both packs.",
      "Turn on Holiday Creator Features in world settings.",
    ],
    screenshots: [shot("dragon1"), shot("dragon2"), shot("dragon3")],
  },
  {
    id: "a2",
    slug: "voxel-vehicles",
    title: "Voxel Vehicles",
    tagline: "Drivable cars, trucks and planes with working lights and fuel.",
    description:
      "Twenty-four fully drivable vehicles with fuel consumption, headlights, horns and passenger seats. Includes a workshop block for painting and upgrading your ride.",
    creator: "BlockMotors",
    creatorSlug: "blockmotors",
    category: "vehicles",
    type: "Behaviour Pack",
    versions: ["1.21.x"],
    addonVersion: "1.9.0",
    fileSize: "22.6 MB",
    updated: "2026-09-02",
    created: "2026-02-14",
    downloads: 92140,
    rating: 4.6,
    featured: true,
    status: "published",
    requirements: ["Minecraft Bedrock 1.21+"],
    installation: ["Download the pack.", "Import into Minecraft.", "Enable in world settings."],
    screenshots: [shot("vehicle1"), shot("vehicle2")],
  },
  {
    id: "a3",
    slug: "arcane-arsenal",
    title: "Arcane Arsenal",
    tagline: "Spellbooks, wands and 40+ craftable spells.",
    description:
      "A full magic progression system: gather arcane dust, bind spellbooks and unlock forty spells across fire, frost, nature and void schools.",
    creator: "MoonRuneStudio",
    creatorSlug: "moonrunestudio",
    category: "magic",
    type: "Add-on Bundle",
    versions: ["1.21.x", "1.20.x", "1.19.x"],
    addonVersion: "2.4.3",
    fileSize: "31.0 MB",
    updated: "2026-07-19",
    created: "2025-06-08",
    downloads: 143870,
    rating: 4.9,
    featured: true,
    status: "published",
    requirements: ["Experimental features enabled"],
    installation: ["Download.", "Import.", "Enable both packs in a new world."],
    screenshots: [shot("magic1"), shot("magic2"), shot("magic3")],
  },
  {
    id: "a4",
    slug: "builders-toolbox",
    title: "Builder's Toolbox",
    tagline: "Furniture, decorations and 180 new building blocks.",
    description:
      "Everything a builder needs: chairs, tables, lamps, roofing, glass variants and a copy-paste wand for large structures.",
    creator: "PixelMason",
    creatorSlug: "pixelmason",
    category: "building",
    type: "Add-on Bundle",
    versions: ["1.21.x", "1.20.x"],
    addonVersion: "5.0.2",
    fileSize: "64.8 MB",
    updated: "2026-08-11",
    created: "2024-12-01",
    downloads: 268900,
    rating: 4.7,
    featured: true,
    status: "published",
    requirements: ["Minecraft Bedrock 1.20+"],
    installation: ["Download.", "Import.", "Enable in world settings."],
    screenshots: [shot("build1"), shot("build2")],
  },
  {
    id: "a5",
    slug: "hardcore-survival-plus",
    title: "Hardcore Survival+",
    tagline: "Thirst, temperature and stamina for a brutal survival run.",
    description:
      "Adds thirst, body temperature, stamina and injuries. Includes canteens, bandages and warm clothing so survival actually fights back.",
    creator: "GrimTundra",
    creatorSlug: "grimtundra",
    category: "survival",
    type: "Behaviour Pack",
    versions: ["1.21.x"],
    addonVersion: "1.4.0",
    fileSize: "8.9 MB",
    updated: "2026-09-06",
    created: "2026-05-21",
    downloads: 41230,
    rating: 4.4,
    featured: false,
    status: "published",
    requirements: ["Minecraft Bedrock 1.21+"],
    installation: ["Download.", "Import.", "Enable in world settings."],
    screenshots: [shot("survive1")],
  },
  {
    id: "a6",
    slug: "crisp-pixels-textures",
    title: "Crisp Pixels",
    tagline: "A clean 32x texture pack that keeps the vanilla feel.",
    description:
      "Hand-drawn 32x textures with softer noise, readable ores and consistent UI icons. Optional connected glass variant included.",
    creator: "AuroraPix",
    creatorSlug: "aurorapix",
    category: "textures",
    type: "Resource Pack",
    versions: ["1.21.x", "1.20.x", "1.19.x", "1.18.x"],
    addonVersion: "4.1.0",
    fileSize: "18.3 MB",
    updated: "2026-06-30",
    created: "2024-08-17",
    downloads: 312400,
    rating: 4.8,
    featured: false,
    status: "published",
    requirements: ["Any Bedrock version 1.18+"],
    installation: ["Download.", "Import.", "Activate under Global Resources."],
    screenshots: [shot("texture1"), shot("texture2")],
  },
  {
    id: "a7",
    slug: "skylands-dimension",
    title: "Skylands Dimension",
    tagline: "A floating-island dimension with its own mobs and loot.",
    description:
      "Travel through a cloud portal into Skylands: floating biomes, wind temples, gliders and three new bosses.",
    creator: "EmberForge",
    creatorSlug: "emberforge",
    category: "world",
    type: "Add-on Bundle",
    versions: ["1.21.x"],
    addonVersion: "1.2.0",
    fileSize: "55.4 MB",
    updated: "2026-08-20",
    created: "2026-03-30",
    downloads: 76510,
    rating: 4.5,
    featured: false,
    status: "published",
    requirements: ["Experimental features enabled"],
    installation: ["Download.", "Import.", "Enable in world settings."],
    screenshots: [shot("sky1"), shot("sky2")],
  },
  {
    id: "a8",
    slug: "blade-legacy",
    title: "Blade Legacy",
    tagline: "60 unique weapons with combos and special attacks.",
    description:
      "Katanas, warhammers, scythes and spears — each with a charged special attack and upgrade path at the forge table.",
    creator: "MoonRuneStudio",
    creatorSlug: "moonrunestudio",
    category: "weapons",
    type: "Behaviour Pack",
    versions: ["1.21.x", "1.20.x"],
    addonVersion: "2.0.0",
    fileSize: "27.1 MB",
    updated: "2026-09-08",
    created: "2025-09-12",
    downloads: 118760,
    rating: 4.6,
    featured: false,
    status: "published",
    requirements: ["Minecraft Bedrock 1.20+"],
    installation: ["Download.", "Import.", "Enable in world settings."],
    screenshots: [shot("blade1"), shot("blade2")],
  },
  {
    id: "a9",
    slug: "quest-board",
    title: "Quest Board",
    tagline: "Village quest boards with rewards and reputation.",
    description:
      "Adds quest boards to villages with 120 procedurally assembled quests, reputation levels and rare reward crates.",
    creator: "PixelMason",
    creatorSlug: "pixelmason",
    category: "gameplay",
    type: "Add-on Bundle",
    versions: ["1.21.x"],
    addonVersion: "1.0.6",
    fileSize: "12.4 MB",
    updated: "2026-09-09",
    created: "2026-07-02",
    downloads: 20340,
    rating: 4.3,
    featured: false,
    status: "published",
    requirements: ["Minecraft Bedrock 1.21+"],
    installation: ["Download.", "Import.", "Enable in world settings."],
    screenshots: [shot("quest1")],
  },
  {
    id: "a10",
    slug: "inventory-tweaks",
    title: "Inventory Tweaks",
    tagline: "Sorting, trash slot and quick-craft shortcuts.",
    description:
      "Small utility pack: one-tap inventory sorting, a trash slot, and recipe shortcuts for common blocks.",
    creator: "AuroraPix",
    creatorSlug: "aurorapix",
    category: "utility",
    type: "Behaviour Pack",
    versions: ["1.21.x", "1.20.x"],
    addonVersion: "1.3.2",
    fileSize: "2.1 MB",
    updated: "2026-05-14",
    created: "2025-04-04",
    downloads: 58900,
    rating: 4.2,
    featured: false,
    status: "published",
    requirements: ["Minecraft Bedrock 1.20+"],
    installation: ["Download.", "Import.", "Enable in world settings."],
    screenshots: [shot("util1")],
  },
];

export type Submission = {
  id: string;
  title: string;
  submittedBy: string;
  version: string;
  category: string;
  submittedAt: string;
  status: "pending" | "changes-requested" | "approved" | "rejected";
  flagged?: boolean;
};

export const submissions: Submission[] = [
  {
    id: "s1",
    title: "Dragon Expansion 4.0 Beta",
    submittedBy: "EmberForge",
    version: "1.21.x",
    category: "mobs",
    submittedAt: "2026-09-10",
    status: "pending",
  },
  {
    id: "s2",
    title: "Realistic Trains",
    submittedBy: "RailRunner",
    version: "1.21.x",
    category: "vehicles",
    submittedAt: "2026-09-09",
    status: "pending",
  },
  {
    id: "s3",
    title: "Neon City Textures",
    submittedBy: "GlowByte",
    version: "1.20.x",
    category: "textures",
    submittedAt: "2026-09-08",
    status: "changes-requested",
  },
  {
    id: "s4",
    title: "Free Diamonds Hack",
    submittedBy: "unknown_user",
    version: "1.19.x",
    category: "other",
    submittedAt: "2026-09-07",
    status: "pending",
    flagged: true,
  },
];

export type AddonRequest = {
  id: string;
  slug: string;
  title: string;
  description: string;
  version: string;
  category: string;
  votes: number;
  status: "requested" | "under-consideration" | "in-development" | "completed" | "rejected";
  createdBy: string;
  createdAt: string;
  officialResponse?: string;
};

export const requests: AddonRequest[] = [
  {
    id: "r1",
    slug: "realistic-trains",
    title: "Realistic trains with working rail signals",
    description:
      "I want a Bedrock add-on that adds realistic trains — multiple carriages, stations and signals you can actually operate.",
    version: "1.21.x",
    category: "vehicles",
    votes: 412,
    status: "in-development",
    createdBy: "RailRunner",
    createdAt: "2026-06-18",
    officialResponse: "A creator picked this up — beta submission is in review now.",
  },
  {
    id: "r2",
    slug: "medieval-siege",
    title: "Medieval siege weapons",
    description: "Catapults, trebuchets and battering rams that damage blocks properly.",
    version: "1.21.x",
    category: "weapons",
    votes: 287,
    status: "under-consideration",
    createdBy: "SiegeLord",
    createdAt: "2026-07-25",
  },
  {
    id: "r3",
    slug: "deep-ocean-overhaul",
    title: "Deep ocean overhaul with submarines",
    description: "New ocean biomes, deep-sea mobs and a craftable submarine.",
    version: "1.21.x",
    category: "world",
    votes: 198,
    status: "requested",
    createdBy: "AbyssFan",
    createdAt: "2026-08-30",
  },
  {
    id: "r4",
    slug: "farming-expansion",
    title: "Farming expansion with seasons",
    description: "Crop seasons, greenhouses, sprinklers and a market stall.",
    version: "1.20.x",
    category: "survival",
    votes: 156,
    status: "completed",
    createdBy: "GreenThumb",
    createdAt: "2026-02-11",
    officialResponse: "Shipped as part of Hardcore Survival+ 1.4.",
  },
  {
    id: "r5",
    slug: "pixel-ui-pack",
    title: "Cleaner pixel UI pack",
    description: "A UI resource pack with larger readable fonts for tablets.",
    version: "1.21.x",
    category: "textures",
    votes: 64,
    status: "requested",
    createdBy: "TabletPlayer",
    createdAt: "2026-09-05",
  },
];

export type Creator = {
  slug: string;
  name: string;
  bio: string;
  joined: string;
};

export const creators: Creator[] = [
  {
    slug: "emberforge",
    name: "EmberForge",
    bio: "Mob and dimension specialist. Building the biggest dragon pack on Bedrock.",
    joined: "2024-09-01",
  },
  {
    slug: "blockmotors",
    name: "BlockMotors",
    bio: "Everything that drives, flies or floats.",
    joined: "2025-11-20",
  },
  {
    slug: "moonrunestudio",
    name: "MoonRuneStudio",
    bio: "Magic systems and weapon packs with deep progression.",
    joined: "2024-03-14",
  },
  {
    slug: "pixelmason",
    name: "PixelMason",
    bio: "Builder-focused packs, furniture and quests.",
    joined: "2023-12-05",
  },
  {
    slug: "grimtundra",
    name: "GrimTundra",
    bio: "Hard survival mechanics for people who like suffering.",
    joined: "2026-01-09",
  },
  {
    slug: "aurorapix",
    name: "AuroraPix",
    bio: "Texture artist and utility tinkerer.",
    joined: "2024-06-22",
  },
];

export type Report = {
  id: string;
  addon: string;
  reportedBy: string;
  reason: string;
  status: "open" | "reviewing" | "resolved";
  createdAt: string;
};

export const reports: Report[] = [
  {
    id: "rp1",
    addon: "Free Diamonds Hack",
    reportedBy: "player_812",
    reason: "Suspicious file / possible malware",
    status: "open",
    createdAt: "2026-09-10",
  },
  {
    id: "rp2",
    addon: "Neon City Textures",
    reportedBy: "AuroraPix",
    reason: "Stolen textures from my pack",
    status: "reviewing",
    createdAt: "2026-09-08",
  },
  {
    id: "rp3",
    addon: "Blade Legacy",
    reportedBy: "player_44",
    reason: "Broken download link",
    status: "resolved",
    createdAt: "2026-09-01",
  },
];

export type User = {
  id: string;
  username: string;
  email: string;
  role: "owner" | "admin" | "moderator" | "user";
  joined: string;
};

export const users: User[] = [
  { id: "u1", username: "Nathan", email: "nathan@knightmc.gg", role: "owner", joined: "2024-01-04" },
  { id: "u2", username: "EmberForge", email: "ember@forge.dev", role: "admin", joined: "2024-09-01" },
  { id: "u3", username: "AuroraPix", email: "aurora@pix.io", role: "moderator", joined: "2024-06-22" },
  { id: "u4", username: "RailRunner", email: "rail@runner.net", role: "user", joined: "2026-06-18" },
  { id: "u5", username: "unknown_user", email: "temp@mail.tld", role: "user", joined: "2026-09-07" },
];

export const categoryBySlug = (slug: string) => categories.find((c) => c.slug === slug);
export const addonBySlug = (slug: string) => addons.find((a) => a.slug === slug);
export const creatorBySlug = (slug: string) => creators.find((c) => c.slug === slug);
export const requestBySlug = (slug: string) => requests.find((r) => r.slug === slug);
export const addonsByCategory = (slug: string) => addons.filter((a) => a.category === slug);
export const addonsByCreator = (slug: string) => addons.filter((a) => a.creatorSlug === slug);

export const formatCount = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : String(n);

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
