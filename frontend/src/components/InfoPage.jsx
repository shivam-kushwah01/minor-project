import { useEffect } from "react";
import { SITE } from "../siteInfo.js";

// Shared layout for the static pages (About, Help, Contact, Privacy, Terms)
export default function InfoPage({ title, subtitle, updated = false, children }) {
  useEffect(() => {
    document.title = `${title} · ${SITE.name}`;
    return () => {
      document.title = SITE.name;
    };
  }, [title]);

  return (
    <article className="info-page">
      <header className="info-hero">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
        {updated && <small>Last updated: {SITE.lastUpdated}</small>}
      </header>
      <div className="info-body">{children}</div>
    </article>
  );
}
