"use client";

import { useState } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";

type BackendName = "alpha" | "beta";
type Event = { id: number; target: string; note: string };

export function BalancerDemo() {
  const [healthy, setHealthy] = useState<Record<BackendName, boolean>>({ alpha: true, beta: true });
  const [cursor, setCursor] = useState(0);
  const [events, setEvents] = useState<Event[]>([]);

  function sendRequest() {
    const active = (["alpha", "beta"] as BackendName[]).filter((name) => healthy[name]);
    const target = active.length ? active[cursor % active.length] : "nenhum";
    const next = cursor + 1;
    setCursor(next);
    setEvents((current) => [
      { id: next, target, note: active.length ? `encaminhado para ${target}` : "sem backend saudável" },
      ...current,
    ].slice(0, 5));
  }

  function reset() {
    setHealthy({ alpha: true, beta: true });
    setCursor(0);
    setEvents([]);
  }

  return (
    <div className="nb-demo" id="simulacao">
      <div className="nb-demo-head">
        <div><span className="nb-kicker">LAB / 01</span><h2>Veja a escolha acontecer.</h2></div>
        <button type="button" className="nb-reset" onClick={reset}><RotateCcw size={15} /> Reiniciar</button>
      </div>
      <p className="nb-demo-note">Simulação didática no navegador. O código Python faz o encaminhamento TCP real.</p>
      <div className="nb-network" aria-label="Simulação de distribuição entre dois backends">
        <div className="nb-node nb-client"><small>ORIGEM</small><strong>Cliente</strong><span>TCP :8080</span></div>
        <ArrowRight className="nb-flow-arrow" aria-hidden="true" />
        <div className="nb-node nb-proxy"><small>ALGORITMO</small><strong>Round-Robin</strong><span>escolhe um destino UP</span></div>
        <ArrowRight className="nb-flow-arrow" aria-hidden="true" />
        <div className="nb-targets">
          {(["alpha", "beta"] as BackendName[]).map((name, index) => (
            <button
              type="button"
              key={name}
              className={`nb-node nb-target ${healthy[name] ? "is-up" : "is-down"}`}
              onClick={() => setHealthy((current) => ({ ...current, [name]: !current[name] }))}
              aria-pressed={healthy[name]}
              aria-label={`${name}, ${healthy[name] ? "ativo" : "inativo"}. Alterar estado`}
            >
              <span className="nb-target-label"><strong>{name}</strong><em>{healthy[name] ? "UP" : "DOWN"}</em></span>
              <small>HTTP :808{index + 1}</small>
            </button>
          ))}
        </div>
      </div>
      <div className="nb-demo-controls">
        <button type="button" className="nb-action" onClick={sendRequest}>Enviar conexão <ArrowRight size={17} /></button>
        <span>Toque em um backend para simular queda ou recuperação.</span>
      </div>
      <div className="nb-event-list" aria-live="polite">
        {events.length ? events.map((event) => (
          <div className="nb-event" key={event.id}><span>#{String(event.id).padStart(2, "0")}</span><strong>{event.note}</strong><code>{event.target === "nenhum" ? "TCP / sem destino" : `→ ${event.target}`}</code></div>
        )) : <p>Envie uma conexão para iniciar a simulação.</p>}
      </div>
    </div>
  );
}
