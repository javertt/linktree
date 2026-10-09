import { BadgeCheck, Github, Instagram, Twitch, Youtube, Music2, Globe2, Orbit } from "lucide-react";
import type { Profile, Link } from "@/lib/types";
import { safeTheme } from "@/lib/themes";
import { LinkCard } from "@/components/link-card";
import { PageView } from "@/components/page-view";

const socialIcons: Record<string, typeof Globe2> = { instagram: Instagram, github: Github, twitch: Twitch, youtube: Youtube, spotify: Music2 };

export function PublicProfile({ profile, links }: { profile: Profile; links: Link[] }) {
  const theme = safeTheme(profile.theme);
  const style = { "--profile-bg": theme.background, "--profile-surface": theme.surface, "--profile-fg": theme.foreground, "--profile-accent": theme.accent, "--profile-radius": `${theme.radius}px` } as React.CSSProperties;
  return <main className={`profile-shell ${theme.font === "mono" ? "font-terminal" : ""}`} style={style}>
    <PageView username={profile.username} /><div className="profile-glow" aria-hidden="true" />
    <div className="profile-content"><div className="profile-topline"><span><Orbit size={17} /> POPCULT.LINKS</span><span>TRANSMISSÃO ABERTA <i /></span></div>
      <header className="profile-header"><div className="avatar-ring"><div className="avatar-frame">{profile.avatar_url ? <img src={profile.avatar_url} alt={`Avatar de ${profile.display_name}`} /> : <span>{profile.display_name.charAt(0).toUpperCase()}</span>}</div></div><div className="profile-kicker">// @{profile.username}</div><h1>{profile.display_name}{profile.verified && <BadgeCheck className="verified" size={27} aria-label="Perfil verificado" />}</h1>{profile.bio && <p>{profile.bio}</p>}</header>
      <div className="section-label"><span>EXPLORE OS LINKS</span><span>{String(links.length).padStart(2, "0")} CANAIS</span></div>
      <section className="links-list" aria-label={`Links de ${profile.display_name}`}>{links.length ? links.map((link) => <LinkCard key={link.id} link={link} />) : <p className="empty-links">Este universo ainda está em construção.</p>}</section>
      {profile.socials?.length > 0 && <nav className="social-list" aria-label="Redes sociais">{profile.socials.map((social, index) => { const Icon = socialIcons[social.label.toLowerCase()] || Globe2; return <a key={`${social.url}-${index}`} href={social.url} target="_blank" rel="noopener noreferrer" aria-label={social.label} title={social.label}><Icon size={19} /></a>; })}</nav>}
      <footer className="profile-footer"><span>FIM DA TRANSMISSÃO</span><a href="/" aria-label="Popcult Links, página inicial"><Orbit size={17} /> POPCULT.LINKS</a></footer>
    </div>
  </main>;
}
