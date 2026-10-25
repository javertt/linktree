import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUpRight,
  Check,
  Copy,
  Download,
  FileText,
  MousePointer2,
  Sparkles,
} from "lucide-react";
import "./portal-data.css";

const downloadPath = "/downloads/Portal-Data-v1.0-Beta.zip";

export const metadata: Metadata = {
  title: "Portal Data | Popcult Links",
  description: "Conheça o Portal Data, extensão beta que importa fichas de RPG para o Roll20, com foco em Tormenta20. Baixe o ZIP e siga o guia de instalação.",
};

export default function PortalDataPage() {
  return (
    <main className="pd-project-page">
      <div className="pd-project-glow" aria-hidden="true" />
      <div className="pd-project-shell">
        <nav className="pd-project-nav" aria-label="Navegação do projeto">
          <Link className="pd-project-brand" href="/projetos/portal-data">
            <Image src="/images/portal-data/portal.svg" alt="" width={38} height={38} />
            <span>Portal Data</span>
          </Link>
          <Link className="pd-project-back" href="/"><ArrowLeft size={16} /> Voltar ao portfólio</Link>
        </nav>

        <section className="pd-project-hero" aria-labelledby="pd-project-title">
          <div className="pd-project-copy">
            <span className="pd-project-kicker"><span className="pd-project-kicker-dot" /> EXTENSÃO PARA ROLL20 <b>1.0 BETA</b></span>
            <h1 id="pd-project-title">Da ficha em texto para o <em>Roll20.</em></h1>
            <p>Cole o bloco de uma ficha de RPG, confira os dados encontrados e importe para a ficha aberta. O Portal Data foi criado com foco em Tormenta20 e ajuda a organizar atributos, vida, itens, ataques e magias.</p>
            <div className="pd-project-actions">
              <a className="pd-project-download" href={downloadPath} download>
                <Download size={19} /> Baixar Portal Data 1.0 Beta
              </a>
              <a className="pd-project-quiet-link" href="#como-usar">Como usar <ArrowDown size={16} /></a>
            </div>
            <p className="pd-project-download-note">ZIP para Opera GX, Chrome e Edge · guia simples incluído · instalação local</p>
          </div>

          <div className="pd-project-preview" aria-label="Exemplo de texto convertido em ficha">
            <div className="pd-project-preview-top"><span><i /> PORTAL DATA / PRÉVIA</span><span>01 → 02</span></div>
            <div className="pd-project-preview-flow">
              <div className="pd-project-preview-text">
                <span><FileText size={14} /> TEXTO COLADO</span>
                <strong>Bandido Selvagem</strong>
                <p>Defesa 16<br />Pontos de Vida 12<br />Corpo a Corpo Lança +11 (1d6+5)<br />For 2, Des 1, Con 1...</p>
              </div>
              <span className="pd-project-flow-arrow" aria-hidden="true">→</span>
              <div className="pd-project-preview-sheet">
                <span><Sparkles size={14} /> FICHA NO ROLL20</span>
                <strong>Bandido Selvagem</strong>
                <div><span>DEFESA</span><b>16</b></div>
                <div><span>VIDA</span><b>12</b></div>
                <div className="pd-project-preview-attack"><span>LANÇA</span><b>+11 · 1d6+5</b></div>
              </div>
            </div>
            <div className="pd-project-preview-bottom"><Check size={14} /> Menos campos para copiar à mão</div>
          </div>
        </section>

        <section className="pd-project-explain" aria-labelledby="pd-project-explain-title">
          <div className="pd-project-section-intro"><span>01 / O PROJETO</span><h2 id="pd-project-explain-title">O que o Portal Data faz?</h2><p>Ele lê texto simples ou Markdown, identifica informações da ficha e preenche campos correspondentes no Roll20. No Tormenta20, também cria linhas de equipamento e ataque para usar os botões de rolagem da própria ficha.</p></div>
          <div className="pd-project-feature-grid">
            <article><div><FileText size={23} /></div><h3>Entende o texto</h3><p>Reconhece nome, atributos, pontos de vida, perícias, inventário e ataques em blocos de ameaça Tormenta20.</p></article>
            <article><div><MousePointer2 size={23} /></div><h3>Preenche a ficha</h3><p>Coloca os dados em campos editáveis e cria linhas de itens e armas. Você confere tudo antes de jogar.</p></article>
            <article><div><Sparkles size={23} /></div><h3>Enriquece as rolagens</h3><p>Prepara bônus e dano nos ataques. Também oferece macros para copiar e GIFs opcionais para o chat.</p></article>
          </div>
        </section>

        <section className="pd-project-how" id="como-usar" aria-labelledby="pd-project-how-title">
          <div className="pd-project-section-intro"><span>02 / COMEÇAR</span><h2 id="pd-project-how-title">Três passos para testar</h2></div>
          <ol>
            <li><b>01</b><div><h3>Instale a extensão</h3><p>Baixe e extraia o ZIP. No Opera GX, abra <code>opera:extensions</code>, ative o modo do desenvolvedor e escolha “Carregar sem compactação”. Selecione a pasta que contém <code>manifest.json</code>.</p></div></li>
            <li><b>02</b><div><h3>Abra uma ficha no Roll20</h3><p>Entre na sua mesa, abra uma ficha editável e selecione “Ficha Ameaça” quando for importar um monstro do Tormenta20.</p></div></li>
            <li><b>03</b><div><h3>Cole e importe</h3><p>Clique no ícone do Portal Data, cole o texto, escolha “Analisar texto” e depois “Importar na ficha”. Confira os campos e teste o ataque no chat.</p></div></li>
          </ol>
          <p className="pd-project-how-note"><Copy size={17} /> O arquivo <strong>COMO_USAR.txt</strong> dentro do ZIP explica a instalação também para Chrome e Edge.</p>
          <p className="pd-project-store-note">Nesta distribuição beta por ZIP, é preciso ativar o modo do desenvolvedor. A instalação direta pelo navegador dependerá de aprovação em uma loja de extensões, como a Opera Add-ons.</p>
        </section>

        <section className="pd-project-final" aria-labelledby="pd-project-final-title">
          <div><span>VERSÃO 1.0 BETA</span><h2 id="pd-project-final-title">Pronto para atravessar o portal?</h2><p>Comece com uma cópia da ficha e confirme os valores após importar. Outros sistemas podem precisar de um mapeamento personalizado.</p></div>
          <a href={downloadPath} download><Download size={19} /> Baixar ZIP <ArrowUpRight size={17} /></a>
        </section>

        <footer className="pd-project-footer"><span>PORTAL DATA · PROJETO INDEPENDENTE PARA ROLL20</span><Link href="/">Voltar ao portfólio <ArrowUpRight size={16} /></Link></footer>
      </div>
    </main>
  );
}
