import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import CTAGroup from "@/components/ui/cta-group";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useRef } from "react";

export default function BrandActivation() {
  useReducedMotion(); // still called if needed elsewhere
  const [ref, isIntersecting] = useIntersectionObserver();
  const sectionRef = useRef<HTMLDivElement>(null);
  
  return (
    <section 
      ref={sectionRef}
      className="relative overflow-hidden bg-transparent max-w-7xl mx-auto flex items-center justify-center px-4 sm:px-6 py-12 sm:py-14 md:py-16"
      data-testid="brand-activation-section"
      data-section="brand-activation"
      style={{ minHeight: '100vh' }}
    >


      <motion.div 
        className="backdrop-blur-2xl rounded-xl sm:rounded-2xl md:rounded-3xl bg-white/10 p-5 sm:p-8 md:p-12 w-full"
        ref={ref}
        initial="hidden"
        animate={isIntersecting ? "visible" : "hidden"}
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 
            className="text-2xl sm:text-4xl md:text-5xl xl:text-6xl font-black leading-tight sm:leading-snug tracking-tight text-black mb-3 sm:mb-4"
            data-testid="ai-headline"
          >
            <span className="block">AI designed for</span>
            <span className="block">brand activations</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg xl:text-xl text-black max-w-[36ch] sm:max-w-3xl leading-relaxed mx-auto px-1">
            Because your brand deserves more than face swaps.
          </p>
          <CTAGroup breakpoint="md" className="mt-5 sm:mt-8">
            <a href="/ai-technology" className="inline-block w-full md:w-auto" data-testid="brand-activation-cta">
              <Button variant="creativePrimary" size="lg" className="group w-full md:w-auto text-base sm:text-lg py-6">
                Explore our AI Tech
              </Button>
            </a>
          </CTAGroup>
        </div>
      </motion.div>
    </section>
  );
}
