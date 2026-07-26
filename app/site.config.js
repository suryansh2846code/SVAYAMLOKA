// ─────────────────────────────────────────────────────────────
//  EDIT ME — this is the "save file" for your world.
//  Change names, lore, guides, realms and quests here.
//
//  ART:  drop your generated images in  /public  and point the
//        path fields at them. Every art field can stay null — the
//        world renders brutalist placeholders until you add art,
//        so you can build the whole thing before a single asset.
//
//  Layer paths for a realm parallax stage (all optional):
//    sky   → far background (moves slowest)
//    mid   → temples / mountains / cosmic structures (transparent)
//    fore  → foreground detail (moves fastest, transparent)
// ─────────────────────────────────────────────────────────────

export const world = {
  name: "SVAYAMLOKA",          // your world's name (svayam = self, loka = realm)
  subtitle: "a realm built by one hand",
  player: "YOUR NAME",         // <- put your name here
  role: "multidisciplinary maker · artist · builder",
  version: "v0.2 — the realms",

  // The lore crawl on the title screen / intro
  lore: [
    "Long before the servers hummed, there was only the VOID and a single restless mind.",
    "From that mind spilled colour, code, noise and gods — none of them finished, all of them alive.",
    "You have wandered in. Cross the realms. Meet the guides. Every one of them is a piece of the maker.",
    "This is not a website. It is a world that happens to hold a portfolio.",
  ],
};

// ─── THE GUIDES / REALMS ─────────────────────────────────────
// Each guide rules a REALM (loka). A realm has a parallax stage,
// an ambient colour, a greeting, and a set of QUESTS (your real
// projects, framed as artifacts / astras you've forged).
export const characters = [
  {
    id: "01",
    name: "THE CARTOGRAPHER",
    domain: "DESIGN",
    realm: "MANDALA-LOKA",      // realm name
    glyph: "स",                 // Devanagari accent
    art: null,                  // e.g. "/characters/cartographer.png" (transparent PNG)
    accent: "--vermillion",
    stats: { craft: 92, chaos: 40, mana: 77 },
    line: "I draw the maps nobody asked for.",
    greeting:
      "Every world needs a map before it is real. I drew this one. Walk with me — I will show you the shapes I gave to chaos.",
    // Parallax layers for this realm (all optional — null = placeholder)
    layers: { sky: null, mid: null, fore: null },
    // Your real work, framed as quests / artifacts
    quests: [
      {
        title: "PROJECT ONE",
        artifact: "ॐ",
        blurb: "A short line on what this was and why it mattered.",
        reward: "+ clarity",
        link: null,             // e.g. "https://…"
      },
      {
        title: "PROJECT TWO",
        artifact: "✦",
        blurb: "Another piece of design work, framed as a forged relic.",
        reward: "+ order",
        link: null,
      },
    ],
  },
  {
    id: "02",
    name: "THE FORGE-SMITH",
    domain: "CODE",
    realm: "AGNI-LOKA",
    glyph: "क",
    art: null,
    accent: "--teal",
    stats: { craft: 88, chaos: 55, mana: 81 },
    line: "Give me a broken thing. I will make it hum.",
    greeting:
      "This is the forge. Everything here was bent into shape by hand and fire. Bring me a broken thing and watch it hum.",
    layers: { sky: null, mid: null, fore: null },
    quests: [
      {
        title: "PROJECT ONE",
        artifact: "⚙",
        blurb: "A thing you built. What it does, what it's made of.",
        reward: "+ power",
        link: null,
      },
      {
        title: "PROJECT TWO",
        artifact: "⟠",
        blurb: "Another build. Framed as an astra you forged.",
        reward: "+ speed",
        link: null,
      },
    ],
  },
  {
    id: "03",
    name: "THE TRICKSTER",
    domain: "PLAY",
    realm: "MAYA-LOKA",
    glyph: "ल",
    art: null,
    accent: "--marigold",
    stats: { craft: 70, chaos: 99, mana: 64 },
    line: "Rules are just suggestions with a good UI.",
    greeting:
      "Welcome to the realm of illusion. Nothing here is quite what it seems, and that is the whole point. Come play.",
    layers: { sky: null, mid: null, fore: null },
    quests: [
      {
        title: "PROJECT ONE",
        artifact: "◆",
        blurb: "A game, toy or experiment. What made it fun.",
        reward: "+ delight",
        link: null,
      },
      {
        title: "PROJECT TWO",
        artifact: "☼",
        blurb: "Another playful thing you made.",
        reward: "+ chaos",
        link: null,
      },
    ],
  },
  {
    id: "04",
    name: "THE ORACLE",
    domain: "WORDS",
    realm: "VAAK-LOKA",
    glyph: "व",
    art: null,
    accent: "--indigo",
    stats: { craft: 85, chaos: 33, mana: 90 },
    line: "Every project is a story wearing a deadline.",
    greeting:
      "I keep the words. Every project here is a story wearing a deadline. Sit — let me tell you how they end.",
    layers: { sky: null, mid: null, fore: null },
    quests: [
      {
        title: "PROJECT ONE",
        artifact: "❋",
        blurb: "Writing, narrative or content work. The story of it.",
        reward: "+ meaning",
        link: null,
      },
      {
        title: "PROJECT TWO",
        artifact: "✧",
        blurb: "Another piece of the written world.",
        reward: "+ wisdom",
        link: null,
      },
    ],
  },
];

// The closing NPC at the edge of the world (contact / offering)
export const threshold = {
  name: "THE GATEKEEPER",
  glyph: "ग",
  text:
    "You crossed every realm. The world is still being built — more regions, more quests will grow here. Leave an offering, or come back and watch it change.",
  // e.g. { label: "SEND A RAVEN", href: "mailto:you@example.com" }
  cta: { label: "LEAVE AN OFFERING", href: "mailto:you@example.com" },
};

// Scrolling ticker phrases (maximalist noise)
export const ticker = [
  "◈ NOW ENTERING SVAYAMLOKA",
  "PRESS START TO BEGIN",
  "★ MADE BY ONE HAND ★",
  "अन्वेषण · EXPLORE · अन्वेषण",
  "NO TEMPLATES WERE HARMED",
  "◈ SELECT YOUR REALM ◈",
];
