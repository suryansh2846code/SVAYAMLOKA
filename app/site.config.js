// ─────────────────────────────────────────────────────────────
//  EDIT ME — this is the "save file" for your world.
//  Change names, lore, and characters here. Drop your own art in
//  /public/characters/  and point `art` at it (e.g. "/characters/naga.png").
// ─────────────────────────────────────────────────────────────

export const world = {
  name: "SVAYAMLOKA",          // your world's name (svayam = self, loka = realm)
  subtitle: "a realm built by one hand",
  player: "YOUR NAME",         // <- put your name here
  role: "multidisciplinary maker · artist · builder",
  version: "v0.1 — prologue",

  // The lore crawl on the title screen / intro
  lore: [
    "Long before the servers hummed, there was only the VOID and a single restless mind.",
    "From that mind spilled colour, code, noise and gods — none of them finished, all of them alive.",
    "You have wandered in. Pick a guide. Every one of them is a piece of the maker.",
    "This is not a website. It is a world that happens to hold a portfolio.",
  ],
};

// Your cast. These are the "guides" / NPCs = the facets of your work.
// `art` can stay null (shows a brutalist placeholder frame) until you add
// your own image to /public/characters/.
export const characters = [
  {
    id: "01",
    name: "THE CARTOGRAPHER",
    domain: "DESIGN",
    glyph: "स",          // Devanagari accent
    art: null,           // e.g. "/characters/cartographer.png"
    stats: { craft: 92, chaos: 40, mana: 77 },
    line: "I draw the maps nobody asked for.",
    accent: "--vermillion",
  },
  {
    id: "02",
    name: "THE FORGE-SMITH",
    domain: "CODE",
    glyph: "क",
    art: null,
    stats: { craft: 88, chaos: 55, mana: 81 },
    line: "Give me a broken thing. I will make it hum.",
    accent: "--teal",
  },
  {
    id: "03",
    name: "THE TRICKSTER",
    domain: "PLAY",
    glyph: "ल",
    art: null,
    stats: { craft: 70, chaos: 99, mana: 64 },
    line: "Rules are just suggestions with a good UI.",
    accent: "--marigold",
  },
  {
    id: "04",
    name: "THE ORACLE",
    domain: "WORDS",
    glyph: "व",
    art: null,
    stats: { craft: 85, chaos: 33, mana: 90 },
    line: "Every project is a story wearing a deadline.",
    accent: "--indigo",
  },
];

// Scrolling ticker phrases (maximalist noise)
export const ticker = [
  "◈ NOW ENTERING SVAYAMLOKA",
  "PRESS START TO BEGIN",
  "★ MADE BY ONE HAND ★",
  "अन्वेषण · EXPLORE · अन्वेषण",
  "NO TEMPLATES WERE HARMED",
  "◈ SELECT YOUR GUIDE ◈",
];
