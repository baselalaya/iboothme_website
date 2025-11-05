import React from "react";

type SeoProps = {
  title?: string;
  description?: string;
  canonical?: string;
  prev?: string;
  next?: string;
  robots?: string;
  ogImage?: string;
  keywords?: string[];
  jsonLd?: object | string;
};

const SITE_NAME = "iboothme";
const BASE_URL = typeof window !== "undefined" ? window.location.origin : "";
const DEFAULT_OG = "/images/icon.svg";

export function Seo({
  title,
  description,
  canonical,
  prev,
  next,
  robots = "index,follow",
  ogImage,
  keywords,
  jsonLd,
}: SeoProps) {
  const pageTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  // Normalize canonical: strip query/hash, ensure leading slash, and build absolute URL if needed
  const normalizeCanonical = (url?: string) => {
    if (!url) return undefined;
    try {
      // If absolute, use URL API to strip search/hash
      if (/^https?:\/\//i.test(url)) {
        const u = new URL(url);
        u.search = "";
        u.hash = "";
        return u.toString();
      }
      // Relative: ensure starts with '/', strip query/hash
      let path = url;
      if (!path.startsWith('/')) path = `/${path}`;
      path = path.split('?')[0].split('#')[0];
      // Build absolute only if BASE_URL is available (client side)
      return BASE_URL ? `${BASE_URL}${path}` : path;
    } catch {
      return url;
    }
  };
  const canonicalUrl = normalizeCanonical(canonical);
  const prevUrl = normalizeCanonical(prev);
  const nextUrl = normalizeCanonical(next);
  const og = ogImage || DEFAULT_OG;
  const kw = keywords?.join(", ");
  const json = typeof jsonLd === "string" ? jsonLd : jsonLd ? JSON.stringify(jsonLd) : undefined;

  return (
    <>
      <title>{pageTitle}</title>
      {description && <meta name="description" content={description} />}
      {kw && <meta name="keywords" content={kw} />} 
      <meta name="robots" content={robots} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      {prevUrl && <link rel="prev" href={prevUrl} />}
      {nextUrl && <link rel="next" href={nextUrl} />}

      {/* Open Graph */}
      <meta property="og:title" content={pageTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content="website" />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:site_name" content={SITE_NAME} />
      {og && <meta property="og:image" content={og} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      {description && <meta name="twitter:description" content={description} />}
      {og && <meta name="twitter:image" content={og} />}

      {/* JSON-LD */}
      {json && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
      )}
    </>
  );
}

export default Seo;
