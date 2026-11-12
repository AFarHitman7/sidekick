export type FinishId = "studio" | "night" | "field" | "clay";

export type Finish = {
  id: FinishId;
  name: string;
  shell: string;
  frame: string;
  accent: string;
  keys: string;
  character: string;
  material: string;
  image: string;
  stageImage: string;
};

export const FINISHES: Finish[] = [
  {
    id: "studio",
    name: "Studio",
    shell: "#d6d0c1",
    frame: "#1d1e1b",
    accent: "#ff3d02",
    keys: "#eee9dc",
    character: "The reference object. Warm, tool-like, orange only at the point of action.",
    material: "Bone / charcoal / orange",
    image: "/renders/studio.webp",
    stageImage: "/renders/stage.webp",
  },
  {
    id: "night",
    name: "Night",
    shell: "#4a4a44",
    frame: "#121311",
    accent: "#ff5a1f",
    keys: "#e7e2d4",
    character: "Stealth. Orange only where it matters.",
    material: "Graphite / black / orange",
    image: "/renders/night.webp",
    stageImage: "/renders/stage_night.webp",
  },
  {
    id: "field",
    name: "Field",
    shell: "#c6c9c4",
    frame: "#2a2b29",
    accent: "#3fb98f",
    keys: "#f0ece1",
    character: "Instrument-panel clean. The accent reads as a status colour until you send.",
    material: "Silver / charcoal / mint",
    image: "/renders/field.webp",
    stageImage: "/renders/stage_field.webp",
  },
  {
    id: "clay",
    name: "Clay",
    shell: "#c8b69e",
    frame: "#2b2420",
    accent: "#e0472b",
    keys: "#efe7d8",
    character: "A 1970s calculator that happens to be a companion. Soft sand shell, tomato key.",
    material: "Sand / umber / tomato",
    image: "/renders/clay.webp",
    stageImage: "/renders/stage_clay.webp",
  },
];

export type Palette = {
  shell: string;
  frame: string;
  keys: string;
  accent: string;
  accentEmissive: string;
  chip: string;
  chipEmissive: string;
  power: string;
  seam: string;
  grip: string;
  backInk: string;
  backFaint: string;
};

export const PALETTES: Record<FinishId, Palette> = {
  studio: {
    shell: "#d6d0c1",
    frame: "#1d1e1b",
    keys: "#eee9dc",
    accent: "#ff3d02",
    accentEmissive: "#ff5a1f",
    chip: "#e23a05",
    chipEmissive: "#ff4a0a",
    power: "#c02f18",
    seam: "#262623",
    grip: "#7a2408",
    backInk: "#5a574e",
    backFaint: "#7c786c",
  },
  night: {
    shell: "#4a4a44",
    frame: "#121311",
    keys: "#e7e2d4",
    accent: "#ff5a1f",
    accentEmissive: "#ff7a45",
    chip: "#e8491a",
    chipEmissive: "#ff5a24",
    power: "#c02f18",
    seam: "#0e0f0d",
    grip: "#7a2c10",
    backInk: "#dcd6c6",
    backFaint: "#a29c8e",
  },
  field: {
    shell: "#c6c9c4",
    frame: "#2a2b29",
    keys: "#f0ece1",
    accent: "#3fb98f",
    accentEmissive: "#59d6aa",
    chip: "#2e9e7c",
    chipEmissive: "#4bc99e",
    power: "#c02f18",
    seam: "#262623",
    grip: "#1e6b55",
    backInk: "#4c4e49",
    backFaint: "#7b7e77",
  },
  clay: {
    shell: "#c8b69e",
    frame: "#2b2420",
    keys: "#efe7d8",
    accent: "#e0472b",
    accentEmissive: "#ff6a4d",
    chip: "#d63e20",
    chipEmissive: "#f25a3a",
    power: "#c02f18",
    seam: "#3a2f27",
    grip: "#6e2314",
    backInk: "#5c4a3a",
    backFaint: "#8b7a68",
  },
};
