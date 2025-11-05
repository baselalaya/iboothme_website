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
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { getEffectiveUtm } from "@/lib/utm";
import { trackEvent } from "@/lib/ga";
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
    <video
      ref={ref}
      src={src}
      className="w-full h-auto"
      muted={!reduced}
      playsInline
      loop={!reduced}
      controls={reduced}
      preload="metadata"
      poster={poster}
    />
  );
}

export default function GetIdeasPage() {
  useEffect(() => { (async () => { const cfg = await fetchSeoConfig('/get-ideas'); if (cfg) applySeoToHead(cfg); })(); }, []);
  const [activeFilter, setActiveFilter] = useState<string>("All Effects");
  const featured: Idea[] = [
    { tag: 'AI Photo Effect', title: 'AI Portrait Enhancement', subtitle: 'Professional studio-quality portraits with AI-powered lighting and skin enhancement.', media: { type: 'image', src: '/images/studio-ai-example.jpg' } },
    { tag: 'AI Video Effect', title: 'Cinematic Video Transform', subtitle: 'Transform photos into dynamic cinematic video sequences with AI motion.', media: { type: 'video', src: '/videos/ai-parallax-new.mp4' } },
  ];

  const gridAll: Idea[] = [
    { tag: 'AI Photo Effect', title: 'AI Portrait Enhancement', subtitle: 'AI Portrait Enhancement', media: { type: 'image', src: '/images/studio-ai-example.jpg' } },
    { tag: 'AI Video Effect', title: 'Cinematic Video Transform', subtitle: 'Cinematic Video Transform', media: { type: 'video', src: '/videos/1.mp4' } },
    { tag: 'AI Music Generator', title: 'Brand Music Generator', subtitle: 'Brand Music Generator', media: { type: 'video', src: '/videos/2.mp4' } },
    { tag: 'AI Photo Effect', title: 'Virtual Background Magic', subtitle: 'Virtual Background Magic', media: { type: 'image', src: '/images/alex.jpg' } },
    { tag: 'Interactive Experience', title: 'Interactive Gaming Hub', subtitle: 'Interactive Gaming Hub', media: { type: 'video', src: '/videos/3.mp4' } },
    { tag: 'Creative AI Tool', title: 'Sketch to Art AI', subtitle: 'Sketch to Art AI', media: { type: 'image', src: '/images/robin.jpg' } },
    { tag: 'AI Effect', title: 'AI Face Filters', subtitle: 'AI Face Filters', media: { type: 'video', src: '/videos/4.mp4' } },
    { tag: 'Motion Graphics Video', title: 'Motion Graphics Video', subtitle: 'Motion Graphics Video', media: { type: 'video', src: '/videos/ai-avatar.mp4' } },
    { tag: 'AI Video Generator', title: 'Brand Voice AI', subtitle: 'Brand Voice AI', media: { type: 'video', src: '/videos/ai-tech.mp4' } },
  ];

  const filters = ['All Effects','AI Photo','AI Video','AI Music','Interactive','Creative'];

  const grid = useMemo(() => {
    if (activeFilter === 'All Effects') return gridAll;
    const map: Record<string, string[]> = {
      'AI Photo': ['AI Photo Effect'],
      'AI Video': ['AI Video Effect','AI Video Generator','Motion Graphics Video'],
      'AI Music': ['AI Music Generator'],
      'Interactive': ['Interactive Experience'],
      'Creative': ['Creative AI Tool','AI Effect'],
    };
    const tags = map[activeFilter] || [];
    return gridAll.filter(i => tags.includes(i.tag));
  }, [activeFilter]);

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
        <section className="relative w-full overflow-hidden min-h-[70vh] text-center mb-14 rounded-[28px] flex items-center justify-center">
          <div className="absolute inset-0 -z-10 opacity-30 overflow-hidden">
            <video className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.78vh] h-[100vh] md:w-[177.78vw] md:h-[56.25vw] max-w-none" autoPlay muted loop playsInline preload="metadata">
              <source src="/videos/get-ideas.mp4" />
            </video>
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,1)_0%,rgba(0,0,0,0.85)_10%,rgba(0,0,0,0)_40%,rgba(0,0,0,0)_60%,rgba(0,0,0,0.85)_90%,rgba(0,0,0,1)_100%)]" />
            <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_82%)]" />
          </div>
          <div className="max-w-5xl mx-auto px-6 py-16 md:py-20 lg:py-24 min-h-[70vh] flex flex-col items-center justify-center">
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
          <div className="text-center mb-8 opacity-60">⸻</div>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">Inside the Ideas</h2>
          <p className="text-white/80 text-center max-w-2xl mx-auto mb-6">Real project outcomes and successful brand activations</p>

          {/* Filter tabs (mirroring creative-results) */}
          <IdeasFilterGrid />
        </section>

        {/* Ideas Grid mapped to cards in screenshot */}
        <section className="max-w-7xl mx-auto px-6 mb-12">
          <div className="text-center mb-8 opacity-60">⸻</div>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">Inside the Ideas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'AI Effects', desc: 'Ready-made AI effects that create instant impact in brand activations and events.', cta: 'Explore Effects', href: '/ai-effects' },
              { title: 'Creative Results', desc: 'See the final results of projects we\'ve delivered to help you visualize possibilities.', cta: 'View Results',href: '/creative-results'  },
              { title: 'Video Hub', desc: 'Watch videos showing how our innovations engage during events and brand activations.', cta: 'Watch Videos' ,href: '/video-hub' },
              { title: 'Insights & Inspiration', desc: 'Blogs that unpack events we\'ve delivered and the ideas driving them.', cta: 'Read Insights' ,href: '/insights'  },
              { title: 'Newsletter', desc: 'Your monthly round-up of new innovations and trends we\'ve applied in events.', cta: 'Browse Archive' },
              { title: 'Concepts', desc: 'Fresh monthly ideas to help you stand out in pitches and win clients', cta: 'Explore Products' },
            ].map((item, idx) => (
              <a key={idx} href={item.href || '#'} className="relative rounded-3xl border border-white/10 bg-white/5 p-6 md:p-7 flex flex-col justify-between shadow-[0_18px_60px_rgba(0,0,0,0.35)] hover:bg-white/10 transition-colors">
                <div>
                  <h3 className="text-lg md:text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-white/80 text-sm md:text-base leading-relaxed">{item.desc}</p>
                </div>
                <div className="pt-4">
                  <button className="text-sm md:text-base text-white font-semibold inline-flex items-center gap-2 opacity-90 hover:opacity-100">
                    {item.cta}
                    <span aria-hidden>›</span>
                  </button>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Ideas Statistics */}
        <section className="max-w-6xl mx-auto px-6 pb-8 md:pb-12 grid grid-cols-1 sm:grid-cols-4 gap-6">
          {[
            { k: "150+", v: "AI Effects" },
            { k: "50+", v: "Interactive Games" },
            { k: "25+", v: "Music Generators" },
            { k: "∞", v: "Custom Concepts" },
          ].map((s, i) => (
            <div key={i} className="relative rounded-3xl lg:rounded-[2.5rem] border border-white/10 bg-white/5 p-10 text-center overflow-hidden transition-all duration-500 hover:bg-gradient-to-br hover:from-white/10 hover:to-white/5 hover:border-white/20">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120px_60px_at_50%_0%,rgba(255,255,255,0.12),transparent)]" />
              <div className="text-3xl md:text-4xl font-black mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">{s.k}</div>
              <div className="text-sm md:text-base text-white/70 tracking-wide uppercase">{s.v}</div>
            </div>
          ))}
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
              <a href="/creative-results">View Results</a>
            </Button>
            <Button asChild variant="creativeSecondary" size="lg" className="w-full sm:w-auto">
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
  type Item = { id: string; type: 'image'|'video'; src: string; poster?: string; title?: string; tag?: string };
  const demo: Item[] = [
    { id:'1', type:'image', src:'/images/ai-effects-24-87a3ecd1-8012-4fff-b172-0fd869fb98d0.jpg', title:'Lego Style', tag:'AI Photo' },
    { id:'2', type:'image', src:'/images/ai-effects-25-34e87f0a-8b2e-4762-92fc-12aa5c136feb.jpg', title:'Illustration', tag:'AI Photo' },
    { id:'3', type:'video', src:'/videos/ai-parallax-new.mp4', poster:'/images/posters/ai-parallax.jpg', title:'Parallax', tag:'AI Video' },
    { id:'4', type:'image', src:'/images/ai-effects-10-6697ad3c-9d76-439a-8b77-f4327ef98124.jpg', title:'Zombie', tag:'AI Photo' },
    { id:'5', type:'image', src:'/images/ai-effects-14-e92e477d-7a05-4303-9270-f2c302c099a8.jpg', title:'Simpson', tag:'AI Photo' },
    { id:'6', type:'video', src:'/videos/ai-avatar-new.mp4', poster:'/images/posters/ai-avatar.jpg', title:'Avatar', tag:'AI Video' },
    { id:'7', type:'image', src:'/images/ai-effects-12-abc87399-46e6-4499-94a5-24099adc2d0f.jpg', title:'GTA', tag:'AI Photo' },
    { id:'8', type:'image', src:'/images/ai-effects-05-a204058a-88d8-4042-8b34-42528d195155.jpeg', title:'Christmas', tag:'AI Photo' },
    { id:'9', type:'image', src:'/images/ai-effects-18-4d0d7820-be91-4c28-a548-be1941e53889.jpg', title:'Portrait', tag:'AI Photo' },
  ];

  const frFilters = ['All','AI Photo','AI Video','Experimental'];
  const items = useMemo(()=> active==='All' ? demo : demo.filter(i => i.tag===active), [active]);
  const eight = items.slice(0, 6);

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6">
        {frFilters.map(f => (
          <button key={f} onClick={()=>setActive(f)} className={`px-4 py-2 rounded-full border text-sm font-semibold transition ${active===f? 'bg-zinc-900 text-white border-white' : 'bg-zinc-800/60 text-white border-white/20 hover:bg-zinc-700/60'}`}>{f}</button>
        ))}
      </div>

      <section className="[column-fill:_balance] sm:columns-2 lg:columns-3 gap-5 space-y-5">
        {eight.map((it) => (
          <article key={it.id} className="group break-inside-avoid rounded-3xl overflow-hidden bg-zinc-900/70 border border-white/10 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(0,0,0,0.35)] hover:border-white/20">
            <div className="relative">
              {it.type==='image' ? (
                <img src={it.src} alt={it.title||'Creative Result'} className="w-full h-auto object-cover will-change-transform transition-transform duration-700 ease-out group-hover:scale-[1.03]" loading="lazy" />
              ) : (
                <SmartVideo src={it.src} poster={it.poster}
                />
              )}
              {(it.title || it.tag) && (
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 via-black/10 to-transparent">
                  <div className="text-sm font-semibold leading-tight">{it.title}</div>
                  {it.tag && <div className="text-xs text-white/80">{it.tag}</div>}
                </div>
              )}
            </div>
            <div className="p-3">
              <Button onClick={()=> setOpen({ title: it.title, tag: it.tag, img: it.src })} variant="creativePrimary" className="w-full">I like it</Button>
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
