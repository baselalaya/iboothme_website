import Navigation from "@/components/navigation";
import FooterSection from "@/components/footer-section";
import Seo from "@/components/seo";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { applySeoToHead, fetchSeoConfig } from "@/lib/seoOverride";
import Breadcrumbs from "@/components/breadcrumbs";
import { apiRequest } from "@/lib/queryClient";
import { getEffectiveUtm } from "@/lib/utm";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/ga";

type Clip = { title: string; tag: string; src: string; poster?: string };

const allClips: Clip[] = [
  { title:'AI Parallax', tag:'Effects', src:'/videos/ai-parallax-new.mp4', poster:'/images/studio-ai-example.jpg' },
  { title:'Avatar Demo', tag:'Avatars', src:'/videos/ai-avatar-new.mp4', poster:'/images/alex.jpg' },
  { title:'Lighting', tag:'Technology', src:'/videos/ai-lighting.mp4', poster:'/images/ai-lighting-poster.jpg' },
  { title:'Harcout Style', tag:'Effects', src:'/videos/ai-harcourt.mp4', poster:'/images/ai-pro-photo-poster.jpg' },
];

const filters = ['All','Effects','Avatars','Technology'];

export default function VideoHubPage(){
  useEffect(() => { (async () => { const cfg = await fetchSeoConfig('/video-hub'); if (cfg) applySeoToHead(cfg); })(); }, []);
  const [active, setActive] = useState('All');
  const items = useMemo(()=> active==='All'? allClips : allClips.filter(c=>c.tag===active), [active]);
  const [playing, setPlaying] = useState<Clip|null>(null);
  const [open, setOpen] = useState<{title:string; tag:string; img?:string}|null>(null);
  const { toast } = useToast?.() || { toast: (args:any)=>console.log(args) } as any;
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name:'', email:'', phone:'', company:'', eventType:'', guests:'', duration:'', eventDate:'', location:'', idea:'' });
  const formRef = useRef<HTMLFormElement|null>(null);
  const upd = <K extends keyof typeof form>(k:K, v:string) => setForm(f=>({ ...f, [k]: v }));

  return (
    <div className="relative min-h-screen text-white">
      <Seo title="Video Hub" description="Watch our AI activations and technology in action" canonical="/video-hub" />
      <Navigation />
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-10 md:py-14">
        <Breadcrumbs items={[{ label:'Get Ideas', href:'/get-ideas' }, { label:'Video Hub' }]} />
        <header className="text-center mb-8 md:mb-10">
          <h1 className="text-3xl md:text-5xl font-black">Video Hub</h1>
          <p className="text-white/80 mt-2">Explore highlight videos from real activations and demos</p>
        </header>

        <div className="mb-8 flex flex-wrap gap-3 justify-center">
          {filters.map(f => (
            <button key={f} onClick={()=>setActive(f)} className={`px-4 py-2 rounded-full border text-sm font-semibold transition ${active===f? 'bg-white text-black border-white' : 'bg-white/5 text-white border-white/20 hover:bg-white/10'}`}>{f}</button>
          ))}
        </div>

        {/* Grid layout and card styling aligned with AI Effects */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((c,i)=> (
            <article key={i} className="overflow-hidden rounded-2xl bg-white/5 text-white border border-white/10 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="relative aspect-video bg-black">
                <video className="absolute inset-0 w-full h-full object-cover" src={c.src} poster={c.poster} muted playsInline />
                <button onClick={()=>setPlaying(c)} className="absolute inset-0 grid place-items-center bg-black/0 hover:bg-black/20 transition-colors">
                  <span className="inline-flex items-center justify-center h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-white/90 text-black shadow-lg">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M8 5v14l11-7z"/></svg>
                  </span>
                </button>
              </div>
              <div className="px-4 pt-4 pb-3">
                <h3 className="font-semibold text-base md:text-lg leading-tight text-white/90">{c.title}</h3>
                <p className="text-white/70 text-xs md:text-sm mt-1">Tag: {c.tag}</p>
              </div>
              <div className="px-4 pb-4">
                <Button variant="creativePrimary" className="w-full" onClick={()=>setOpen({ title:c.title, tag:c.tag, img:c.poster })}>I like it</Button>
              </div>
            </article>
          ))}
        </section>
      </main>
      <FooterSection />

      {playing && createPortal(
        <div className="fixed inset-0 z-[9999] grid min-h-screen place-items-center p-4">
          <div className="absolute inset-0 bg-black/80" onClick={()=>setPlaying(null)} />
          <div className="relative w-full max-w-5xl">
            <video className="w-full aspect-video rounded-xl border border-white/15 bg-black" src={playing.src} controls autoPlay playsInline />
            <button aria-label="Close" className="absolute -top-3 -right-3 h-10 w-10 rounded-full bg-white/90 text-black grid place-items-center" onClick={()=>setPlaying(null)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
            </button>
          </div>
        </div>, document.body)
      }

      {open && createPortal(
        <div className="fixed inset-0 z-[9999] grid min-h-screen place-items-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={()=>setOpen(null)} />
          <div className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl sm:rounded-3xl border border-white/10 shadow-[0_24px_70px_rgba(0,0,0,0.55)] backdrop-blur-xl">
            <button aria-label="Close" className="absolute top-3 right-3 z-20 h-10 w-10 rounded-full bg-white/90 text-black grid place-items-center shadow" onClick={()=>setOpen(null)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
            </button>
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-neutral-900/95 via-neutral-900/80 to-black/90" />
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(120deg,rgba(147,51,234,0.08),rgba(59,130,246,0.06))]" />
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(120%_100%_at_50%_-10%,rgba(255,255,255,0.06),transparent_45%)]" />
            <div className="p-4 sm:p-6">
              <header className="mb-4">
                <h3 className="text-xl sm:text-2xl font-black leading-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-200 via-white to-pink-200">Let's Create Something Extraordinary</h3>
                <p className="text-white/85 text-sm mt-1">Tell us your vision, and we’ll craft a custom activation.</p>
              </header>
              <div className="rounded-xl bg-white/5 border border-white/10 ring-1 ring-white/10 p-3 sm:p-4 mb-4">
                <div className="flex items-center gap-3">
                  {open.img ? (<img src={open.img} alt={open.title} className="h-12 w-12 rounded-lg object-cover shadow-md" />) : null}
                  <div>
                    <div className="text-white/95 font-semibold leading-snug">{open.title}</div>
                    <div className="text-white/70 text-xs">Tags: {open.tag}</div>
                  </div>
                </div>
              </div>
              <form ref={formRef} onSubmit={async (e)=>{
                e.preventDefault();
                if (!form.name.trim() || !form.email.trim()) { toast({ title:'Missing info', description:'Please provide your name and email.' }); return; }
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { toast({ title:'Invalid email', description:'Please enter a valid email address.' }); return; }
                if (form.phone && !/^\+?[0-9()\-\s]{7,}$/.test(form.phone)) { toast({ title:'Invalid phone', description:'Please enter a valid phone number.' }); return; }
                try {
                  setSending(true);
                  const params = new URLSearchParams(window.location.search);
                  const eff = getEffectiveUtm?.();
                  const packed = { ideaTitle: open?.title, ideaTag: open?.tag, ideaNotes: form.idea, eventDate: form.eventDate, eventType: form.eventType, guests: form.guests, duration: form.duration, location: form.location };
                  await apiRequest('POST','/api/leads', {
                    name: form.name.trim(),
                    email: form.email.trim(),
                    phone: form.phone.trim() || undefined,
                    company: form.company.trim() || undefined,
                    product: open?.title,
                    message: `[extra] ${JSON.stringify(packed)}`,
                    _hp: (form as any)._hp,
                    source_path: window.location.pathname,
                    utm_source: params.get('utm_source') || eff?.utm_source || undefined,
                    utm_medium: params.get('utm_medium') || eff?.utm_medium || undefined,
                    utm_campaign: params.get('utm_campaign') || eff?.utm_campaign || undefined,
                    utm_term: params.get('utm_term') || eff?.utm_term || undefined,
                    utm_content: params.get('utm_content') || eff?.utm_content || undefined,
                    gclid: params.get('gclid') || eff?.gclid || undefined,
                    fbclid: params.get('fbclid') || eff?.fbclid || undefined,
                  });
                  try { trackEvent('generate_lead', { form_id:'video_hub_modal', method:'modal', value:1, currency:'USD', items:[{ item_id: open?.title, item_name: open?.title }] }); } catch {}
                  toast({ title:'Request sent', description:'We will contact you shortly.' });
                  setSent(true);
                  setForm({ name:'', email:'', phone:'', company:'', eventType:'', guests:'', duration:'', eventDate:'', location:'', idea:'', _hp: '' } as any);
              } catch(err:any){
                  toast({ title:'Failed to send', description: err?.message || 'Please try again.' });
                } finally { setSending(false); }
              }} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Honeypot */}
                <div style={{ position: 'absolute', left: '-10000px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }} aria-hidden>
                  <label htmlFor="siteurl">Site URL</label>
                  <input id="siteurl" name="siteurl" autoComplete="off" value={(form as any)._hp || ''} onChange={(e)=>setForm((f:any)=>({ ...f, _hp: e.target.value }))} />
                </div>
                <label className="block">
                  <span className="text-[11px] uppercase tracking-wide text-white/70">Full Name</span>
                  <input autoComplete="name" value={form.name} onChange={(e)=>upd('name', e.target.value)} className="mt-1 w-full h-11 rounded-xl bg-white/95 text-black px-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-purple-300/60" placeholder="Your Full Name" />
                </label>
                <label className="block">
                  <span className="text-[11px] uppercase tracking-wide text-white/70">Company (optional)</span>
                  <input autoComplete="organization" value={form.company} onChange={(e)=>upd('company', e.target.value)} className="mt-1 w-full h-11 rounded-xl bg-white/95 text-black px-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-purple-300/60" placeholder="Your Company" />
                </label>
                <label className="block">
                  <span className="text-[11px] uppercase tracking-wide text-white/70">Email</span>
                  <input type="email" autoComplete="email" value={form.email} onChange={(e)=>upd('email', e.target.value)} className="mt-1 w-full h-11 rounded-xl bg-white/95 text-black px-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-purple-300/60" placeholder="your@email.com" />
                </label>
                <label className="block">
                  <span className="text-[11px] uppercase tracking-wide text-white/70">Phone Number</span>
                  <input type="tel" inputMode="tel" autoComplete="tel" value={form.phone} onChange={(e)=>upd('phone', e.target.value)} className="mt-1 w-full h-11 rounded-xl bg-white/95 text-black px-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-purple-300/60" placeholder="Phone Number" />
                </label>
                {/* Triplet row */}
                <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3 mt-1">
                  <select value={form.eventType} onChange={(e)=>upd('eventType', e.target.value)} className="h-11 rounded-full bg-white/95 text-black px-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-purple-300/60">
                    <option>Select Event Type</option>
                    <option>Corporate</option>
                    <option>Retail</option>
                    <option>Festival</option>
                  </select>
                  <input inputMode="numeric" value={form.guests} onChange={(e)=>upd('guests', e.target.value)} className="h-11 rounded-full bg-white/95 text-black px-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-purple-300/60" placeholder="Expected Guests" />
                  <input value={form.duration} onChange={(e)=>upd('duration', e.target.value)} className="h-11 rounded-full bg-white/95 text-black px-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-purple-300/60" placeholder="Duration (e.g., 4 hours)" />
                </div>
                {/* Date + Location */}
                <label className="block">
                  <span className="text-[11px] uppercase tracking-wide text-white/70">Event Date</span>
                  <input type="date" value={form.eventDate} onChange={(e)=>upd('eventDate', e.target.value)} className="mt-1 w-full h-11 rounded-xl bg-white/95 text-black px-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-purple-300/60" />
                </label>
                <div className="block">
                  <span className="text-[11px] uppercase tracking-wide text-white/70">Event Location</span>
                  <input autoComplete="address-level1" value={form.location} onChange={(e)=>upd('location', e.target.value)} className="mt-1 w-full h-11 rounded-xl bg-white/95 text-black px-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-purple-300/60" placeholder="Event Location" />
                </div>
                {/* Idea */}
                <div className="sm:col-span-2">
                  <label className="text-[11px] uppercase tracking-wide text-white/70">Got a Bold Idea?</label>
                  <textarea value={form.idea} onChange={(e)=>upd('idea', e.target.value)} className="mt-1 w-full h-28 rounded-xl bg-white/95 text-black px-3 py-2 text-[15px] focus:outline-none focus:ring-2 focus:ring-purple-300/60" placeholder="Describe your idea..." />
                </div>

                {sent ? (
                  <div className="sm:col-span-2 mt-5 rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-4 text-emerald-200">
                    Thank you! Your request has been received. We’ll get back to you shortly.
                  </div>
                ) : null}
              </form>
              <div className="mt-5 pt-4 border-t border-white/10 -mx-4 sm:-mx-6 w-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 w-full px-4 sm:px-6">
                  <div className="sm:col-start-1 sm:col-end-2">
                    <button type="button" onClick={()=>setOpen(null)} className="w-full px-4 py-2 rounded-full border border-white/25 text-white/90 hover:bg-white/10">
                      {sent ? 'Close' : 'Cancel'}
                    </button>
                  </div>
                  {!sent && (
                    <div className="sm:col-start-2 sm:col-end-3">
                      <Button type="button" onClick={()=>formRef.current?.requestSubmit()} disabled={sending} variant="creativePrimary" className="w-full rounded-full px-6">
                        {sending? 'Sending…' : 'Send Request'}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>, document.body)
      }
    </div>
  );
}
