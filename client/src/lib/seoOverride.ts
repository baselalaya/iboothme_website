export type SeoConfig = {
  id: string;
  title?: string;
  description?: string;
  canonical?: string;
  og_image?: string;
  robots?: string;
  keywords?: string[];
  json_ld?: any;
};

export async function fetchSeoConfig(path: string): Promise<SeoConfig | null> {
  try {
    const res = await fetch(`/api/seo/${encodeURIComponent(path)}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export function applySeoToHead(cfg: SeoConfig) {
  if (!cfg) return;
  if (cfg.title) document.title = `${cfg.title} | iboothme`;
  setMeta('name','description', cfg.description);
  setMeta('name','robots', cfg.robots);
  if (cfg.keywords && cfg.keywords.length) setMeta('name','keywords', cfg.keywords.join(', '));
  if (cfg.canonical) setLink('canonical', cfg.canonical);
  // Open Graph
  setMeta('property','og:title', cfg.title ? `${cfg.title} | iboothme` : undefined);
  setMeta('property','og:description', cfg.description);
  setMeta('property','og:url', cfg.canonical);
  setMeta('property','og:image', cfg.og_image);
  // Twitter
  setMeta('name','twitter:title', cfg.title ? `${cfg.title} | iboothme` : undefined);
  setMeta('name','twitter:description', cfg.description);
  setMeta('name','twitter:image', cfg.og_image);
  // JSON-LD
  if (cfg.json_ld) setJsonLd(cfg.json_ld);
}

function setMeta(kind: 'name'|'property', key: string, value?: string) {
  let el = document.head.querySelector(`meta[${kind}="${key}"]`) as HTMLMetaElement | null;
  if (!value) { if (el) el.parentElement?.removeChild(el); return; }
  if (!el) { el = document.createElement('meta'); el.setAttribute(kind, key); document.head.appendChild(el); }
  el.setAttribute('content', value);
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!href) { if (el) el.parentElement?.removeChild(el); return; }
  if (!el) { el = document.createElement('link'); el.rel = rel; document.head.appendChild(el); }
  el.href = href;
}

function setJsonLd(data: any) {
  // remove existing LD+JSON nodes we control
  const existing = Array.from(document.head.querySelectorAll('script[type="application/ld+json"]'));
  existing.forEach(n => n.parentElement?.removeChild(n));
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = typeof data === 'string' ? data : JSON.stringify(data);
  document.head.appendChild(script);
}

