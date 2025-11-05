import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import CTAGroup from "@/components/ui/cta-group";
import { CheckCircle, Bot } from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import RobotTaliaViewer from "@/components/robot-talia-viewer";

const features = [
  "Learns your products, answers questions, and hosts brand quizzes.",
  "She can be styled in outfits that represent your brand.",
  "Soon to become your autonomous AI-powered event photographer."
];


export default function MeetTalia() {
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

  const staggerContainer = {
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
      className="py-20 sm:py-28 md:py-32 relative overflow-hidden" 
      data-testid="meet-talia-section"
    
    >
      {/* Seamless background that blends with previous and next sections */}
      <div className="absolute inset-0 -z-10">
        {/* Main vertical gradient: deep black -> purple -> back to dark for seamless merges */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#1a0f2e] via-60% to-black" />
        {/* Soft radial overlays at edges to merge with neighbors */}
        <div className="absolute -top-40 -left-20 w-[520px] h-[520px] rounded-full bg-neon-purple/20 blur-[120px]" />
        <div className="absolute -bottom-40 -right-20 w-[520px] h-[520px] rounded-full bg-neon-blue/10 blur-[120px]" />
        {/* Subtle center vignette to anchor content */}
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_40%,rgba(0,0,0,0.35),transparent_60%)]" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
          <motion.div
            initial="hidden"
            animate={isIntersecting ? "visible" : "hidden"}
            variants={staggerContainer}
          >
            <motion.h2 
              className="text-3xl sm:text-4xl md:text-6xl font-black mb-4 sm:mb-6 md:mb-8 gradient-text neon-glow leading-tight"
              variants={fadeUpVariants}
              data-testid="meet-talia-headline"
            >
              Meet TALIA
            </motion.h2>
            
            <motion.p 
              className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 leading-relaxed"
              variants={fadeUpVariants}
              data-testid="talia-description"
            >
Meet TALIA.\n\nTALIA is the humanoid robot everyone wants to experience, a true crowd magnet that keeps the spotlight on your brand.
            </motion.p>
            
            <motion.ul 
              className="space-y-3 sm:space-y-4 mb-8 sm:mb-10 md:mb-12"
              variants={staggerContainer}
            >
              {features.map((feature, index) => (
                <motion.li 
                  key={index}
                  className="flex items-start sm:items-center text-sm sm:text-base md:text-lg"
                  variants={fadeUpVariants}
                  data-testid={`talia-feature-${index}`}
                >
                  <CheckCircle className="text-neon-green mr-3 sm:mr-4 mt-0.5 sm:mt-0 flex-shrink-0" size={20} />
                  <span className="leading-relaxed">{feature}</span>
                </motion.li>
              ))}
            </motion.ul>
            
            <motion.div variants={fadeUpVariants}>
                <Button 
                  size="lg"
                  variant="creativePrimary"
                  className="group w-full md:w-auto text-base sm:text-lg py-6"
                  data-testid="discover-talia"
                  onClick={()=>{ window.location.href = '/robotics'; }}
                  >
                  Discover Talia
                </Button>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="relative"
            initial="hidden"
            animate={isIntersecting ? "visible" : "hidden"}
            variants={fadeUpVariants}
          >
            <div className="relative rounded-2xl overflow-hidden">
              <RobotTaliaViewer src="/models/robot-talia.glb" className="w-full h-[380px] sm:h-[480px] md:h-[540px] rounded-2xl bg-transparent" />
              <div className="absolute top-3 sm:top-4 right-3 sm:right-4 glass-effect px-3 sm:px-4 py-1.5 sm:py-2 rounded-full" data-testid="live-indicator">
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
