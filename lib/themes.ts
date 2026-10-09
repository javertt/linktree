import type { Theme, ThemePreset } from "@/lib/types";

export const presets: Record<Exclude<ThemePreset, "custom">, Theme> = {
  "neo-tokyo": { preset: "neo-tokyo", background: "#0c101b", surface: "#182033", foreground: "#f4f3ef", accent: "#ff6b81", radius: 18, font: "space" },
  matrix: { preset: "matrix", background: "#060c08", surface: "#102117", foreground: "#d9ffdc", accent: "#64f58d", radius: 5, font: "mono" },
  monolith: { preset: "monolith", background: "#0a0a0c", surface: "#202026", foreground: "#f4f4f5", accent: "#d3d6e4", radius: 4, font: "space" },
  overlook: { preset: "overlook", background: "#180e10", surface: "#392025", foreground: "#fff3e8", accent: "#efb28f", radius: 10, font: "space" },
  aperture: { preset: "aperture", background: "#131b1e", surface: "#27363b", foreground: "#f3f8f7", accent: "#f5aa50", radius: 24, font: "space" },
};

export function safeTheme(value: unknown): Theme {
  const fallback = presets["neo-tokyo"];
  if (!value || typeof value !== "object") return fallback;
  const input = value as Partial<Theme>;
  const base = input.preset && input.preset !== "custom" && input.preset in presets ? presets[input.preset as keyof typeof presets] : fallback;
  const hex = (candidate: unknown, defaultValue: string) => typeof candidate === "string" && /^#[0-9a-fA-F]{6}$/.test(candidate) ? candidate : defaultValue;
  return { preset: input.preset === "custom" ? "custom" : base.preset, background: hex(input.background, base.background), surface: hex(input.surface, base.surface), foreground: hex(input.foreground, base.foreground), accent: hex(input.accent, base.accent), radius: typeof input.radius === "number" ? Math.max(0, Math.min(32, input.radius)) : base.radius, font: input.font === "mono" ? "mono" : "space" };
}
