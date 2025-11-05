import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CTAGroup from "@/components/ui/cta-group";
import { Lightbulb, Settings, ArrowRight, Rocket } from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

export default function CTASplit() {
  const prefersReducedMotion = useReducedMotion();
  const [ref, isIntersecting] = useIntersectionObserver();

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        duration: prefersReducedMotion ? 0.01 : 0.6,
        ease: "easeOut"
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.2
      }
    }
  };

  return (
    <section
      ref={ref}
      className="relative py-20 sm:py-28 md:py-32 overflow-hidden"
      data-testid="cta-split-section"
    >
      {/* ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-20 w-[520px] h-[520px] rounded-full bg-neon-purple/20 blur-[120px]" />
        <div className="absolute -bottom-32 -right-16 w-[480px] h-[480px] rounded-full bg-neon-blue/20 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(50%_50%_at_50%_20%,rgba(255,255,255,0.06),transparent_60%)]" />
      </div>
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6"
        initial="hidden"
        animate={isIntersecting ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <div className="text-center mb-10 sm:mb-12 md:mb-14">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-[10px] sm:text-xs tracking-wide uppercase text-white/80 mb-3 sm:mb-4">
            The Hub
          </div>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-2 sm:mb-3 leading-tight">Get Ideas</h3>
          <p className="text-sm sm:text-base text-white/80 max-w-2xl mx-auto px-1">1. 250+ case studies, AI innovations, trendy results, and secret lab creations — all in one curated hub.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 items-stretch relative">
          <motion.div variants={cardVariants}>
            <Card className="group rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 h-full bg-white/8 border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl relative overflow-hidden cursor-pointer" data-testid="get-ideas-card">
              {/* sheen */}
              <div className="pointer-events-none absolute -inset-y-20 -left-1/2 w-3/4 sm:w-2/3 rotate-12 bg-gradient-to-r from-white/0 via-white/15 to-white/0 opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
              <div className="text-center h-full flex flex-col justify-between">
                <div>
                  <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl mx-auto mb-5 sm:mb-6 md:mb-8 grid place-items-center bg-[#7042D2] shadow-[0_10px_30px_rgba(112,66,210,0.45)]">
                    <Lightbulb size={26} className="sm:hidden" />
                    <Lightbulb size={30} className="hidden sm:block md:hidden" />
                    <Lightbulb size={32} className="hidden md:block" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 sm:mb-4 gradient-text" data-testid="get-ideas-title">
                    The Hub
                  </h3>
                  <p className="text-sm sm:text-base text-white/85 mb-6 sm:mb-8 leading-relaxed" data-testid="get-ideas-description">
                    Dive into a collection of engagement tools, AI effects, immersive features, campaign insights, and content-worthy ideas. All in one place, ready to plug into your next activation.
                  </p>
                </div>
                <CTAGroup breakpoint="md">
                  <a href="/get-ideas">
                    <Button 
                      size="lg"
                      variant="creativePrimary"
                      className="group w-full md:w-auto text-base sm:text-lg py-5 sm:py-6"
                      data-testid="browse-gallery"
                    >
                      Explore The Hub
                      <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                    </Button>
                  </a>
                </CTAGroup>
              </div>
            </Card>
          </motion.div>

          {/* vertical divider on md+ */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2 border-l border-white/10" aria-hidden="true" />

          <motion.div variants={cardVariants}>
            <Card className="group rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 h-full bg-white/8 border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl relative overflow-hidden cursor-pointer" data-testid="request-customization-card">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="text-center h-full flex flex-col justify-between">
                <div>
                  <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl mx-auto mb-5 sm:mb-6 md:mb-8 grid place-items-center bg-[#7042D2] shadow-[0_10px_30px_rgba(112,66,210,0.45)]">
                    <Settings size={26} className="sm:hidden" />
                    <Settings size={30} className="hidden sm:block md:hidden" />
                    <Settings size={32} className="hidden md:block" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 sm:mb-4 gradient-text" data-testid="request-customization-title">
                    Request Customization
                  </h3>
                  <p className="text-sm sm:text-base text-white/85 mb-6 sm:mb-8 leading-relaxed" data-testid="request-customization-description">
                    Your brand deserves experiences that match its objectives. If the tech doesn’t exist, we’ll build it. And if your idea isn’t clear, our creative team will shape it with you.
                  </p>
                </div>
                <CTAGroup breakpoint="md">
                  <Button 
                    size="lg"
                    variant="creativeSecondary"
                    className="group w-full md:w-auto text-base sm:text-lg py-5 sm:py-6"
                    data-testid="start-project"
                  >
                    Request Customization
                    <Rocket className="ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                  </Button>
                </CTAGroup>
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
