import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { Link } from "wouter";

const servicesLinks = [
  { name: "PhotoBooths", href: "/products" },
  { name: "AI Tech", href: "/ai-technology" },
  { name: "Analytics", href: "/analytics" },
  { name: "Robotics", href: "/robotics" },
  { name: "Personalized Merch", href: "/personalised-merch" },
  { name: "Experiential Marketing", href: "/experiential-marketing" },
  { name: "Gamifications", href: "/gamifications" },
  { name: "Tailored Software Solutions", href: "/tailored-software-solutions" },
  { name: "The Hub", href: "/get-ideas" },
] as const;
const companyLinks = [
  { name: "Our Story", href: "/our-story" },
  { name: "Contact", href: "/contact-us" },
  { name: "Careers", href: "/careers" },
] as const;
const legalLinks = [
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms & Conditions", href: "/terms" },
] as const;

export default function FooterSection() {
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
        staggerChildren: prefersReducedMotion ? 0 : 0.1
      }
    }
  };

  return (
    <footer
      ref={ref}
      className="relative py-16 sm:py-20 md:py-24 overflow-hidden"
      data-testid="footer-section"
    >
      {/* Ambient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#05060c] via-[#070910] to-[#05060c]" />
      <div className="pointer-events-none absolute -top-32 -left-28 w-[560px] h-[560px] rounded-full bg-purple-600/8 blur-[160px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-28 w-[560px] h-[560px] rounded-full bg-indigo-500/8 blur-[160px]" />
      
      <motion.div 
        className="relative z-10 max-w-7xl mx-auto px-6"
        initial="hidden"
        animate={isIntersecting ? "visible" : "hidden"}
        variants={staggerContainer}
      >
        {/* Grid: Brand + Services + Company + Legal */}
        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:gap-10 mb-10 sm:mb-12 md:mb-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8 md:gap-10">
            {/* Brand */}
            <motion.div variants={fadeUpVariants} className="rounded-2xl border border-white/10 bg-white/5/10 backdrop-blur-sm p-5 sm:p-6">
            <div className="flex items-center gap-3 mb-4">
              <img src="/images/icon.svg" width={40} height={40} alt="Iboothme" className="opacity-90" />
              <div className="text-2xl font-bold tracking-tight">Iboothme</div>
            </div>
            <div className="space-y-3 text-sm sm:text-base">
              <p className="text-white/85">iboothme delivers custom AI experiential marketing and technology for brand activations. From photo booths to robotics and personalized merch, every solution is built in-house to create impact for leading brands worldwide.</p>
              <div className="flex items-center gap-3 text-white/85">
                <Mail size={16} aria-hidden className="opacity-80" />
                <a href="mailto:info@iboothme.com" className="hover:underline underline-offset-4">info@iboothme.com</a>
              </div>
              <div className="flex items-center gap-3 text-white/85">
                <Phone size={16} aria-hidden className="opacity-80" />
                <a href="tel:+97144488563" className="hover:underline underline-offset-4">+971 4 448 8563</a>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <MapPin size={16} aria-hidden className="opacity-80" />
                <span className="sr-only">Regions:</span>
                <div className="flex flex-wrap gap-2" aria-label="Operating regions">
                  {['UAE','KSA','Qatar'].map((r) => (
                    <span key={r} className="px-2.5 py-1 rounded-full text-xs bg-white/10 border border-white/15 text-white/85">{r}</span>
                  ))}
                </div>
              </div>
            </div>
            </motion.div>

            {/* Services */}
            <motion.div variants={fadeUpVariants} className="rounded-2xl border border-white/10 bg-white/5/10 backdrop-blur-sm p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold tracking-wide text-white mb-4">Services</h2>
            <ul className="space-y-2.5 text-[15px]">
              {servicesLinks.map(({ name, href }) => (
                <li key={name}>
                  {href.startsWith("/") ? (
                    <Link href={href} key={name}>
                      <a className="text-white/80 hover:text-white transition-colors duration-200 underline-offset-4 hover:underline">{name}</a>
                    </Link>
                  ) : (
                    <a href={href} className="text-white/80 hover:text-white transition-colors duration-200 underline-offset-4 hover:underline" key={name}>{name}</a>
                  )}
                </li>
              ))}
            </ul>
            </motion.div>

            {/* Company */}
            <motion.div variants={fadeUpVariants} className="rounded-2xl border border-white/10 bg-white/5/10 backdrop-blur-sm p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold tracking-wide text-white mb-4">Company</h2>
            <ul className="space-y-2.5 text-[15px]">
              {companyLinks.map(({ name, href }) => (
                <li key={name}>
                  {href.startsWith("/") ? (
                    <Link href={href} key={name}>
                      <a className="text-white/80 hover:text-white transition-colors duration-200 underline-offset-4 hover:underline">{name}</a>
                    </Link>
                  ) : (
                    <a href={href} className="text-white/80 hover:text-white transition-colors duration-200 underline-offset-4 hover:underline" key={name}>{name}</a>
                  )}
                </li>
              ))}
            </ul>
            </motion.div>

            {/* Legal */}
            <motion.div variants={fadeUpVariants} className="rounded-2xl border border-white/10 bg-white/5/10 backdrop-blur-sm p-5 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold tracking-wide text-white mb-4" data-testid="footer-legal-title">Legal</h2>
              <ul className="space-y-2.5 text-[15px]">
                {legalLinks.map(({ name, href }) => (
                  <li key={name}>
                    <Link href={href}>
                      <a 
                        className="text-white/80 hover:text-white transition-colors duration-200 underline-offset-4 hover:underline"
                        data-testid={`footer-legal-${name.toLowerCase().replace(/[^a-z&]/gi, '-').replace(/-+/g, '-')}`}
                      >
                        {name}
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
          </div>

        <motion.div
          className="pt-6 md:pt-8 border-t border-white/10"
          variants={fadeUpVariants}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-white/60 text-center md:text-left text-xs md:text-sm" data-testid="footer-copyright">
              2026 Iboothme. All rights reserved.
            </div>
            <div className="flex items-center gap-2.5 sm:gap-3.5" aria-label="footer social links">
              <a href="https://instagram.com/iboothme" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="group">
                <Button size="icon" variant="outline" className="rounded-full border-white/15 bg-white/5 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200" data-testid="footer-social-instagram">
                  <Instagram size={18} />
                </Button>
              </a>
              <a href="https://x.com/iboothme" target="_blank" rel="noopener noreferrer" aria-label="X" className="group">
                <Button size="icon" variant="outline" className="rounded-full border-white/15 bg-white/5 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200" data-testid="footer-social-twitter">
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false" className="block">
                    <path fill="currentColor" d="M18.244 2H21l-6.49 7.41L22 22h-6.828l-4.255-5.512L5.91 22H3.154l6.93-7.912L2 2h6.912l3.843 5.058L18.244 2Zm-2.394 18h2.02L7.32 4H5.3l10.55 16Z" />
                  </svg>
                </Button>
              </a>
              <a href="https://linkedin.com/company/iboothme" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="group">
                <Button size="icon" variant="outline" className="rounded-full border-white/15 bg-white/5 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200" data-testid="footer-social-linkedin">
                  <Linkedin size={18} />
                </Button>
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
}
