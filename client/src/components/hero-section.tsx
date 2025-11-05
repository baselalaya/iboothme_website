import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useEffect, useRef, useState } from "react";

export default function HeroSection() {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [contentVisible, setContentVisible] = useState(false);
  const [spot, setSpot] = useState({ x: 50, y: 50 });
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setContentVisible(true);
    }, prefersReducedMotion ? 0 : 500);
    return () => clearTimeout(timer);
  }, [prefersReducedMotion]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (prefersReducedMotion) return;
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 20;
      const y = (clientY / window.innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
      setSpot({ x: (clientX / window.innerWidth) * 100, y: (clientY / window.innerHeight) * 100 });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [prefersReducedMotion]);

  const cinematicVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1, y: 0,
      transition: { 
        duration: prefersReducedMotion ? 0.01 : 0.8,
        ease: [0.19, 1, 0.22, 1]
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.15,
        delayChildren: 0.3
      }
    }
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 100, rotateX: 90 },
    visible: (custom: number) => ({
      opacity: 1, 
      y: 0,
      rotateX: 0,
      transition: { 
        duration: prefersReducedMotion ? 0.01 : 0.8,
        ease: [0.19, 1, 0.22, 1],
        delay: custom * 0.2
      }
    })
  };

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen max-h-screen overflow-hidden hero-brand flex flex-col justify-end pb-16 md:pb-24 z-0"
      data-testid="hero-section"
    >
      <motion.div 
        className={`relative z-20 text-center max-w-7xl mx-auto px-6 py-20 transition-all duration-1500 ease-out ${
          contentVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{ 
          y: prefersReducedMotion ? 0 : y, 
          opacity: prefersReducedMotion ? 1 : (contentVisible ? opacity : 0),
          transform: prefersReducedMotion ? 'none' : `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`
        }}
        variants={staggerContainer}
        initial="hidden"
        animate={contentVisible ? "visible" : "hidden"}
      >

        {/* Headline moved into 3D scene; keep spacing minimal here */}
        <motion.div className="mb-2" variants={cinematicVariants} />
        
        <motion.div
          variants={cinematicVariants}
          className="mb-6 md:mb-8"
        >
          <p 
            className="text-base sm:text-lg md:text-xl xl:text-2xl text-white/80 max-w-[32ch] sm:max-w-4xl mx-auto leading-relaxed font-regular px-2"
            data-testid="hero-description"
            style={{ 
              fontFamily: 'var(--font-sans)',
              textShadow: '0 0 20px rgba(255,255,255,0.1)'
            }}
          >
            Custom AI experiential marketing and tech for brand activations.
          </p>
        </motion.div>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-10 md:mb-12 px-4"
          variants={cinematicVariants}
        >
          <Button 
            size="lg"
            variant="creativePrimary"
            className="group w-full sm:w-auto"
            data-testid="cta-custom-concept"
            onClick={()=>{ window.location.href = '/get-ideas'; }}
          >
            <span className="text-white font-bold">
              Unlock Ideas
            </span>
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" size={18} />
          </Button>
          
          <Button 
            variant="creativeSecondary"
            size="lg"
            className="group w-full sm:w-auto"
            data-testid="cta-consultation"
            onClick={()=>{ window.location.href = '/contact-us'; }}
          >
            <span className="text-white group-hover:text-white/80 transition-colors font-semibold">
              Activate Your Event
            </span>
          </Button>
        </motion.div>

        <motion.div
          variants={cinematicVariants}
          className="mt-6 md:mt-8"
        >
          <div className="flex flex-col items-center gap-3">
            <span className="text-white/60 text-xs font-light tracking-widest">SCROLL TO EXPLORE</span>
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce" />
            </div>
          </div>
        </motion.div>

        {/* Removed floating badges per request */}
     </motion.div>

      {/* Local keyframes for gradient and float */}
      <style>{`
        @keyframes heroGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </section>
  );
}
