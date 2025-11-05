import { motion, useMotionValue, useSpring, useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const stats = [
  { id: "brand-engagements", value: 6, suffix: "M+", label: "Brand Engagements" },
  { id: "client-satisfaction", value: 98, suffix: "%", label: "Client Satisfaction" },
  { id: "brand-partnerships", value: 150, suffix: "+", label: "Premium Brand Partnerships" }
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref);
  const motionValue = useMotionValue(0);
  // Use a spring that does not overshoot; clamp to target and limit bounce
  const springValue = useSpring(motionValue, {
    duration: 2000,
    bounce: 0,
    damping: 40,
    stiffness: 200,
  } as any);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (isInView && !prefersReducedMotion) {
      // Reset to 0 before animating to avoid residual overshoot
      motionValue.set(0);
      // Animate up to the target value
      motionValue.set(value);
    } else if (prefersReducedMotion) {
      springValue.set(value);
    }
  }, [isInView, motionValue, value, prefersReducedMotion, springValue]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      // Clamp to [0, value] to avoid visual overshoot (e.g., >100%)
      const clamped = Math.max(0, Math.min(latest, value));
      if (ref.current) {
        ref.current.textContent = Math.round(clamped).toString() + suffix;
      }
    });
  }, [springValue, suffix]);

  return <span ref={ref}> {prefersReducedMotion ? value + suffix : "0" + suffix}</span>;
}

export default function StatsSection() {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.3
      }
    }
  };

  const itemVariants = {
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
    <section ref={ref} className="py-16 sm:py-20 md:py-32 relative overflow-hidden" data-testid="stats-section">
      {/* Ambient background aligned with site visuals */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0b0b12] to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_20%,rgba(112,66,210,0.12),transparent_60%)]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <motion.h2
          className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 sm:mb-4 gradient-text leading-tight"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={itemVariants}
          data-testid="stats-headline"
        >
          Proven Impact
        </motion.h2>
        <motion.p
          className="text-sm sm:text-base md:text-lg text-white/70 max-w-2xl mx-auto mb-10 sm:mb-12 md:mb-14 px-1"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={itemVariants}
        >
          Measurable performance in social reach, engagement, and activations.
        </motion.p>

        {/* Stat cards with premium shells */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {stats.map((stat) => (
            <motion.div key={stat.id} variants={itemVariants}>
              <div className="relative rounded-2xl sm:rounded-3xl lg:rounded-[2.5rem] border border-white/10 bg-white/5 p-6 sm:p-7 md:p-8 text-center overflow-hidden transition-all duration-500 hover:bg-gradient-to-br hover:from-white/10 hover:to-white/5 hover:border-white/20">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120px_60px_at_50%_0%,rgba(255,255,255,0.12),transparent)]" />
                <div className="text-4xl sm:text-5xl md:text-6xl font-black mb-1.5 sm:mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400" data-testid={`stat-value-${stat.id}`}>
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-sm sm:text-base md:text-lg text-white/75 tracking-wide" data-testid={`stat-label-${stat.id}`}>
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
