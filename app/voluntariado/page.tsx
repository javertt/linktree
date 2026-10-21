import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUpRight,
  HeartHandshake,
} from "lucide-react";
import { VolunteerGallery } from "./gallery";
import "./voluntariado.css";

export const metadata: Metadata = {
  title: "Professor voluntário | Samy Vieira Gomes",
  description:
    "Experiência de Samy Vieira Gomes como professor voluntário de informática no Projeto SERPA, com foco também no público idoso.",
};

export default function VolunteerPage() {
  return (
    <main className="volunteer-page">
      <div className="volunteer-glow" aria-hidden="true" />
      <header className="volunteer-header">
        <Link className="volunteer-brand" href="/voluntariado">
          <HeartHandshake size={25} aria-hidden="true" />
          Professor <span>voluntário</span>
        </Link>
        <Link className="volunteer-back" href="/javertt">
          <ArrowLeft size={17} /> Voltar ao portfólio
        </Link>
      </header>

      <div className="volunteer-content">
        <section className="volunteer-hero" aria-labelledby="volunteer-title">
          <span className="volunteer-kicker">
            PROJETO SERPA · INCLUSÃO DIGITAL
          </span>
          <h1 id="volunteer-title">
            Tecnologia e <span>inclusão digital.</span>
          </h1>
          <p>
            Sou Samy Vieira Gomes. Atuei como professor voluntário de
            informática, ensinando mais de 40 alunos ao longo de mais de um ano.
            O curso também tem foco no público idoso, com aulas de tecnologia
            acessíveis.
          </p>
          <a className="volunteer-hero-link" href="#galeria">
            Ver registros das aulas <ArrowDown size={18} />
          </a>
          <div className="volunteer-facts" aria-label="Resumo da experiência">
            <div>
              <strong>Mais de 1 ano</strong>
              <span>de aulas voluntárias</span>
            </div>
            <div>
              <strong>Mais de 40</strong>
              <span>alunos ensinados</span>
            </div>
            <div>
              <strong>Público idoso</strong>
              <span>também faz parte do foco do curso</span>
            </div>
          </div>
        </section>

        <section
          className="volunteer-story"
          aria-labelledby="volunteer-story-title"
        >
          <div>
            <span className="volunteer-section-number">01 / TRAJETÓRIA</span>
            <h2 id="volunteer-story-title">
              Ensinar também é aprender a ouvir.
            </h2>
          </div>
          <div>
            <p>
              Preparei aulas, orientei atividades práticas, esclareci dúvidas e
              apoiei o aprendizado dos participantes. Essa experiência
              fortaleceu minha comunicação, organização e capacidade de explicar
              tecnologia de forma acessível.
            </p>
            <p>
              Reuni aqui os registros dessa atuação para mostrar uma parte da
              minha trajetória que vai além dos projetos de software.
            </p>
          </div>
        </section>

        <section
          className="volunteer-gallery-section"
          id="galeria"
          aria-labelledby="volunteer-gallery-title"
        >
          <div className="volunteer-gallery-heading">
            <div>
              <span className="volunteer-section-number">02 / REGISTROS</span>
              <h2 id="volunteer-gallery-title">Galeria das aulas</h2>
            </div>
            <p>
              Fotos do espaço, das atividades e um material didático desta
              experiência.
            </p>
          </div>
          <VolunteerGallery />
        </section>
      </div>

      <footer className="volunteer-footer">
        <span>Samy Vieira Gomes · Experiência voluntária</span>
        <Link href="/javertt">
          Voltar ao portfólio <ArrowUpRight size={18} />
        </Link>
      </footer>
    </main>
  );
}
