import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

type PartnerLogo = {
  alt: string;
  webp: string;
};

// Partners logos sourced from client/public/partners
const partners: PartnerLogo[] = [
  { alt: "Adidas", webp: "/partners/adidas-logo.webp" },
  { alt: "Dell", webp: "/partners/dell-logo.webp" },
  { alt: "Nike", webp: "/partners/nike-logo.webp" },
  { alt: "Philips", webp: "/partners/philip-logo.webp" },
  { alt: "Samsung", webp: "/partners/samsung-logo.webp" },
  { alt: "Saudi Electricity", webp: "/partners/sep-logo.webp" },
  { alt: "TikTok", webp: "/partners/tik-tok-logo.webp" },
];

function Logo({ item }: { item: PartnerLogo }) {
  return (
    <div className="inline-block mx-4 sm:mx-10 md:mx-20 opacity-90 hover:opacity-100 transition-opacity duration-300">
      <div className="rounded-md bg-white px-4 py-2 shadow-sm">
        <img
          src={item.webp}
          alt={item.alt}
          aria-label={`${item.alt} logo`}
          className="h-8 sm:h-10 md:h-12 min-w-[40px] sm:min-w-[56px] w-auto object-contain block mix-blend-normal opacity-100 filter-none"
          loading="lazy"
          draggable={false}
          onError={(e: any) => {
            // Keep row height if an asset fails
            e.currentTarget.style.display = 'inline-block';
            e.currentTarget.style.height = '1.75rem';
          }}
        />
      </div>
    </div>
  );
}

function MarqueeRow({ items, reverse = false }: { items: PartnerLogo[]; reverse?: boolean }) {
  const prefersReducedMotion = useReducedMotion();
  // Duplicate for seamless loop
  const track = [...items, ...items];
  return (
    <div
      className={`flex items-center whitespace-nowrap will-change-transform min-h-[2.75rem] sm:min-h-[3rem] relative z-10 ${
        prefersReducedMotion ? '' : 'animate-marquee-centered sm:hover:pause'
      }`}
      data-testid="marquee-container"
      onMouseEnter={(e) => {
        if (!prefersReducedMotion) e.currentTarget.style.animationPlayState = 'paused';
      }}
      onMouseLeave={(e) => {
        if (!prefersReducedMotion) e.currentTarget.style.animationPlayState = 'running';
      }}
      onPointerDown={(e) => {
        if (!prefersReducedMotion) (e.currentTarget as HTMLElement).style.animationPlayState = 'paused';
      }}
      onPointerUp={(e) => {
        if (!prefersReducedMotion) (e.currentTarget as HTMLElement).style.animationPlayState = 'running';
      }}
      onPointerCancel={(e) => {
        if (!prefersReducedMotion) (e.currentTarget as HTMLElement).style.animationPlayState = 'running';
      }}
    >
      {track.map((p, index) => (
        <Logo key={`${p.alt}-${index}`} item={p} />
      ))}
    </div>
  );
}

export default function ClientsMarquee() {
  const prefersReducedMotion = useReducedMotion();
  const [ref, isIntersecting] = useIntersectionObserver();

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: prefersReducedMotion ? 0.01 : 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <section 
      ref={ref}
      className="py-16 sm:py-24 md:py-32 bg-gradient-to-b from-white to-gray-100 overflow-hidden" 
      data-testid="clients-marquee-section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div 
          className="text-center mb-10 sm:mb-14 md:mb-20"
          initial="hidden"
          animate={isIntersecting ? "visible" : "hidden"}
          variants={fadeUpVariants}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 leading-tight" data-testid="clients-headline">
            Trusted by Premium Brands
          </h2>
          <p className="text-base sm:text-lg text-gray-600 px-1" data-testid="clients-description">
            Where Global Brands Come to Engage! From global sportswear to luxury beauty, we deliver activations that redefine engagement.
          </p>
        </motion.div>
        
        <motion.div 
          className="relative overflow-hidden"
          initial="hidden"
          animate={isIntersecting ? "visible" : "hidden"}
          variants={fadeUpVariants}
        >
          {/* Light background (chips handle contrast) */}
          <div className="relative rounded-xl">
            <div className="relative z-10 py-2">
              <MarqueeRow items={partners} />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
