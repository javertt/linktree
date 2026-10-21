import Link from "next/link";
import {
  ArrowUpRight,
  HeartHandshake,
  Network,
  TicketCheck,
} from "lucide-react";

const helpDeskDemo =
  "https://helpdesk-ti-web.samy-vgomes.workers.dev/login?demo=1";
const helpDeskLive =
  "https://helpdesk-ti-web.samy-vgomes.workers.dev/login?demo=0";

export function PortfolioProjects() {
  return (
    <>
      <section
        className="portfolio-projects"
        aria-labelledby="portfolio-heading"
      >
        <div className="section-label">
          <span id="portfolio-heading">PROJETOS</span>
          <span>02 EM DESTAQUE</span>
        </div>
        <article className="portfolio-project-card">
          <div className="portfolio-project-head">
            <span className="portfolio-project-icon" aria-hidden="true">
              <TicketCheck size={25} />
            </span>
            <span className="portfolio-project-kicker">
              APLICAÇÃO FULL STACK
            </span>
          </div>
          <h2>HelpDesk TI</h2>
          <p>
            Central de suporte técnico com chamados, histórico, respostas e
            painéis para colaboradores e administradores.
          </p>
          <div
            className="portfolio-project-stack"
            aria-label="Tecnologias do projeto"
          >
            <span>React</span>
            <span>Express</span>
            <span>PostgreSQL</span>
            <span>Cloudflare</span>
          </div>
          <div className="portfolio-project-actions">
            <a
              className="portfolio-project-primary"
              href={helpDeskDemo}
              target="_blank"
              rel="noopener noreferrer"
            >
              Explorar demonstração <ArrowUpRight size={17} />
            </a>
            <a
              className="portfolio-project-secondary"
              href={helpDeskLive}
              target="_blank"
              rel="noopener noreferrer"
            >
              Abrir sistema online <ArrowUpRight size={16} />
            </a>
          </div>
        </article>
        <article className="portfolio-project-card portfolio-project-netbalancer">
          <div className="portfolio-project-head">
            <span className="portfolio-project-icon" aria-hidden="true">
              <Network size={25} />
            </span>
            <span className="portfolio-project-kicker">REDES · PYTHON</span>
          </div>
          <h2>NetBalancer</h2>
          <p>
            Proxy TCP com distribuição Round-Robin, checagem de saúde e failover
            automático. Explore a arquitetura e simule a seleção de backends.
          </p>
          <div
            className="portfolio-project-stack"
            aria-label="Tecnologias do projeto"
          >
            <span>Python</span>
            <span>TCP</span>
            <span>Supabase</span>
            <span>Cloudflare Tunnel</span>
          </div>
          <div className="portfolio-project-actions">
            <Link
              className="portfolio-project-primary"
              href="/projetos/netbalancer"
            >
              Explorar projeto <ArrowUpRight size={17} />
            </Link>
          </div>
        </article>
      </section>
      <section
        className="portfolio-projects portfolio-experience"
        aria-labelledby="experience-heading"
      >
        <div className="section-label">
          <span id="experience-heading">EXPERIÊNCIA VOLUNTÁRIA</span>
          <span>INCLUSÃO DIGITAL</span>
        </div>
        <article className="portfolio-project-card portfolio-project-volunteer">
          <div className="portfolio-project-head">
            <span className="portfolio-project-icon" aria-hidden="true">
              <HeartHandshake size={25} />
            </span>
            <span className="portfolio-project-kicker">PROJETO SERPA</span>
          </div>
          <h2>Tecnologia e inclusão digital</h2>
          <p>
            Atuei como professor voluntário de informática por mais de um ano e
            ensinei mais de 40 alunos. O curso também tem foco no público idoso.
            Conheça os registros das aulas e o que aprendi nessa experiência.
          </p>
          <div className="portfolio-project-actions">
            <Link className="portfolio-project-primary" href="/voluntariado">
              Ver experiência e fotos <ArrowUpRight size={17} />
            </Link>
          </div>
        </article>
      </section>
    </>
  );
}
