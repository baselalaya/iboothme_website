import Navigation from "@/components/navigation";
import FooterSection from "@/components/footer-section";
import Seo from "@/components/seo";
import Breadcrumbs from "@/components/breadcrumbs";
import { useEffect, useMemo, useState } from "react";
import { useRoute } from "wouter";
import { gtmEvent } from "@/lib/gtm";

type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  cover_image?: string;
  content_html: string;
  tags?: string[];
  author?: string;
  published_at?: string;
};

function decodeHtml(input: string | undefined): string {
  if (!input) return "";
  if (typeof window === "undefined") {
    return input
      .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, "\"")
      .replace(/&apos;/g, "'")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">");
  }
  const el = document.createElement("textarea");
  el.innerHTML = input;
  return el.value;
}

function stripHtml(input: string | undefined): string {
  if (!input) return "";
  return input.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export default function InsightArticlePage() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug || "";
  const [article, setArticle] = useState<Article | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [related, setRelated] = useState<Article[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(false);

  useEffect(() => {
    (async () => {
      if (!slug) return;
      setError(undefined);
      try {
        const res = await fetch(
          `https://demo.iboothme.ae/blog/wp-json/wp/v2/posts?slug=${encodeURIComponent(
            slug
          )}&_embed`
        );
        if (!res.ok) throw new Error("Failed to load article");
        const json = await res.json();
        const wp = json?.[0];
        if (!wp) throw new Error("Article not found");

        const media = wp._embedded?.["wp:featuredmedia"]?.[0];
        const sizes = media?.media_details?.sizes || {};
        const preferredSize =
          sizes["shutter-image-blog-grid-standart"] ||
          sizes["shutter-image-blog-grid-masonry"] ||
          sizes["medium_large"] ||
          sizes["full"];
        const cover =
          preferredSize?.source_url ||
          media?.source_url ||
          wp.yoast_head_json?.og_image?.[0]?.url ||
          undefined;

        const rawExcerpt = wp.excerpt?.rendered
          ? wp.excerpt.rendered.replace(/<[^>]+>/g, "").trim()
          : undefined;

        const mapped: Article = {
          id: String(wp.id),
          // Use the pure post title for on-page heading and SEO.
          title: decodeHtml(wp.title?.rendered || ""),
          slug: wp.slug || String(wp.id),
          excerpt: rawExcerpt ? decodeHtml(rawExcerpt) : undefined,
          cover_image: cover,
          content_html: wp.content?.rendered || "",
          tags: Array.isArray(wp.tags) ? wp.tags.map(String) : [],
          author: wp._embedded?.author?.[0]?.name,
          published_at: wp.date,
        };

        setArticle(mapped);
        try {
          gtmEvent("insights_article_view", {
            slug: mapped.slug,
            title: mapped.title,
            published_at: mapped.published_at,
          });
        } catch {}
      } catch (e: any) {
        const msg =
          typeof e?.message === "string"
            ? e.message
            : "Failed to load article";
        setError(msg);
      }
    })();
  }, [slug]);

  useEffect(() => {
    (async () => {
      if (!article?.id) return;
      setLoadingRelated(true);
      try {
        const res = await fetch(
          `https://demo.iboothme.ae/blog/wp-json/wp/v2/posts?per_page=3&exclude=${article.id}&_embed`
        );
        if (!res.ok) throw new Error("Failed to load related articles");
        const json = await res.json();
        const mapped: Article[] = (json || []).map((p: any) => {
          const media = p._embedded?.["wp:featuredmedia"]?.[0];
          const sizes = media?.media_details?.sizes || {};
          const preferredSize =
            sizes["shutter-image-blog-grid-standart"] ||
            sizes["shutter-image-blog-grid-masonry"] ||
            sizes["medium_large"] ||
            sizes["full"];
          const cover =
            preferredSize?.source_url ||
            media?.source_url ||
            p.yoast_head_json?.og_image?.[0]?.url ||
            undefined;
          const rawExcerpt = p.excerpt?.rendered
            ? p.excerpt.rendered.replace(/<[^>]+>/g, "").trim()
            : undefined;
          return {
            id: String(p.id),
            title: decodeHtml(p.title?.rendered || ""),
            slug: p.slug || String(p.id),
            excerpt: rawExcerpt ? decodeHtml(rawExcerpt) : undefined,
            cover_image: cover,
            content_html: "",
            tags: Array.isArray(p.tags) ? p.tags.map(String) : [],
            author: p._embedded?.author?.[0]?.name,
            published_at: p.date,
          };
        });
        setRelated(mapped);
      } catch {
        setRelated([]);
      } finally {
        setLoadingRelated(false);
      }
    })();
  }, [article?.id]);

  const jsonLd = useMemo(() => {
    if (!article) return null;
    const description =
      article.excerpt || stripHtml(article.content_html).slice(0, 300);
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description,
      datePublished: article.published_at || undefined,
      author: article.author
        ? { "@type": "Person", name: article.author }
        : undefined,
      image: article.cover_image || undefined,
      keywords: (article.tags || []).join(", "),
    } as any;
  }, [article]);

  const breadcrumbLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Blog",
          item: "/blog",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: article?.title || "Article",
          item: `/blog/${slug}`,
        },
      ],
    }),
    [article, slug]
  );

  // As a simple, resilient fallback, force-update the core SEO
  // tags once the article has loaded. This guarantees that even
  // if anything else interferes with <Seo>, title/description
  // will reflect the WordPress article.
  useEffect(() => {
    if (!article || typeof document === "undefined") return;
    const titleText = article.title || "Article";
    const descText =
      article.excerpt ||
      stripHtml(article.content_html).slice(0, 160) ||
      "Insights and inspiration from iboothme.";

    document.title = `${titleText} | iboothme`;

    const ensureMeta = (name: string, content: string) => {
      let el = document.head.querySelector(
        `meta[name="${name}"]`
      ) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    ensureMeta("description", descText);
    ensureMeta("twitter:description", descText);
  }, [article]);

  return (
    <div className="relative min-h-screen text-white">
      <Seo
        title={article?.title || "Article"}
        description={
          article
            ? article.excerpt ||
              stripHtml(article.content_html).slice(0, 160)
            : "Insights and inspiration from iboothme."
        }
        canonical={`/blog/${slug}`}
        jsonLd={jsonLd ? [jsonLd, breadcrumbLd] : breadcrumbLd}
      />
      <Navigation />
      <main className="relative z-10 max-w-5xl mx-auto px-6 py-10 md:py-14">
        <Breadcrumbs items={[{ label:'Blog', href:'/blog' }, { label: article?.title || 'Article' }]} />
        {error && <div className="mt-6 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-red-200">{error}</div>}
        {!article ? (
          <div className="min-h-[40vh] w-full flex items-center justify-center">
            <div className="flex items-center gap-3 text-white/80 bg-white/5 border border-white/10 rounded-xl px-4 py-3 animate-fade-in">
              <svg className="animate-spin h-4 w-4 text-white/70" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              <span className="text-sm">Loading article…</span>
            </div>
          </div>
        ) : (
          <article
            className="article-content"
            itemScope
            itemType="https://schema.org/Article"
          >
            <header className="mb-6 border-b border-white/10 pb-4">
              <h1
                className="text-3xl md:text-4xl font-black leading-tight"
                itemProp="headline"
              >
                {article.title}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-white/60">
                {article.published_at && (
                  <time
                    dateTime={article.published_at}
                    itemProp="datePublished"
                  >
                    {new Date(article.published_at).toLocaleDateString()}
                  </time>
                )}
                {article.tags && article.tags.length > 0 && (
                  <span className="inline-flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#C5A6FF]" />
                    <span>{article.tags.slice(0, 3).join(" • ")}</span>
                  </span>
                )}
              </div>
            </header>
            {article.cover_image && (
              <img
                src={article.cover_image}
                alt={article.title}
                className="w-full rounded-2xl border border-white/10 mb-6 object-cover"
                itemProp="image"
              />
            )}
            <div
              className="prose prose-invert max-w-none"
              itemProp="articleBody"
              dangerouslySetInnerHTML={{ __html: article.content_html }}
            />
            <footer className="mt-10 border-t border-white/10 pt-4">
              {(article.tags || []).length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2" aria-label="Article tags">
                  {(article.tags || []).map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2 py-1 rounded-full border border-white/20 bg-white/10"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </footer>
            {(related.length > 0 || loadingRelated) && (
              <section className="mt-10">
                <h2 className="text-xl md:text-2xl font-semibold mb-4">
                  Related insights
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                  {loadingRelated &&
                    Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={`skeleton-${i}`}
                        className="h-40 rounded-2xl border border-white/10 bg-white/5 animate-pulse"
                      />
                    ))}
                  {!loadingRelated &&
                    related.map((r) => (
                      <article
                        key={r.id}
                        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10 transition-colors"
                      >
                        <a
                          href={`/blog/${r.slug}`}
                          className="flex h-full flex-col"
                          aria-label={r.title}
                        >
                          {r.cover_image && (
                            <div className="relative aspect-[16/9] w-full overflow-hidden">
                              <img
                                src={r.cover_image}
                                alt={r.title}
                                loading="lazy"
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                              />
                            </div>
                          )}
                          <div className="flex flex-1 flex-col px-3 py-3 bg-black/40">
                            <h3 className="text-sm font-semibold leading-snug line-clamp-2">
                              {r.title}
                            </h3>
                            {r.published_at && (
                              <time className="mt-1 text-[11px] text-white/60">
                                {new Date(r.published_at).toLocaleDateString()}
                              </time>
                            )}
                            {r.excerpt && (
                              <p className="mt-1 text-[11px] text-white/70 line-clamp-2">
                                {r.excerpt}
                              </p>
                            )}
                            <span className="mt-3 text-[11px] font-medium text-[#C5A6FF] group-hover:text-white">
                              Read article →
                            </span>
                          </div>
                        </a>
                      </article>
                    ))}
                </div>
              </section>
            )}
          </article>
        )}
      </main>
      <FooterSection />
    </div>
  );
}
