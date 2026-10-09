import { LoginForm } from "@/components/admin/login-form";
import { Orbit } from "lucide-react";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  const runtimeEnv = process.env;
  const configured = Boolean(runtimeEnv.NEXT_PUBLIC_SUPABASE_URL && runtimeEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  return <main className="auth-shell"><div className="auth-card"><div className="brand"><Orbit size={26} /> popcult<span className="brand-accent">.links</span></div><div className="auth-heading"><span>ACESSO RESTRITO / 001</span><h1>Bem-vindo de volta.</h1><p>Entre para ajustar sua presença no universo.</p></div>{!configured && <p className="setup-hint" role="status">Configure a URL e a chave pública do Supabase no ambiente antes de entrar.</p>}<LoginForm /><div className="auth-foot">PAINEL DE CONTROLE · ACESSO SEGURO</div></div></main>;
}
