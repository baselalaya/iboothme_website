import Navigation from "@/components/navigation";
import Seo from "@/components/seo";
import FooterSection from "@/components/footer-section";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="relative min-h-screen text-white">
      <Seo
        title="404 — Page Not Found"
        description="The page you’re looking for doesn’t exist or was moved."
        canonical="/404"
        robots="noindex,follow"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_50%_at_50%_0%,rgba(112,66,210,0.12),transparent_60%),radial-gradient(60%_40%_at_80%_100%,rgba(34,212,253,0.10),transparent_60%)]"
      />
      <Navigation />
      <main className="relative z-10">
        <section className="relative w-full overflow-hidden min-h-[60vh] text-center mb-14 rounded-[28px] flex items-center justify-center">
          <div className="max-w-3xl mx-auto px-6 py-16 md:py-24 lg:py-28 flex flex-col items-center justify-center">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-white/15 bg-white/10 backdrop-blur mb-5">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-sm font-semibold tracking-wide uppercase">Error</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black gradient-text">404 — Page Not Found</h1>
            <p className="text-white/85 mt-4 max-w-[38ch] md:max-w-2xl mx-auto text-lg leading-relaxed">
              The page you’re looking for doesn’t exist, was moved, or the URL is incorrect.
            </p>
            <div className="mt-6 md:mt-8 flex justify-center">
              <img src="/Not%20Found.gif" alt="Not found" className="object-contain" />
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <a href="/" className="inline-block">
                <Button variant="creativePrimary" size="lg" className="w-full sm:w-auto">Go Home</Button>
              </a>
              <a href="/contact-us" className="inline-block">
                <Button variant="creativeSecondary" size="lg" className="w-full sm:w-auto">Contact Us</Button>
              </a>
            </div>
          </div>
        </section>
      </main>
      <FooterSection />
    </div>
  );
}
