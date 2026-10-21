import type { Metadata } from "next";
import Link from "next/link";
import { Activity, ArrowDown, ArrowLeft, ArrowUpRight, Database, Network, ShieldCheck, Waypoints } from "lucide-react";
import { BalancerDemo } from "./demo";
import "./netbalancer.css";

export const metadata: Metadata = {
  title: "NetBalancer",
  description: "Projeto de portfólio: proxy TCP em Python com Round-Robin, health checker, failover e telemetria no Supabase.",
};

export default function NetBalancerPage() {
  return (
    <main className="nb-page">
      <div className="nb-glow" aria-hidden="true" />
      <nav className="nb-nav" aria-label="Navegação do projeto">
        <Link className="nb-brand" href="/projetos/netbalancer"><span className="nb-brand-mark"><Network size={22} /></span><span>NetBalancer<span className="nb-brand-dot">.</span></span></Link>
        <Link className="nb-back" href="/"><ArrowLeft size={16} /> Voltar ao portfólio</Link>
      </nav>

      <section className="nb-hero">
        <div className="nb-hero-copy">
          <span className="nb-kicker"><span className="nb-live-dot" /> ESTUDO DE CASO · REDES & BACKEND</span>
          <h1>Tráfego sob controle<span>.</span></h1>
          <p>Um mini load balancer em Python que distribui conexões TCP entre servidores, detecta falhas e recoloca destinos saudáveis em circulação.</p>
          <div className="nb-hero-actions"><a className="nb-action" href="#simulacao">Testar simulação <ArrowDown size={17} /></a><a className="nb-text-link" href="#arquitetura">Entender arquitetura <ArrowUpRight size={17} /></a></div>
          <div className="nb-tech"><span>PYTHON 3.10+</span><span>SOCKETS TCP</span><span>SUPABASE</span><span>CLOUDFLARE TUNNEL</span></div>
        </div>
        <div className="nb-hero-visual" aria-hidden="true">
          <div className="nb-visual-top"><span>NETBALANCER / TOPOLOGIA ILUSTRATIVA</span><span className="nb-visual-pulse">● 2 DESTINOS</span></div>
          <div className="nb-visual-center"><span className="nb-visual-client">CLIENT<br />:8080</span><span className="nb-visual-line" /><span className="nb-visual-core"><Waypoints size={42} /><b>RR</b></span><span className="nb-visual-line" /><div className="nb-visual-servers"><span>BACKEND 01 <i>UP</i></span><span>BACKEND 02 <i>UP</i></span></div></div>
          <div className="nb-visual-bottom"><span>HEALTH CHECK <strong>5s</strong></span><span>ROUTE <strong>ROUND ROBIN</strong></span></div>
        </div>
      </section>

      <section className="nb-intro" id="arquitetura"><div><span className="nb-kicker">01 / O DESAFIO</span><h2>Uma conexão precisa de um destino disponível.</h2></div><p>Quando um backend sai do ar, continuar enviando tráfego para ele causa falhas. O NetBalancer mantém um pool de destinos saudáveis, escolhe o próximo em sequência e encaminha os bytes nos dois sentidos até a conexão terminar.</p></section>

      <section className="nb-feature-grid" aria-label="Componentes do projeto">
        <article><div className="nb-feature-icon"><Waypoints size={24} /></div><span>01 / DISTRIBUIÇÃO</span><h3>Round-Robin</h3><p>Um cursor protegido por lock alterna as novas conexões entre os backends que estão UP.</p></article>
        <article><div className="nb-feature-icon"><Activity size={24} /></div><span>02 / RESILIÊNCIA</span><h3>Health Checker</h3><p>Uma thread consulta os destinos por TCP ou HTTP e atualiza o pool quando há queda ou recuperação.</p></article>
        <article><div className="nb-feature-icon"><Database size={24} /></div><span>03 / VISIBILIDADE</span><h3>Telemetria</h3><p>Status e logs podem ser persistidos no Supabase; um painel local mostra o estado atual do serviço.</p></article>
      </section>

      <BalancerDemo />

      <section className="nb-details"><div><span className="nb-kicker">02 / POR DENTRO</span><h2>Feito para entender o caminho de cada byte.</h2></div><div className="nb-detail-list"><div><ShieldCheck size={22} /><p><strong>Failover imediato</strong><span>Se a conexão com um destino falhar, o proxy tenta outro backend saudável na mesma conexão.</span></p></div><div><Network size={22} /><p><strong>Proxy bidirecional</strong><span>Duas rotinas copiam os streams em sentidos opostos, respeitando o encerramento independente de cada lado.</span></p></div><div><Activity size={22} /><p><strong>Recuperação automática</strong><span>Após uma sonda bem-sucedida, o backend volta ao pool sem reiniciar o balanceador.</span></p></div></div></section>

      <footer className="nb-footer"><div><span className="nb-kicker">PROJETO DE PORTFÓLIO</span><h2>NetBalancer<span>.</span></h2><p>Python · redes de computadores · observabilidade</p></div><Link href="/">Voltar ao portfólio <ArrowUpRight size={18} /></Link></footer>
    </main>
  );
}
