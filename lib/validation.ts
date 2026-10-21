import type { EmbedType, Social } from "@/lib/types";

const reservedUsernames = new Set(["admin", "api", "go", "login", "projetos", "voluntariado"]);

export function isValidUsername(username: string): boolean {
  return /^[a-z0-9][a-z0-9_-]{2,29}$/.test(username) && !reservedUsernames.has(username);
}

export function safeUrl(value: string): string | null {
  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
  } catch { return null; }
}

export function safeSocials(value: unknown): Social[] {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 12).flatMap((item) => {
    if (!item || typeof item.label !== "string" || typeof item.url !== "string") return [];
    const url = safeUrl(item.url);
    return url ? [{ label: item.label.slice(0, 30), url }] : [];
  });
}

export function embedUrl(type: EmbedType, rawUrl: string): string | null {
  const url = safeUrl(rawUrl);
  if (!url) return null;
  const parsed = new URL(url);
  const host = parsed.hostname.replace(/^www\./, "");
  if (type === "youtube" && ["youtube.com", "m.youtube.com", "youtu.be"].includes(host)) {
    const id = host === "youtu.be" ? parsed.pathname.slice(1) : parsed.searchParams.get("v");
    return id && /^[\w-]{11}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  }
  if (type === "spotify" && host === "open.spotify.com") {
    const match = parsed.pathname.match(/^\/(track|album|playlist|episode|show)\/([\w]+)$/);
    return match ? `https://open.spotify.com/embed/${match[1]}/${match[2]}` : null;
  }
  if (type === "soundcloud" && host === "soundcloud.com") return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}`;
  if (type === "apple_music" && ["music.apple.com", "embed.music.apple.com"].includes(host)) return `https://embed.music.apple.com${parsed.pathname}${parsed.search}`;
  return null;
}
