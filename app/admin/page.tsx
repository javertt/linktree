import { createClient } from "@/lib/supabase/server";
import { AdminDashboard } from "@/components/admin/dashboard";
import type { Profile, Link } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const [{ data: profile }, { data: links }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase.from("links").select("*").eq("user_id", user.id).order("position", { ascending: true }).order("created_at", { ascending: true }),
  ]);
  const { data: summary } = profile ? await supabase.rpc("analytics_summary", { p_profile_id: user.id }) : { data: null };
  return <AdminDashboard userId={user.id} email={user.email || ""} profile={profile as Profile | null} links={(links || []) as Link[]} summary={summary} />;
}
