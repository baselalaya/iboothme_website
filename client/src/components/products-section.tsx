import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import CTAGroup from "@/components/ui/cta-group";
import { ArrowRight, Grid3X3, Play } from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useToast } from "@/hooks/use-toast";
import { getEffectiveUtm } from "@/lib/utm";
import { apiRequest } from "@/lib/queryClient";
import { validateLeadBasics } from "@/lib/validation";
import { apiBaseJoin } from "../lib/publicApi";
import { products as dataProducts } from "@/data/products";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay, Navigation as SwiperNavigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";

const defaultProducts = [
  {
    id: "holo-booth",
    title: "AI-Powered Experiences",
    subtitle: "HoloBooth",
    description: "Easy to use. Easy to love.",
    image: "/images/holobox-purple.png",
    bgColor: "from-orange-400 via-pink-400 to-blue-500",
    isDarkImage: true
  },
  {
    id: "360-booth", 
    title: "Performance and Content",
    subtitle: "360 Video Booth",
    description: "Go fast. Go far.",
    image: "/images/360-purple.png", 
    bgColor: "from-gray-900 to-black",
    isDarkImage: true
  },
  {
    id: "mirror-tech",
    title: "Interactive and Social",
    subtitle: "Mirror Tech", 
    description: "Dream team.",
    image: "/images/mirror-tech-purple.png",
    bgColor: "from-green-300 to-blue-400",
    isDarkImage: false
  },
  {
    id: "gumball-x",
    title: "Compatibility",
    subtitle: "Gumball X",
    description: "Mac runs your favorite apps.",
    image: "/images/gumball-x-purple.png",
    bgColor: "from-blue-300 to-purple-400",
    isDarkImage: false
  },
  {
    id: "gift-box",
    title: "Surprise & Delight", 
    subtitle: "Giftbox",
    description: "Branded gift reveals and social moments",
    image: "/images/gift-box-purple.png",
    bgColor: "from-yellow-300 to-orange-400",
    isDarkImage: false
  },
  {
    id: "gobooth",
    title: "Portable Solutions",
    subtitle: "Goboothme X", 
    description: "Mobile photo booth experiences for any event",
    image: "/images/gobooth-purple.png",
    bgColor: "from-indigo-400 to-blue-500",
    isDarkImage: true
  }
];

export default function ProductsSection() {
  const [products, setProducts] = useState(defaultProducts);
  const [openVideo, setOpenVideo] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", solution: "", notes: "", _hp: "" });
  const formRef = useRef<HTMLFormElement|null>(null);
  const { toast } = useToast?.() || ({ toast: (args: any) => console.log(args) } as any);
  const mountedAtRef = useRef<number>(Date.now());
  useEffect(() => {
    if (!openVideo) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpenVideo(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [openVideo]);

  useEffect(() => {
    let isMounted = true;
    const url = (typeof window !== 'undefined' && (window as any).__PRODUCTS_URL__) || "/data/products.json";
    // Always fetch static assets like /data/products.json from the current origin, not the API domain
    const absolute = url.startsWith('http://') || url.startsWith('https://')
      ? url
      : `${location.origin}${url.startsWith('/') ? '' : '/'}${url}`;
    fetch(absolute, { cache: 'no-store' })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (Array.isArray(data) && data.length && isMounted) {
          setProducts(data);
        }
      })
      .catch(() => {
        // Fallback to in-app data order
        const mapped = dataProducts.slice(0, 6).map((p) => ({
          id: p.id,
          title: p.meta,
          subtitle: p.name,
          description: p.description,
          image: p.image,
          bgColor: "from-gray-900 to-black",
          isDarkImage: true,
        }));
        if (isMounted && mapped.length) setProducts(mapped);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const prefersReducedMotion = useReducedMotion();
  const [ref, isIntersecting] = useIntersectionObserver();
  // Swiper coverflow used for consistency across pages

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.15
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: prefersReducedMotion ? 0.01 : 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <section 
      ref={ref}
      className="relative py-24 overflow-hidden" 
      data-testid="products-section"
      data-section="products"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          animate={isIntersecting ? "visible" : "hidden"}
          variants={cardVariants}
        >
          <motion.div variants={cardVariants} className="mb-6">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-sm font-medium text-white tracking-wide uppercase">Our Solutions</span>
            </div>
          </motion.div>
          
          <motion.h2
            className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-3 md:mb-4 leading-tight"
            variants={cardVariants}
            data-testid="products-headline"
          >
            Photobooth and Beyond
          </motion.h2>
          
          <motion.p
            variants={cardVariants}
            className="text-base sm:text-lg md:text-xl text-white/80 max-w-4xl mx-auto px-1"
            data-testid="products-description"
          >
All our tech is built in-house and if you don’t find what you need, we’ll build it.
          </motion.p>
        </motion.div>


        
        {/* Vertical Cards Carousel */}
        <motion.div 
          className="relative mb-10 md:mb-16"
          initial="hidden"
          animate={isIntersecting ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <motion.div variants={cardVariants}>
            <div className="relative h-[360px] sm:h-[420px] md:h-[480px]">
              <button
                type="button"
                aria-label="Previous"
                className="products-prev absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/10 border border-white/20 backdrop-blur grid place-items-center hover:bg-white/20 transition"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white/80">
                  <path d="M15 18l-6-6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                aria-label="Next"
                className="products-next absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/10 border border-white/20 backdrop-blur grid place-items-center hover:bg-white/20 transition"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white/80">
                  <path d="M9 18l6-6-6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <Swiper
                modules={[EffectCoverflow, Autoplay, SwiperNavigation]}
                effect="coverflow"
                centeredSlides
                slidesPerView="auto"
                spaceBetween={16}
                autoplay={{ delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true }}
                coverflowEffect={{ rotate: 14, stretch: 0, depth: 120, modifier: 1, scale: 0.9, slideShadows: false }}
                navigation={{ prevEl: '.products-prev', nextEl: '.products-next' }}
                className="absolute inset-0 !px-6 sm:!px-10 md:!px-12 !overflow-visible"
              >
              {products.map((product) => (
                <SwiperSlide key={product.id} className="!w-[min(78vw,320px)] sm:!w-[min(70vw,360px)] md:!w-[min(38vw,360px)] xl:!w-[min(28vw,380px)] !min-w-[240px] sm:!min-w-[260px] md:!min-w-[320px]">
                  <HoverCard openDelay={80} closeDelay={80}>
                    <a href={`/products/${product.id}`} className="group cursor-pointer relative z-10 block" aria-label={`${product.subtitle} product`}>
                      <motion.div
                      whileHover={{
                        scale: 1.04,
                        boxShadow: "0 16px 48px 0 rgba(80,130,255,0.17), 0 1.5px 23px 0 rgba(0,0,0,0.08)",
                        transition: { type: "spring", stiffness: 275, damping: 23 }
                      }}
                      className={`relative h-[360px] sm:h-[420px] md:h-[480px] rounded-[28px] sm:rounded-[32px] md:rounded-[34px] overflow-hidden transform-gpu will-change-transform bg-gradient-to-br ${product.bgColor} shadow-2xl transition-all duration-700 ease-[cubic-bezier(.77,0,.18,1)]`}
                      data-testid={`product-card-${product.id}`}
                    >
                      <div
                        className="absolute inset-0 w-full h-full bg-cover bg-center transform-gpu will-change-transform"
                        style={{ backgroundImage: `url('${product.image}')` }}
                      />
                      <div className="absolute inset-0 z-10 pointer-events-none transform-gpu will-change-transform" style={{ backfaceVisibility: 'hidden' }}>
                        <div className="absolute inset-0 bg-black/20" />
                        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.18)_0%,transparent_28%,transparent_72%,rgba(255,255,255,0.09)_100%)] mix-blend-overlay" />
                        <div className="absolute inset-0 bg-gradient-radial from-black/45 via-transparent to-black/65" />
                        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/70 to-transparent" />
                        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/40 to-transparent" />
                      </div>
                      <div className="relative z-20 pt-36 sm:pt-44 md:pt-48 pb-6 sm:pb-8 px-5 sm:px-8 flex flex-col h-full" style={{ transform: 'translateZ(0)' }}>
                        <div className="mt-auto">
                          <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight tracking-[-0.6px] sm:tracking-[-1.2px] font-display text-white">
                            <span className="drop-shadow-glow">{product.subtitle}</span>
                          </h3>
                          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-sm">
                            <span className="text-[11px] uppercase tracking-[0.14em] text-white/80 line-clamp-1 max-w-[60vw] sm:max-w-[240px]">{product.title}</span>
                          </div>
                        </div>
                        {/* Full-card hover trigger overlay */}
                        <HoverCardTrigger asChild>
                          <div className="absolute inset-0 z-30" aria-hidden />
                        </HoverCardTrigger>
                      </div>
                    </motion.div>
                    </a>
                    <HoverCardContent side="top" align="center" className="w-80 sm:w-96 p-4 bg-white/95 text-black shadow-xl border border-black/10 pointer-events-auto">
                      <div className="text-sm leading-relaxed">
                        <div className="font-semibold mb-1">{product.subtitle}</div>
                        <p className="text-black/80 line-clamp-5">{product.description}</p>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </SwiperSlide>
              ))}
              </Swiper>
            </div>
          </motion.div>
        </motion.div>
        
        {/* CTA section (mobile-optimized) */}
        <motion.div 
          className="text-center"
          initial="hidden"
          animate={isIntersecting ? "visible" : "hidden"}
          variants={cardVariants}
        >
          <div className="px-2">
            <div className="mx-auto max-w-xl grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 items-stretch">
              <Link href="/products?utm_source=site&utm_medium=section-products-cta&utm_campaign=home">
                <a className="block" onClick={() => { try { const { trackEvent } = require('@/lib/ga'); trackEvent('select_promotion', { creative_name: 'home_products_section', promotion_name: 'View All Booths' }); } catch {} }}>
                  <Button 
                    variant="creativePrimary"
                    size="lg"
                    className="w-full text-base sm:text-lg py-5 sm:py-6"
                    data-testid="view-all-models"
                  >
                    <span className="text-white">View All Booths</span>
                  </Button>
                </a>
              </Link>
              <Button
                size="lg"
                variant="creativeSecondary"
                className="w-full text-base sm:text-lg py-5 sm:py-6"
                data-testid="product-book-now"
                onClick={() => { try { const { trackEvent } = require('@/lib/ga'); trackEvent('select_promotion', { creative_name: 'home_products_section', promotion_name: 'book_now' }); } catch {} setOpenForm(true); setSent(false); }}
              >
                <span className="text-white">Book Now</span>
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
            <p className="mt-3 text-xs text-white/60 sm:hidden">Faster taps, larger buttons, and stacked layout for small screens.</p>
          </div>
          
        </motion.div>
        {openVideo && createPortal(
          <div className="fixed inset-0 z-[9999] grid min-h-screen place-items-center p-4">
            <div className="absolute inset-0 bg-black/80" onClick={()=>setOpenVideo(false)} />
            <div className="relative w-full max-w-5xl">
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-[0_24px_70px_rgba(0,0,0,0.55)]">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/_o68ZYTHi0I?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1&start=0"
                  title="Product Lineup 2026"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
              <button aria-label="Close" className="absolute -top-3 -right-3 z-20 h-10 w-10 rounded-full bg-white/90 text-black grid place-items-center shadow" onClick={()=>setOpenVideo(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
              </button>
            </div>
          </div>, document.body)}
      </div>
      {openForm && createPortal(
        <div className="fixed inset-0 z-[9999] grid min-h-screen place-items-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={()=>setOpenForm(false)} />
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl border border-white/10 shadow-[0_24px_70px_rgba(0,0,0,0.55)] backdrop-blur-xl">
            <button aria-label="Close" className="absolute top-3 right-3 z-20 h-10 w-10 rounded-full bg-white/90 text-black grid place-items-center shadow" onClick={()=>setOpenForm(false)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
            </button>
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-neutral-900/95 via-neutral-900/80 to-black/90" />
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(120deg,rgba(147,51,234,0.08),rgba(59,130,246,0.06))]" />
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(120%_100%_at_50%_-10%,rgba(255,255,255,0.06),transparent_45%)]" />
            <div className="absolute inset-0 -z-10 bg-[url('/images/noise.svg')] opacity-10 mix-blend-overlay" />
            <div className="p-4 sm:p-7 md:p-8">
              <header className="mb-5">
                <h3 className="text-2xl font-black leading-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-200 via-white to-pink-200">Book a Solution</h3>
                <p className="text-white/85 text-sm mt-1">Tell us which solution you’re interested in and your details.</p>
              </header>
              <form ref={formRef}
                onSubmit={async (e)=>{
                  e.preventDefault();
                  // Normalize all fields
                  const name = (form.name || '').trim();
                  const email = (form.email || '').trim();
                  const phone = (form.phone || '').trim();
                  const company = (form.company || '').trim();
                  const solution = (form.solution || '').trim();
                  const notes = (form.notes || '').trim();
                  const basics = { name, email, phone } as any;

                  // Time-based gate
                  const elapsed = Date.now() - (mountedAtRef.current || 0);
                  if (elapsed < 2000) { try { toast?.({ title:'Hold on', description: 'Please review your details before sending.', variant: 'destructive' as any }); } catch {} return; }

                  // Robust validation with fallback
                  let errorMsg: string | undefined;
                  try {
                    const res: any = typeof validateLeadBasics === 'function' ? validateLeadBasics(basics) : undefined;
                    if (res && res.ok === false) errorMsg = res.message || 'Please check your details.';
                    if (!name) errorMsg = errorMsg || 'Please provide your name.';
                    if (!email) errorMsg = errorMsg || 'Please provide your email.';
                    if (!solution) errorMsg = errorMsg || 'Please select a solution.';
                  } catch {
                    if (!name || !email) errorMsg = 'Please provide your name and email.';
                    if (!solution) errorMsg = errorMsg || 'Please select a solution.';
                  }
                  if (errorMsg) { try { toast?.({ title:'Invalid input', description: errorMsg, variant: 'destructive' as any }); } catch {} return; }

                  if (sending) return;
                  setSending(true);
                  try{
                    const params = new URLSearchParams(typeof window!== 'undefined' ? window.location.search : '');
                    const eff = getEffectiveUtm();
                    await apiRequest('POST','/api/leads',{
                      name,
                      email,
                      phone: phone || undefined,
                      company: company || undefined,
                      message: `[home_products_section] Solution: ${solution} — ${notes}`,
                      _hp: form._hp,
                      source_path: typeof window!== 'undefined' ? window.location.pathname : '/',
                      utm_source: params.get('utm_source') || eff?.utm_source || undefined,
                      utm_medium: params.get('utm_medium') || eff?.utm_medium || undefined,
                      utm_campaign: params.get('utm_campaign') || eff?.utm_campaign || undefined,
                      gclid: params.get('gclid') || eff?.gclid || undefined,
                      fbclid: params.get('fbclid') || eff?.fbclid || undefined,
                    });
                    setSent(true);
                    try { toast?.({ title: 'Request sent', description: 'We will contact you shortly.' }); } catch {}
                  } catch (err:any) {
                    try { toast?.({ title:'Failed to send', description: err?.message || 'Please try again.', variant: 'destructive' as any }); } catch {}
                  } finally {
                    setSending(false);
                  }
                }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                <div style={{ position: 'absolute', left: '-10000px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }} aria-hidden>
                  <label htmlFor="company-website">Company Website</label>
                  <input id="company-website" name="company-website" autoComplete="off" value={form._hp} onChange={(e)=>setForm(f=>({...f, _hp: e.target.value}))} />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wide text-white/70">Full Name</label>
                  <input autoComplete="name" value={form.name} onChange={e=>setForm(f=>({...f, name: e.target.value}))} className="mt-1 w-full h-11 rounded-xl bg-white/95 text-black px-3 text-[15px]" placeholder="Your Full Name"/>
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wide text-white/70">Email</label>
                  <input type="email" autoComplete="email" value={form.email} onChange={e=>setForm(f=>({...f, email: e.target.value}))} className="mt-1 w-full h-11 rounded-xl bg-white/95 text-black px-3 text-[15px]" placeholder="your@email.com"/>
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wide text-white/70">Phone</label>
                  <input type="tel" autoComplete="tel" value={form.phone} onChange={e=>setForm(f=>({...f, phone: e.target.value}))} className="mt-1 w-full h-11 rounded-xl bg-white/95 text-black px-3 text-[15px]" placeholder="+971 4 44 88 563"/>
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wide text-white/70">Company</label>
                  <input autoComplete="organization" value={form.company} onChange={e=>setForm(f=>({...f, company: e.target.value}))} className="mt-1 w-full h-11 rounded-xl bg-white/95 text-black px-3 text-[15px]" placeholder="Your Company"/>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[11px] uppercase tracking-wide text-white/70">Solution</label>
                  <select value={form.solution} onChange={e=>setForm(f=>({...f, solution: e.target.value}))} className="mt-1 w-full h-11 rounded-xl bg-white/95 text-black px-3 text-[15px]">
                    <option value="">Select a solution…</option>
                    {dataProducts.map(p => (<option key={p.id} value={p.name}>{p.name}</option>))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[11px] uppercase tracking-wide text-white/70">Notes</label>
                  <textarea value={form.notes} onChange={e=>setForm(f=>({...f, notes: e.target.value}))} className="mt-1 w-full h-28 rounded-xl bg-white/95 text-black px-4 py-3 text-base" placeholder="Describe your idea..."/>
                </div>
                {sent ? (<div className="sm:col-span-2 mt-2 rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-3 text-emerald-200">Thank you! Your request has been received. We’ll get back to you shortly.</div>) : null}
              </form>
              <div className="mt-5 pt-4 border-t border-white/10 -mx-4 sm:-mx-6 w-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 w-full px-4 sm:px-6">
                  <div>
                    <button type="button" onClick={()=>setOpenForm(false)} className="w-full px-4 py-2 rounded-full border border-white/25 text-white/90 hover:bg-white/10">{sent? 'Close':'Cancel'}</button>
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
    </section>
  );
}
