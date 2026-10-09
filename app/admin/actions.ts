"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { safeTheme } from "@/lib/themes";
import { safeSocials, safeUrl } from "@/lib/validation";
import type { EmbedType } from "@/lib/types";

type Result = { error?: string; ok?: true };
const text = (form: FormData, key: string) => String(form.get(key) ?? "").trim();
const optionalDate = (value: string) => value ? (Number.isNaN(Date.parse(value)) ? null : new Date(value).toISOString()) : null;

async function owner() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Sessão expirada. Entre novamente.");
  return { supabase, user };
}

export async function signIn(form: FormData): Promise<Result> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return { error: "Configure o Supabase no arquivo .env.local antes de entrar." };
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email: text(form, "email"), password: text(form, "password") });
  if (error) return { error: "E-mail ou senha inválidos." };
  redirect("/admin");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function saveProfile(form: FormData): Promise<Result> {
  const { supabase, user } = await owner();
  const username = text(form, "username").toLowerCase();
  const displayName = text(form, "display_name");
  if (!/^[a-z0-9][a-z0-9_-]{2,29}$/.test(username) || ["admin", "api", "go", "login"].includes(username)) return { error: "Usuário deve ter 3–30 caracteres: letras, números, _ ou -." };
  if (!displayName || displayName.length > 80) return { error: "Nome deve ter entre 1 e 80 caracteres." };
  const bio = text(form, "bio").slice(0, 280);
  const avatar = text(form, "avatar_url");
  const favicon = text(form, "favicon_url");
  let socials: unknown = [];
  let theme: unknown = {};
  try { socials = JSON.parse(text(form, "socials") || "[]"); theme = JSON.parse(text(form, "theme") || "{}"); }
  catch { return { error: "Dados de tema ou redes sociais inválidos." }; }
  const { data: previous } = await supabase.from("profiles").select("username").eq("id", user.id).maybeSingle();
  const { error } = await supabase.from("profiles").upsert({ id: user.id, username, display_name: displayName, bio, avatar_url: avatar ? safeUrl(avatar) : null, favicon_url: favicon ? safeUrl(favicon) : null, verified: form.get("verified") === "on", theme: safeTheme(theme), socials: safeSocials(socials) });
  if (error) return { error: error.code === "23505" ? "Este usuário já está em uso." : error.message };
  revalidatePath("/admin");
  revalidatePath(`/${username}`);
  if (previous?.username && previous.username !== username) revalidatePath(`/${previous.username}`);
  return { ok: true };
}

export async function saveLink(form: FormData): Promise<Result> {
  const { supabase, user } = await owner();
  const { data: profile } = await supabase.from("profiles").select("username").eq("id", user.id).maybeSingle();
  if (!profile) return { error: "Salve o perfil antes de criar links." };
  const title = text(form, "title");
  const url = safeUrl(text(form, "url"));
  if (!title || title.length > 120 || !url) return { error: "Informe um título e uma URL http(s) válida." };
  const embed = text(form, "embed_type");
  const embedType: EmbedType = ["spotify", "youtube", "soundcloud", "apple_music"].includes(embed) ? embed as EmbedType : "none";
  const starts = text(form, "starts_at");
  const ends = text(form, "ends_at");
  const startsAt = optionalDate(starts), endsAt = optionalDate(ends);
  if ((starts && !startsAt) || (ends && !endsAt) || (startsAt && endsAt && startsAt >= endsAt)) return { error: "Verifique as datas de agendamento." };
  const id = text(form, "id");
  const payload = { title, url, icon: text(form, "icon").slice(0, 40) || null, is_active: form.get("is_active") === "on", is_featured: form.get("is_featured") === "on", embed_type: embedType, starts_at: startsAt, ends_at: endsAt };
  if (id) {
    const { error } = await supabase.from("links").update(payload).eq("id", id).eq("user_id", user.id);
    if (error) return { error: error.message };
  } else {
    const { data: last } = await supabase.from("links").select("position").eq("user_id", user.id).order("position", { ascending: false }).limit(1).maybeSingle();
    const { error } = await supabase.from("links").insert({ ...payload, user_id: user.id, position: (last?.position ?? -1) + 1 });
    if (error) return { error: error.message };
  }
  revalidatePath("/admin"); revalidatePath(`/${profile.username}`);
  return { ok: true };
}

export async function deleteLink(id: string): Promise<Result> {
  const { supabase, user } = await owner();
  const { data: profile } = await supabase.from("profiles").select("username").eq("id", user.id).maybeSingle();
  const { error } = await supabase.from("links").delete().eq("id", id).eq("user_id", user.id);
  if (error) return { error: error.message };
  revalidatePath("/admin"); if (profile) revalidatePath(`/${profile.username}`);
  return { ok: true };
}

export async function reorderLinks(ids: string[]): Promise<Result> {
  const { supabase, user } = await owner();
  const { error } = await supabase.rpc("set_link_order", { p_ids: ids });
  if (error) return { error: error.message };
  const { data: profile } = await supabase.from("profiles").select("username").eq("id", user.id).maybeSingle();
  revalidatePath("/admin"); if (profile) revalidatePath(`/${profile.username}`);
  return { ok: true };
}
