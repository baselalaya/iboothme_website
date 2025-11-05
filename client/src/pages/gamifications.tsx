import Navigation from "@/components/navigation";
import Seo from "@/components/seo";
import { useEffect } from 'react';
import { applySeoToHead, fetchSeoConfig } from "@/lib/seoOverride";
import FooterSection from "@/components/footer-section";
import CTAGroup from "@/components/ui/cta-group";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Breadcrumbs from "@/components/breadcrumbs";
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

export default function GamificationsPage() {
  useEffect(() => { (async () => { const cfg = await fetchSeoConfig('/gamifications'); if (cfg) applySeoToHead(cfg); })(); }, []);
  return (
    <div className="relative min-h-screen text-white">
      <Seo
        title="Gamifications for Events"
        description="Interactive games and challenges that boost engagement and create shareable brand moments."
        canonical="/gamifications"
        ogImage="/images/gumball-x-purple.png"
        keywords={["gamification", "interactive games", "event engagement"]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Gamifications",
          description: "Interactive games for events.",
          provider: { "@type": "Organization", name: "iboothme" }
        }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_50%_at_50%_0%,rgba(112,66,210,0.12),transparent_60%),radial-gradient(60%_40%_at_80%_100%,rgba(34,212,253,0.10),transparent_60%)]" />
      <Navigation />
      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Gamifications' }]} />
        </div>
        {/* Hero */}
        <section className="relative w-full overflow-hidden min-h-[60vh] sm:min-h-[70vh] text-center mb-0 flex items-center justify-center">
          <video className="absolute inset-0 w-full h-full object-cover bg-black -z-10" src="/videos/gamification-iboothme.mp4" autoPlay loop muted playsInline preload="metadata" />
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_-20%,transparent_0%,rgba(3,7,18,0.38)_45%,rgba(3,7,18,0.92)_70%,rgba(3,7,18,0.99)_90%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,1)_0%,rgba(0,0,0,0.85)_10%,rgba(0,0,0,0)_40%,rgba(0,0,0,0)_60%,rgba(0,0,0,0.85)_90%,rgba(0,0,0,1)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
          </div>
          <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 lg:py-28 flex flex-col items-center justify-center">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2 rounded-full border border-white/15 bg-white/10 backdrop-blur mb-4 sm:mb-6">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-sm font-semibold tracking-wide uppercase">Engagement Boost</span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.05 }} className="text-3xl sm:text-5xl md:text-6xl font-black mt-1 gradient-text leading-tight">
              Gamification
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }} className="max-w-3xl mx-auto mt-4 sm:mt-6 text-white/80 px-2 text-base sm:text-lg md:text-xl">
              Deliver your marketing message in a way that feels natural and engaging. Games hold attention longer, spark genuine interaction, and make your message part of the experience.
            </motion.p>
          </div>
        </section>

        {/* Custom Games For Your Brand */}
        <section className="relative px-6 py-12 md:py-16">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Gamification <span className="gradient-text">For Your Event</span></h2>
            <p className="text-white/80 mt-3">We design and develop games tailored specifically to your brand activation, ensuring maximum impact and engagement. Every element is crafted with your marketing objectives in mind, turning play into powerful brand storytelling.</p>
          </div>
          <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { t: "Brand Story", d: "Visuals and mechanics designed around your brand message." },
              { t: "Multi-Platform", d: "Playable on mobile, kiosks, screens, and online." },
              { t: "Hardware Compatible", d: "Seamless with sensors, controllers, cameras, and custom devices." },
              { t: "Engagement Focused", d: "Increase dwell time, capture data, and create shareable moments." },
            ].map(({ t, d }) => (
              <div key={t} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h3 className="font-semibold mb-1">{t}</h3>
                <p className="text-sm text-white/75">{d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Games We've Developed - Vertical Cards Carousel */}
        <section className="relative px-6 py-12 md:py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold">Engagement <span className="gradient-text">Focused</span></h2>
            <p className="text-white/80 mt-3">Hold audience attention up to three times longer, your message delivered naturally, as part of the play.</p>
          </div>
          <div className="relative max-w-7xl mx-auto mt-8">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-24 bg-gradient-to-r from-black/60 via-black/20 to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-24 bg-gradient-to-l from-black/60 via-black/20 to-transparent z-10" />
            <Swiper
              modules={[Autoplay]}
              slidesPerView={'auto'}
              spaceBetween={16}
              loop
              autoplay={{ delay: 4200, disableOnInteraction: false, pauseOnMouseEnter: false }}
              className="!px-2 sm:!px-6 lg:!px-12"
            >
              {[
                { t: "Sephora Mobile Game", d: "Quiz + mini-game for product discovery, built with data capture.", img: "/images/SephoraGame.png" },
                { t: "Samsung Quiz Game", d: "Timed challenge with scores and shareable results.", img: "/images/Notequestsamsung.png" },
                { t: "Virgin Game Integration", d: "Brand story embedded into casual gameplay moments.", img: "/images/Virgintechfest.png" },
                { t: "Coca Cola Memory Game", d: "Match, play, and remember your brand.", img: "/images/Coca Cola memory game.png" },
              ].map(({ t, d, img }) => (
                <SwiperSlide key={t} className="!w-[min(78vw,320px)] sm:!w-[min(48vw,360px)] lg:!w-[min(24vw,360px)] xl:!w-[min(22vw,380px)] !min-w-[240px] md:!min-w-[280px]">
                  <div className="group relative aspect-[7/12] w-full rounded-[28px] overflow-hidden border border-white/10 bg-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition-transform duration-500 ease-out will-change-transform hover:scale-[1.02]">
                    <img src={img} alt={t} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60" />
                    <div className="absolute inset-0 ring-1 ring-white/10" />
                    <div className="absolute inset-0 flex items-end p-4">
                      <div>
                        <h3 className="text-white text-base sm:text-lg font-semibold drop-shadow-[0_6px_18px_rgba(0,0,0,0.6)]">{t}</h3>
                        <p className="mt-1 text-xs text-white/80 max-w-[32ch]">{d}</p>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>

        

        {/* Final CTA */}
        <section className="relative px-6 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold">Ready to Create <span className="gradient-text">Your Custom Game?</span></h2>
            <p className="text-white/80 mt-3">Transform your marketing message into an engaging, interactive experience. We design and build games tailored to your brand activation, ensuring maximum impact and audience connection.</p>
            <CTAGroup breakpoint="md" className="justify-center mt-6">
              <Button asChild variant="creativePrimary" size="lg">
                <a href="/contact-us">Bring My Game to Life</a>
              </Button>
            </CTAGroup>
          </div>
        </section>

        <FooterSection />
      </main>
    </div>
  );
}
