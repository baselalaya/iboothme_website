import Navigation from "@/components/navigation";
import Seo from "@/components/seo";
import { useEffect } from 'react';
import { applySeoToHead, fetchSeoConfig } from "@/lib/seoOverride";
// removed hook-based SEO override
import FooterSection from "@/components/footer-section";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { trackEvent } from "@/lib/ga";
import { useState } from "react";
import Portal from "@/components/portal";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import Breadcrumbs from "@/components/breadcrumbs";

export default function PersonalisedMerchPage() {
  useEffect(() => { (async () => { const cfg = await fetchSeoConfig('/personalised-merch'); if (cfg) applySeoToHead(cfg); })(); }, []);
  return (
    <div className="relative min-h-screen text-white">
      <Seo
        title="Personalised Merchandise for Events"
        description="On-demand custom merchandise for events and activations with branding, QR flows, and instant fulfillment."
        canonical="/personalised-merch"
        ogImage="/images/gift-box-purple.png"
        keywords={["personalised merch", "custom giveaways", "event merchandise"]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Personalised Merchandise",
          description: "On-demand branded merchandise for events.",
          provider: { "@type": "Organization", name: "iboothme" }
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_50%_at_50%_0%,rgba(112,66,210,0.12),transparent_60%),radial-gradient(60%_40%_at_80%_100%,rgba(34,212,253,0.10),transparent_60%)]"
      />
      <Navigation />
      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Personalised Merch' }]} />
        </div>
        {/* Hero */}
        <section className="relative w-full min-h-[60vh] sm:min-h-[70vh] overflow-hidden text-center mb-8 sm:mb-14 rounded-[20px] sm:rounded-[28px] flex items-center justify-center">
          <div className="absolute inset-0 -z-10 opacity-30 overflow-hidden">
            <video
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.78vh] h-[100vh] md:w-[177.78vw] md:h-[56.25vw] max-w-none"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src="/videos/customization.mp4" />
            </video>
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,1)_0%,rgba(0,0,0,0.85)_10%,rgba(0,0,0,0)_40%,rgba(0,0,0,0)_60%,rgba(0,0,0,0.85)_90%,rgba(0,0,0,1)_100%)]" />
            <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_82%)]" />
          </div>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-20 lg:py-24 flex flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2 rounded-full border border-white/15 bg-white/10 backdrop-blur mb-4 sm:mb-6"
            >
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-sm font-semibold tracking-wide uppercase">
                Real-Time Personalization Technology
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="text-3xl sm:text-4xl md:text-6xl font-black gradient-text px-3 leading-tight"
            >
              The Power of Live Personalization
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="text-base sm:text-lg md:text-xl text-white/85 mt-3 sm:mt-4 max-w-[34ch] sm:max-w-3xl mx-auto leading-relaxed px-3"
            >
              We turn giveaways into brand moments. From laser engraving to instant printing, every item is personalized live so your guests don't just receive a gift, they carry your brand with them long after the event.
            </motion.p>
            <div className="mt-6 sm:mt-8 px-3 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/contact-us?utm_source=site&utm_medium=hero&utm_campaign=personalised-merch"
                onClick={() => { try { trackEvent('select_promotion', { creative_name: 'personalised-merch_hero', promotion_name: 'Personalize for My Event' }); } catch {} }}
                className="inline-block w-full sm:w-auto"
              >
                <Button
                  variant="creativePrimary"
                  size="lg"
                  className="w-full md:w-auto text-base sm:text-lg py-6"
                >
                  Personalize for My Event
                </Button>
              </a>
              <a
                href="/products?utm_source=site&utm_medium=hero&utm_campaign=personalised-merch"
                onClick={() => { try { trackEvent('select_promotion', { creative_name: 'personalised-merch_hero', promotion_name: 'Explore Products' }); } catch {} }}
                className="inline-block w-full sm:w-auto"
              >
                <Button
                  variant="creativeSecondary"
                  size="lg"
                  className="w-full md:w-auto text-base sm:text-lg py-6"
                >
                  Explore Products
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Custom Software & Hardware */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-12">
          <div className="text-center mb-8 opacity-60">⸻</div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-3 sm:mb-4 leading-tight">Custom Software &amp; Hardware? Absolutely.</h2>
          <p className="text-center text-white/80 max-w-3xl mx-auto mb-8 px-2">We build bespoke software and hardware to personalize your products and create live brand experiences. With real-time personalization, every giveaway becomes a brand moment that lasts.</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-stretch ">
            <div className="p-5 sm:p-6 md:p-8">
              <h3 className="text-xl font-semibold mb-2">
                NIKE Personalization Experience
              </h3>
              <p className="text-white/80 mb-4">
                We designed Nike’s end-to-end personalization ecosystem.
                Bringing digital creativity into the store.
              </p>
              <p className="text-white/80 mb-4">
                Guests scan a QR code or use interactive kiosks to design their
                own apparel with graphics.
              </p>
              <p className="text-white/80 mb-4">
                {" "}
                Our smart system manages real-time production updates and
                enables seamless, contactless pickup from lockers. From design
                to delivery, every step was engineered to make personalization
                effortless, scalable, and unforgettable.
              </p>
              <ul className="text-white/85 text-sm space-y-2.5">
                {["Custom Software Development","Hardware Integration","Automated Smart Locker Integration","Real-time Engagement"].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-400/30">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </span>
                    <span><b>{item}</b></span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              {/* subtle bezel frame (kept minimal) */}
              <div className="absolute inset-3 sm:inset-4 pointer-events-none z-10" />
              <div className="relative mx-auto my-3 sm:my-4 w-[72%] sm:w-[62%] lg:w-[72%] max-w-[700px]">
                <video
                  className="w-full h-full object-cover aspect-[9/16] rounded-[1.25rem]"
                  src="/videos/Nike.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-transparent to-black/30" />
            </div>
          </div>
        </section>

        {/* Our Live Personalization Services */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-12">
          <div className="text-center mb-8 opacity-60">⸻</div>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
            Proven Results for Global Brands
          </h2>
          <p className="text-center mb-6">
            Discover how top brands have elevated their activations through our
            live personalization technology, turning every interaction into a
            powerful brand moment.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                title: "Philips",
                desc: "Personalized coffee coasters that kept Philips top of mind.",
                videoUrl: "/videos/philips-coasters.mp4",
              },
              {
                title: "L’Oréal",
                desc: "Live serum bottle personalized with guests’ names elegantly engraved on-site.",
                videoUrl: "/videos/loreal-serum.mp4",
              },
              {
                title: "TATA",
                desc: "From AI avatar to personalized notebook in minutes.",
                videoUrl: "/videos/tata-notebook.mp4",
              },
            ].map((c) => (
              <ServiceVideoCard
                key={c.title}
                title={c.title}
                desc={c.desc}
                url={c.videoUrl}
              />
            ))}
          </div>
        </section>

        {/* Products We Customize for Brands */}
        <section className="max-w-7xl mx-auto px-6 mb-12">
          <div className="text-center mb-8 opacity-60">⸻</div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4 sm:mb-6 leading-tight">
            Products We Personalize for Brands
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <ProductCard
              title="Beauty & Cosmetics"
              desc="Makeup palettes, perfumes, skincare."
              media={{ type: "image", src: "/images/makeup.png" }}
              chip="Beauty"
            />
            <ProductCard
              title="Fashion & Apparel"
              desc="Shoes, tees, bags."
              media={{ type: "image", src: "/images/fashion.png" }}
              chip="Fashion"
            />
            <ProductCard
              title="Tech & Accessories"
              desc="Phones, headphones, laptops."
              media={{ type: "image", src: "/images/tech.png" }}
              chip="Tech"
            />
            <ProductCard
              title="Lifestyle Products"
              desc="Water bottles, mugs, stationery."
              media={{ type: "image", src: "/images/lifestyle.png" }}
              chip="Lifestyle"
            />
          </div>
        </section>

        {/* Works with Your Iboothme Setup */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-12">
          <div className="text-center mb-8 opacity-60">⸻</div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4 sm:mb-6 leading-tight">
            Works with Your Iboothme Setup
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
            <a href="/products/iboothme-x" className="block">
            <SetupCard
              title="Iboothme X"
              desc="Touchscreen photo booth integration."
              media={{ type: "image", src: "/iboothmex.jpg" }}
              chip="Touchscreen"
            />
            </a>
            <a href="/products/retro-x" className="block">
            <SetupCard
              title="Retro X"
              desc="Retro-styled immersive activation system."
              media={{ type: "image", src: "/images/retro-x.jpg" }}
              chip="Retro"
            />
            </a>
            <a href="/products/vending-x" className="block">
            <SetupCard
              title="Vending X"
              desc="Product delivery meets brand engagement."
              media={{ type: "image", src: "/vendingx.jpg" }}
              chip="Vending"
            />
            </a>
            <a href="/products/the-claw" className="block">
            <SetupCard
              title="The Claw"
              desc="Gamified engagement and data capture."
              media={{ type: "image", src: "/TheClaw.jpg" }}
              chip="Gaming"
            />
            </a>
            <a href="/products/gumball-x" className="block">
            <SetupCard
              title="The GumBall"
              desc="Interactive acrylic ball activation."
              media={{ type: "image", src: "/images/gumball-x-purple.png" }}
              chip="Interactive"
            />
            </a>
          </div>
        </section>

        {/* Why Live Customization Wins */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
          <div className="text-center mb-8 opacity-60">⸻</div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4 sm:mb-6 leading-tight">
            Why Live Personalization Wins?
          </h2>
          <p className="text-center mb-6">When guests see your product personalized with their name or photo, it becomes more than a gift; it’s a personal connection. That bond keeps your brand unforgettable and draws them back to you.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-8">
            {[
              { k: "85%", v: "Higher Engagement" },
              { k: "3x", v: "Brand Recall" },
              { k: "92%", v: "Keep Rate" },
              { k: "67%", v: "Social Shares" },
            ].map((s, i) => (
              <div
                key={i}
                className="relative rounded-3xl lg:rounded-[2.5rem] border border-white/10 bg-white/5 p-10 text-center overflow-hidden transition-all duration-500 hover:bg-gradient-to-br hover:from-white/10 hover:to-white/5 hover:border-white/20"
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120px_60px_at_50%_0%,rgba(255,255,255,0.12),transparent)]" />
                <div className="text-4xl md:text-5xl font-black mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
                  {s.k}
                </div>
                <div className="text-sm md:text-base text-white/70 tracking-wide uppercase">
                  {s.v}
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <Service
              title="Instant Brand Connection"
              desc="Guests leave with branded items they love."
            />
            <Service
              title="Social Media Amplification"
              desc="Unique shareable moments fuel organic reach."
            />
            <Service
              title="Event Highlights"
              desc="Customization creates unforgettable activations."
            />
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-16 text-center">
          <div className="text-center mb-8 opacity-60">⸻</div>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-2 sm:mb-3 px-2 leading-tight">
            Ready to Transform Your Brand Activation?
          </h3>
          <p className="text-white/80 max-w-3xl mx-auto mb-5 sm:mb-6 px-2">
Join the leading brands who use live personalization to create deeper connections, drive engagement, and amplify their brand visibility at events.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 px-3 sm:px-0">
            <Button
              variant="creativePrimary"
              size="lg"
              className="w-full md:w-auto text-base sm:text-lg py-6"
            >
              Start Your Personalization Journey
            </Button>
          </div>
        </section>
      </main>
      <FooterSection />
    </div>
  );
}

function VideoPreviewCard({ url, title }: { url: string; title: string }) {
  function openInlineVideoModal(url: string): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="relative aspect-[16/10]">
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src={url}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      />
      <button
        type="button"
        className="group absolute inset-0 grid place-items-center bg-black/0 hover:bg-black/10 transition-colors"
        aria-label={`Play ${title}`}
        onClick={() => openInlineVideoModal(url)}
      >
        <span className="inline-flex items-center justify-center h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-white/90 text-black shadow-lg group-hover:scale-105 transition-transform">
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </button>
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/50" />
    </div>
  );
}

declare global {
  interface Window {
    openInlineVideoModal?: (url: string) => void;
  }
}
if (typeof window !== "undefined") {
  (window as any).openInlineVideoModal = (url: string) => {
    const overlay = document.createElement("div");
    overlay.className =
      "fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4";
    overlay.tabIndex = -1;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        cleanup();
      }
    };
    const cleanup = () => {
      try {
        document.body.removeChild(overlay);
        document.removeEventListener("keydown", onKey);
      } catch (_) {}
    };
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) cleanup();
    });
    document.addEventListener("keydown", onKey);
    const vid = document.createElement("video");
    vid.className =
      "w-full max-w-5xl aspect-video rounded-xl border border-white/15 bg-black";
    vid.src = url;
    vid.autoplay = true as any;
    (vid as any).controls = true;
    (vid as any).playsInline = true;
    vid.muted = false;
    const closeBtn = document.createElement("button");
    closeBtn.setAttribute("aria-label", "Close");
    closeBtn.className =
      "absolute top-4 right-4 h-10 w-10 rounded-full bg-white/90 text-black grid place-items-center";
    closeBtn.innerHTML =
      '<svg width=20 height=20 viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18"></path><path d="M6 6l12 12"></path></svg>';
    closeBtn.addEventListener("click", cleanup);
    overlay.appendChild(vid);
    overlay.appendChild(closeBtn);
    document.body.appendChild(overlay);
    setTimeout(() => {
      try {
        (vid as any).play?.();
      } catch (_) {}
    }, 0);
  };
}
function Service({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
      <div className="font-semibold mb-1">{title}</div>
      <div className="text-white/75 text-sm">{desc}</div>
    </div>
  );
}

type Media = { type: "image" | "video"; src: string };

function MerchSlideCard({
  tag,
  title,
  desc,
  media,
}: {
  tag: string;
  title: string;
  desc: string;
  media?: Media;
}) {
  return (
    <div className="group relative aspect-[7/12] w-full rounded-[34px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition-transform duration-500 ease-out will-change-transform hover:scale-[1.02] hover:-rotate-[0.6deg]">
      {media && (
        <div className="absolute inset-0 overflow-hidden">
          {media.type === "image" ? (
            <img
              src={media.src}
              alt={title}
              className="w-full h-full object-cover will-change-transform transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
            />
          ) : (
            <video
              className="w-full h-full object-cover"
              src={media.src}
              autoPlay
              loop
              muted
              playsInline
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/0 to-black/60" />
          <div className="pointer-events-none absolute inset-0 ring-1 ring-white/10" />
          <div className="pointer-events-none absolute -inset-px rounded-[36px] shadow-[0_40px_120px_rgba(0,0,0,0.45)]" />
        </div>
      )}
      <div className="absolute inset-0 flex items-end p-5 md:p-6">
        <div>
          <span className="inline-block text-[10px] px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/15 uppercase tracking-wide mb-2">
            {tag}
          </span>
          <div className="text-white/95 drop-shadow-[0_6px_18px_rgba(0,0,0,0.6)] text-base md:text-lg font-semibold leading-snug">
            {title}
          </div>
          <div className="text-white/80 text-xs md:text-sm mt-1 max-w-[28ch]">
            {desc}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductCard({
  title,
  desc,
  media,
  chip,
}: {
  title: string;
  desc: string;
  media?: Media;
  chip?: string;
}) {
  return (
    <div className="group relative overflow-hidden transition-all duration-500">
      {media && (
        <div className="relative h-40 md:h-50 overflow-hidden">
          {media.type === "image" ? (
            <img
              src={media.src}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
            />
          ) : (
            <video
              className="w-full h-full object-cover"
              src={media.src}
              autoPlay
              loop
              muted
              playsInline
            />
          )}
        </div>
      )}
      <div className="p-5">
        <h4 className="text-lg font-semibold mb-1">{title}</h4>
        <p className="text-white/75 text-sm">{desc}</p>
      </div>
    </div>
  );
}

function SetupCard({
  title,
  desc,
  media,
  chip,
}: {
  title: string;
  desc: string;
  media?: Media;
  chip?: string;
}) {
  return (
    <div className="group relative aspect-[7/12] w-full rounded-[34px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition-transform duration-500 ease-out will-change-transform hover:scale-[1.02] hover:-rotate-[0.6deg]">
      {media && (
        <div className="absolute inset-0 overflow-hidden">
          {media.type === "image" ? (
            <img
              src={media.src}
              alt={title}
              className="w-full h-full object-cover will-change-transform transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
            />
          ) : (
            <video
              className="w-full h-full object-cover"
              src={media.src}
              autoPlay
              loop
              muted
              playsInline
            />
          )}
          {/* glossy sweep */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.18)_0%,transparent_28%,transparent_72%,rgba(255,255,255,0.09)_100%)] opacity-60 mix-blend-overlay transition-transform duration-700 group-hover:translate-y-[-2%]" />
          {/* stronger readability gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/80 sm:from-black/35 sm:via-black/15 sm:to-black/85" />
          {/* fine ring + ambient glow */}
          <div className="pointer-events-none absolute inset-0 ring-1 ring-white/10" />
          <div className="pointer-events-none absolute -inset-px rounded-[36px] shadow-[0_40px_120px_rgba(0,0,0,0.45)]" />
        </div>
      )}
      <div className="absolute inset-0 flex items-end p-5 md:p-6">
        <div>
          {chip && (
            <span className="inline-block text-[10px] px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/15 uppercase tracking-wide mb-2">
              {chip}
            </span>
          )}
          <div className="text-white/95 drop-shadow-[0_6px_18px_rgba(0,0,0,0.6)] text-base md:text-lg font-semibold leading-snug">
            {title}
          </div>
          <div className="text-white/80 text-xs md:text-sm mt-1 max-w-[30ch] line-clamp-2">
            {desc}
          </div>
        </div>
      </div>
    </div>
  );
}

function ServiceVideoCard({
  title,
  desc,
  url,
}: {
  title: string;
  desc: string;
  url: string;
}) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

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
        <button
          type="button"
          className="group absolute inset-0 z-20 grid place-items-center bg-black/0 hover:bg-black/10 transition-colors"
          aria-label={`Play ${title}`}
          onClick={() => setOpen(true)}
        >
          <span className="inline-flex items-center justify-center h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-white/90 text-black shadow-lg group-hover:scale-105 transition-transform">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/10 via-transparent to-black/50" />
      </div>
      <div className="p-5">
        <h4 className="text-lg font-semibold mb-1">{title}</h4>
        <p className="text-white/80 text-sm">{desc}</p>
      </div>

      {open && (
        <Portal>
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/80"
              onClick={() => setOpen(false)}
            />
            <div className="relative w-full max-w-5xl">
              <video
                className="w-full aspect-video rounded-xl border border-white/15 bg-black"
                src={url}
                autoPlay
                controls
                playsInline
              />
              <button
                aria-label="Close"
                className="absolute -top-3 -right-3 h-10 w-10 rounded-full bg-white/90 text-black grid place-items-center"
                onClick={() => setOpen(false)}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6L6 18" />
                  <path d="M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
