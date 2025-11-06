import Navigation from "@/components/navigation";
import FooterSection from "@/components/footer-section";
import Seo from "@/components/seo";
import { Button } from "@/components/ui/button";
import Breadcrumbs from "@/components/breadcrumbs";
import { useEffect } from 'react';
import { applySeoToHead, fetchSeoConfig } from "@/lib/seoOverride";

export default function CareersPage() {
  useEffect(() => { (async () => { const cfg = await fetchSeoConfig('/careers'); if (cfg) applySeoToHead(cfg); })(); }, []);
  return (
    <div className="relative min-h-screen text-white">
      <Seo
        title="Careers"
        description="Join a team of engineers, creators, and innovators building cutting-edge experiential technology for the world's top brands."
        canonical="/careers"
        ogImage="/images/tech.png"
        keywords={["careers", "jobs", "experiential marketing", "engineering", "design"]}
        jsonLd={{
          "@context":"https://schema.org",
          "@type":"WebPage",
          name: "Careers at iboothme",
          description: "Open roles and hiring information"
        }}
      />
      {/* Background accents */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_50%_at_50%_0%,rgba(112,66,210,0.12),transparent_60%),radial-gradient(60%_40%_at_80%_100%,rgba(34,212,253,0.10),transparent_60%)]" />
      <Navigation />

      {/* Hero */}
      <section className="relative w-full overflow-hidden min-h-[60vh] text-center mb-14 rounded-[28px] flex items-center justify-center">
        <video className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.78vh] h-[100vh] md:w-[177.78vw] md:h-[56.25vw] max-w-none opacity-25" autoPlay muted loop playsInline preload="metadata">
          <source src="/videos/contact-hero.mp4" />
        </video>
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,1)_0%,rgba(0,0,0,0.85)_10%,rgba(0,0,0,0)_40%,rgba(0,0,0,0)_60%,rgba(0,0,0,0.85)_90%,rgba(0,0,0,1)_100%)]" />
        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_85%)]" />
        <div className="relative w-full">
          <div className="max-w-7xl mx-auto px-6 pt-6">
            <Breadcrumbs items={[{ label:'Home', href:'/' }, { label:'Careers' }]} />
          </div>
          <div className="max-w-5xl mx-auto px-6 py-16 md:py-20 lg:py-24">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-white/15 bg-white/10 backdrop-blur mb-6">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="text-sm font-semibold tracking-wide uppercase">Join Our Team</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black gradient-text">Build the Future of Experiential Marketing</h1>
          <p className="text-base sm:text-lg md:text-xl text-white/85 mt-3 sm:mt-4 max-w-[38ch] sm:max-w-3xl mx-auto leading-relaxed">Join a team of engineers, creators, and innovators building cutting-edge experiential technology for the world's top brands.</p>
          </div>
        </div>
      </section>

      {/* Why work with us */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">Why Work With Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[{
            t:'Innovation First', d:'Work on cutting-edge AI, hardware, and software projects that push experiential marketing forward.'
          },{
            t:'Global Impact', d:'Your work will be seen at major brand activations and events around the world.'
          },{
            t:'Creative Freedom', d:'We encourage bold ideas and give you the tools and autonomy to bring them to life.'
          }].map((b, i)=> (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-lg font-semibold mb-2">{b.t}</div>
              <div className="text-white/80 text-sm">{b.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Openings */}
      <section className="max-w-5xl mx-auto px-6 mb-20 text-center">
        <h3 className="text-2xl md:text-3xl font-semibold mb-3">Current Openings</h3>
        <p className="text-white/80 max-w-2xl mx-auto mb-6">We’re always looking for talented individuals to join our team. Send us your CV and portfolio, and we’ll be in touch if there’s a fit.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild variant="creativePrimary" size="lg" className="w-full sm:w-auto">
            <a href="mailto:careers@iboothme.com?subject=Application%20to%20iboothme">Apply Now</a>
          </Button>
          <Button asChild variant="creativeSecondary" size="lg" className="w-full sm:w-auto">
            <a href="mailto:careers@iboothme.com">Email Us</a>
          </Button>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
