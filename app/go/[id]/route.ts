import { NextRequest, NextResponse } from "next/server";
import { createPublicClient } from "@/lib/supabase/server";
import { safeUrl } from "@/lib/validation";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-fA-F-]{36}$/.test(id)) return new NextResponse("Link não encontrado", { status: 404 });
  const supabase = createPublicClient();
  const { data: link } = await supabase.from("links").select("id,user_id,url").eq("id", id).maybeSingle();
  const target = link && safeUrl(link.url);
  if (!link || !target) return new NextResponse("Link não encontrado", { status: 404 });
  const ua = request.headers.get("user-agent") || "";
  const device = /ipad|tablet/i.test(ua) ? "tablet" : /mobile|iphone|android/i.test(ua) ? "mobile" : "desktop";
  const country = request.headers.get("cf-ipcountry");
  await supabase.rpc("record_event", { p_profile_id: link.user_id, p_link_id: link.id, p_event_type: "link_click", p_country: country && /^[A-Z]{2}$/.test(country) ? country : null, p_device: device });
  return NextResponse.redirect(target, { status: 302 });
}
