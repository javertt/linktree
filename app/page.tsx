import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight, AudioLines, Orbit, Sparkles } from "lucide-react";
import { createPublicClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function Home() {
  const runtimeEnv = process.env;
  if (runtimeEnv.NEXT_PUBLIC_SUPABASE_URL && runtimeEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const supabase = createPublicClient();
    const { data: profile } = await supabase.from("profiles").select("username").order("created_at", { ascending: true }).limit(1).maybeSingle();
    if (profile?.username) redirect(`/${encodeURIComponent(profile.username)}`);
  }
  return <main className="landing-shell">
    <div className="ambient ambient-a" /><div className="ambient ambient-b" />
    <nav className="landing-nav"><div className="brand"><Orbit size={24} /><span>popcult<span className="brand-accent">.links</span></span></div><Link className="nav-link" href="/admin">Abrir painel <ArrowUpRight size={16} /></Link></nav>
    <section className="hero"><div className="eyebrow"><Sparkles size={14} /> SUA PRESENÇA, EM OUTRA DIMENSÃO</div><h1>Um link para<br /><em>todos os seus universos.</em></h1><p>Reúna projetos, redes e conteúdos em uma página com a sua identidade. Uma vitrine digital para quem nunca coube em um só formato.</p><div className="hero-actions"><Link className="primary-button" href="/admin">Montar meu perfil <ArrowUpRight size={18} /></Link><span>Temas cult · Links inteligentes · Analytics</span></div></section>
    <div className="landing-bottom"><span>01 / IDENTIDADE DIGITAL</span><div><AudioLines size={17} /> FEITO PARA QUEM CRIA</div><span>EST. 2026</span></div>
  </main>;
}
