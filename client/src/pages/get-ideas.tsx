import Navigation from "@/components/navigation";
import { useEffect } from 'react';
import { applySeoToHead, fetchSeoConfig } from "@/lib/seoOverride";
import Seo from "@/components/seo";
import FooterSection from "@/components/footer-section";
import { Button } from "@/components/ui/button";
import Breadcrumbs from "@/components/breadcrumbs";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay } from "swiper/modules";
import { useMemo, useRef, useState } from "react";
import { apiBaseJoin } from "../lib/publicApi";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { getEffectiveUtm } from "@/lib/utm";
import { trackEvent } from "@/lib/ga";
import { gtmEvent } from "@/lib/gtm";
import { validateLeadBasics } from "@/lib/validation";
import "swiper/css";
import "swiper/css/effect-coverflow";

type Idea = { tag: string; title: string; subtitle: string; media?: { type: 'image'|'video'; src: string } };

function SmartVideo({ src, poster }: { src: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement|null>(null);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const isReduced = !!mq && mq.matches;
    setReduced(isReduced);
    let obs: IntersectionObserver | null = null;
    const onIntersect: IntersectionObserverCallback = (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          el.play?.().catch(()=>{});
        } else {
          el.pause?.();
        }
      }
    };
    if (!isReduced && 'IntersectionObserver' in window) {
      obs = new IntersectionObserver(onIntersect, { root: null, threshold: 0.35 });
      obs.observe(el);
    }
    return () => { if (obs && el) obs.unobserve(el); };
  }, []);
  return (
    <div className="absolute inset-0 flex">
      <div className="m-auto w-full h-full">
        <div className="w-full h-full aspect-[9/16] max-h-full mx-auto">
          <video
            ref={ref}
            src={src}
            className="w-full h-full object-cover"
            muted={!reduced}
            playsInline
            loop={!reduced}
            controls={reduced}
            preload="metadata"
            poster={poster}
          />
        </div>
      </div>
    </div>
  );
}

export default function GetIdeasPage() {
  useEffect(() => { (async () => { const cfg = await fetchSeoConfig('/get-ideas'); if (cfg) applySeoToHead(cfg); })(); }, []);
  const [activeFilter, setActiveFilter] = useState<string>("All Effects");
  const [featured, setFeatured] = useState<Idea[]>([]);
  const [items, setItems] = useState<Array<{ id:string; title:string; type:'image'|'video'; url:string; target?: string; video_url?: string; thumbnail_url?:string; tags?:string[] }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|undefined>();
  const [page, setPage] = useState(1);
  const pageSize = 24;

  // Unified fetch used by Featured and Grid
  useEffect(() => {
    (async () => {
      setLoading(true); setError(undefined);
      try {
        const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
        if (activeFilter && activeFilter !== 'All Effects') params.set('tag', activeFilter);
        const res = await fetch(apiBaseJoin(`/api/media?${params.toString()}`));
        const ct = res.headers.get('content-type')||'';
        const data = ct.includes('application/json') ? await res.json() : JSON.parse(await res.text());
        if (!res.ok) throw new Error(data?.message||'Failed to load ideas');
        const arr = (data?.data || []) as Array<{ id:string; title:string; type:'image'|'video'; url:string; target?:string; video_url?:string; thumbnail_url?:string; tags?:string[] }>;
        setItems(arr);
        // derive featured from first two results
        const ideas: Idea[] = arr.slice(0,2).map(it => ({
          tag: it.tags?.[0] || (it.type==='video' ? 'AI Video' : 'AI Photo'),
          title: it.title,
          subtitle: it.tags?.slice(0,2).join(', ') || it.title,
          media: { type: it.type, src: it.url }
        }));
        setFeatured(ideas);
      } catch(e:any) {
        setError(e?.message||'Failed to load ideas');
        setItems([]);
        setFeatured([]);
      } finally { setLoading(false); }
    })();
  }, [activeFilter, page]);

  const filters = useMemo(() => {
    const tags = Array.from(new Set(items.map(i => (i.tags?.[0] || (i.type==='video'?'AI Video':'AI Photo')))));
    return ['All Effects', ...tags];
  }, [items]);

  const grid = useMemo(() => {
    if (activeFilter === 'All Effects') return items;
    return items.filter(i => (i.tags?.[0] || (i.type==='video'?'AI Video':'AI Photo')) === activeFilter);
  }, [activeFilter, items]);

  const Card = ({ it }: { it: { id:string; title:string; url:string; target?:string; video_url?:string; thumbnail_url?:string; tags?:string[] } }) => (
    <div className="group relative rounded-2xl overflow-hidden border border-white/10 bg-white/5">
      <img src={it.url} alt={it.title} className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0" loading="lazy" />
      {!it.video_url && it.target && (
        <img src={it.target} alt={it.title} className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100" loading="lazy" />
      )}
      {it.video_url && (
        <video className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100" src={it.video_url} poster={it.thumbnail_url || it.url} autoPlay muted loop playsInline preload="metadata" />
      )}
      <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
        <div className="text-sm font-semibold">{it.title}</div>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen text-white">
      <Seo
        title="Activation Ideas"
        description="Explore fresh activation ideas and experiential concepts to inspire your next event."
        canonical="/get-ideas"
        ogImage="/images/Brand Activation.jpg"
        keywords={["activation ideas", "experiential ideas", "event concepts"]}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_50%_at_50%_0%,rgba(112,66,210,0.12),transparent_60%),radial-gradient(60%_40%_at_80%_100%,rgba(34,212,253,0.10),transparent_60%)]" />
      <Navigation />
      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Get Ideas' }]} />
        </div>
        {/* Hero */}
        <section className="relative w-full overflow-hidden min-h-[30vh] text-center mb-14 rounded-[28px] flex items-center justify-center">
          <div className="absolute inset-0 -z-10 opacity-30 overflow-hidden">
            <video className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.78vh] h-[100vh] md:w-[177.78vw] md:h-[56.25vw] max-w-none" autoPlay muted loop playsInline preload="metadata">
              <source src="/videos/get-ideas.mp4" />
            </video>
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,1)_0%,rgba(0,0,0,0.85)_10%,rgba(0,0,0,0)_40%,rgba(0,0,0,0)_60%,rgba(0,0,0,0.85)_90%,rgba(0,0,0,1)_100%)]" />
            <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_82%)]" />
          </div>
          <div className="max-w-5xl mx-auto px-6 py-16 md:py-20 lg:py-24 min-h-[30vh] flex flex-col items-center justify-center">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-white/15 bg-white/10 backdrop-blur mb-6">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-sm font-semibold tracking-wide uppercase">Get Ideas</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black gradient-text">Discover. Imagine. Activate.</h1>
            <p className="text-base sm:text-lg md:text-xl text-white/85 mt-3 sm:mt-4 max-w-[34ch] sm:max-w-3xl mx-auto leading-relaxed">Get inspired with concepts that help you win your pitches and create unforgettable brand activations</p>
            {/* <div className="mt-6 sm:mt-8">
              <Button variant="creativePrimary" size="lg" className="w-full sm:w-auto">Explore Ideas</Button>
            </div> */}
          </div>
        </section>

        {/* Featured Experiences (2-card layout) */}
        {/* <section className="relative max-w-7xl mx-auto px-6 mb-12">
          <div className="text-center mb-8 opacity-60">⸻</div>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">Inside the Ideas</h2>
          <p className="text-white/80 text-center max-w-2xl mx-auto mb-6">Explore our curated collection of AI-powered concepts and creative solutions</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featured.map((f, i) => (
              <div key={i} className="pb-2">
                <IdeaSlideCard {...f} />
              </div>
            ))}
          </div>
        </section> */}
        
        {/* Inside the Ideas – preview from Creative Results with filters */}
        <section className="max-w-7xl mx-auto px-6 mb-12">
          {/* Filter tabs (mirroring creative-results) */}
          <IdeasFilterGrid
            items={items}
            loading={loading}
            error={error}
            page={page}
            pageSize={pageSize}
            onPrev={()=>setPage(p=>Math.max(1,p-1))}
            onNext={()=>setPage(p=>p+1)}
            active={activeFilter}
            onActiveChange={setActiveFilter}
          />
        </section>

   

        {/* CTA */}
        <section className="max-w-7xl mx-auto px-6 mb-16 text-center">
          <div className="text-center mb-8 opacity-60">⸻</div>
          <h3 className="text-2xl md:text-3xl font-semibold mb-3 px-3">Ready to implement these experiences?</h3>
          <p className="text-white/80 max-w-3xl mx-auto mb-6 px-3">
            Let’s discuss how we can customize these solutions for your brand activation needs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild variant="creativePrimary" size="lg" className="w-full sm:w-auto">
              <a href="/contact-us">Start the Conversation</a>
            </Button>
          </div>
        </section>
      </main>
      <FooterSection />
    </div>
  );
}

function IdeasFilterGrid() {
  const [active, setActive] = useState<string>('All');
  const [open, setOpen] = useState<{ title?: string; tag?: string; img?: string }|null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast?.() || ({ toast: (args: any) => console.log(args) } as any);
  const formRef = useRef<HTMLFormElement|null>(null);
  const [form, setForm] = useState({ name:'', email:'', phone:'', company:'', eventDate:'', eventType:'', guests:'', duration:'', location:'', idea:'' });
  function upd<K extends keyof typeof form>(k: K, v: string) { setForm(f => ({...f, [k]: v})); }
  type Item = { id: string; type: 'image'|'video'; src: string; target?: string; video?: string; poster?: string; title?: string; tag?: string };
  const [demo, setDemo] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|undefined>();

  useEffect(()=>{ (async()=>{
    setLoading(true); setError(undefined);
    try{
      const params = new URLSearchParams({ page:'1', pageSize:'24' });
      const res = await fetch(apiBaseJoin(`/api/media?${params.toString()}`));
      const ct = res.headers.get('content-type')||'';
      const json = ct.includes('application/json') ? await res.json() : JSON.parse(await res.text());
      const arr = (json?.data||[]) as Array<{ id:string; title:string; type:'image'|'video'; url:string; target?:string; video_url?:string; thumbnail_url?:string; tags?:string[] }>;
      const mapped: Item[] = arr.map(it => ({ id: it.id, type: it.type, src: it.url, target: it.target, video: it.video_url, poster: it.thumbnail_url, title: it.title, tag: it.tags?.[0]|| (it.type==='video'?'AI Video':'AI Photo') }));
      setDemo(mapped);
    }catch(e:any){ setError(e?.message||'Failed to load'); setDemo([]);} finally{ setLoading(false);} })(); },[]);

  const frFilters = useMemo(()=>['All', ...Array.from(new Set(demo.map(i=>i.tag||'').filter(Boolean)))] ,[demo]);
  const items = useMemo(()=> active==='All' ? demo : demo.filter(i => i.tag===active), [active, demo]);
  const eight = items.slice(0, 8);

  const onCardClick = (it: Item) => {
    try {
      const { trackEvent } = require('@/lib/ga');
      trackEvent('select_content', {
        content_type: 'idea_card',
        item_id: it.id,
        item_name: it.title,
        item_category: it.tag,
        item_variant: it.type,
      });
    } catch {}
    try {
      const { gtmEvent } = require('@/lib/gtm');
      gtmEvent('ideas_card_click', {
        id: it.id,
        title: it.title,
        tag: it.tag,
        type: it.type,
      });
    } catch {}
  };

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6">
        {frFilters.map(f => (
          <button key={f} onClick={()=>setActive(f)} className={`px-4 py-2 rounded-full border text-sm font-semibold transition ${active===f? 'bg-zinc-900 text-white border-white' : 'bg-zinc-800/60 text-white border-white/20 hover:bg-zinc-700/60'}`}>{f}</button>
        ))}
      </div>

      {/* Bento Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5">
        {eight.map((it, idx) => (
          <article
            key={it.id}
            onClick={() => onCardClick(it)}
            className={`group relative rounded-3xl overflow-hidden bg-zinc-900/70 border border-white/10 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(0,0,0,0.35)] hover:border-white/20 ${
              // New rule: videos are tall, images are square-ish
              it.type === 'video'
                ? 'lg:col-span-2 lg:row-span-3'
                : 'lg:col-span-2 lg:row-span-2'
            }`}
          >
            <div className={`relative ${it.type === 'video' ? 'h-72 sm:h-80 md:h-[26rem] lg:h-[34rem]' : 'h-60 sm:h-64 md:h-72 lg:h-[22rem]'}`}>
              {it.type==='image' ? (
                <div className="absolute inset-0 flex">
                  <div className="m-auto w-full h-full">
                    <div className={`w-full h-full ${it.type==='video' ? 'aspect-[9/16]' : 'aspect-square'} max-h-full mx-auto`}>
                      <img src={it.src} alt={it.title||'Creative Result'} className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0" loading="lazy" />
                      {it.target && (
                        <img src={it.target} alt={it.title||'Creative Result'} className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100" loading="lazy" />
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex">
                  <div className="m-auto w-full h-full">
                    <div className="w-full h-full aspect-[9/16] max-h-full mx-auto max-w-[18rem] sm:max-w-[20rem] md:max-w-[22rem] lg:max-w-[24rem]">
                      {/* show source image by default, swap to video on hover */}
                      <img src={it.poster || it.src} alt={it.title||'Creative Result'} className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0" loading="lazy" />
                      {it.video && (
                        <video className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100" src={it.video} poster={it.poster || it.src} autoPlay muted loop playsInline preload="metadata" />
                      )}
                    </div>
                  </div>
                </div>
              )}
              {(it.title || it.tag) && (
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 via-black/10 to-transparent">
                  <div className="text-sm font-semibold leading-tight">{it.title}</div>
                  {it.tag && <div className="text-xs text-white/80">{it.tag}</div>}
                </div>
              )}
            </div>
            <div className="absolute inset-x-0 bottom-0 p-3">
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <Button onClick={()=> setOpen({ title: it.title, tag: it.tag, img: it.src })} variant="creativePrimary" className="w-[calc(100%-1.5rem)] mx-auto block opacity-0 translate-y-2 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0 focus:opacity-100 focus:translate-y-0">I like it</Button>
            </div>
          </article>
        ))}
      </section>

      <div className="mt-6 flex justify-center">
        <a href="/creative-results" className="px-5 py-2.5 rounded-full border border-white/20 bg-zinc-800/60 hover:bg-zinc-700/60 text-sm font-semibold">View more</a>
      </div>

      {open && (
        <div className="fixed inset-0 z-[9999] grid min-h-screen place-items-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={()=>setOpen(null)} />
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl border border-white/10 shadow-[0_24px_70px_rgba(0,0,0,0.55)] backdrop-blur-xl">
            <button aria-label="Close" className="absolute top-3 right-3 z-20 h-10 w-10 rounded-full bg-white/90 text-black grid place-items-center shadow" onClick={()=>setOpen(null)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
            </button>
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-neutral-900/95 via-neutral-900/80 to-black/90" />
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(120deg,rgba(147,51,234,0.08),rgba(59,130,246,0.06))]" />
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(120%_100%_at_50%_-10%,rgba(255,255,255,0.06),transparent_45%)]" />
            <div className="absolute inset-0 -z-10 bg-[url('/images/noise.svg')] opacity-10 mix-blend-overlay" />
            <div className="p-4 sm:p-7 md:p-8">
              <header className="mb-5">
                <h3 className="text-2xl font-black leading-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-200 via-white to-pink-200">Let's Create Something Extraordinary</h3>
                <p className="text-white/85 text-sm mt-1">Tell us your vision, and we’ll craft a custom activation.</p>
              </header>
              <div className="rounded-xl bg-white/5 border border-white/10 ring-1 ring-white/10 p-3 sm:p-5 mb-5">
                <div className="flex items-center gap-3">
                  <img src={open.img} alt={open.title||'Selected'} className="h-12 w-12 rounded-lg object-cover shadow-md" />
                  <div>
                    <div className="text-white/95 font-semibold leading-snug">{open.title || 'Selected Item'}</div>
                    {open.tag && <div className="text-white/70 text-xs">Tags: {open.tag}</div>}
                  </div>
                </div>
              </div>
              <form ref={formRef}
                onSubmit={async (e)=>{
                  e.preventDefault();
                  if(sending) return;
                  {
                    const res = validateLeadBasics({ name: form.name, email: form.email, phone: form.phone });
                    if (!res.ok) { toast({ title: 'Invalid input', description: res.message, variant: 'destructive' as any }); return; }
                  }
                  setSending(true);
                  try{
                    const params = new URLSearchParams(typeof window!== 'undefined' ? window.location.search : '');
                    const eff = getEffectiveUtm();
                    await apiRequest('POST','/api/lead',{ 
                      name: form.name,
                      email: form.email,
                      phone: form.phone,
                      company: form.company,
                      eventDate: form.eventDate,
                      eventType: form.eventType,
                      guests: form.guests,
                      duration: form.duration,
                      location: form.location,
                      idea: form.idea || `I like: ${open?.title || ''}`,
                      source: 'get_ideas_modal',
                      utm_source: params.get('utm_source') || eff?.utm_source || undefined,
                      utm_medium: params.get('utm_medium') || eff?.utm_medium || undefined,
                      utm_campaign: params.get('utm_campaign') || eff?.utm_campaign || undefined,
                      utm_term: params.get('utm_term') || eff?.utm_term || undefined,
                      utm_content: params.get('utm_content') || eff?.utm_content || undefined,
                      gclid: params.get('gclid') || eff?.gclid || undefined,
                      fbclid: params.get('fbclid') || eff?.fbclid || undefined,
                    });
                    try { trackEvent('generate_lead', { form_id:'get_ideas_modal', method:'modal', value:1, currency:'USD', items:[{ item_id: open?.title, item_name: open?.title }] }); } catch {}
                    toast({ title:'Request sent', description:'We will contact you shortly.' });
                    setSent(true);
                    setForm({ name:'', email:'', phone:'', company:'', eventDate:'', eventType:'', guests:'', duration:'', location:'', idea:'' });
                  } catch(err:any){
                    toast({ title:'Failed to send', description: err?.message || 'Please try again.', variant: 'destructive' as any });
                  } finally { setSending(false); }
                }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
              >
                <label className="block"><span className="text-[11px] uppercase tracking-wide text-white/70">Full Name</span>
                  <input autoComplete="name" value={form.name} onChange={e=>upd('name', e.target.value)} className="mt-1 w-full h-12 rounded-xl bg-white/95 text-black px-4 text-base focus:outline-none focus:ring-2 focus:ring-purple-300/60" placeholder="Your Full Name"/>
                </label>
                <label className="block"><span className="text-[11px] uppercase tracking-wide text-white/70">Company (optional)</span>
                  <input autoComplete="organization" value={form.company} onChange={e=>upd('company', e.target.value)} className="mt-1 w-full h-12 rounded-xl bg-white/95 text-black px-4 text-base focus:outline-none focus:ring-2 focus:ring-purple-300/60" placeholder="Your Company"/>
                </label>
                <label className="block"><span className="text-[11px] uppercase tracking-wide text-white/70">Email</span>
                  <input type="email" autoComplete="email" value={form.email} onChange={e=>upd('email', e.target.value)} className="mt-1 w-full h-12 rounded-xl bg-white/95 text-black px-4 text-base focus:outline-none focus:ring-2 focus:ring-purple-300/60" placeholder="your@email.com"/>
                </label>
                <label className="block"><span className="text-[11px] uppercase tracking-wide text-white/70">Phone Number</span>
                  <input type="tel" inputMode="tel" autoComplete="tel" value={form.phone} onChange={e=>upd('phone', e.target.value)} className="mt-1 w-full h-12 rounded-xl bg-white/95 text-black px-4 text-base focus:outline-none focus:ring-2 focus:ring-purple-300/60" placeholder="Phone Number"/>
                </label>
                <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-1">
                  <select value={form.eventType} onChange={e=>upd('eventType', e.target.value)} className="h-12 rounded-full bg-white/95 text-black px-4 text-base focus:outline-none focus:ring-2 focus:ring-purple-300/60">
                    <option>Select Event Type</option>
                    <option>Corporate</option>
                    <option>Retail</option>
                    <option>Festival</option>
                  </select>
                  <input inputMode="numeric" value={form.guests} onChange={e=>upd('guests', e.target.value)} className="h-12 rounded-full bg-white/95 text-black px-4 text-base focus:outline-none focus:ring-2 focus:ring-purple-300/60" placeholder="Expected Guests"/>
                  <input value={form.duration} onChange={e=>upd('duration', e.target.value)} className="h-12 rounded-full bg-white/95 text-black px-4 text-base focus:outline-none focus:ring-2 focus:ring-purple-300/60" placeholder="Duration (e.g., 4 hours)"/>
                </div>
                <label className="block"><span className="text-[11px] uppercase tracking-wide text-white/70">Event Date</span>
                  <input type="date" value={form.eventDate} onChange={e=>upd('eventDate', e.target.value)} className="mt-1 w-full h-11 rounded-xl bg-white/95 text-black px-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-purple-300/60"/>
                </label>
                <div className="block"><span className="text-[11px] uppercase tracking-wide text-white/70">Event Location</span>
                  <input autoComplete="address-level1" value={form.location} onChange={e=>upd('location', e.target.value)} className="mt-1 w-full h-11 rounded-xl bg-white/95 text-black px-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-purple-300/60" placeholder="Event Location"/>
                </div>
                <label className="sm:col-span-2 block"><span className="text-[11px] uppercase tracking-wide text-white/70">Tell us more</span>
                  <textarea value={form.idea} onChange={e=>upd('idea', e.target.value)} className="mt-1 w-full min-h-[100px] rounded-xl bg-white/95 text-black p-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-purple-300/60" placeholder="Share details about your idea, goals, or event." />
                </label>
                <div className="sm:col-span-2 flex gap-3">
                  <Button type="submit" disabled={sending} variant="creativePrimary" className="flex-1">{sending? 'Sending...' : sent? 'Sent' : 'Request a Quote'}</Button>
                  <Button type="button" onClick={()=>setOpen(null)} variant="creativeSecondary" className="flex-1">Close</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function IdeaSlideCard({ tag, title, subtitle, media }: Idea) {
  return (
    <div className="group relative aspect-[3/5] w-full rounded-[34px] overflow-hidden shadow-[0_24px_70px_rgba(0,0,0,0.38)] transition-transform duration-500 ease-out will-change-transform hover:scale-[1.02] hover:-rotate-[0.6deg]">
      {media && (
        <div className="absolute inset-0 overflow-hidden">
          {media.type === 'image' ? (
            <img src={media.src} alt={title} className="w-full h-full object-cover will-change-transform transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]" />
          ) : (
            <video className="w-full h-full object-cover" src={media.src} autoPlay loop muted playsInline />
          )}
          {/* glossy sweep */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.18)_0%,transparent_28%,transparent_72%,rgba(255,255,255,0.09)_100%)] opacity-60 mix-blend-overlay transition-transform duration-700 group-hover:translate-y-[-2%]" />
          {/* stronger readability gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/0 to-black/70" />
          {/* fine stroke + ambient glow */}
          <div className="pointer-events-none absolute inset-0 ring-1 ring-white/10" />
          <div className="pointer-events-none absolute -inset-px rounded-[36px] shadow-[0_40px_120px_rgba(0,0,0,0.45)]" />
        </div>
      )}
      <div className="absolute inset-0 flex items-end p-6 md:p-7">
        <div className="space-y-1">
          <span className="inline-block text-[10px] px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/15 uppercase tracking-wide mb-2">{tag}</span>
          <div className="text-white/95 drop-shadow-[0_6px_18px_rgba(0,0,0,0.6)] text-base md:text-lg font-semibold leading-snug">{title}</div>
          <div className="text-white/80 text-xs md:text-sm mt-1 max-w-[28ch]">{subtitle}</div>
        </div>
      </div>
    </div>
  );
}

function IdeaTile({ tag, title, subtitle, media }: Idea) {
  return (
    <div className="group relative rounded-3xl border border-white/10 bg-white/5 overflow-hidden transition-all duration-500 hover:border-white/20 hover:bg-white/10 hover:shadow-[0_18px_60px_rgba(0,0,0,0.35)] hover:-translate-y-[2px] min-h-[360px] flex flex-col">
      {media && (
        <div className="relative h-64 md:h-72 overflow-hidden">
          {media.type === 'image' ? (
            <img src={media.src} alt={title} className="w-full h-full object-cover will-change-transform transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]" />
          ) : (
            <video className="w-full h-full object-cover" src={media.src} autoPlay loop muted playsInline />
          )}
          {/* glossy sweep */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.18)_0%,transparent_28%,transparent_72%,rgba(255,255,255,0.09)_100%)] opacity-60 mix-blend-overlay transition-transform duration-700 group-hover:translate-y-[-2%]" />
          {/* readability gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/12 via-transparent to-black/50" />
          {/* fine ring on image edge */}
          <div className="pointer-events-none absolute inset-0 ring-1 ring-white/10" />
          <span className="absolute top-3 left-3 text-[10px] px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/15 uppercase tracking-wide">{tag}</span>
        </div>
      )}
      <div className="p-6 flex-1 flex flex-col justify-end gap-2">
        <div className="text-base md:text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">{title}</div>
        <div className="text-white/80 text-sm leading-relaxed max-w-[36ch]">{subtitle}</div>
      </div>
    </div>
  );
}
