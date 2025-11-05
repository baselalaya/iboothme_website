import Navigation from "@/components/navigation";
import Seo from "@/components/seo";
import { useEffect } from 'react';
import { applySeoToHead, fetchSeoConfig } from "@/lib/seoOverride";
import FooterSection from "@/components/footer-section";
import CTAGroup from "@/components/ui/cta-group";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { products as dataProducts, type Product } from "@/data/products";
import Breadcrumbs from "@/components/breadcrumbs";

export default function TailoredSoftwareSolutionsPage() {
  useEffect(() => { (async () => { const cfg = await fetchSeoConfig('/tailored-software-solutions'); if (cfg) applySeoToHead(cfg); })(); }, []);
  return (
    <div className="relative min-h-screen text-white">
      <Seo
        title="Tailored Software Solutions for Brand Activations"
        description="Custom event software: web apps, AR/AI, games, registration, integrations, and real-time analytics to power your brand activations."
        canonical="/tailored-software-solutions"
        ogImage="/images/tech.png"
        keywords={["custom software", "event tech", "brand activation software", "experiential software", "AR", "AI", "gamification"]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Tailored Software Solutions",
          description: "Custom software for events and brand activations.",
          provider: { "@type": "Organization", name: "iboothme" }
        }}
      />
      <Navigation />
      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Tailored Software Solutions' }]} />
        </div>
        {/* Hero */}
        <section className="relative w-full overflow-hidden min-h-[60vh] sm:min-h-[70vh] text-center mb-0 flex items-center justify-center">
          {/* Background video like inner pages */}
          <video
            className="absolute inset-0 w-full h-full object-cover bg-black -z-10"
            src="/videos/tailored.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
          />
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_-20%,transparent_0%,rgba(3,7,18,0.38)_45%,rgba(3,7,18,0.92)_70%,rgba(3,7,18,0.99)_90%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,1)_0%,rgba(0,0,0,0.85)_10%,rgba(0,0,0,0)_40%,rgba(0,0,0,0)_60%,rgba(0,0,0,0.85)_90%,rgba(0,0,0,1)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
          </div>
          <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 lg:py-28 flex flex-col items-center justify-center">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2 rounded-full border border-white/15 bg-white/10 backdrop-blur mb-4 sm:mb-6">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-sm font-semibold tracking-wide uppercase">Software Solutions</span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.05 }} className="text-3xl sm:text-5xl md:text-6xl font-black mt-1 gradient-text leading-tight">
              Tailored Software Solutions
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }} className="max-w-4xl mx-auto mt-4 sm:mt-6 text-white/80 px-2 text-base sm:text-lg md:text-xl">
              From on-site guests to remote audiences, our custom software connects everyone to your event. WebApps, interactive games, AI photo booths, and live data tracking. Every click, scan, and interaction is built to extend reach and deepen engagement.
            </motion.p>
            {/* removed iframe; video is now background */}
          </div>
        </section>

        {/* Solutions grid */}
        <section className="relative px-6 py-12 md:py-16">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
              <div className="aspect-video w-full bg-black/30 border-b border-white/10">
                <img src="/images/ar-image.jpg" alt="AR Solution" className="w-full h-full object-cover" />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-semibold">AR Solution</h3>
                <p className="text-white/80 mt-2">From transforming appearances to creating immersive worlds, our AR activations make every interaction a branded moment.</p>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
              <div className="aspect-video w-full bg-black/30 border-b border-white/10">
                <img src="/images/hybrid.jpg" alt="Hybrid Experience" className="w-full h-full object-cover" />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-semibold">Hybrid Experience</h3>
                <p className="text-white/80 mt-2">Connect physical presence with digital engagement — technology that links every touchpoint.</p>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
              <div className="aspect-video w-full bg-black/30 border-b border-white/10">
                <img src="/images/tata.jpg" alt="Registration & Check-in" className="w-full h-full object-cover" />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-semibold">Registration & Check-in</h3>
                <p className="text-white/80 mt-2">Track the full guest journey, from invitation to exit. Our apps make it simple to welcome, manage, and engage audiences.</p>
              </div>
            </div>
          </div>
          <p className="text-white/85 max-w-4xl mx-auto mt-8 text-center">Our in-house team turns bold ideas into custom digital experiences built for brands</p>
        </section>

        {/* Drive Traffic */}
        <section className="relative px-6 py-12 md:py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-4xl mx-auto mb-8">
              <h2 className="text-2xl md:text-3xl font-bold">Drive Traffic Straight To Your Store</h2>
              <p className="text-white/80 mt-3">Our software bridges digital engagement with real-world action. After completing an online experience, customers receive a unique 4-digit code. They visit your location, enter the code, and instantly unlock their reward — a seamless way to turn clicks into foot traffic.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { t: "Engage Online", d: "Customers play, quiz, or interact with your digital experience." },
                { t: "Receive Code", d: "On completion, they get a unique 4-digit code." },
                { t: "Visit Store", d: "Customers visit your store, pop-up, or event location." },
                { t: "Unlock Reward", d: "The code unlocks their reward — connecting digital to physical." },
              ].map(({ t, d }) => (
                <div key={t} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <h3 className="font-semibold mb-1">{t}</h3>
                  <p className="text-sm text-white/75">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Locker and GiftBox (reuse products card style, sourced from data) */}
        <section className="relative px-6 py-12 md:py-16">
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {(() => {
              const ids = new Set(["locker-x", "gift-box"]);
              const subset = (dataProducts as Product[]).filter(p => ids.has(p.id));
              const withHref = subset.map(p => ({ ...p, href: `/products#${p.id}` }));
              return withHref;
            })().map((p) => (
              <article key={p.id} className="group cursor-pointer relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-black/10 ring-1 ring-white/5 hover:ring-white/15 transition-all duration-500">
                <a href={p.href} className="absolute inset-0" aria-label={`Learn more about ${p.name}`}></a>
                <div className="absolute inset-0 bg-cover bg-center transform-gpu transition-transform duration-700 will-change-transform group-hover:scale-[1.06]" style={{ backgroundImage: `url('${p.image}')` }} />
                <div className="absolute inset-0 z-10 pointer-events-none">
                  <div className="absolute inset-0 bg-black/25" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/15 to-transparent mix-blend-overlay opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
                  <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_70%,rgba(0,0,0,0.55),transparent_60%)]" />
                  <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/45 to-transparent" />
                </div>
                <div className="relative z-20 pt-48 sm:pt-56 pb-7 sm:pb-9 px-6 sm:px-8 flex flex-col h-[460px] sm:h-[500px]">
                  <div className="space-y-2 mt-auto drop-shadow-[0_0_18px_rgba(0,0,0,0.16)]">
                    <div className="text-[11px] sm:text-xs text-purple-300/90 mb-1 font-medium">{p.meta}</div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight text-white">{p.name}</h3>
                    <p className="text-sm sm:text-base text-white/92 line-clamp-2">{p.description}</p>
                  </div>
                </div>
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium text-white bg-black/50 backdrop-blur-sm z-20 border border-white/10">
                  {p.tier}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative px-6 py-16">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold">Ready to Build Your Custom Software Solution?</h2>
            <p className="text-white/80 mt-3">Turn bold activation ideas into powerful, interactive tools. We design and develop software built around your brand, your audience, and your goals. Every feature is created in-house to engage, perform, and deliver results.</p>
            <CTAGroup breakpoint="md" className="justify-center mt-6">
              <Button asChild variant="creativePrimary" size="lg"><a href="/contact-us">Develop My Custom Software</a></Button>
            </CTAGroup>
          </div>
        </section>

        <FooterSection />
      </main>
    </div>
  );
}
