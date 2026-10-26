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
import { DownloadCount } from "./download-count";

const downloadPath = "https://github.com/javertt/linktree/releases/download/portal-data-v1.0.4-beta/Portal-Data-v1.0.4-Beta.zip";

export const metadata: Metadata = {
  title: "Portal Data | Popcult Links",
  description: "Portal Data importa fichas de ameaças Tormenta20 para o Roll20 e oferece suporte inicial aos campos básicos da ficha D&D 5e 2014 Legacy. Baixe a extensão beta.",
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
            <span className="pd-project-kicker"><span className="pd-project-kicker-dot" /> EXTENSÃO PARA ROLL20 <b>1.0.4 BETA</b></span>
            <h1 id="pd-project-title">Da ficha em texto para o <em>Roll20.</em></h1>
            <p>Cole o bloco de uma ficha de RPG, confira os dados encontrados e importe para a ficha aberta. O foco é a criação de ameaças Tormenta20; a ficha de personagem D&D 5e 2014 Legacy também recebe dados básicos.</p>
            <div className="pd-project-actions">
              <a className="pd-project-download" href={downloadPath}>
                <Download size={19} /> Baixar Portal Data 1.0.4 Beta
              </a>
              <a className="pd-project-quiet-link" href="#como-usar">Como usar <ArrowDown size={16} /></a>
            </div>
            <p className="pd-project-download-note">ZIP para Opera GX, Chrome e Edge · guia simples incluído · instalação local</p>
            <DownloadCount />
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
          <div className="pd-project-section-intro"><span>01 / O PROJETO</span><h2 id="pd-project-explain-title">O que o Portal Data faz?</h2><p>Ele lê texto simples ou Markdown, identifica informações da ficha e preenche campos correspondentes no Roll20. No Tormenta20, também cria linhas de equipamento, ataques, habilidades e magias.</p></div>
          <div className="pd-project-feature-grid">
            <article><div><FileText size={23} /></div><h3>Entende o texto</h3><p>Reconhece nome, atributos, pontos de vida, perícias, inventário, ataques, habilidades e magias em blocos de ameaça Tormenta20.</p></article>
            <article><div><MousePointer2 size={23} /></div><h3>Preenche a ficha</h3><p>Coloca os dados em campos editáveis e cria linhas de itens e armas. Você confere tudo antes de jogar.</p></article>
            <article><div><Sparkles size={23} /></div><h3>Enriquece as rolagens</h3><p>Prepara bônus e dano nos ataques. Também oferece macros para copiar e GIFs opcionais para o chat.</p></article>
          </div>
          <div className="pd-project-dnd-note">
            <strong>D&D 5e 2014 Legacy: suporte inicial</strong>
            <p>Em uma ficha de personagem desse modelo, o Portal Data reconhece nome, seis atributos, pontos de vida, itens, nomes de ataques e magias separadas por nível. O mapeamento foi conferido no <a href="https://github.com/Roll20/roll20-character-sheets/blob/master/DD5thEditionLegacy/src/html/pc/core.html" target="_blank" rel="noreferrer">código da ficha do Roll20</a> e passou em teste automatizado com DOM simulado. Dano e detalhes dos ataques, fichas de monstro/NPC de D&D e a edição 2024 ainda precisam de mapeamento específico; a importação em uma mesa real segue em validação.</p>
          </div>
        </section>

        <section className="pd-project-how" id="como-usar" aria-labelledby="pd-project-how-title">
          <div className="pd-project-section-intro"><span>02 / COMEÇAR</span><h2 id="pd-project-how-title">Três passos para testar</h2></div>
          <ol>
            <li><b>01</b><div><h3>Instale a extensão</h3><p>Baixe e extraia o ZIP. No Opera GX, abra <code>opera:extensions</code>, ative o modo do desenvolvedor e escolha “Carregar sem compactação”. Selecione a pasta que contém <code>manifest.json</code>.</p></div></li>
            <li><b>02</b><div><h3>Abra uma ficha no Roll20</h3><p>Entre na sua mesa e abra uma ficha editável. Para uma ameaça Tormenta20, pode começar em qualquer aba da ficha: o Portal Data abre as seções necessárias sozinho.</p></div></li>
            <li><b>03</b><div><h3>Cole e importe</h3><p>Clique no ícone do Portal Data, cole o texto, escolha “Analisar texto” e depois “Importar na ficha”. Confira os campos e teste o ataque no chat. Se o nome não vier no texto, comece com “Nome: nome da criatura”.</p></div></li>
          </ol>
          <div className="pd-project-guide-images" aria-label="Imagens de referência do painel Portal Data">
            <figure>
              <Image unoptimized src="/images/portal-data/painel-texto.png" alt="Painel Portal Data com texto de ameaça colado e o botão Analisar texto" width={500} height={540} />
              <figcaption><b>1. Cole o texto</b><span>O painel identifica uma ficha Tormenta20 aberta.</span></figcaption>
            </figure>
            <figure>
              <Image unoptimized src="/images/portal-data/painel-analisado.png" alt="Painel Portal Data com resumo dos dados e botão Importar na ficha" width={500} height={730} />
              <figcaption><b>2. Confira o resumo</b><span>Revise os dados e escolha “Importar na ficha”.</span></figcaption>
            </figure>
          </div>
          <p className="pd-project-image-note">Capturas do painel real com texto de exemplo. A ficha de destino foi simulada para ilustrar a interface.</p>
          <p className="pd-project-how-note"><Copy size={17} /> O ZIP inclui <strong>COMO_USAR.html</strong> com imagens e <strong>COMO_USAR.txt</strong> para leitura simples.</p>
          <p className="pd-project-store-note">Nesta distribuição beta por ZIP, é preciso ativar o modo do desenvolvedor. A instalação direta pelo navegador dependerá de aprovação em uma loja de extensões, como a Opera Add-ons.</p>
        </section>

        <section className="pd-project-compat" aria-labelledby="pd-project-compat-title">
          <div className="pd-project-section-intro"><span>03 / COMPATIBILIDADE</span><h2 id="pd-project-compat-title">Onde usar a versão 1.0.4 Beta</h2><p>O pacote é uma extensão Manifest V3 para navegadores de computador baseados em Chromium. Use uma versão atualizada do navegador, uma mesa do Roll20 aberta e permissão para editar a ficha.</p></div>
          <div className="pd-project-compat-table-wrap">
            <table>
              <thead><tr><th>Navegador</th><th>Sistemas disponíveis</th><th>Validação do Portal Data</th></tr></thead>
              <tbody>
                <tr><td>Google Chrome</td><td>Windows 10/11, macOS 13+ e Linux 64 bits nas distribuições suportadas</td><td>Interface conferida no Chrome; importação em Roll20 ainda em validação.</td></tr>
                <tr><td>Microsoft Edge</td><td>Windows 10/11, macOS e Linux 64 bits nas distribuições suportadas</td><td>Instalação prevista; importação em Roll20 ainda em validação.</td></tr>
                <tr><td>Opera GX</td><td>Windows, macOS e Linux na edição de computador</td><td>Instalação prevista; importação em Roll20 ainda em validação.</td></tr>
              </tbody>
            </table>
          </div>
          <p className="pd-project-compat-note">O ZIP não é uma extensão para Firefox, Safari, Android ou iPhone. O Roll20 recomenda Chrome ou Firefox para o VTT; seu funcionamento no Edge e no Opera GX não é garantido oficialmente pelo Roll20.</p>
          <p className="pd-project-compat-sources">Fontes: <a href="https://support.google.com/chrome/answer/95346" target="_blank" rel="noreferrer">Google Chrome</a>, <a href="https://learn.microsoft.com/en-us/deployedge/microsoft-edge-supported-operating-systems" target="_blank" rel="noreferrer">Microsoft Edge</a>, <a href="https://www.opera.com/gx/linux" target="_blank" rel="noreferrer">Opera GX</a> e <a href="https://help.roll20.net/hc/en-us/articles/4403128607127-Roll20-System-Recommendations" target="_blank" rel="noreferrer">Roll20</a>.</p>
        </section>

        <section className="pd-project-final" aria-labelledby="pd-project-final-title">
          <div><span>VERSÃO 1.0.4 BETA</span><h2 id="pd-project-final-title">Pronto para atravessar o portal?</h2><p>Comece com uma cópia da ficha e confirme os valores após importar. Outros sistemas podem precisar de um mapeamento personalizado.</p></div>
          <a href={downloadPath}><Download size={19} /> Baixar ZIP <ArrowUpRight size={17} /></a>
        </section>

        <footer className="pd-project-footer"><span>PORTAL DATA · PROJETO INDEPENDENTE PARA ROLL20</span><Link href="/">Voltar ao portfólio <ArrowUpRight size={16} /></Link></footer>
      </div>
    </main>
  );
}
