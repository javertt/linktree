import { createClient } from "@/lib/supabase/server";
import { AdminDashboard } from "@/components/admin/dashboard";
import type { Profile, Link } from "@/lib/types";

export const dynamic = "force-dynamic";

function isPublicSupabaseKey(key: string) {
  if (key.startsWith("sb_publishable_")) return true;
  try {
    const payload = key.split(".")[1];
    return Boolean(payload && JSON.parse(Buffer.from(payload, "base64url").toString("utf8")).role === "anon");
  } catch { return false; }
}

export default async function AdminPage() {
  const runtimeEnv = process.env;
  const supabaseUrl = runtimeEnv.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = runtimeEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) throw new Error("Supabase não configurado no Worker.");
  if (!isPublicSupabaseKey(supabaseAnonKey)) throw new Error("Use a chave publishable ou anon do Supabase, nunca a chave secret ou service_role.");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const [{ data: profile }, { data: links }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase.from("links").select("*").eq("user_id", user.id).order("position", { ascending: true }).order("created_at", { ascending: true }),
  ]);
  const { data: summary } = profile ? await supabase.rpc("analytics_summary", { p_profile_id: user.id }) : { data: null };
  return <AdminDashboard userId={user.id} email={user.email || ""} profile={profile as Profile | null} links={(links || []) as Link[]} summary={summary} supabaseUrl={supabaseUrl} supabaseAnonKey={supabaseAnonKey} />;
}
