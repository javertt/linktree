"use client";
import { useState } from "react";
import { ArrowUpRight, ChevronDown, Play } from "lucide-react";
import { motion } from "framer-motion";
import type { Link } from "@/lib/types";
import { embedUrl } from "@/lib/validation";

export function LinkCard({ link }: { link: Link }) {
  const [expanded, setExpanded] = useState(false);
  const player = embedUrl(link.embed_type, link.url);
  return <motion.article initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.32 }} className={`link-card ${link.is_featured ? "featured" : ""}`}>
    <div className="link-main"><a className="link-tap" href={`/go/${link.id}`} target="_blank" rel="noopener noreferrer" aria-label={`Abrir ${link.title} em nova aba`}><span className="link-icon" aria-hidden="true">{link.icon || <ArrowUpRight size={20} />}</span><span className="link-title">{link.title}{link.is_featured && <small>DESTAQUE</small>}</span><ArrowUpRight className="link-arrow" size={20} /></a>{player && <button className="embed-toggle" onClick={() => setExpanded((value) => !value)} aria-expanded={expanded} aria-label={`${expanded ? "Fechar" : "Abrir"} player de ${link.title}`}>{expanded ? <ChevronDown size={18} /> : <Play size={17} fill="currentColor" />}</button>}</div>
    {player && expanded && <div className="embed-frame"><iframe src={player} title={`Player: ${link.title}`} allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" /></div>}
  </motion.article>;
}
