import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, Lightbulb, Cpu, Gift, LifeBuoy } from "lucide-react";
import { AnimatePresence, LayoutGroup, motion, useScroll } from "framer-motion";
import Portal from "@/components/portal";

const navItems = [
  { name: "Solutions", href: "/products", description: "Discover modular booth ecosystems built for instant impact." },
  { name: "AI Technology", href: "/ai-technology", description: "See how our adaptive AI creates unforgettable experiences." },
  { name: "Get Ideas", href: "/get-ideas", description: "Browse curated launch playbooks designed for your next event." },
  { name: "Robotics", href: "/robotics", description: "Step inside autonomous capture labs crafted for futuristic brands." },
  { name: "Personalized Merch", href: "/personalised-merch", description: "Generate signature keepsakes that ship before your guests get home." },
  { name: "Our Story", href: "/our-story", description: "Meet the team reimagining photo experiences for 2026 and beyond." },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showTopNav, setShowTopNav] = useState(true);
  const [showBottomDock, setShowBottomDock] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [location] = useLocation();

  const isItemActive = (href: string) => {
    if (href === "/") {
      return location === "/";
    }
    return location === href || location.startsWith(`${href}/`);
  };

  const activeNavItem = navItems.find(({ href }) => isItemActive(href))?.name ?? null;

  const bottomLinks = [
    { name: "Ideas Hub", icon: Lightbulb },
    { name: "Robotics", icon: Cpu },
    { name: "Personalised Merch", icon: Gift },
    { name: "Support", icon: LifeBuoy },
  ];
  const [activeBottom, setActiveBottom] = useState("Ideas Hub");

  const mobileListVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 260, damping: 30 },
    },
  } as const;

  const mobileContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.12 },
    },
  } as const;

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setIsScrolled(latest > 50);

      if (latest > lastScrollY && latest > 100) {
        setShowTopNav(false);
      } else {
        setShowTopNav(true);
      }

      // Show bottom dock shortly after user starts scrolling
      setShowBottomDock(latest > 80);
      setLastScrollY(latest);
    });

    return () => unsubscribe();
  }, [scrollY, lastScrollY]);

  useEffect(() => {
    if (!isOpen) {
      setHoveredItem(null);
    }
  }, [isOpen]);

  // Focus trap + Escape to close
  useEffect(() => {
    if (!isOpen) return;
    const drawer = menuRef.current;
    if (!drawer) return;

    // focus first focusable
    drawer.scrollTop = 0;
    const focusables = drawer.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (first?.focus) {
      try {
        first.focus({ preventScroll: true } as FocusOptions);
      } catch {
        first.focus();
      }
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        requestAnimationFrame(() => toggleRef.current?.focus());
      }
      if (e.key === 'Tab' && focusables.length) {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          (last as HTMLElement).focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          (first as HTMLElement).focus();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -24 }}
        animate={{
          y: showTopNav ? 0 : -120,
          opacity: showTopNav ? 1 : 0,
          transition: {
            type: "spring",
            stiffness: 110,
            damping: 26,
            mass: 1.05,
          },
        }}
        className="sticky top-0 z-50 px-3 py-3 font-sans text-white sm:px-6 sm:py-4 lg:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <div
            className={`relative overflow-hidden rounded-3xl border border-white/12 px-4 sm:px-6 transition-all duration-300 backdrop-blur-xl ${
              isScrolled
                ? "bg-[rgba(10,12,28,0.88)] shadow-[0_10px_28px_rgba(5,7,22,0.35)] py-2.5 sm:py-3"
                : "bg-[rgba(16,19,40,0.75)] shadow-[0_18px_45px_rgba(7,9,26,0.38)] py-3.5 sm:py-4"
            }`}
          >
            <div className="relative flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <Link href="/">
                  <a
                    aria-label="Go to home"
                    className="group relative flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9b7cff]"
                  >
                    <img
                      src="/images/icon.svg"
                      width={64}
                      height={64}
                      alt="iBoothme logo"
                      className="h-12 w-12 sm:h-14 sm:w-14"
                    />
                  </a>
                </Link>
              </div>
              <nav className="hidden lg:flex flex-1 justify-center">
                <LayoutGroup>
                  <ul className="relative flex items-center gap-1 rounded-full border border-white/10 bg-white/6 px-1.5 py-1 text-sm font-medium text-white/70 shadow-[0_10px_24px_rgba(10,13,35,0.28)]">
                    {navItems.map(({ name, href }) => {
                      const isActive = activeNavItem === name;
                      const showHighlight = hoveredItem === name || (!hoveredItem && isActive);
                      return (
                        <li key={name} className="relative">
                          <a
                            href={href}
                            onMouseEnter={() => setHoveredItem(name)}
                            onMouseLeave={() => setHoveredItem(null)}
                            onFocus={() => setHoveredItem(name)}
                            onBlur={() => setHoveredItem(null)}
                            aria-current={isActive ? "page" : undefined}
                            className="relative flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold tracking-wide text-white/70 transition-all duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9b7cff]/70"
                          >
                            {showHighlight && (
                              <motion.span
                                layoutId="nav-pill"
                                className="absolute inset-0 rounded-full bg-[#7042D2]/90 shadow-[0_14px_32px_rgba(52,32,122,0.5)] backdrop-blur-md border border-white/15"
                                transition={{ type: "spring", stiffness: 420, damping: 32 }}
                              />
                            )}
                            <span className="relative z-10">{name}</span>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </LayoutGroup>
              </nav>
              <div className="ml-auto flex items-center gap-3">
                <a href="/contact-us" className="hidden sm:inline-flex">
                  <Button size="lg" variant="creativePrimary" className="rounded-full px-6">
                    Get in Touch
                  </Button>
                </a>
                <Button
                  variant="ghost"
                  size="icon"
                  className="inline-flex h-11 w-11 rounded-full border border-white/15 bg-white/5 text-white/90 backdrop-blur-lg hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9b7cff] lg:hidden"
                  onClick={() => setIsOpen(!isOpen)}
                  aria-label="Toggle mobile menu"
                  aria-expanded={isOpen}
                  aria-controls="mobile-menu"
                  ref={toggleRef}
                  data-testid="mobile-menu-toggle"
                >
                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                  </motion.div>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {isOpen && (
            <Portal>
              <motion.div
                key="mobile-menu"
                id="mobile-menu"
                role="dialog"
                aria-modal="true"
                aria-labelledby="mobileMenuTitle"
                initial={{ y: -120, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -120, opacity: 0 }}
                transition={{ type: "spring", stiffness: 170, damping: 22, mass: 0.9 }}
                className="fixed inset-0 z-[60] flex w-screen flex-col lg:hidden"
              >
                <motion.div
                  className="absolute inset-0 z-0 bg-[#02030a]/80 backdrop-blur-xl"
                  aria-hidden="true"
                  onClick={() => setIsOpen(false)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                />
                <div
                  ref={menuRef}
                  className="relative z-10 flex h-[100dvh] w-full flex-col overflow-hidden border border-white/10 bg-[rgba(12,16,34,0.95)] shadow-[0_18px_60px_rgba(4,6,18,0.45)] sm:mx-auto sm:h-[calc(100dvh-2rem)] sm:max-w-[520px] sm:rounded-[28px]"
                >
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(180px_120px_at_85%_0%,rgba(90,179,255,0.25),transparent),radial-gradient(220px_160px_at_0%_70%,rgba(112,66,210,0.22),transparent)]" />
                  <div className="relative flex justify-center pt-4">
                    <span className="h-1.5 w-16 rounded-full bg-white/25" />
                  </div>
                  <div className="relative flex items-center justify-between px-5 pt-4 pb-3">
                  <Link href="/">
                    <a
                      aria-label="Go to home"
                      onClick={() => setIsOpen(false)}
                      className="inline-flex items-center rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9b7cff]"
                    >
                      <img src="/images/icon.svg" width={48} height={48} alt="iBoothme logo" className="h-10 w-10" />
                    </a>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close menu"
                    className="rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10"
                  >
                    <X size={24} />
                  </Button>
                </div>
                <h2 id="mobileMenuTitle" className="sr-only">
                  Mobile navigation
                </h2>
                <div className="relative px-5 pb-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.38em] text-white/45">
                    Explore iboothme
                  </p>
                  <p className="mt-2 text-xl font-semibold text-white">
                    Find the experience you want to open next.
                  </p>
                </div>
                <nav className="relative flex-1 overflow-y-auto px-5 pb-6 pt-1">
                  <motion.div
                    className="flex flex-col gap-2.5"
                    initial="hidden"
                    animate="visible"
                    variants={mobileContainerVariants}
                  >
                    {navItems.map(({ name, href }) => {
                      const isActive = activeNavItem === name;
                      return (
                        <motion.a
                          key={name}
                          href={href}
                          onClick={() => setIsOpen(false)}
                          aria-current={isActive ? "page" : undefined}
                          variants={mobileListVariants}
                          whileTap={{ scale: 0.98 }}
                          className={`group relative flex flex-col gap-1.5 overflow-hidden rounded-2xl px-4 py-5 text-left text-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9b7cff] ${
                            isActive
                              ? "bg-[#7042D2]/90 shadow-[0_16px_36px_rgba(18,17,38,0.5)] backdrop-blur-lg border border-white/15"
                              : "border border-white/10 bg-white/[0.06] hover:border-white/20 hover:bg-white/[0.1]"
                          }`}
                        >
                          {isActive && (
                            <span className="pointer-events-none absolute inset-0 bg-white/10 mix-blend-soft-light" aria-hidden="true" />
                          )}
                          <div className="relative flex items-center justify-between">
                            <span className="text-lg font-semibold tracking-wide">{name}</span>
                          </div>
                        </motion.a>
                      );
                    })}
                  </motion.div>
                </nav>
                  <div className="relative space-y-3 px-5 pb-6">
                    <a href="/contact-us" onClick={() => setIsOpen(false)} className="block">
                      <Button className="w-full rounded-full" size="lg" variant="creativePrimary">
                        Get in Touch
                      </Button>
                    </a>
                  </div>
                </div>
              </motion.div>
            </Portal>
          )}
        </AnimatePresence>
      </motion.nav>
      {/* Bottom floating dock temporarily disabled */}
    </>
  );
}
