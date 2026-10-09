"use client";
import { useState, useTransition } from "react";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { signIn } from "@/app/admin/actions";

export function LoginForm() {
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  return <form className="auth-form" action={(form) => startTransition(async () => { setError(""); const result = await signIn(form); if (result?.error) setError(result.error); })}>
    <label>E-MAIL<input type="email" name="email" autoComplete="email" required placeholder="voce@exemplo.com" /></label>
    <label>SENHA<input type="password" name="password" autoComplete="current-password" required placeholder="••••••••" /></label>
    {error && <p role="alert" className="form-error">{error}</p>}
    <button className="primary-button" disabled={pending}><LockKeyhole size={17} /> {pending ? "Entrando..." : "Entrar no painel"} <ArrowRight size={17} /></button>
  </form>;
}
