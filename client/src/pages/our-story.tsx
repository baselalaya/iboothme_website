import Navigation from "@/components/navigation";
import Seo from "@/components/seo";
import { useEffect } from 'react';
import { applySeoToHead, fetchSeoConfig } from "@/lib/seoOverride";
// removed hook-based SEO override
import FooterSection from "@/components/footer-section";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation as SwiperNavigation, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import { useRef, useState } from "react";

export default function OurStoryPage() {
  useEffect(() => { (async () => { const cfg = await fetchSeoConfig('/our-story'); if (cfg) applySeoToHead(cfg); })(); }, []);
  const [showVideo, setShowVideo] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowVideo(false)
      }
    }
    if (showVideo) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [showVideo])
  const storyRef = useRef<HTMLDivElement | null>(null);
  const team = [
    { name: "Ben", role: "Sales Director" },
            { name: "Sarah", role: "Marketing Specialist" },
    { name: "Saqib", role: "Sales Manager" },
    { name: "Modar", role: "Account Manager" },
    { name: "Shubhneet", role: "Marketing Manager" },
    { name: "Robin", role: "Senior Accountant" },
    { name: "Alex", role: "Operations Manager" },
    { name: "Laith", role: "Embedded System Engineer" },
        { name: "Maya Lin ", role: "Project Coordinator" },
    { name: "Asem", role: "Project Manager" },
    { name: "Wendell", role: "Event Operations" },
    { name: "Firas", role: "Event Operations" },
    { name: "Howell", role: "Creative Head" },
  ];

  function formatNameForImage(name: string) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  return (
    <div className="relative min-h-screen text-white" data-testid="our-story-page">
      <Seo
        title="Our Story"
        description="iboothme: crafting immersive experiential marketing technology and unforgettable brand activations."
        canonical="/our-story"
        ogImage="/images/Youssef-Founder.jpg"
        keywords={["iboothme story", "about iboothme", "experiential marketing"]}
      />
      <Navigation />

      {/* Hero */}
      <section className={`relative w-full overflow-hidden ${showVideo ? 'min-h-[100vh]' : 'min-h-[70vh]'} transition-all duration-500 ease-out`}>
        {/* background subtle gradient + noise */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_-20%,transparent_0%,rgba(3,7,18,0.35)_45%,rgba(3,7,18,0.9)_70%,rgba(3,7,18,0.98)_90%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,1)_0%,rgba(0,0,0,0.85)_10%,rgba(0,0,0,0)_40%,rgba(0,0,0,0)_60%,rgba(0,0,0,0.85)_90%,rgba(0,0,0,1)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_0%,rgba(112,66,210,0.15),transparent_60%)]" />
        {/* bottom fade to merge into founder section (reversed) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 md:h-40 bg-gradient-to-t from-black/40 via-black/20 to-transparent" />
        {/* ambient background video (muted) */}
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-25 md:opacity-35 overflow-hidden">
          <video
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.78vh] h-[100vh] md:w-[177.78vw] md:h-[56.25vw] max-w-none"
            src="/videos/our-story.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        </div>
        <div className={`relative max-w-6xl mx-auto px-6 ${showVideo ? 'py-0' : 'py-20 md:py-24 lg:py-28'} text-center ${showVideo ? 'min-h-[100vh]' : 'min-h-[70vh]'} flex flex-col items-center justify-center transition-all duration-500 ease-out`}>
          <div className={`mb-4 inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-white/15 bg-white/10 backdrop-blur transition-all duration-500 ease-out ${showVideo ? 'opacity-0 translate-y-1 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="text-sm font-semibold tracking-wide uppercase">Our Story</span>
          </div>
          <h1 className={`text-4xl md:text-6xl font-black leading-tight mb-5 gradient-text transition-all duration-500 ease-out ${showVideo ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'} px-3`}>
            WELCOME TO OUR FAMILY
          </h1>
          <p className={`text-lg md:text-xl text-white/85 max-w-3xl mx-auto transition-all duration-500 ease-out ${showVideo ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'} px-3`}>
            Behind iboothme is a team of engineers, creators, and innovators building next-level activations for some of the world's top brands.
          </p>
          {!showVideo && (
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 transition-all duration-500 ease-out px-3">
              <Button variant="creativePrimary" size="lg" className="w-full sm:w-auto">Work With Us</Button>
          <Button variant="creativeSecondary" size="lg" className="w-full sm:w-auto" onClick={() => setShowVideo(true)}>Inside iboothme</Button>
            </div>
          )}
        </div>
        {/* Full height player when watching (no dark overlay) */}
        <button
          aria-label="Close video"
          className={`absolute top-4 right-4 z-20 rounded-full px-3 py-1.5 text-sm bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-500 ease-out ${showVideo ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
          onClick={() => setShowVideo(false)}
        >
          Close ✕
        </button>
        <video
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.78vh] h-[100vh] md:w-[177.78vw] md:h-[56.25vw] max-w-none z-10 transition-all duration-500 ease-out ${showVideo ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.98] pointer-events-none'}`}
          src="/videos/our-story.mp4"
          autoPlay
          loop
          playsInline
          preload="metadata"
          muted={!showVideo}
          controls={showVideo}
        />
      </section>

      {/* Inline modal removed; fullscreen hero takeover handles playback */}

      {/* Divider (removed to close gap) */}
      {/* <div className="relative max-w-6xl mx-auto px-6">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      </div> */}

      {/* Story */}
      <section className="relative pt-16 md:pt-24 pb-0 md:pb-8">
        {/* static gradient background, softened to blend with neighbors */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(78%_62%_at_50%_0%,rgba(112,66,210,0.10),transparent_70%),radial-gradient(78%_62%_at_50%_100%,rgba(34,212,253,0.08),transparent_70%)] after:absolute after:inset-x-0 after:top-0 after:h-28 md:after:h-40 after:bg-gradient-to-b after:from-black/0 after:to-black/20 before:absolute before:inset-x-0 before:bottom-0 before:h-28 md:before:h-40 before:bg-gradient-to-t before:from-black/0 before:to-black/20"
        />
        <div ref={storyRef} className="max-w-6xl mx-auto px-6 grid md:grid-cols-12 gap-10 items-start md:items-center">
          {/* Left: Founder Portrait with overlay */}
          <aside className="md:col-span-5 order-2 md:order-1 h-full">
            <figure className="relative h-full aspect-[3/4] rounded-3xl overflow-hidden border-4 border-gradient-to-br from-purple-600 via-blue-500 to-teal-400 shadow-[0_0_15px_rgba(112,66,210,0.7)] group transition-shadow duration-500 hover:shadow-[0_0_20px_5px_rgba(112,66,210,0.9)]">
              <img
                src="/images/Youssef-Founder.jpg"
                alt="Youssef, Founder of iboothme"
                className="absolute inset-0 w-full h-full object-cover will-change-transform transition-transform duration-500 group-hover:scale-[1.03]"
                loading="lazy"
                decoding="async"
              />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.18)_0%,transparent_28%,transparent_72%,rgba(255,255,255,0.09)_100%)] opacity-60 mix-blend-overlay transition-transform duration-700 group-hover:translate-y-[-2%]" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40" />
              <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent px-4 py-3 backdrop-blur-sm text-center text-white">
                <div className="text-lg font-bold">Youssef</div>
                <div className="text-sm text-white/80">Founder & Visionary</div>
              </figcaption>
            </figure>
          </aside>

          {/* Right: Heading, badges, narrative */}
          <section className="md:col-span-7 order-1 md:order-2 text-white/85 space-y-6 leading-relaxed relative">
            <h2 className="text-3xl md:text-4xl font-black mb-3">How did it all start?</h2>
            <div className="grid grid-cols-1 gap-5">
              <motion.p
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                className="col-span-1"
              >
                I’m Youssef — founder of iboothme. Back in 2011, I saw a gap in the way brands connected with people at events. The tech felt generic. The experiences felt forgettable.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
                viewport={{ once: true, amount: 0.4 }}
                className="col-span-1"
              >
                So I decided to change that. I wanted the freedom to create experiences tailored for every brand. Software and hardware engineered not just to impress, but to make every interaction meaningful, seamless, and truly make sense for brands.
              </motion.p>
            </div>
            <motion.blockquote
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
              viewport={{ once: true, amount: 0.4 }}
              className="border-l-2 border-white/20 pl-4 italic text-white/90"
            >
              “That’s how iboothme was born — from a belief that brand activations should be more than a moment and a vision to transform how brands connect with their audiences.”
            </motion.blockquote>
            <motion.p
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.45 }}
              viewport={{ once: true, amount: 0.4 }}
            >
              Today, that vision is stronger than ever. Creating custom, tech-powered experiences that help your brand stand out and make lasting connections.
            </motion.p>
            <Button asChild variant="creativeSecondary" size="lg" className="group">
              <a href="https://www.linkedin.com/in/youssefkibbe/" target="_blank" rel="noreferrer">
                <span className="inline-block mr-2 text-lg font-bold leading-none">in</span>Connect with Youssef
              </a>
            </Button>
          </section>
        </div>

        {/* Stats */}
        <div className="max-w-6xl mx-auto px-6 mt-8 md:mt-10 pb-8 md:pb-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { k: "14", v: "Years of Innovation" },
            { k: "45K+", v: "Brand Activations" },
            { k: "∞", v: "Possibilities" },
          ].map((s, i) => (
            <div key={i} className="relative rounded-3xl lg:rounded-[2.5rem] border border-white/10 bg-white/5 p-10 text-center overflow-hidden transition-all duration-500 hover:bg-gradient-to-br hover:from-white/10 hover:to-white/5 hover:border-white/20">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120px_60px_at_50%_0%,rgba(255,255,255,0.12),transparent)]" />
              <div className="text-6xl md:text-7xl font-black mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 drop-shadow-[0_0_20px_rgba(167,139,250,0.5)]">{s.k}</div>
              <div className="text-base md:text-lg text-white/70 tracking-wide uppercase">{s.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Divider (removed to close gap) */}
      {/* <div className="relative max-w-6xl mx-auto px-6">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      </div> */}

      {/* Team */}
      <section className="relative pt-6 md:pt-24 pb-16 md:pb-24 -mt-6 md:-mt-8">
        {/* soft blended background matching founder section */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(78%_62%_at_50%_0%,rgba(34,212,253,0.08),transparent_70%),radial-gradient(78%_62%_at_50%_100%,rgba(112,66,210,0.10),transparent_70%)] after:absolute after:inset-x-0 after:top-0 after:h-28 md:after:h-40 after:bg-gradient-to-b after:from-black/0 after:to-black/20 before:absolute before:inset-x-0 before:bottom-0 before:h-28 md:before:h-40 before:bg-gradient-to-t before:from-black/0 before:to-black/20"
        />
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black gradient-text drop-shadow-[0_0_8px_rgba(167,139,250,0.7)]">Meet Our Amazing Family</h2>
            <p className="text-white/75 mt-5 mb-8 px-3">Get to know the passionate individuals who make the magic happen.</p>
          </div>
          <div className="relative">
            {/* Controls */}
            <button
              type="button"
              aria-label="Previous"
              className="swiper-prev absolute -left-4 sm:-left-8 md:-left-10 lg:-left-12 top-1/2 -translate-y-1/2 z-20 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/10 border border-white/20 backdrop-blur hover:bg-white/20 transition grid place-items-center shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white/80">
                <path d="M15 18l-6-6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next"
              className="swiper-next absolute -right-4 sm:-right-8 md:-right-10 lg:-right-12 top-1/2 -translate-y-1/2 z-20 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/10 border border-white/20 backdrop-blur hover:bg-white/20 transition grid place-items-center shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white/80">
                <path d="M9 18l6-6-6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {/* side masks removed */}
            <Swiper
              modules={[Autoplay, SwiperNavigation, EffectCoverflow]}
              slidesPerView="auto"
              spaceBetween={14}
              loop
              centeredSlides
              autoplay={{ delay: 3400, disableOnInteraction: false, pauseOnMouseEnter: true }}
              navigation={{ prevEl: ".swiper-prev", nextEl: ".swiper-next" }}
              effect="coverflow"
              coverflowEffect={{ rotate: 22, stretch: 0, depth: 180, modifier: 1, slideShadows: false }}
              className="!px-4 sm:!px-6 md:!px-8 lg:!px-10 !py-4 sm:!py-6 md:!py-8 lg:!py-10 min-h-[380px] sm:min-h-[420px] md:min-h-[520px] lg:min-h-[560px]"
            >
              {team.map((m, idx) => (
                <SwiperSlide
                  key={m.name}
                  className="!w-[82%] xs:!w-[68%] sm:!w-[52%] md:!w-[36%] lg:!w-[26%] xl:!w-[24%] transition-transform duration-300 ease-out [&.swiper-slide-active>div]:ring-1 [&.swiper-slide-active>div]:ring-white/10 [&.swiper-slide-active>div]:shadow-[0_30px_90px_rgba(112,66,210,0.18)] [&.swiper-slide-active>div]:scale-[1.80] [&:not(.swiper-slide-active)>div]:opacity-70 [&:not(.swiper-slide-active)>div]:blur-[1.5px] md:[&:not(.swiper-slide-active)>div]:blur-[2px]"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: Math.min(idx * 0.03, 0.3) }}
                    className="group rounded-[32px] p-0 hover:scale-[1.02] transition-all duration-300 ease-out relative overflow-hidden h-full bg-gradient-to-b from-[#0e0e0e] to-[#111]"
                    onMouseMove={(e) => {
                      const t = e.currentTarget as HTMLElement;
                      const r = t.getBoundingClientRect();
                      const x = ((e.clientX - r.left) / r.width) * 100;
                      const y = ((e.clientY - r.top) / r.height) * 100;
                      t.style.setProperty('--mx', x + '%');
                      t.style.setProperty('--my', y + '%');
                    }}
                  >
                    {/* Subtle glass ring */}
                    <div className="absolute inset-0 rounded-[32px] ring-1 ring-white/10" />
                    {/* Spotlight cursor glow */}
                    <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "radial-gradient(180px 120px at var(--mx,50%) var(--my,50%), rgba(112,66,210,0.18), transparent 60%)" }} />
                    {/* Portrait with subtle depth (Apple-like) */}
                    <div className="aspect-[4/5] md:aspect-[7/9] w-full flex items-center justify-center rounded-t-[32px] overflow-hidden relative bg-[#0b0b0b]">
                      <img
                        src={`/images/${formatNameForImage(m.name)}.jpg`}
                        alt={`${m.name}, ${m.role}`}
                        className="w-full h-full object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] will-change-transform"
                      />
                      {/* Gentle top light */}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-transparent" />
                    </div>
                    {/* Nameplate minimal */}
                    <div className="px-5 md:px-6 py-4 rounded-b-[32px] relative">
                      <div className="flex items-center justify-start">
                        <div className="text-[1.05rem] md:text-xl font-semibold tracking-tight text-white/95">{m.name}</div>
                      </div>
                      <div className="text-xs md:text-sm text-white/60 tracking-wide mt-1">{m.role}</div>
                    </div>
                    {/* Soft shadow for lift */}
                    <div className="pointer-events-none absolute -inset-px rounded-[32px] shadow-[0_30px_80px_rgba(0,0,0,0.5)]" />
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      {/* Divider removed with Behind the Scenes section */}

      <FooterSection />
    </div>
  );
}
