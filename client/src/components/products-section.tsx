import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import CTAGroup from "@/components/ui/cta-group";
import { ArrowRight, Grid3X3, Play } from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useEffect, useState } from "react";
import { products as dataProducts } from "@/data/products";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay, Navigation as SwiperNavigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";

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

  useEffect(() => {
    let isMounted = true;
    const url =
      (typeof window !== 'undefined' && (window as any).__PRODUCTS_URL__) ||
      "/data/products.json";
    fetch(url, { cache: 'no-store' })
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
                        <div className="space-y-2 drop-shadow-[0_0_18px_rgba(0,0,0,0.16)] mt-auto">
                          <span className="uppercase tracking-[0.14em] sm:tracking-[0.19em] font-medium text-[10px] sm:text-xs px-2.5 py-1 bg-white/15 rounded-full backdrop-blur-sm text-white/90 shadow-white/30">
                            {product.title}
                          </span>
                          <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight tracking-[-0.6px] sm:tracking-[-1.2px] font-display text-white">
                            <span className="drop-shadow-glow">{product.subtitle}</span>
                          </h3>
                          <p className="text-sm sm:text-base md:text-xl leading-relaxed font-medium text-white/92 line-clamp-2">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </a>
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
                data-testid="product-lineup-video"
                onClick={() => { try { const { trackEvent } = require('@/lib/ga'); trackEvent('select_promotion', { creative_name: 'home_products_section', promotion_name: 'Lineup Video 2026' }); } catch {} }}
              >
                <span className="text-white">Lineup Video 2026</span>
                <Play className="ml-2 w-5 h-5" />
              </Button>
            </div>
            <p className="mt-3 text-xs text-white/60 sm:hidden">Faster taps, larger buttons, and stacked layout for small screens.</p>
          </div>
          
        </motion.div>
      </div>
    </section>
  );
}
