import Navigation from "@/components/navigation";
import { useEffect } from 'react';
import { applySeoToHead, fetchSeoConfig } from "@/lib/seoOverride";
import Seo from "@/components/seo";
import FooterSection from "@/components/footer-section";
import { motion } from "framer-motion";
import { products as dataProducts, type Product } from "@/data/products";
import { useEffect as useEffectReact } from 'react';
import { trackEvent } from "@/lib/ga";
import Breadcrumbs from "@/components/breadcrumbs";

// products imported from shared data

export default function ProductsPage() {
  useEffect(() => { (async () => { const cfg = await fetchSeoConfig('/products'); if (cfg) applySeoToHead(cfg); })(); }, []);
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
          description: "Interactive booths and experiential products for events."
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
                className="group cursor-pointer relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-black/10 ring-1 ring-white/5 hover:ring-white/15 transition-all duration-500 transform-gpu will-change-transform"
                onClick={() => {
                  try { trackEvent('select_item', { item_list_id: 'all_products', items: [{ item_id: product.id, item_name: product.name }] }); } catch {}
                  window.location.href = `/products/${product.id}`;
                }}
              >
                {/* Full image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transform-gpu transition-transform duration-700 will-change-transform group-hover:scale-[1.06]"
                  style={{ backgroundImage: `url('${product.image}')` }}
                />

                {/* Overlays (match carousel look) */}
                <div className="absolute inset-0 z-10 pointer-events-none transform-gpu will-change-transform" style={{ backfaceVisibility: 'hidden' }}>
                  {/* Base scrim for contrast */}
                  <div className="absolute inset-0 bg-black/25" />
                  {/* Subtle diagonal sheen */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/15 to-transparent mix-blend-overlay opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
                  {/* Radial focus from center-bottom */}
                  <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_70%,rgba(0,0,0,0.55),transparent_60%)]" />
                  {/* Bottom legibility ramp */}
                  <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
                  {/* Top fade */}
                  <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/45 to-transparent" />
                  {/* Hover sweep highlight */}
                  <div className="absolute -inset-y-8 -left-1/2 w-2/3 rotate-12 bg-gradient-to-r from-white/0 via-white/15 to-white/0 opacity-0 group-hover:opacity-70 group-hover:translate-x-[180%] transition-all duration-700 ease-out" />
                </div>

                {/* Content */}
                <div className="relative z-20 pt-40 sm:pt-48 pb-6 sm:pb-8 px-6 sm:px-8 flex flex-col h-[380px] sm:h-[440px] md:h-[460px]" style={{ transform: 'translateZ(0)' }}>
                  <div className="space-y-2 drop-shadow-[0_0_18px_rgba(0,0,0,0.16)] mt-auto">
                    <div className="text-[11px] sm:text-xs text-purple-300/90 mb-1 font-medium">{product.meta}</div>
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight tracking-[-0.6px] sm:tracking-[-1.2px] font-display text-white drop-shadow-[0_6px_24px_rgba(0,0,0,0.35)]">{product.name}</h3>
                    <p className="text-sm sm:text-base md:text-lg leading-relaxed font-medium text-white/92 line-clamp-2">{product.description}</p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {product.tags.map((t) => (
                        <span key={t} className="text-[10px] sm:text-[11px] px-2 py-1 rounded-full bg-white/10 text-white/85 ring-1 ring-white/10">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
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
      <FooterSection />
    </div>
  );
}
