import Navigation from "@/components/navigation";
import { useEffect } from 'react';
import { applySeoToHead, fetchSeoConfig } from "@/lib/seoOverride";
import Seo from "@/components/seo";
import FooterSection from "@/components/footer-section";
import { products } from "@/data/products";
import { Link, useRoute } from "wouter";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/ga";
// import Breadcrumbs from "@/components/breadcrumbs";

export default function ProductDetailPage() {
  const match = useRoute("/products/:id");
  const id = match?.[1]?.id as string | undefined;
  const product = products.find((p) => p.id === id);
  useEffect(() => { if (id) { (async () => { const cfg = await fetchSeoConfig(`/products/${id}`); if (cfg) applySeoToHead(cfg); })(); } }, [id]);
  useEffect(() => {
    if (product) {
      try { trackEvent('view_item', { items: [{ item_id: product.id, item_name: product.name }] }); } catch {}
    }
  }, [product]);

  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  // Lock body scroll while modal open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);
  return (
    <div className="relative min-h-screen text-white">
      {product && (
        <Seo
          title={`${product.name}`}
          description={product.description || `Learn more about ${product.name} experiential product.`}
          canonical={`/products/${product.id}`}
          ogImage={product.image}
          keywords={[product.name, "photo booth", "experiential product"]}
          jsonLd={{
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            image: product.image ? [product.image] : undefined,
            description: product.description,
            brand: { "@type": "Brand", name: "iboothme" }
          }}
        />
      )}
      <Navigation />
      {/* Sticky back bar on mobile */}
      <div className="sm:hidden sticky top-0 z-30 bg-black/70 backdrop-blur supports-[backdrop-filter]:bg-black/50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <Link href="/products" className="text-sm text-white/80 hover:text-white inline-flex items-center gap-2">
            <span>←</span> Back to Products
          </Link>
        </div>
      </div>
      <main className="relative z-10 py-10 sm:py-14 md:py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <Link href="/products" className="hidden sm:inline-flex text-sm text-white/70 hover:text-white items-center gap-2 mb-6">
          <span>←</span> Back to Products
        </Link>
        {!product ? (
          <div>
            <h1 className="text-3xl font-bold">Product not found</h1>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5">
              <div className="aspect-[4/5] w-full rounded-2xl overflow-hidden border border-white/10 bg-white/5">
                <div className="w-full h-full bg-cover bg-center" style={{backgroundImage:`url('${product.image}')`}}/>
              </div>
            </div>
            <div className="lg:col-span-7 space-y-4">
              <div className="text-xs text-purple-300/90 uppercase tracking-wide">{product.meta}</div>
              <h1 className="text-4xl sm:text-5xl font-extrabold">{product.name}</h1>
              <p className="text-white/85 text-lg">{product.description}</p>
              <div className="flex flex-wrap gap-2 pt-2">
                {product.tags.map((t) => (
                  <span key={t} className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/85 ring-1 ring-white/10">{t}</span>
                ))}
              </div>
              <div className="pt-4">
                <a href={`/contact-us?product=${product.id}`} className="inline-flex items-center justify-center rounded-full px-6 py-3 text-base font-semibold bg-[#7042D2] hover:bg-[#7042D2]/90 text-white shadow-[0_12px_28px_rgba(112,66,210,0.45)]">Activate Your Event</a>
              </div>
            </div>
          </div>
        )}

        {/* Simple sections inspired by reference */}
        {product && (
          <div className="mt-10 space-y-6">
            <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <h2 className="text-xl font-semibold mb-3">Complete {product.name} Demonstration</h2>
              {product.video ? (
                <div className="aspect-video w-full rounded-xl overflow-hidden border border-white/10 bg-black">
                  <iframe
                    title={`${product.name} demonstration`}
                    className="w-full h-full"
                    src={(function () {
                      try {
                        const url = new URL(product.video as string);
                        if (url.hostname.includes('youtu.be')) {
                          // https://youtu.be/VIDEO -> https://www.youtube.com/embed/VIDEO
                          const id = url.pathname.replace('/', '');
                          return `https://www.youtube.com/embed/${id}`;
                        }
                        if (url.hostname.includes('youtube.com')) {
                          const id = url.searchParams.get('v');
                          if (id) return `https://www.youtube.com/embed/${id}`;
                          // Shorts or other paths
                          const parts = url.pathname.split('/').filter(Boolean);
                          const idx = parts.findIndex((p) => p === 'shorts');
                          if (idx !== -1 && parts[idx + 1]) {
                            return `https://www.youtube.com/embed/${parts[idx + 1]}`;
                          }
                        }
                      } catch {}
                      return product.video as string;
                    })()}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="aspect-video w-full rounded-xl border border-white/10 bg-black/40 flex items-center justify-center text-white/60">
                  Coming soon
                </div>
              )}
            </section>
            {/* Rich details */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                <h3 className="text-lg font-semibold mb-2">Key Features</h3>
                {product.tags?.length ? (
                  <ul className="list-disc pl-5 text-white/80 space-y-1 text-sm">
                    {product.tags.map((t) => (<li key={t}>{t}</li>))}
                  </ul>
                ) : (
                  <p className="text-white/70 text-sm">No features listed.</p>
                )}
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                <h3 className="text-lg font-semibold mb-2">Technical Specifications</h3>
                {product.specs ? (
                  <dl className="grid grid-cols-1 gap-1 text-sm text-white/80">
                    {product.specs.dimensions && (<div><dt className="font-medium text-white">Dimensions</dt><dd>{product.specs.dimensions}</dd></div>)}
                    {product.specs.power && (<div className="mt-1"><dt className="font-medium text-white">Power</dt><dd>{product.specs.power}</dd></div>)}
                    {product.specs.capacity && (<div className="mt-1"><dt className="font-medium text-white">Capacity</dt><dd>{product.specs.capacity}</dd></div>)}
                    {product.specs.technology && (<div className="mt-1"><dt className="font-medium text-white">Technology</dt><dd>{product.specs.technology}</dd></div>)}
                    {product.specs.support && (<div className="mt-1"><dt className="font-medium text-white">Support</dt><dd>{product.specs.support}</dd></div>)}
                    {product.specs.setup && (<div className="mt-1"><dt className="font-medium text-white">Setup</dt><dd>{product.specs.setup}</dd></div>)}
                  </dl>
                ) : (
                  <p className="text-white/70 text-sm">Specs available on request.</p>
                )}
              </div>
            </section>
            {product.useCases?.length ? (
              <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                <h3 className="text-lg font-semibold mb-2">Use Cases</h3>
                <ul className="list-disc pl-5 text-white/80 space-y-1 text-sm">
                  {product.useCases.map((u) => (<li key={u}>{u}</li>))}
                </ul>
              </section>
            ) : null}
            <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <h3 className="text-lg font-semibold mb-2">Customization Options</h3>
              <p className="text-white/80 text-sm">Software and hardware customization available. Branding, flows, and integrations tailored to your event.</p>
            </section>
            <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.03] backdrop-blur-xl p-6 sm:p-10 md:p-12 text-center">
              <div className="pointer-events-none absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-purple-500/15 blur-[120px]" />
              <div className="pointer-events-none absolute -bottom-24 -right-24 w-[420px] h-[420px] rounded-full bg-indigo-500/15 blur-[120px]" />
              <h3 className="relative text-3xl sm:text-4xl font-extrabold mb-3">Ready to Activate Your Event?</h3>
              <p className="relative text-white/85 text-base sm:text-lg max-w-3xl mx-auto mb-6">
                Get a fast, tailored quote for {product.name}. Our team will help you pick options, branding, and integrations.
              </p>
              <a href={`/contact-us?product=${product.id}`} className="relative inline-block">
                <div className="inline-flex items-center justify-center rounded-full px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold bg-[#7042D2] hover:bg-[#7042D2]/90 text-white shadow-[0_12px_28px_rgba(112,66,210,0.45)] transition-colors">
                  Activate {product.name}
                </div>
              </a>
            </section>
          </div>
        )}
      </main>
      {/* Modal removed in favor of dedicated route */}
      <FooterSection />
    </div>
  );
}
