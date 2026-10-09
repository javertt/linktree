import { LoginForm } from "@/components/admin/login-form";
import { Orbit } from "lucide-react";

export default function LoginPage() {
  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  return <main className="auth-shell"><div className="auth-card"><div className="brand"><Orbit size={26} /> popcult<span className="brand-accent">.links</span></div><div className="auth-heading"><span>ACESSO RESTRITO / 001</span><h1>Bem-vindo de volta.</h1><p>Entre para ajustar sua presença no universo.</p></div>{!configured && <p className="setup-hint" role="status">Para testar o painel, crie <code>.env.local</code> a partir de <code>.env.example</code> e informe a URL e a chave pública do Supabase.</p>}<LoginForm /><div className="auth-foot">PAINEL DE CONTROLE · ACESSO SEGURO</div></div></main>;
}
