import Navigation from "@/components/navigation";
import FooterSection from "@/components/footer-section";
import Seo from "@/components/seo";
import Breadcrumbs from "@/components/breadcrumbs";
import { useEffect, useMemo, useState } from "react";
import { applySeoToHead, fetchSeoConfig } from "@/lib/seoOverride";

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

export default function InsightsPage(){
  useEffect(() => { (async () => { const cfg = await fetchSeoConfig('/insights'); if (cfg) applySeoToHead(cfg); })(); }, []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|undefined>();
  const [data, setData] = useState<Article[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [tag, setTag] = useState('');
  const pageSize = 12;

  useEffect(()=>{ (async()=>{
    setLoading(true); setError(undefined);
    try{
      const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
      if (q) params.set('q', q); if (tag) params.set('tag', tag);
      const res = await fetch(`/api/articles?${params.toString()}`);
      const json = await res.json();
      if(!res.ok) throw new Error(json?.message||'Failed');
      setData(json.data||[]); setCount(json.count||0);
    }catch(e:any){ setError(e?.message||'Failed'); }
    finally{ setLoading(false); }
  })(); }, [page, q, tag]);

  const totalPages = Math.max(1, Math.ceil(count / pageSize));

  return (
    <div className="relative min-h-screen text-white">
      <Seo title="Insights & Inspiration" description="Ideas, case studies, and inspiration from real brand activations." canonical="/insights" />
      <Navigation />
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-10 md:py-14">
        <Breadcrumbs items={[{ label:'Get Ideas', href:'/get-ideas' }, { label:'Insights & Inspiration' }]} />
        <header className="text-center mb-8 md:mb-10">
          <h1 className="text-3xl md:text-5xl font-black">Insights & Inspiration</h1>
          <p className="text-white/80 mt-2">Articles, guides, and case studies for experiential marketing</p>
        </header>

        <div className="mb-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <input value={q} onChange={e=>{setPage(1); setQ(e.target.value);}} placeholder="Search articles" className="w-full sm:w-80 rounded-full bg-white/10 border border-white/15 px-4 py-2 outline-none focus:ring-2 focus:ring-purple-400/60" />
          <select value={tag} onChange={e=>{setPage(1); setTag(e.target.value);}} className="w-full sm:w-56 rounded-full bg-white/10 border border-white/15 px-4 py-2 outline-none focus:ring-2 focus:ring-purple-400/60">
            <option value="">All Tags</option>
            {(Array.from(new Set(data.flatMap(a=>a.tags||[])))).map(t=> (<option key={t} value={t}>{t}</option>))}
          </select>
        </div>

        {error && <div className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-red-200">{error}</div>}

        <section className="[column-fill:_balance] sm:columns-2 lg:columns-3 gap-4 space-y-4 min-h-[200px]">
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
          {!loading && data.map(a => (
            <a key={a.id} href={`/insights/${a.slug}`} className="block break-inside-avoid rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/20">
              {a.cover_image && (
                <img src={a.cover_image} alt={a.title} className="w-full h-auto object-cover" loading="lazy" />
              )}
              <div className="px-3 py-3 bg-black/40 text-white">
                <div className="text-sm font-semibold">{a.title}</div>
                {a.excerpt && (<div className="text-xs text-white/70 mt-1">{a.excerpt}</div>)}
                <div className="mt-2 flex flex-wrap gap-1">
                  {(a.tags||[]).slice(0,3).map(t=> (<span key={t} className="text-[10px] px-2 py-0.5 rounded-full border border-white/20 bg-white/10">{t}</span>))}
                </div>
              </div>
            </a>
          ))}
        </section>

        <div className="mt-8 flex items-center justify-center gap-3">
          <button disabled={page<=1} onClick={()=>setPage(p=>Math.max(1,p-1))} className="px-4 py-2 rounded-full border border-white/20 text-white/90 disabled:opacity-50">Prev</button>
          <div className="text-white/70 text-sm">Page {page} of {totalPages}</div>
          <button disabled={page>=totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))} className="px-4 py-2 rounded-full border border-white/20 text-white/90 disabled:opacity-50">Next</button>
        </div>
      </main>
      <FooterSection />
    </div>
  );
}
