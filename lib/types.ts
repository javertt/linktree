export type EmbedType = "none" | "spotify" | "youtube" | "soundcloud" | "apple_music";
export type ThemePreset = "neo-tokyo" | "matrix" | "monolith" | "overlook" | "aperture" | "custom";
export type Theme = { preset: ThemePreset; background: string; surface: string; foreground: string; accent: string; radius: number; font: "space" | "mono" };
export type Social = { label: string; url: string };
export type Profile = { id: string; username: string; display_name: string; bio: string | null; avatar_url: string | null; favicon_url: string | null; verified: boolean; theme: Theme; socials: Social[]; created_at: string };
export type Link = { id: string; user_id: string; title: string; url: string; icon: string | null; is_active: boolean; is_featured: boolean; embed_type: EmbedType; position: number; starts_at: string | null; ends_at: string | null; created_at: string };
export type AnalyticsEvent = { id: string; link_id: string | null; profile_id: string; event_type: "page_view" | "link_click"; country: string | null; device: string | null; created_at: string };
