import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { PublicProfile } from "@/components/public-profile";
import { createPublicClient } from "@/lib/supabase/server";
import type { Profile, Link } from "@/lib/types";

export const dynamic = "force-dynamic";

const getProfile = cache(async (username: string) => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return null;
  const supabase = createPublicClient();
  const { data: profile } = await supabase.from("profiles").select("*").eq("username", username).maybeSingle();
  if (!profile) return null;
  const [{ data: links }, { data: primaryProfile }] = await Promise.all([
    supabase.from("links").select("*").eq("user_id", profile.id).order("position", { ascending: true }).order("created_at", { ascending: true }),
    supabase.from("profiles").select("id").order("created_at", { ascending: true }).order("id", { ascending: true }).limit(1).maybeSingle(),
  ]);
  return { profile: profile as Profile, links: (links ?? []) as Link[], showPortfolio: profile.id === primaryProfile?.id };
});

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;
  const result = await getProfile(username);
  if (!result) return { title: "Perfil não encontrado | Popcult Links" };
  return { title: `${result.profile.display_name} | Popcult Links`, description: result.profile.bio || `Explore os links de ${result.profile.display_name}`, icons: result.profile.favicon_url ? { icon: result.profile.favicon_url } : undefined };
}

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const result = await getProfile(username);
  if (!result) notFound();
  return <PublicProfile profile={result.profile} links={result.links} showPortfolio={result.showPortfolio} />;
}
