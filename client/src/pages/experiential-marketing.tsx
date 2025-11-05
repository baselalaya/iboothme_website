import Navigation from "@/components/navigation";
import Seo from "@/components/seo";
import { useEffect } from 'react';
import { applySeoToHead, fetchSeoConfig } from "@/lib/seoOverride";
import FooterSection from "@/components/footer-section";
import CTAGroup from "@/components/ui/cta-group";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Breadcrumbs from "@/components/breadcrumbs";

export default function ExperientialMarketingPage() {
  useEffect(() => { (async () => { const cfg = await fetchSeoConfig('/experiential-marketing'); if (cfg) applySeoToHead(cfg); })(); }, []);
  return (
    <div className="relative min-h-screen text-white">
      <Seo
        title="Experiential Marketing Solutions"
        description="Immersive brand activations, interactive experiences, and measurable engagement across physical and digital touchpoints."
        canonical="/experiential-marketing"
        ogImage="/images/Brand Activation.jpg"
        keywords={["experiential marketing", "brand activations", "interactive experiences"]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Experiential Marketing",
          description: "Immersive brand activations and interactive experiences.",
          provider: { "@type": "Organization", name: "iboothme" }
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_50%_at_50%_0%,rgba(112,66,210,0.12),transparent_60%),radial-gradient(60%_40%_at_80%_100%,rgba(34,212,253,0.10),transparent_60%)]"
      />
      <Navigation />
      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Experiential Marketing' }]} />
        </div>
        {/* Hero */}
        <section className="relative w-full overflow-hidden min-h-[60vh] sm:min-h-[70vh] text-center mb-0 flex items-center justify-center">
          {/* Background video like AI Technology page */}
          <video
            className="absolute inset-0 w-full h-full object-cover bg-black -z-10"
            src="/videos/h-tech.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
          />
          {/* Overlay stack matching inner pages */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_-20%,transparent_0%,rgba(3,7,18,0.38)_45%,rgba(3,7,18,0.92)_70%,rgba(3,7,18,0.99)_90%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,1)_0%,rgba(0,0,0,0.85)_10%,rgba(0,0,0,0)_40%,rgba(0,0,0,0)_60%,rgba(0,0,0,0.85)_90%,rgba(0,0,0,1)_100%)]" />
            <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_85%)]" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
          </div>
          <div className="max-w-5xl mx-auto px-6 py-16 md:py-24 lg:py-28 min-h-[60vh] sm:min-h-[70vh] flex flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2 rounded-full border border-white/15 bg-white/10 backdrop-blur mb-4 sm:mb-6"
            >
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-sm font-semibold tracking-wide uppercase">Hybrid Experience</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 }}
              className="text-3xl sm:text-5xl md:text-6xl font-black mt-1 gradient-text leading-tight"
            >
              Experiential Marketing
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="max-w-3xl mx-auto mt-4 sm:mt-6 text-white/80 px-2 text-base sm:text-lg md:text-xl"
            >
              Crafting immersive experiences with bespoke hardware and software integrations. Every detail is tailored to your brand’s story. Every gesture, interaction, and outcome is deliberately designed to create experiences your audience will never forget.
            </motion.p>
          </div>
        </section>

        {/* Deep customization */}
        <section className="relative px-6 py-12 md:py-16">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-white/5 text-xs uppercase tracking-widest mb-4">
                <span>Deep Customization</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Hardware + Software, Deeply Customized</h2>
              <p className="text-white/80 mb-6">
                We don’t just integrate existing solutions. We design and build custom hardware, develop proprietary software, and craft experiences that cannot be replicated. Every motion, interaction, and outcome is precisely engineered for your brand.
              </p>
              <div className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <h3 className="font-semibold">Custom Hardware Integration</h3>
                  <p className="text-sm text-white/75">Sensors, controllers, and mechanics engineered exclusively for your activation.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <h3 className="font-semibold">Unlimited Possibilities</h3>
                  <p className="text-sm text-white/75">Every action can trigger any outcome—no limits, no boundaries.</p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/5 p-3">
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden">
                <video
                  className="absolute inset-0 h-full w-full object-cover"
                  src="/videos/expt-demo.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-[11px] text-white/85">
                  Custom Racing Simulator — Motion-controlled gaming experience
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Any Motion */}
        <section className="relative px-6 py-12 md:py-16">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold">Every Motion <span className="gradient-text">Produces Something</span></h2>
            <p className="text-white/80 max-w-3xl mx-auto mt-3">
              We engineer solutions that transform physical actions into remarkable digital experiences, creating brand activations the world hasn’t seen before. The sky is the limit.
            </p>
          </div>
          <div className="max-w-6xl mx-auto mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { t: "Motion → Digital Art", d: "Cycling creates animations, dancing generates visuals, movement becomes interactive art." },
              { t: "Fitness → Rewards", d: "Push-ups unlock prizes, workouts earn points, effort gets rewarded instantly." },
              { t: "Voice → Control", d: "Speak to control environments; sing to create music; voice becomes interface." },
              { t: "Gestures → Control", d: "Hand movements control interfaces, gestures trigger precise automations." },
              { t: "Heartbeat → Visuals", d: "Biometrics create personalized art; emotions become visual experiences." },
              { t: "Custom → Anything", d: "Your concept, our engineering — we build any idea into reality." },
            ].map(({ t, d }) => (
              <div key={t} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h3 className="font-semibold mb-1">{t}</h3>
                <p className="text-sm text-white/75">{d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Real Examples */}
        <section className="relative px-6 py-12 md:py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold">Real Experiences <span className="gradient-text">We’ve Created</span></h2>
            <p className="text-white/80 mt-3">
              Explore our custom-built activations in action—from Philips’ bike-powered smoothie blending to an AI-enhanced foosball table with live commentary.
            </p>
          </div>
          <div className="max-w-6xl mx-auto mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "Philips Bike Activation", img: "/images/PhilipsActivation.png" },
              { title: "AI Foosball Experience", img: "/images/Foosball.jpg" },
              { title: "Phone Booth Challenge", img: "/images/Phone Booth.png" },
              { title: "Karaoke Experience", img: "/images/Karaokebooth.png" },
              { title: "Loftcam Experience", img: "/images/Loftcamexperience.png" },
              { title: "Videobooth Experience", img: "/images/Delano Videobooth.jpg" },
            ].map(({ title, img }) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="aspect-video rounded-xl bg-black/40 mb-3 overflow-hidden">
                  <img
                    src={img}
                    alt={title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <h3 className="font-semibold text-sm">{title}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative px-6 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold">Got a Vision? <span className="gradient-text">Let’s Make It Happen.</span></h2>
            <p className="text-white/80 mt-3">Your brand deserves experiences that match its objectives. If the tech doesn't exist, we'll build it. And if your idea isn't clear, our creative team will shape it with you.</p>
            <CTAGroup breakpoint="md" className="justify-center mt-6">
              <Button variant="creativePrimary" size="lg">Let’s Talk & Create</Button>
              <Button asChild variant="creativeSecondary" size="lg">
                <a href="/ideas#concepts">View More Concepts</a>
              </Button>
            </CTAGroup>
          </div>
        </section>

        <FooterSection />
      </main>
    </div>
  );
}
