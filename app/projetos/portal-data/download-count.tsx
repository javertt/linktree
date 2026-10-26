"use client";

import { useEffect, useState } from "react";

type Release = {
  tag_name?: string;
  assets?: { name?: string; download_count?: number }[];
};

export function DownloadCount() {
  const [count, setCount] = useState<number | null>(null);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch("https://api.github.com/repos/javertt/linktree/releases?per_page=100", {
      headers: { Accept: "application/vnd.github+json" },
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error("Contagem indisponível");
        return response.json() as Promise<Release[]>;
      })
      .then((releases) => {
        if (!Array.isArray(releases)) throw new Error("Resposta inválida");
        const total = releases
          .filter((release) => release.tag_name?.startsWith("portal-data-v"))
          .flatMap((release) => release.assets || [])
          .filter((asset) => /^Portal-Data-v.+-Beta\.zip$/i.test(asset.name || ""))
          .reduce((sum, asset) => {
            const downloads = asset.download_count;
            return sum + (typeof downloads === "number" && Number.isSafeInteger(downloads) && downloads >= 0 ? downloads : 0);
          }, 0);
        if (!controller.signal.aborted) setCount(total);
      })
      .catch(() => { if (!controller.signal.aborted) setUnavailable(true); });
    return () => controller.abort();
  }, []);

  return (
    <div className="pd-project-download-count" aria-live="polite">
      <strong className="pd-project-download-count-number">{count === null ? "—" : count.toLocaleString("pt-BR")}</strong>
      <div>
        <span className="pd-project-download-count-label">downloads do Portal Data</span>
        <small>{unavailable ? "Contagem temporariamente indisponível" : count === null ? "Consultando downloads…" : "Contagem iniciada na versão 1.0.2 Beta"}</small>
      </div>
    </div>
  );
}
