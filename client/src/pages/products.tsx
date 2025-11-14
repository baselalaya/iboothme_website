import Navigation from "@/components/navigation";
import { useEffect, useRef, useState } from 'react';
import { applySeoToHead, fetchSeoConfig } from "@/lib/seoOverride";
import Seo from "@/components/seo";
import FooterSection from "@/components/footer-section";
import { motion } from "framer-motion";
import { products as dataProducts, type Product } from "@/data/products";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { useEffect as useEffectReact } from 'react';
import { trackEvent } from "@/lib/ga";
import Breadcrumbs from "@/components/breadcrumbs";
import { createPortal } from "react-dom";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { getEffectiveUtm } from "@/lib/utm";
import { Button } from "@/components/ui/button";

// products imported from shared data

export default function ProductsPage() {
  useEffect(() => { (async () => { const cfg = await fetchSeoConfig('/products'); if (cfg) applySeoToHead(cfg); })(); }, []);
  const { toast } = useToast?.() || ({ toast: (args: any) => console.log(args) } as any);
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);
  const formRef = useRef<HTMLFormElement|null>(null);
  const mountedAtRef = useRef<number>(Date.now());
  const [form, setForm] = useState({ name:"", email:"", phone:"", company:"", idea:"", _hp:"" });
  useEffect(() => { if (!open) return; const onKey = (e: KeyboardEvent)=>{ if (e.key==='Escape') setOpen(false); }; document.addEventListener('keydown', onKey); return ()=>document.removeEventListener('keydown', onKey); }, [open]);
  useEffectReact(() => {
    // Track view_item_list when products page loads
    try {
      trackEvent('view_item_list', {
        item_list_id: 'all_products',
        item_list_name: 'All Products'
      });
    } catch {}
  }, []);
  return (
    <div className="relative min-h-screen text-white">
      <Seo
        title="Experiential Products & Booths"
        description="Explore interactive booths and experiential products designed to drive engagement at events and brand activations."
        canonical="/products"
        ogImage="/images/booth_unit_1.webp"
        keywords={["photo booth", "experiential products", "event tech"]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Products",
          description: "Interactive booths and experiential products for events.",
          hasPart: (function(){
            try { return (dataProducts||[]).map(p=>({
              // Use Thing here to avoid invalid Product
              // rich result warnings when we don't expose
              // offers/reviews on the listing page.
              "@type":"Thing",
              name: p.name,
              sku: p.id,
              image: p.image,
              brand: { "@type":"Brand", name: "iboothme" },
              url: `/products/${p.id}`
            })); } catch { return []; }
          })()
        }}
      />
      <Navigation />
      <main className="relative z-10 py-16 sm:py-20 md:py-24" data-testid="products-page">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Products' }]} />
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-4 sm:mb-6">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-sm font-medium text-white tracking-wide uppercase">Our Technology</span>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-3 sm:mb-4 px-3 leading-tight">All Products</h1>
            <p className="text-base sm:text-xl text-white/80 max-w-2xl mx-auto px-3">Explore our complete lineup of brand activation tech.</p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7">
            {(() => {
              const desiredOrder = [
                "iboothme-x",
                "glamdroid",
                "claw-machine",
                "gumball-x",
                "locker-x",
                "vending-x",
                "arcade-x",
                "mega-vending",
                "retro-x",
                "slider-180",
                "scribble-booth",
                "slider-12",
                "catch-baton",
                "gift-box",
                "booth-360",
                "gobooth",
              ];
              const indexMap = new Map<string, number>(desiredOrder.map((id, idx) => [id, idx]));
              const sorted = [...dataProducts].sort((a: Product, b: Product) => {
                const ia = indexMap.get(a.id) ?? Number.MAX_SAFE_INTEGER;
                const ib = indexMap.get(b.id) ?? Number.MAX_SAFE_INTEGER;
                return ia - ib;
              });
              return sorted;
            })().map((product, i) => (
              <motion.article
                key={product.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.06 }}
                className="group relative rounded-[28px] sm:rounded-[32px] md:rounded-[34px] overflow-visible shadow-2xl border border-white/10 bg-gradient-to-br from-gray-900 to-black ring-1 ring-white/5 hover:ring-white/15 transition-all duration-500 transform-gpu will-change-transform"
               >
                {/* Full image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transform-gpu transition-transform duration-700 will-change-transform overflow-hidden rounded-[28px] sm:rounded-[32px] md:rounded-[34px]"
                  style={{ backgroundImage: `url('${product.image}')` }}
                />

                {/* Overlays (match carousel look) */}
                <div className="absolute inset-0 z-10 pointer-events-none transform-gpu will-change-transform rounded-[28px] sm:rounded-[32px] md:rounded-[34px]" style={{ backfaceVisibility: 'hidden' }}>
                  <div className="absolute inset-0 bg-black/20 transition-opacity duration-300 group-hover:opacity-70 rounded-[28px] sm:rounded-[32px] md:rounded-[34px]" />
                  <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.18)_0%,transparent_28%,transparent_72%,rgba(255,255,255,0.09)_100%)] mix-blend-overlay transition-opacity duration-300 group-hover:opacity-80 rounded-[28px] sm:rounded-[32px] md:rounded-[34px]" />
                  <div className="absolute inset-0 bg-gradient-radial from-black/45 via-transparent to-black/65 transition-opacity duration-300 group-hover:opacity-60 rounded-[28px] sm:rounded-[32px] md:rounded-[34px]" />
                  <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300 group-hover:opacity-60 rounded-b-[28px] sm:rounded-b-[32px] md:rounded-b-[34px]" />
                  <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/40 to-transparent transition-opacity duration-300 group-hover:opacity-30 rounded-t-[28px] sm:rounded-t-[32px] md:rounded-t-[34px]" />
                </div>
                {/* Content */}
                <div className="relative z-20 pt-40 sm:pt-48 md:pt-56 pb-7 sm:pb-9 px-5 sm:px-8 flex flex-col h-[420px] sm:h-[500px] md:h-[540px]" style={{ transform: 'translateZ(0)' }}>
                  <div className="mt-auto">
                    <h3 className="text-3xl sm:text-4xl md:text-[2.75rem] font-extrabold leading-tight tracking-[-0.8px] sm:tracking-[-1.2px] font-display text-white mb-1">
                      <span className="drop-shadow-glow">{product.name}</span>
                    </h3>
                    <div className="h-1.5 w-12 sm:w-14 bg-white/20 rounded-full transition-all duration-300 ease-out group-hover:w-20" />
                  </div>
                  {/* CTAs pinned at bottom of content */}
                  <div className="relative z-30 pt-3">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        data-card-cta
                        type="button"
                        className="inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold bg-[#7042D2] hover:bg-[#7042D2]/90 text-white shadow"
                        onClick={(e)=>{ e.stopPropagation(); setSelected(product); setOpen(true); setSent(false); try { trackEvent('select_promotion', { creative_name: 'products_grid', promotion_name: 'book_now', item_id: product.id }); } catch {} }}
                      >
                        Book Now
                      </button>
                      <a
                        data-card-cta
                        href={`/products/${product.id}`}
                        className="inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold border border-white/20 bg-white/10 text-white hover:bg-white/15"
                        onClick={(e)=>{ e.stopPropagation(); try { trackEvent('select_promotion', { creative_name: 'products_grid', promotion_name: 'view_details', item_id: product.id }); } catch {} }}
                      >
                        View Details
                      </a>
                    </div>
                  </div>
                  {/* Full-card hover trigger overlay */}
                  <HoverCard openDelay={80} closeDelay={80}>
                    <HoverCardTrigger asChild>
                      <div className="absolute inset-0 z-10" aria-hidden />
                    </HoverCardTrigger>
                  <HoverCardContent side="top" align="center" className="z-[100] w-80 sm:w-96 p-4 bg-white/95 text-black shadow-xl border border-black/10 pointer-events-auto">
                    <div className="text-sm leading-relaxed">
                      <div className="font-semibold mb-1">{product.name}</div>
                      <p className="text-black/80 mb-2 line-clamp-5">{product.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {product.tags.slice(0, 2).map(t => (
                          <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-black/10 text-black/80 border border-black/10">{t}</span>
                        ))}
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
                </div>

                {/* Tier badge */}
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium text-white bg-black/50 backdrop-blur-sm z-20 border border-white/10 shadow-md">
                  {product.tier}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </main>
      {/* Custom Solution CTA */}
      <section className="relative z-10 pb-16 sm:pb-20 md:pb-24 -mt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.03] backdrop-blur-xl p-6 sm:p-10 md:p-14 text-center">
            <div className="pointer-events-none absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-purple-500/15 blur-[120px]" />
            <div className="pointer-events-none absolute -bottom-24 -right-24 w-[420px] h-[420px] rounded-full bg-indigo-500/15 blur-[120px]" />
            <h2 className="relative text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3 sm:mb-4">Standard activations don't stand out.</h2>
            <p className="relative text-white/85 text-sm sm:text-base md:text-lg max-w-3xl mx-auto mb-6 sm:mb-8">That's why we engineer tailor-made technologies that put your brand ahead.</p>
            <a href="/contact-us" className="relative inline-block">
              <div className="inline-flex items-center justify-center rounded-full px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold bg-[#7042D2] hover:bg-[#7042D2]/90 text-white shadow-[0_12px_28px_rgba(112,66,210,0.45)] transition-colors">
                Request Custom Solution
              </div>
            </a>
          </div>
        </div>
      </section>
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
              {selected && (
                <div className="rounded-xl bg-white/5 border border-white/10 ring-1 ring-white/10 p-3 sm:p-5 mb-5">
                  <div className="flex items-center gap-3">
                    <img src={selected.image} alt={selected.name} className="h-12 w-12 rounded-lg object-cover shadow-md" />
                    <div>
                      <div className="text-white/95 font-semibold leading-snug">{selected.name}</div>
                      <div className="text-white/70 text-xs">Selected Product</div>
                    </div>
                  </div>
                </div>
              )}
              <form ref={formRef}
                onSubmit={async (e)=>{
                  e.preventDefault();
                  const elapsed = Date.now() - (mountedAtRef.current || 0);
                  if (elapsed < 2000) { try { toast?.({ title:'Hold on', description: 'Please review your details before sending.', variant: 'destructive' as any }); } catch {}; return; }
                  const name = (form.name||'').trim();
                  const email = (form.email||'').trim();
                  if (!name || !email) { try { toast?.({ title:'Invalid input', description: 'Please provide your name and email.', variant: 'destructive' as any }); } catch {}; return; }
                  if (sending) return;
                  setSending(true);
                  try{
                    const params = new URLSearchParams(typeof window!== 'undefined' ? window.location.search : '');
                    const eff = getEffectiveUtm();
                    await apiRequest('POST','/api/leads',{
                      name,
                      email,
                      phone: form.phone.trim() || undefined,
                      company: form.company.trim() || undefined,
                      product: selected?.id || undefined,
                      message: `[products] ${selected?.name || ''} — ${form.idea}`,
                      _hp: form._hp,
                      source_path: typeof window!== 'undefined' ? window.location.pathname : '/products',
                      utm_source: params.get('utm_source') || eff?.utm_source || undefined,
                      utm_medium: params.get('utm_medium') || eff?.utm_medium || undefined,
                      utm_campaign: params.get('utm_campaign') || eff?.utm_campaign || undefined,
                      gclid: params.get('gclid') || eff?.gclid || undefined,
                      fbclid: params.get('fbclid') || eff?.fbclid || undefined,
                    });
                    setSent(true);
                    toast({ title: 'Request sent', description: 'We will contact you shortly.' });
                  } catch(err:any) {
                    toast({ title:'Failed to send', description: err?.message || 'Please try again.', variant: 'destructive' as any });
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
                  <input autoComplete="name" value={form.name} onChange={e=>setForm(f=>({...f, name: e.target.value}))} className="mt-1 w-full h-11 rounded-xl bg-white/95 text-black px-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-purple-300/60" placeholder="Your Full Name"/>
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wide text-white/70">Email</label>
                  <input type="email" autoComplete="email" value={form.email} onChange={e=>setForm(f=>({...f, email: e.target.value}))} className="mt-1 w-full h-11 rounded-xl bg-white/95 text-black px-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-purple-300/60" placeholder="your@email.com"/>
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wide text-white/70">Phone</label>
                  <input type="tel" autoComplete="tel" value={form.phone} onChange={e=>setForm(f=>({...f, phone: e.target.value}))} className="mt-1 w-full h-11 rounded-xl bg-white/95 text-black px-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-purple-300/60" placeholder="+971 4 44 88 563"/>
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wide text-white/70">Company</label>
                  <input autoComplete="organization" value={form.company} onChange={e=>setForm(f=>({...f, company: e.target.value}))} className="mt-1 w-full h-11 rounded-xl bg-white/95 text-black px-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-purple-300/60" placeholder="Your Company"/>
                </div>
                <div className="block sm:col-span-2">
                  <span className="text-[11px] uppercase tracking-wide text-white/70">Idea / Notes</span>
                  <textarea value={form.idea} onChange={e=>setForm(f=>({...f, idea: e.target.value}))} className="mt-1 w-full h-28 rounded-xl bg-white/95 text-black px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-purple-300/60" placeholder="Describe your idea..."/>
                </div>
                {sent ? (<div className="sm:col-span-2 mt-2 rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-3 text-emerald-200">Thank you! Your request has been received. We’ll get back to you shortly.</div>) : null}
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
      <FooterSection />
    </div>
  );
}
