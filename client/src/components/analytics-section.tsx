import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import CTAGroup from "@/components/ui/cta-group";
import { TrendingUp } from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

export default function AnalyticsSection() {
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

  // Generate particles for drift effect
  const particles = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    left: `${10 + i * 20}%`,
    top: `${20 + (i * 15) % 70}%`, // avoid starting at very top
    delay: `${i * 3}s`,
    color: i % 2 === 0 ? 'bg-neon-purple' : 'bg-neon-blue' // remove white dots
  }));

  return (
    <section 
      ref={ref}
      className="py-20 sm:py-28 md:py-32 relative overflow-hidden" 
      data-testid="analytics-section"
    >
      {/* Background video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: -2 }}
        src="/video/last-section.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/40" />

      <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/20 to-purple-900/20" />
      
      <div className="absolute inset-0 pointer-events-none" data-testid="particles-container">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={`absolute w-1 h-1 ${particle.color} rounded-full animate-particle-drift opacity-60`}
            style={{
              left: particle.left,
              top: particle.top,
              animationDelay: particle.delay,
              opacity: 0.5,
            }}
          />
        ))}
      </div>
      
      <motion.div 
        className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6"
        initial="hidden"
        animate={isIntersecting ? "visible" : "hidden"}
        variants={fadeUpVariants}
      >
        <motion.h2 
          className="text-3xl sm:text-4xl md:text-6xl font-black mb-5 sm:mb-7 md:mb-8 gradient-text neon-glow leading-tight"
          variants={fadeUpVariants}
          data-testid="analytics-headline"
        >
          Every activation is built for impact and proven with detailed analytics
        </motion.h2>
        
        <motion.p 
          className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto leading-relaxed px-1"
          variants={fadeUpVariants}
          data-testid="analytics-description"
        >
          Real-time insights, comprehensive reporting, and actionable data to maximize your brand's return on experience
        </motion.p>
        
        <motion.div variants={fadeUpVariants}>
          <CTAGroup breakpoint="md" className="justify-center">
            <Button 
              size="lg"
              variant="creativePrimary"
              className="group w-full md:w-auto text-base sm:text-lg py-6"
              data-testid="see-what-you-get"
            >
              See What You Get
              <TrendingUp className="ml-2" />
            </Button>
          </CTAGroup>
        </motion.div>
      </motion.div>
    </section>
  );
}
