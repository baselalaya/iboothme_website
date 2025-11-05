import Navigation from "@/components/navigation";
import FooterSection from "@/components/footer-section";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation as SwiperNavigation } from "swiper/modules";
// removed coverflow effect for a standard slider
import "swiper/css";
import Seo from "@/components/seo";
import { applySeoToHead, fetchSeoConfig } from "@/lib/seoOverride";

export default function AITechnologyPage() {
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => { (async () => { const cfg = await fetchSeoConfig('/ai-technology'); if (cfg) applySeoToHead(cfg); })(); }, []);
  // Features showcase array
  const features = [
    {
      id: "pro-photo",
      title: "Professional Photography",
      subtitle: "Studio-grade results, every time.",
      video: {
        src: "/videos/ai-harcourt.mp4",
        poster: "/images/ai-pro-photo-poster.jpg",
      },
      bullets: [
        "Perfect lighting & composition",
        "Flattering for every guest",
        "Consistent, brand-worthy output",
      ],
      theme: "purple",
    },
    {
      id: "brand-worthy",
      title: "Brand-Worthy Results",
      subtitle: "Content made to be shared.",
      video: {
        src: "/videos/ai-song.mp4",
        poster: "/images/ai-brand-worthy-poster.jpg",
      },
      bullets: [
        "On-brand filters & overlays",
        "Social-ready formats",
        "Predictable, safe for brands",
      ],
      theme: "blue",
    },
    {
      id: "instant-studio",
      title: "Instant Studio Quality",
      subtitle: "AI perfection, instantly.",
      video: {
        src: "/videos/ai-dress.mp4",
        poster: "/images/ai-instant-studio-poster.jpg",
      },
      bullets: [
        "Real-time posture & lighting analysis",
        "No retakes needed",
        "Flawless, repeatable results",
      ],
      theme: "electric",
    },
    {
      id: "parallax",
      title: "AI Parallax Effect",
      subtitle: "Dynamic, immersive motion.",
      video: {
        src: "/videos/ai-parallax-new.mp4",
        poster: "/images/ai-parallax-poster.jpg",
      },
      bullets: [
        "Single photo → dynamic motion",
        "Immersive brand experiences",
        "Real-time parallax technology",
      ],
      theme: "purple",
    },
    {
      id: "adaptive-ai",
      title: "Adaptive AI",
      subtitle: "Refined, realistic, you.",
      video: {
        src: "/videos/ai-avatar-new.mp4",
        poster: "/images/ai-adaptive-poster.jpg",
      },
      bullets: [
        "Precision customization",
        "Intelligent body segmentation",
        "Realistic pose alignment",
      ],
      theme: "emerald",
    },
    {
      id: "smart-lighting",
      title: "Smart AI Lighting",
      subtitle: "Flattering light, every time.",
      video: {
        src: "/videos/ai-lighting.mp4",
        poster: "/images/ai-lighting-poster.jpg",
      },
      bullets: [
        "Accurate skin detection",
        "Dynamic lighting adjustment",
        "Professional preset optimization",
      ],
      theme: "purple",
    },
    
  ];

  // All carousel logic handled by Swiper

  return (
    <div
      className="relative min-h-screen text-white"
      data-testid="ai-technology-page"
    >
      <Seo
        title="AI Technology for Experiential Marketing"
        description="AI-driven photo/video, avatars, and effects to create immersive brand experiences with measurable impact."
        canonical="/ai-technology"
        ogImage="/images/studio-ai-example.jpg"
        keywords={["AI photo booth", "AI avatars", "experiential AI", "computer vision"]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "AI Technology",
          description: "AI-driven interactive experiences for events.",
          provider: { "@type": "Organization", name: "iboothme" }
        }}
      />
      <Navigation />

      {/* HERO: full-width, centered content, blended overlay */}
      <section className="relative w-full min-h-[70vh] overflow-hidden flex items-center justify-center">
        <video
          className="absolute inset-0 w-full h-full object-cover bg-black"
          src="/videos/ai-tech.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
        />
        {/* overlay stack: vertical gradient + brand tint + noise; merges to dark bottom */}
        <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_-20%,transparent_0%,rgba(3,7,18,0.38)_45%,rgba(3,7,18,0.92)_70%,rgba(3,7,18,0.99)_90%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,1)_0%,rgba(0,0,0,0.85)_10%,rgba(0,0,0,0)_40%,rgba(0,0,0,0)_60%,rgba(0,0,0,0.85)_90%,rgba(0,0,0,1)_100%)]" />
        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_85%)]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
        {/* removed purple brand tint overlay for a neutral look */}

        <div className="relative z-10 w-full px-6">
          <div className="max-w-5xl mx-auto text-center">
            <div className="mb-4 sm:mb-6 inline-flex items-center gap-3 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full border border-white/15 bg-white/10 backdrop-blur-xl">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-sm font-semibold tracking-wide uppercase">
                AI Built for Brand Impact.
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black leading-tight mb-4 md:mb-5 gradient-text px-3">
              Pioneering AI for Premium Brand Activations.
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-white/85 max-w-[40ch] sm:max-w-3xl mx-auto leading-relaxed px-3">
              Your brand deserves AI that reflects its identity, not gimmicks. Our local engineers build awesome tailored AI experiences that engage your audience.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 px-3">
              <Button variant="creativePrimary" size="lg" className="group w-full sm:w-auto">
                Start a Project
              </Button>
              <Button variant="creativeSecondary" size="lg" className="group w-full sm:w-auto">
                See Live Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* QUOTE / PHILOSOPHY */}
      <section className="relative w-full py-12 md:py-16 bg-transparent">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <blockquote className="text-2xl md:text-3xl font-semibold leading-relaxed text-white/90">
            We create AI for brands focused on impact, not just amusement.
          </blockquote>
          <div className="mt-4 text-white/60 text-sm md:text-base">Iboothme Philosophy</div>
        </div>
      </section>

      {/* SHOWCASE: Studio-Quality AI Result */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        {/* looping background video */}
        <video
          className="absolute inset-0 w-full h-full object-contain object-center -z-10"
          src="/videos/ai-example.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        {/* dark gradient overlay for readability */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/90 via-black/20 to-black/90" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_50%,rgba(0,0,0,0.45),transparent_70%)]" />

        <div className="relative max-w-2xl mx-auto px-6 py-8 md:py-10">
          <div className="group rounded-2xl sm:rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
            <img
              src="/images/studio-ai-example.jpg"
              alt="Studio-Quality AI portrait example"
              className="w-full h-[500px] md:h-full object-contain object-center"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/10 via-transparent to-black/50" />
          </div>

          <div className="text-center mt-8">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3 sm:mb-4 gradient-text">
             Studio-Grade AI Results.
            </h3>
            <p className="text-white/85 text-base sm:text-lg leading-relaxed max-w-2xl sm:max-w-3xl mx-auto">
Our AI makes every capture look professional. Photos which people will not only share instantly, but proudly frame.
            </p>
          </div>
        </div>
      </section>

      {/* Features Carousel (boxed) */}
      <section className="block">
        <div className="relative max-w-7xl mx-auto px-6">
          {/* Removed boxed wrapper background/border to make it flat */}
          <div className="relative overflow-visible min-h-[40vh] flex items-center">
          {/* side fade overlays */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-20 sm:w-28 lg:w-36 z-10 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-20 sm:w-28 lg:w-36 z-10 bg-gradient-to-l from-black/60 via-black/25 to-transparent" />
          {/* Controls */}
          <button
            type="button"
            aria-label="Previous"
            ref={prevRef}
            className="hidden lg:grid absolute left-6 inset-y-0 my-auto z-20 h-12 w-12 rounded-full bg-white/10 border border-white/20 backdrop-blur hover:bg-white/20 transition place-items-center"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="text-white/80"
            >
              <path
                d="M15 18l-6-6 6-6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next"
            ref={nextRef}
            className="hidden lg:grid absolute right-6 inset-y-0 my-auto z-20 h-12 w-12 rounded-full bg-white/10 border border-white/20 backdrop-blur hover:bg-white/20 transition place-items-center"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="text-white/80"
            >
              <path
                d="M9 18l6-6-6-6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <Swiper
            modules={[Autoplay, SwiperNavigation]}
            centeredSlides={false}
            slidesPerView={'auto'}
            spaceBetween={16}
            loop
            autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: false }}
            watchSlidesProgress
            navigation
            onBeforeInit={(swiper) => {
              // ensure navigation object exists
              // @ts-ignore
              if (!swiper.params.navigation) swiper.params.navigation = {} as any;
              // @ts-ignore
              (swiper.params.navigation as any).prevEl = prevRef.current;
              // @ts-ignore
              (swiper.params.navigation as any).nextEl = nextRef.current;
            }}
            onInit={(swiper) => {
              // After refs are set, rebind navigation safely
              const prevEl = prevRef.current as any;
              const nextEl = nextRef.current as any;
              if (prevEl && nextEl && swiper.params && (swiper.params as any).navigation) {
                (swiper.params as any).navigation.prevEl = prevEl;
                (swiper.params as any).navigation.nextEl = nextEl;
                if (swiper.navigation) {
                  swiper.navigation.destroy();
                  swiper.navigation.init();
                  swiper.navigation.update();
                }
              }
            }}
            className="!px-2 sm:!px-6 lg:!px-12"
         >
            {features.map((feature) => (
              <SwiperSlide
                key={feature.id}
                className="!w-[min(78vw,320px)] sm:!w-[min(48vw,360px)] lg:!w-[min(24vw,360px)] xl:!w-[min(22vw,380px)] !min-w-[240px] md:!min-w-[280px]"
              >
                <div className="group relative aspect-[7/12] w-full rounded-[28px] lg:rounded-[34px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition-transform duration-500 ease-out will-change-transform hover:scale-[1.02] hover:-rotate-[0.6deg]">
                  <video
                    className="absolute inset-0 w-full h-full object-cover"
                    src={feature.video.src}
                    poster={feature.video.poster}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                  />
                  {/* Subtle inner vignette for readability */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/0 to-black/60" />
                  {/* Fine inner stroke */}
                  <div className="pointer-events-none absolute inset-0 ring-1 ring-white/10" />
                  {/* Soft outer ambient glow */}
                  <div className="pointer-events-none absolute -inset-px rounded-[36px] shadow-[0_40px_120px_rgba(0,0,0,0.45)]" />
                  <div className="absolute inset-0 flex items-end p-4 sm:p-5 md:p-6">
                    <div className="text-white/95 drop-shadow-[0_6px_18px_rgba(0,0,0,0.6)] text-base sm:text-[1.05rem] md:text-[1.15rem] font-semibold tracking-wide leading-snug">
                      {feature.title}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          </div>
        </div>
      </section>

      {/* Feature Videos: styled like Personalised Merch "Proven Results" cards */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <div className="text-center mb-8 opacity-60">⸻</div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4 sm:mb-6 leading-tight">
          Proven Results for Global Brands
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {[
            { title: 'Pro Photo', desc: 'Studio-grade results, every time.', url: '/videos/ai-harcourt.mp4' },
            { title: 'Brand-Worthy', desc: 'Content made to be shared.', url: '/videos/ai-song.mp4' },
            { title: 'Parallax', desc: 'Dynamic, immersive motion.', url: '/videos/ai-parallax-new.mp4' },
          ].map((c) => (
            <MerchStyleVideoCard key={c.title} title={c.title} desc={c.desc} url={c.url} />
          ))}
        </div>
      </section>

      {/* Solutions Teaser + Carousel */}
      <section className="relative py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-white/15 bg-white/10 backdrop-blur-xl text-xs font-semibold tracking-wide uppercase">
              Innovation Meets Elegance
            </div>
            <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-black leading-tight">
              AI Powered Photo Booths
            </h2>
            <p className="mt-3 text-white/85 text-base sm:text-lg md:text-xl max-w-3xl mx-auto">
              Choose the perfect solution for your AI activations.
            </p>

          </div>

          {/* Products/Solutions Carousel (subset) */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-24 bg-gradient-to-r from-black/60 via-black/20 to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-24 bg-gradient-to-l from-black/60 via-black/20 to-transparent z-10" />
            <Swiper
              modules={[Autoplay]}
              slidesPerView={1}
              spaceBetween={14}
              loop
              autoplay={{ delay: 4200, disableOnInteraction: false, pauseOnMouseEnter: false }}
              breakpoints={{
                640: { slidesPerView: 2, spaceBetween: 16 },
                1024: { slidesPerView: 3, spaceBetween: 18 },
                1280: { slidesPerView: 4, spaceBetween: 20 },
              }}
              className="!px-2 sm:!px-6 lg:!px-12"
            >
              {[
                { id: 'iboothme-x', name: 'iboothme X', image: '/iboothmex.jpg' },
                { id: 'retro-x', name: 'Retro X', image: '/images/retro-x.jpg' },
                { id: 'vending-x', name: 'Vending X', image: '/vendingx.jpg' },
                { id: 'gobooth', name: 'Goboothme X', image: '/images/gobooth-purple.png' },
              ].map((p) => (
                <SwiperSlide key={p.id}>
                  <a href={`/products#${p.id}`} className="group block">
                    <div className="relative aspect-[7/10] w-full rounded-[24px] overflow-hidden border border-white/10 bg-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${p.image}')` }} />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-lg sm:text-xl font-bold drop-shadow-[0_6px_18px_rgba(0,0,0,0.6)]">{p.name}</h3>
                      </div>
                    </div>
                  </a>
                </SwiperSlide>
              ))}
            </Swiper>
            
          </div>
            <a href="/products" className="mt-6 flex justify-center px-3">
              <Button 
                variant="creativePrimary" 
                size="lg" 
                className="rounded-full px-6 sm:px-8 text-base sm:text-lg"
              >
                VIEW ALL SOLUTIONS
              </Button>
            </a>
        </div>
        
      </section>

      <FooterSection />
    </div>
  );
}

function MerchStyleVideoCard({ title, desc, url }: { title: string; desc: string; url: string }) {
  return (
    <div className="group rounded-2xl sm:rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
      <div className="relative aspect-[16/10]">
        <video
          className="absolute inset-0 z-0 w-full h-full object-cover"
          src={url}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/10 via-transparent to-black/50" />
      </div>
      <div className="p-5">
        <h4 className="text-lg font-semibold mb-1">{title}</h4>
        <p className="text-white/80 text-sm">{desc}</p>
      </div>
    </div>
  );
}
