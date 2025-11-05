import Navigation from "@/components/navigation";
import FooterSection from "@/components/footer-section";
import Seo from "@/components/seo";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { applySeoToHead, fetchSeoConfig } from "@/lib/seoOverride";
import Breadcrumbs from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { getEffectiveUtm } from "@/lib/utm";
import { trackEvent } from "@/lib/ga";
import { validateLeadBasics } from "@/lib/validation";

type Item = {
  id: string;
  type: 'image'|'video';
  src: string;
  title?: string;
  tag?: string;
  w?: number; // hint for aspect ratio sizing
  h?: number;
};

const demo: Item[] = [
  { id:'1', type:'image', src:'/images/ai-effects-24-87a3ecd1-8012-4fff-b172-0fd869fb98d0.jpg', title:'Lego Style', tag:'AI Photo', w:3, h:4 },
  { id:'2', type:'image', src:'/images/ai-effects-25-34e87f0a-8b2e-4762-92fc-12aa5c136feb.jpg', title:'Illustration', tag:'AI Photo', w:3, h:4 },
  { id:'3', type:'video', src:'/videos/ai-parallax-new.mp4', title:'Parallax', tag:'Video', w:9, h:16 },
  { id:'4', type:'image', src:'/images/ai-effects-10-6697ad3c-9d76-439a-8b77-f4327ef98124.jpg', title:'Zombie', tag:'AI Photo', w:4, h:5 },
  { id:'5', type:'image', src:'/images/ai-effects-14-e92e477d-7a05-4303-9270-f2c302c099a8.jpg', title:'Simpson', tag:'AI Photo', w:3, h:4 },
  { id:'6', type:'video', src:'/videos/ai-avatar-new.mp4', title:'Avatar', tag:'Video', w:9, h:16 },
  { id:'7', type:'image', src:'/images/ai-effects-12-abc87399-46e6-4499-94a5-24099adc2d0f.jpg', title:'GTA', tag:'AI Photo', w:3, h:4 },
  { id:'8', type:'image', src:'/images/ai-effects-05-a204058a-88d8-4042-8b34-42528d195155.jpeg', title:'Christmas', tag:'AI Photo', w:4, h:5 },
  { id:'9', type:'image', src:'/images/ai-effects-18-4d0d7820-be91-4c28-a548-be1941e53889.jpg', title:'Portrait', tag:'AI Photo', w:3, h:4 },
];

const filters = ['All','AI Photo','Video','Experimental'];

export default function CreativeResultsPage() {
  useEffect(() => { (async () => { const cfg = await fetchSeoConfig('/creative-results'); if (cfg) applySeoToHead(cfg); })(); }, []);
  const [active, setActive] = useState('All');
  const items = useMemo(()=> active==='All' ? demo : demo.filter(i => i.tag===active), [active]);
  const [open, setOpen] = useState<{ title?: string; tag?: string; img?: string }|null>(null);
  const { toast } = useToast?.() || ({ toast: (args: any) => console.log(args) } as any);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    eventDate: "",
    eventType: "",
    guests: "",
    duration: "",
    location: "",
    idea: "",
  });
  const [sent, setSent] = useState(false);
  function upd<K extends keyof typeof form>(k: K, v: string) { setForm(f => ({...f, [k]: v})); }
  const formRef = useRef<HTMLFormElement|null>(null);
  useEffect(()=>{ if(!open) return; const onKey=(e:KeyboardEvent)=>{ if(e.key==='Escape') setOpen(null); }; document.addEventListener('keydown', onKey); return ()=>document.removeEventListener('keydown', onKey); },[open]);

  return (
    <div className="relative min-h-screen text-white">
      <Seo title="Creative Results" description="Real project outcomes and successful brand activations" canonical="/creative-results" />
      <Navigation />
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-10 md:py-14">
        <Breadcrumbs items={[{ label: 'Get Ideas', href: '/get-ideas' }, { label: 'Creative Results' }]} />
        <header className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl md:text-5xl font-black text-white">Creative Results</h1>
          <p className="text-white/80 mt-2">Real project outcomes and successful brand activations</p>
        </header>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6">
          {filters.map(f => (
            <button key={f} onClick={()=>setActive(f)} className={`px-4 py-2 rounded-full border text-sm font-semibold transition ${active===f? 'bg-zinc-900 text-white border-white' : 'bg-zinc-800/60 text-white border-white/20 hover:bg-zinc-700/60'}`}>{f}</button>
          ))}
        </div>

        {/* Masonry layout using CSS columns */}
        <section className="[column-fill:_balance] sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {items.map((it) => (
            <article key={it.id} className="break-inside-avoid rounded-2xl overflow-hidden bg-zinc-900/80 border border-white/10 backdrop-blur-sm">
              <div className="relative">
                {it.type==='image' ? (
                  <img src={it.src} alt={it.title||'Creative Result'} className="w-full h-auto object-cover" loading="lazy" />
                ) : (
                  <video className="w-full h-auto" src={it.src} autoPlay loop muted playsInline />
                )}
              </div>
              {(it.title || it.tag) && (
                <div className="px-3 py-2 bg-zinc-900/90 text-white border-t border-white/10">
                  <div className="text-sm font-semibold text-white">{it.title}</div>
                  <div className="text-xs text-white/70">{it.tag}</div>
                </div>
              )}
              <div className="p-3">
                <Button onClick={()=> setOpen({ title: it.title, tag: it.tag, img: it.src })} variant="creativePrimary" className="w-full">I like it</Button>
              </div>
            </article>
          ))}
        </section>
        {open && createPortal(
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
                {open && (
                  <div className="rounded-xl bg-white/5 border border-white/10 ring-1 ring-white/10 p-3 sm:p-5 mb-5">
                    <div className="flex items-center gap-3">
                      <img src={open.img} alt={open.title||'Selected'} className="h-12 w-12 rounded-lg object-cover shadow-md" />
                      <div>
                        <div className="text-white/95 font-semibold leading-snug">{open.title || 'Selected Item'}</div>
                        {open.tag && <div className="text-white/70 text-xs">Tags: {open.tag}</div>}
                      </div>
                    </div>
                  </div>
                )}
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
                        source: 'creative_results_modal',
                        utm_source: params.get('utm_source') || eff?.utm_source || undefined,
                        utm_medium: params.get('utm_medium') || eff?.utm_medium || undefined,
                        utm_campaign: params.get('utm_campaign') || eff?.utm_campaign || undefined,
                        utm_term: params.get('utm_term') || eff?.utm_term || undefined,
                        utm_content: params.get('utm_content') || eff?.utm_content || undefined,
                        gclid: params.get('gclid') || eff?.gclid || undefined,
                        fbclid: params.get('fbclid') || eff?.fbclid || undefined,
                      });
                      try { trackEvent('generate_lead', { form_id:'creative_results_modal', method:'modal', value:1, currency:'USD', items:[{ item_id: open?.title, item_name: open?.title }] }); } catch {}
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
                  <div className="sm:col-span-2"><label className="text-[11px] uppercase tracking-wide text-white/70">Got a Bold Idea?</label>
                    <textarea value={form.idea} onChange={e=>upd('idea', e.target.value)} className="mt-1 w-full h-32 rounded-xl bg-white/95 text-black px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-purple-300/60" placeholder="Describe your idea..."/>
                  </div>
                  {sent ? (<div className="mt-5 rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-4 text-emerald-200">Thank you! Your request has been received. We’ll get back to you shortly.</div>) : null}
                </form>
                <div className="mt-5 pt-4 border-t border-white/10 -mx-4 sm:-mx-6 w-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 w-full px-4 sm:px-6">
                    <div>
                      <button type="button" onClick={()=>setOpen(null)} className="w-full px-4 py-2 rounded-full border border-white/25 text-white/90 hover:bg-white/10">{sent? 'Close':'Cancel'}</button>
                    </div>
                    {!sent && (
                      <div>
                        <Button type="button" onClick={()=>formRef.current?.requestSubmit()} disabled={sending} variant="creativePrimary" className="w-full rounded-full px-6">{sending? 'Sending…':'Send Request'}</Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>, document.body)}
      </main>
      <FooterSection />
    </div>
  );
}
