import Navigation from "@/components/navigation";
import FooterSection from "@/components/footer-section";
import Seo from "@/components/seo";
import Breadcrumbs from "@/components/breadcrumbs";
import { useEffect, useState } from "react";
import { gtmEvent } from "@/lib/gtm";

type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  cover_image?: string;
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

export default function InsightsPage(){
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|undefined>();
  const [data, setData] = useState<Article[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [q, setQ] = useState('');
  const [tag, setTag] = useState('');
  useEffect(()=>{
    // keep URL in sync for shareability
    const url = new URL(window.location.href);
    if (q) url.searchParams.set('q', q); else url.searchParams.delete('q');
    if (tag) url.searchParams.set('tag', tag); else url.searchParams.delete('tag');
    window.history.replaceState(null, '', url.toString());
  }, [q, tag]);

  useEffect(()=>{ (async()=>{
    setLoading(true); setError(undefined);
    try{
      const params = new URLSearchParams({
        per_page: "12",
        page: String(page),
        _embed: "1",
      });
      const res = await fetch(`https://demo.iboothme.ae/blog/wp-json/wp/v2/posts?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load blog posts");
      const total = Number(res.headers.get("X-WP-Total") || "0");
      const totalPagesHeader = Number(res.headers.get("X-WP-TotalPages") || "1");
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
          tags: Array.isArray(p.tags) ? p.tags.map(String) : [],
          author: p._embedded?.author?.[0]?.name,
          published_at: p.date,
        };
      });
      setData(mapped);
      setCount(total || mapped.length);
      setTotalPages(totalPagesHeader || 1);
      try {
        gtmEvent("insights_list_view", {
          page,
          page_size: mapped.length,
          count: total || mapped.length,
        });
      } catch {}
    }catch(e:any){ setError(e?.message||"Failed"); }
    finally{ setLoading(false); }
  })(); }, [page]);

  const prev = page > 1 ? `/blog?page=${page-1}${q?`&q=${encodeURIComponent(q)}`:''}${tag?`&tag=${encodeURIComponent(tag)}`:''}` : undefined;
  const next = page < totalPages ? `/blog?page=${page+1}${q?`&q=${encodeURIComponent(q)}`:''}${tag?`&tag=${encodeURIComponent(tag)}`:''}` : undefined;
  const jsonLd = {
    "@context":"https://schema.org",
    "@type":"CollectionPage",
    name: "Blog",
    description: "Blog articles, guides, and case studies for experiential marketing",
    hasPart: (data||[]).slice(0,12).map(a=>({
      "@type":"Article",
      headline: a.title,
      url: `/blog/${a.slug}`,
      datePublished: a.published_at || undefined
    }))
  } as any;
  return (
    <div className="relative min-h-screen text-white">
      <Seo title="Blog" description="Ideas, case studies, and inspiration from real brand activations." canonical="/blog" prev={prev} next={next} jsonLd={jsonLd} />
      <Navigation />
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-10 md:py-14">
        <Breadcrumbs items={[{ label:'Ideas', href:'/ideas' }, { label:'Blog' }]} />
        <header className="text-center mb-8 md:mb-10">
          <h1 className="text-3xl md:text-5xl font-black">Blog</h1>
          <p className="text-white/80 mt-2">Articles, guides, and case studies for experiential marketing.</p>
        </header>

        <div className="mb-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <input value={q} onChange={e=>{setPage(1); setQ(e.target.value);}} placeholder="Search articles" className="w-full sm:w-80 rounded-full bg-white/10 border border-white/15 px-4 py-2 outline-none focus:ring-2 focus:ring-purple-400/60" />
          <select value={tag} onChange={e=>{setPage(1); setTag(e.target.value);}} className="w-full sm:w-56 rounded-full bg-white/10 border border-white/15 px-4 py-2 outline-none focus:ring-2 focus:ring-purple-400/60">
            <option value="">All Tags</option>
            {(Array.from(new Set(data.flatMap(a=>a.tags||[])))).map(t=> (<option key={t} value={t}>{t}</option>))}
          </select>
        </div>

        {error && <div className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-red-200">{error}</div>}

        <section
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[200px]"
          aria-label="Blog articles"
        >
          {loading && (
            <div className="min-h-[40vh] w-full flex items-center justify-center">
              <div className="flex items-center gap-3 text-white/80 bg-white/5 border border-white/10 rounded-xl px-4 py-3 animate-fade-in">
                <svg className="animate-spin h-4 w-4 text-white/70" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                <span className="text-sm">Loading articles…</span>
              </div>
            </div>
          )}
          {!loading &&
            data.map((a) => (
              <article
                key={a.id}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_18px_45px_rgba(2,6,23,0.6)] transition-transform duration-200 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10"
                itemScope
                itemType="https://schema.org/Article"
              >
                <a href={`/blog/${a.slug}`} className="flex h-full flex-col" aria-label={a.title}>
                  {a.cover_image && (
                    <div className="relative aspect-[16/9] w-full overflow-hidden">
                      <img
                        src={a.cover_image}
                        alt={a.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        itemProp="image"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col px-4 py-4 bg-black/40 text-white">
                    <header className="mb-2">
                      <h2
                        className="text-base font-semibold leading-snug line-clamp-2"
                        itemProp="headline"
                      >
                        {a.title}
                      </h2>
                      {a.published_at && (
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-white/60">
                          <time
                            dateTime={a.published_at}
                            itemProp="datePublished"
                          >
                            {new Date(a.published_at).toLocaleDateString()}
                          </time>
                        </div>
                      )}
                    </header>
                    {a.excerpt && (
                      <p className="mt-1 line-clamp-3 text-xs text-white/75" itemProp="description">
                        {a.excerpt}
                      </p>
                    )}
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap gap-1">
                        {(a.tags || []).slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="text-[10px] px-2 py-0.5 rounded-full border border-white/20 bg-white/10 text-white/80"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      <span className="text-[11px] font-medium text-[#C5A6FF] group-hover:text-white">
                        Read article →
                      </span>
                    </div>
                  </div>
                </a>
              </article>
            ))}
        </section>

        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            disabled={page<=1}
            onClick={()=>{
              setPage(p=>Math.max(1,p-1));
              if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-4 py-2 rounded-full border border-white/20 text-white/90 disabled:opacity-50"
          >
            Prev
          </button>
          <div className="text-white/70 text-sm">Page {page} of {totalPages}</div>
          <button
            disabled={page>=totalPages}
            onClick={()=>{
              setPage(p=>Math.min(totalPages,p+1));
              if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-4 py-2 rounded-full border border-white/20 text-white/90 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </main>
      <FooterSection />
    </div>
  );
}
