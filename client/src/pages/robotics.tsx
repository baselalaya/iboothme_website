import Navigation from "@/components/navigation";
import { useEffect, useRef, useState } from 'react';
import { applySeoToHead, fetchSeoConfig } from "@/lib/seoOverride";
import Seo from "@/components/seo";
import FooterSection from "@/components/footer-section";
import { Button } from "@/components/ui/button";
import { createPortal } from "react-dom";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { getEffectiveUtm } from "@/lib/utm";
import { validateLeadBasics } from "@/lib/validation";
import CTAGroup from "@/components/ui/cta-group";
import { trackEvent } from "@/lib/ga";
import { gtmEvent } from "@/lib/gtm";
import { motion } from "framer-motion";
import {
  Shirt,
  Users,
  MessageSquare,
  Camera,
  Cog,
  Mail,
  Megaphone,
  Truck,
} from "lucide-react";

export default function RoboticsPage() {
  useEffect(() => { (async () => { const cfg = await fetchSeoConfig('/robotics'); if (cfg) applySeoToHead(cfg); })(); }, []);
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [openVideo, setOpenVideo] = useState(false);
  const [sent, setSent] = useState(false);
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
  const { toast } = useToast?.() || ({ toast: (args: any) => console.log(args) } as any);
  const formRef = useRef<HTMLFormElement|null>(null);
  const mountedAtRef = useRef<number>(Date.now());
  useEffect(() => { if (!open) return; const onKey = (e: KeyboardEvent)=>{ if (e.key==='Escape') setOpen(false); }; document.addEventListener('keydown', onKey); return ()=>document.removeEventListener('keydown', onKey); }, [open]);
  return (
    <div className="relative min-h-screen text-white">
      <Seo
        title="Robotics for Events"
        description="Robotic experiences and interactive activations that attract, engage, and delight audiences."
        canonical="/robotics"
        ogImage="/images/robotics-talia.png"
        keywords={["robotics", "event robots", "interactive activations"]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Robotics",
          description: "Robotic experiences for events.",
          provider: { "@type": "Organization", name: "iboothme" }
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_50%_at_50%_0%,rgba(112,66,210,0.12),transparent_60%),radial-gradient(60%_40%_at_80%_100%,rgba(34,212,253,0.10),transparent_60%)]"
      />
      <Navigation />
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="relative w-full overflow-hidden min-h-[60vh] sm:min-h-[70vh] text-center mb-0 flex items-center justify-center">
          <div className="absolute inset-0 -z-10 opacity-40">
            <video
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              poster="/images/studio-ai-example.jpg"
            >
              <source src="/videos/robotics.mp4" type="video/mp4" />
            </video>
            {/* overlays: standardized to match inner pages */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,1)_0%,rgba(0,0,0,0.85)_10%,rgba(0,0,0,0)_40%,rgba(0,0,0,0)_60%,rgba(0,0,0,0.85)_90%,rgba(0,0,0,1)_100%)]" />
            <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_82%)]" />
          </div>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24 lg:py-28 min-h-[60vh] sm:min-h-[70vh] flex flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2 rounded-full border border-white/15 bg-white/10 backdrop-blur mb-4 sm:mb-6"
            >
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-sm font-semibold tracking-wide uppercase">
                Robotics Innovation
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 }}
              className="text-3xl sm:text-5xl md:text-6xl font-black mt-1 gradient-text leading-tight"
            >
              Meet TALIA.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="text-lg sm:text-xl md:text-2xl text-white/85 mt-2"
            >
              The robot everyone wants to meet.

            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="max-w-3xl mx-auto mt-4 sm:mt-6 text-white/80 px-2"
            >
TALIA is a next-gen humanoid AI, a true crowd magnet and online buzz creator. She holds natural conversations, represents your brand, shares product knowledge, and builds real connections with audiences. Your Brand. Your Audience. Your TALIA.
            </motion.p>
            <motion.p><b>Your Story. Your Spotlight. Your TALIA.</b></motion.p>
            <CTAGroup breakpoint="lg" className="mt-6 sm:mt-8 w-full">
              <Button variant="creativePrimary" size="lg" className="w-full lg:w-auto text-base sm:text-lg py-6" onClick={()=>{ try { trackEvent('select_promotion', { creative_name: 'robotics_hero', promotion_name: 'reserve_talia_now' }); } catch {} setOpen(true); setSent(false); }}>
                Reserve Talia Now!

              </Button>
              <Button variant="creativeSecondary" size="lg" className="w-full lg:w-auto text-base sm:text-lg py-6" onClick={()=>{ try { trackEvent('select_promotion', { creative_name: 'robotics_hero', promotion_name: 'schedule_demo' }); } catch {} setOpenVideo(true); }}>
                Watch Demo
              </Button>
            </CTAGroup>
            <p className="mt-4 sm:mt-6 text-white/70 text-sm sm:text-base px-2">
              Continuous OTA Software Upgrade and Update
            </p>
          </div>
        </section>

        {/* Why Talia */}
        <section className="relative px-6 mb-16">
          <div className="absolute inset-0 -z-10">
          </div>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 opacity-60">⸻</div>
            <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-3 px-3">Why TALIA for Brand Activations?</h2>
            <p className="text-center text-white/80 max-w-4xl mx-auto mb-12 px-4">TALIA draws crowds, showcases your products, and keeps the spotlight on your brand.</p>

            <div className="relative rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-xl overflow-hidden px-6 md:px-10 lg:px-16 py-12">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(75%_60%_at_50%_15%,rgba(112,66,210,0.18),transparent_70%)]" />
              <div className="relative grid gap-6 sm:gap-8 md:gap-10 lg:grid-cols-[1fr_auto_1fr] items-center lg:items-start">
                <div className="space-y-8 text-right max-lg:order-2 max-lg:text-left">
                  {[
                    { title: "Crowd Magnet", subtitle: "Sleek hardware and an AI personality that boosts dwell time and traffic.", accent: "from-purple-200 to-purple-400" },
                    { title: "AI-Powered Conversations", subtitle: "Launches demos, answers questions, and handles live Q&A effortlessly.", accent: "from-pink-200 to-fuchsia-400" },
                    { title: "Photography Innovation", subtitle: "Roadmap to the world’s first independent photographer humanoid.", accent: "from-blue-200 to-sky-400" },
                  ].map(({ title, subtitle, accent }) => (
                    <div key={title} className="relative">
                      <span className={`text-sm uppercase tracking-[0.32em] text-white/55 block mb-2`}>Highlight</span>
                      <h3 className={`text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${accent}`}>{title}</h3>
                      <p className="text-sm text-white/75 leading-relaxed">{subtitle}</p>
                    </div>
                  ))}
                </div>

                <div className="relative mx-auto w-[260px] sm:w-[300px] md:w-[340px] lg:w-[360px] h-[520px] sm:h-[580px] max-lg:order-1">
                  <div className="absolute -inset-10 bg-[radial-gradient(circle_at_center,rgba(112,66,210,0.32),transparent_70%)] blur-3xl" />
                  <div className="relative h-full w-full rounded-[2.5rem] bg-black/30 overflow-hidden shadow-[0_35px_65px_rgba(0,0,0,0.55)]">
                    <video
                      className="absolute inset-0 h-full w-full object-cover"
                      src="https://vbth-cdn.s3.eu-central-1.amazonaws.com/media-content/robot.mp4"
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      poster="/images/studio-ai-example.jpg"
                    />
                    <div className="absolute top-3 left-3 flex gap-2 text-[10px]">
                      <span className="px-2 py-1 rounded-full bg-black/55 border border-white/10 text-white/85">Immersive Demo</span>
                      <span className="px-2 py-1 rounded-full bg-black/55 border border-white/10 text-white/85">Live Activation</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-8 max-lg:order-3">
                  {[
                    { title: "Fully Brandable", subtitle: "Dress Talia with t-shirts, dresses, hats, and digital skins to match your world.", accent: "from-indigo-200 to-purple-300" },
                    { title: "Lead Capture Ready", subtitle: "Collect emails, surveys, and preferences while she engages.", accent: "from-teal-200 to-cyan-300" },
                    { title: "On-Brand Voice", subtitle: "Tone, scripts, and handovers tuned to your activation playbook.", accent: "from-blue-200 to-lilac-300" },
                    { title: "Easy Logistics", subtitle: "Compact footprint and rapid setup with our on-site crew.", accent: "from-purple-200 to-pink-300" },
                  ].map(({ title, subtitle, accent }) => (
                    <div key={title} className="relative">
                      <span className={`text-sm uppercase tracking-[0.32em] text-white/55 block mb-1`}>Highlight</span>
                      <h3 className={`text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${accent}`}>{title}</h3>
                      <p className="text-sm text-white/75 leading-relaxed">{subtitle}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-10 px-0 md:px-12 text-left lg:text-center">
                <h3 className="text-lg md:text-xl font-semibold text-white mb-4">
                  Deployment Snapshot
                </h3>
                <p className="text-white/70 text-sm md:text-base mb-6 max-w-3xl lg:mx-auto">
                  Bring Talia to your event with minimal logistics and maximum impact.
                </p>
                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 text-sm md:text-base text-white/80">
                  {[
                    { label: "Setup time", value: "Under 30 minutes" },
                    { label: "Footprint", value: "Fits standard booth spaces" },
                    { label: "Connectivity", value: "5G/LTE or secure venue Wi‑Fi" },
                    { label: "Branding", value: "Branded Tshirt" },
                  ].map(({ label, value }) => (
                    <div key={label} className="w-full sm:flex-1 px-5 py-5 rounded-2xl border border-white/10 bg-white/5 text-center flex flex-col gap-1">
                      <span className="text-xs uppercase tracking-[0.28em] text-white/55">{label}</span>
                      <span className="text-white/90 font-semibold">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <CTAGroup breakpoint="md" className="justify-center text-center">
                  <Button variant="creativePrimary" size="lg" className="w-full md:w-auto text-base sm:text-lg py-6" onClick={()=>{ try { trackEvent('select_promotion', { creative_name: 'robotics_mid', promotion_name: 'rent_talia' }); } catch {} setOpen(true); setSent(false); }}>
                    Rent Talia
                  </Button>
                  <Button variant="creativeSecondary" size="lg" className="w-full md:w-auto text-base sm:text-lg py-6" onClick={()=>{ try { trackEvent('select_promotion', { creative_name: 'robotics_mid', promotion_name: 'schedule_demo' }); } catch {} setOpen(true); setSent(false); }}>
                    Schedule Demo
                  </Button>
                </CTAGroup>
              </div>
            </div>
          </div>
        </section>

        {/* Call-to-action: SEE IT IN ACTION */}
        <section className="relative mb-12 sm:mb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-6 opacity-60">⸻</div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4 leading-tight">
              SEE IT IN ACTION
            </h2>
            <VideoTeaser />
          </div>
        </section>

        {/* Creating the Future */}
        <section className="relative mb-10 sm:mb-12 pb-8 sm:pb-10">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0b0b12] to-black" />
            <div className="absolute inset-0 bg-[radial-gradient(60%_55%_at_50%_15%,rgba(112,66,210,0.12),transparent_60%)]" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8 opacity-60">⸻</div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-2 sm:mb-3 leading-tight">
              Creating the Future (SOON)
            </h2>
            <p className="text-center text-white/80 max-w-3xl mx-auto mb-8 sm:mb-10 px-2">Our robotic engineers are pushing the capabilities of Talia to provide you unique robotic solutions that will be jaw dropping!</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 px-2 sm:px-0">
              <FutureCard title="Humanoid Photographer" desc="Revolutionary AI-powered photography for autonomous content creation." media={{ src: "/images/Independent Photography.jpg", alt: "Independent Photography" }} />
              <FutureCard title="AI Videographer Modes" desc="Records smooth cinematic clips (hero shots, entries) with built-in effects." media={{ src: "/images/Crowd Engagement.jpg", alt: "Crowd Engagement" }} />
              <FutureCard title="AI Song Generator" desc="Generates and plays custom songs live based on the description provided by the guest. " media={{ src: "/images/Brand Activation.jpg", alt: "Brand Activation" }} />
            </div>
            <div className="mt-8 text-center">
              <p className="text-white/70 text-sm">
Don’t miss on the updates!              </p>
              <div className="mt-3">
                <Button
                  variant="creativeSecondary"
                  size="lg"
                  onClick={()=>{ try { trackEvent('select_promotion', { creative_name: 'robotics_future', promotion_name: 'join_waitlist' }); } catch {} setOpen(true); setSent(false); }}
                >
                  Join the Waitlist
                </Button>
              </div>
            </div>
          </div>
        </section>


        {/* Call-to-Action */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-12 text-center">
          <div className="text-center mb-8 opacity-60">⸻</div>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-2 sm:mb-3 px-2 leading-tight">
            Ready to Activate Your Brand with Talia?
          </h3>
          <p className="text-white/80 max-w-3xl mx-auto mb-5 sm:mb-6 px-2">
            Transform your next event into an unforgettable experience. All focus will be around your brand thanks to Talia’s incredible presence and AI capabilities.
          </p>
          <CTAGroup breakpoint="md">
            <Button
              variant="creativePrimary"
              size="lg"
              className="w-full md:w-auto text-base sm:text-lg py-6"
              onClick={()=>{ try { trackEvent('select_promotion', { creative_name: 'robotics_footer', promotion_name: 'rent_talia_for_event' }); } catch {} setOpen(true); setSent(false); }}
            >
              Rent Talia for Your Event
            </Button>
            <Button
              variant="creativeSecondary"
              size="lg"
              className="w-full md:w-auto text-base sm:text-lg py-6"
              onClick={()=>{ try { trackEvent('select_promotion', { creative_name: 'robotics_footer', promotion_name: 'see_it_in_action' }); } catch {} setOpenVideo(true); }}
            >
              See it in action
            </Button>
          </CTAGroup>
        </section>

        {/* Stats */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-6 sm:mt-8 md:mt-10 pb-6 sm:pb-8 md:pb-12 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 md:gap-6">
          {[
            { k: "14", v: "Years Experience" },
            { k: "45K+", v: "Activations Powered" },
            { k: "AI First", v: "Technology" },
            { k: "Custom", v: "Solutions" },
          ].map((s, i) => (
            <div
              key={i}
              className="relative rounded-3xl lg:rounded-[2.5rem] border border-white/10 bg-white/5 p-10 text-center overflow-hidden transition-all duration-500 hover:bg-gradient-to-br hover:from-white/10 hover:to-white/5 hover:border-white/20"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120px_60px_at_50%_0%,rgba(255,255,255,0.12),transparent)]" />
              <div className="text-2xl sm:text-3xl md:text-4xl font-black mb-1.5 sm:mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
                {s.k}
              </div>
              <div className="text-xs sm:text-sm md:text-base text-white/70 tracking-wide uppercase">
                {s.v}
              </div>
            </div>
          ))}
        </section>
      </main>
      {open && createPortal(
        <div className="fixed inset-0 z-[9999] grid min-h-screen place-items-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={()=>setOpen(false)} />
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl border border-white/10 shadow-[0_24px_70px_rgba(0,0,0,0.55)] backdrop-blur-xl">
            <button aria-label="Close" className="absolute top-3 right-3 z-20 h-10 w-10 rounded-full bg-white/90 text-black grid place-items-center shadow" onClick={()=>setOpen(false)}>
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
                  <img src="/images/robotics-talia.png" alt="Talia" className="h-12 w-12 rounded-lg object-cover shadow-md" />
                  <div>
                    <div className="text-white/95 font-semibold leading-snug">Talia</div>
                    <div className="text-white/70 text-xs">Product: Robotics</div>
                  </div>
                </div>
              </div>
              <form ref={formRef}
                onSubmit={async (e)=>{
                  e.preventDefault();
                  const elapsed = Date.now() - (mountedAtRef.current || 0);
                  if (elapsed < 2000) { try { toast?.({ title:'Hold on', description: 'Please review your details before sending.', variant: 'destructive' as any }); } catch {} return; }
                  try {
                    const res: any = validateLeadBasics?.({ name: form.name, email: form.email, phone: form.phone } as any);
                    if (res && res.ok === false) { try { toast?.({ title:'Invalid input', description: res.message, variant: 'destructive' as any }); } catch {} return; }
                    if (!form.name?.trim() || !form.email?.trim()) { try { toast?.({ title:'Invalid input', description: 'Please provide your name and email.', variant: 'destructive' as any }); } catch {} return; }
                  } catch {}
                  if (sending) return;
                  setSending(true);
                  try{
                    const params = new URLSearchParams(typeof window!== 'undefined' ? window.location.search : '');
                    const eff = getEffectiveUtm();
                    await apiRequest('POST','/api/leads',{
                      name: form.name.trim(),
                      email: form.email.trim(),
                      phone: form.phone.trim() || undefined,
                      company: form.company.trim() || undefined,
                      product: 'Talia',
                      message: `[extra] ${JSON.stringify({ ideaTitle:'Talia', ideaNotes: form.idea, eventDate: form.eventDate, eventType: form.eventType, guests: form.guests, duration: form.duration, location: form.location })}`,
                      _hp: form._hp,
                      source_path: typeof window!== 'undefined' ? window.location.pathname : '/robotics',
                      utm_source: params.get('utm_source') || eff?.utm_source || undefined,
                      utm_medium: params.get('utm_medium') || eff?.utm_medium || undefined,
                      utm_campaign: params.get('utm_campaign') || eff?.utm_campaign || undefined,
                      utm_term: params.get('utm_term') || eff?.utm_term || undefined,
                      utm_content: params.get('utm_content') || eff?.utm_content || undefined,
                      gclid: params.get('gclid') || eff?.gclid || undefined,
                      fbclid: params.get('fbclid') || eff?.fbclid || undefined,
                    });
                    try {
                      gtmEvent('lead_submit', {
                        product: 'Talia',
                        source_path: typeof window!== 'undefined' ? window.location.pathname : '/robotics',
                        utm_source: localStorage.getItem('utm_source') || undefined,
                        utm_medium: localStorage.getItem('utm_medium') || undefined,
                        utm_campaign: localStorage.getItem('utm_campaign') || undefined,
                        gclid: localStorage.getItem('gclid') || undefined,
                        fbclid: localStorage.getItem('fbclid') || undefined,
                        status: 'created'
                      });
                    } catch {}
                    toast({ title:'Request sent', description:'We will contact you shortly.' });
                    setSent(true);
                    setForm({ name:'', email:'', phone:'', company:'', eventDate:'', eventType:'', guests:'', duration:'', location:'', idea:'', _hp: '' });
                  } catch(err:any){
                    try { gtmEvent('lead_error', { reason: (err && err.message) || 'unknown' }); } catch {}
                    toast({ title:'Failed to send', description: err?.message || 'Please try again.', variant: 'destructive' as any });
                  } finally { setSending(false); }
                }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
              >
                {/* Honeypot field */}
                <div style={{ position: 'absolute', left: '-10000px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }} aria-hidden>
                  <label htmlFor="website">Website</label>
                  <input id="website" name="website" autoComplete="off" value={form._hp}
                    onChange={e=>setForm(f=>({...f, _hp: e.target.value}))} />
                </div>
                <label className="block"><span className="text-[11px] uppercase tracking-wide text-white/70">Full Name</span>
                  <input autoComplete="name" value={form.name} onChange={e=>setForm(f=>({...f, name: e.target.value}))} className="mt-1 w-full h-12 rounded-xl bg-white/95 text-black px-4 text-base focus:outline-none focus:ring-2 focus:ring-purple-300/60" placeholder="Your Full Name"/>
                </label>
                <label className="block"><span className="text-[11px] uppercase tracking-wide text-white/70">Company (optional)</span>
                  <input autoComplete="organization" value={form.company} onChange={e=>setForm(f=>({...f, company: e.target.value}))} className="mt-1 w-full h-12 rounded-xl bg-white/95 text-black px-4 text-base focus:outline-none focus:ring-2 focus:ring-purple-300/60" placeholder="Your Company"/>
                </label>
                <label className="block"><span className="text-[11px] uppercase tracking-wide text-white/70">Email</span>
                  <input type="email" autoComplete="email" value={form.email} onChange={e=>setForm(f=>({...f, email: e.target.value}))} className="mt-1 w-full h-12 rounded-xl bg-white/95 text-black px-4 text-base focus:outline-none focus:ring-2 focus:ring-purple-300/60" placeholder="your@email.com"/>
                </label>
                <label className="block"><span className="text-[11px] uppercase tracking-wide text-white/70">Phone Number</span>
                  <input type="tel" inputMode="tel" autoComplete="tel" value={form.phone} onChange={e=>setForm(f=>({...f, phone: e.target.value}))} className="mt-1 w-full h-12 rounded-xl bg-white/95 text-black px-4 text-base focus:outline-none focus:ring-2 focus:ring-purple-300/60" placeholder="Phone Number"/>
                </label>
                <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-1">
                  <select value={form.eventType} onChange={e=>setForm(f=>({...f, eventType: e.target.value}))} className="h-12 rounded-full bg-white/95 text-black px-4 text-base focus:outline-none focus:ring-2 focus:ring-purple-300/60">
                    <option>Select Event Type</option>
                    <option>Corporate</option>
                    <option>Retail</option>
                    <option>Festival</option>
                  </select>
                  <input inputMode="numeric" value={form.guests} onChange={e=>setForm(f=>({...f, guests: e.target.value}))} className="h-12 rounded-full bg-white/95 text-black px-4 text-base focus:outline-none focus:ring-2 focus:ring-purple-300/60" placeholder="Expected Guests"/>
                  <input value={form.duration} onChange={e=>setForm(f=>({...f, duration: e.target.value}))} className="h-12 rounded-full bg-white/95 text-black px-4 text-base focus:outline-none focus:ring-2 focus:ring-purple-300/60" placeholder="Duration (e.g., 4 hours)"/>
                </div>
                <label className="block"><span className="text-[11px] uppercase tracking-wide text-white/70">Event Date</span>
                  <input type="date" value={form.eventDate} onChange={e=>setForm(f=>({...f, eventDate: e.target.value}))} className="mt-1 w-full h-11 rounded-xl bg-white/95 text-black px-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-purple-300/60"/>
                </label>
                <div className="block"><span className="text-[11px] uppercase tracking-wide text-white/70">Event Location</span>
                  <input autoComplete="address-level1" value={form.location} onChange={e=>setForm(f=>({...f, location: e.target.value}))} className="mt-1 w-full h-11 rounded-xl bg-white/95 text-black px-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-purple-300/60" placeholder="Event Location"/>
                </div>
                <div className="sm:col-span-2"><label className="text-[11px] uppercase tracking-wide text-white/70">Got a Bold Idea?</label>
                  <textarea value={form.idea} onChange={e=>setForm(f=>({...f, idea: e.target.value}))} className="mt-1 w-full h-32 rounded-xl bg-white/95 text-black px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-purple-300/60" placeholder="Describe your idea..."/>
                </div>
                {sent ? (<div className="mt-5 rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-4 text-emerald-200">Thank you! Your request has been received. We’ll get back to you shortly.</div>) : null}
              </form>
              <div className="mt-5 pt-4 border-t border-white/10 -mx-4 sm:-mx-6 w-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 w-full px-4 sm:px-6">
                  <div>
                    <button type="button" onClick={()=>setOpen(false)} className="w-full px-4 py-2 rounded-full border border-white/25 text-white/90 hover:bg-white/10">{sent? 'Close':'Cancel'}</button>
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
      {openVideo && createPortal(
        <div className="fixed inset-0 z-[9999] grid min-h-screen place-items-center p-4">
          <div className="absolute inset-0 bg-black/80" onClick={()=>setOpenVideo(false)} />
          <div className="relative w-full max-w-5xl">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-[0_24px_70px_rgba(0,0,0,0.55)]">
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/YtdEsSryBmY?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1&start=0"
                title="Talia Robotics – See It In Action"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <button aria-label="Close" className="absolute -top-3 -right-3 z-20 h-10 w-10 rounded-full bg-white/90 text-black grid place-items-center shadow" onClick={()=>setOpenVideo(false)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
            </button>
          </div>
        </div>, document.body)}
      <FooterSection />
    </div>
  );
}

function VideoTeaser() {
  return (
    <div className="relative mx-auto max-w-4xl rounded-2xl overflow-hidden border border-white/15 bg-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
      <div className="relative aspect-video">
        <iframe
          id="yt-inline-player"
          className="absolute inset-0 w-full h-full"
          src="https://www.youtube.com/embed/YtdEsSryBmY?autoplay=0&mute=1&controls=0&loop=1&playlist=YtdEsSryBmY&modestbranding=1&rel=0"
          title="Talia Robotics – See It In Action"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
        {/* Overlay play button: removes itself and starts playback from beginning with sound */}
        <button
          type="button"
          onClick={() => {
            const iframe = document.getElementById('yt-inline-player') as HTMLIFrameElement | null;
            if (iframe) {
              // restart unmuted with controls
              iframe.src = 'https://www.youtube.com/embed/YtdEsSryBmY?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1&start=0';
            }
            // remove overlay
            const btn = document.getElementById('yt-inline-overlay');
            btn?.parentElement?.removeChild(btn as any);
          }}
          id="yt-inline-overlay"
          className="group absolute inset-0 grid place-items-center bg-black/0 hover:bg-black/10 transition-colors"
          aria-label="Play video"
        >
          <span className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-white/90 text-black shadow-lg group-hover:scale-105 transition-transform">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
      <h4 className="font-semibold mb-2">{title}</h4>
      <p className="text-white/75 text-sm">{desc}</p>
    </div>
  );
}

function FancyFeature({
  eyebrow,
  title,
  desc,
  icon,
}: {
  eyebrow: string;
  title: string;
  desc: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="group relative rounded-3xl lg:rounded-[2.5rem] border border-white/10 bg-white/5 p-6 md:p-8 overflow-hidden transition-all duration-500 hover:bg-gradient-to-br hover:from-white/10 hover:to-white/5 hover:border-white/20 hover:translate-y-[-2px] hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)] min-h-[220px] md:min-h-[240px] lg:min-h-[260px]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(140px_70px_at_20%_0%,rgba(255,255,255,0.12),transparent)]" />
      <div className="flex items-start gap-3 mb-2">
        {icon && (
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 border border-white/10 text-white/90 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-[0_0_28px_rgba(167,139,250,0.45)]">
            {icon}
          </span>
        )}
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-widest text-white/60">{eyebrow}</div>
          <h4 className="mt-1 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 line-clamp-2">{title}</h4>
        </div>
      </div>
      <p className="text-white/80 text-sm leading-relaxed line-clamp-3">{desc}</p>
    </div>
  );
}

function MiniFeature({
  title,
  desc,
  icon,
}: {
  title: string;
  desc: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 flex items-start gap-3 hover:border-white/20 hover:bg-white/10 transition-colors min-h-[260px]">
      {icon && (
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-white/10 border border-white/10 text-white/90 flex-shrink-0">
          {icon}
        </span>
      )}
      <div className="min-w-0">
        <div className="text-sm font-semibold mb-1 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">{title}</div>
        <p className="text-xs text-white/70 leading-relaxed line-clamp-3">{desc}</p>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
      <div className="text-2xl font-bold">{label}</div>
      <div className="text-white/70 mt-1">{value}</div>
    </div>
  );
}

function FutureCard({ title, desc, media }: { title: string; desc: string; media?: { src: string; alt?: string } }) {
  return (
    <div className="group relative rounded-3xl border border-white/10 bg-white/5 overflow-hidden transition-all duration-500 hover:border-white/20 hover:bg-white/10 hover:shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
      <div className="relative h-40 md:h-44 overflow-hidden">
        {media ? (
          <img src={media.src} alt={media.alt || title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40" />
        )}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.18)_0%,transparent_28%,transparent_72%,rgba(255,255,255,0.09)_100%)] opacity-60 mix-blend-overlay transition-transform duration-700 group-hover:translate-y-[-2%]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40" />
      </div>
      <div className="p-6">
        <h4 className="text-lg font-semibold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
          {title}
        </h4>
        <p className="text-white/80 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
