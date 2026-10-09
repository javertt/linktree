import { NextRequest, NextResponse } from "next/server";
import { createPublicClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const supabase = createPublicClient();
  const { data: profile } = await supabase.from("profiles").select("id").eq("username", username).maybeSingle();
  if (!profile) return new NextResponse(null, { status: 404 });
  const cookie = `viewed_${profile.id.replaceAll("-", "").slice(0, 16)}`;
  if (request.cookies.has(cookie)) return new NextResponse(null, { status: 204 });
  const ua = request.headers.get("user-agent") || "";
  const device = /ipad|tablet/i.test(ua) ? "tablet" : /mobile|iphone|android/i.test(ua) ? "mobile" : "desktop";
  const country = request.headers.get("cf-ipcountry");
  const { error } = await supabase.rpc("record_event", { p_profile_id: profile.id, p_link_id: null, p_event_type: "page_view", p_country: country && /^[A-Z]{2}$/.test(country) ? country : null, p_device: device });
  if (error) return new NextResponse(null, { status: 500 });
  const response = new NextResponse(null, { status: 204 });
  response.cookies.set(cookie, "1", { httpOnly: true, sameSite: "lax", secure: request.nextUrl.protocol === "https:", maxAge: 1800, path: "/" });
  return response;
}
