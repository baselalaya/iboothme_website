import Navigation from "@/components/navigation";
import { useEffect } from 'react';
import { applySeoToHead, fetchSeoConfig } from "@/lib/seoOverride";
import Seo from "@/components/seo";
import FooterSection from "@/components/footer-section";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Clock, MapPin, Phone as PhoneIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { products } from "@/data/products";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { getEffectiveUtm } from "@/lib/utm";
import { trackEvent } from "@/lib/ga";
import { gtmEvent } from "@/lib/gtm";
import { useToast } from "@/hooks/use-toast";

export default function ContactUsPage() {
  useEffect(() => { (async () => { const cfg = await fetchSeoConfig('/contact-us'); if (cfg) applySeoToHead(cfg); })(); }, []);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const urlParams = useMemo(() => new URLSearchParams(window.location.search), []);
  const productId = urlParams.get('product') || '';
  const selectedProduct = products.find(p => p.id === productId);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    product: productId,
    message: "",
    _hp: "",
  });
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      toast({ title: 'Missing required fields', description: 'Please provide your name and email to continue.', variant: 'destructive' as any });
      return;
    }
    // very basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast({ title: 'Invalid email address', description: 'Please enter a valid email.', variant: 'destructive' as any });
      return;
    }
    setSubmitting(true);
    try {
      const params = new URLSearchParams(window.location.search);
      const eff = getEffectiveUtm();
      await apiRequest('POST','/api/leads', {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        company: form.company.trim() || undefined,
        product: form.product || undefined,
        message: form.message.trim() || undefined,
        _hp: form._hp,
        source_path: window.location.pathname,
        utm_source: params.get('utm_source') || eff?.utm_source || undefined,
        utm_medium: params.get('utm_medium') || eff?.utm_medium || undefined,
        utm_campaign: params.get('utm_campaign') || eff?.utm_campaign || undefined,
        utm_term: params.get('utm_term') || eff?.utm_term || undefined,
        utm_content: params.get('utm_content') || eff?.utm_content || undefined,
        gclid: params.get('gclid') || eff?.gclid || undefined,
        fbclid: params.get('fbclid') || eff?.fbclid || undefined,
      });
      try {
        const body = { product: form.product || undefined, source_path: window.location.pathname } as any;
        gtmEvent('lead_submit', {
          product: body.product,
          source_path: body.source_path || window.location.pathname,
          utm_source: localStorage.getItem('utm_source') || undefined,
          utm_medium: localStorage.getItem('utm_medium') || undefined,
          utm_campaign: localStorage.getItem('utm_campaign') || undefined,
          gclid: localStorage.getItem('gclid') || undefined,
          fbclid: localStorage.getItem('fbclid') || undefined,
          status: 'created'
        });
      } catch {}
      trackEvent('generate_lead', {
        form_id: 'contact_us',
        method: 'contact_form',
        value: 1,
        currency: 'USD',
        items: form.product ? [{ item_id: form.product, item_name: selectedProduct?.name }] : undefined,
      });
      toast({ title: 'Request sent', description: 'We will contact you shortly.' });
      setForm({ name:'', email:'', phone:'', company:'', product:'', message:'' });
      // Stay on the same page after successful submit (no redirect)
    } catch (err:any) {
      try { gtmEvent('lead_error', { reason: (err && err.message) || 'unknown' }); } catch {}
      // Provide a friendlier error message
      const msg = typeof err?.message === 'string' ? err.message : 'Please try again.';
      const friendly = msg.includes('Missing SUPABASE') || msg.includes('Invalid API key')
        ? 'Server configuration error. Please try again later or email info@iboothme.com.'
        : msg;
      toast({ title: 'Failed to send', description: friendly, variant: 'destructive' as any });
    }
    finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative min-h-screen text-white">
      <Seo
        title="Contact Us"
        description="Talk to iboothme about your next activation. Get a demo or tailored quote."
        canonical="/contact-us"
        ogImage="/images/icon.svg"
        keywords={["contact", "demo", "quote", "brand activation"]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contact iboothme",
          description: "Get in touch for demos and quotes.",
          mainEntity: {
            "@type": "Organization",
            name: "iboothme",
            url: "https://www.iboothme.com/",
            logo: "https://www.iboothme.com/images/icon.svg",
            contactPoint: [{
              "@type": "ContactPoint",
              telephone: "+971 4 44 88 563",
              contactType: "customer support",
              areaServed: "AE",
              availableLanguage: ["en", "ar"]
            }]
          }
        }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_50%_at_50%_0%,rgba(112,66,210,0.12),transparent_60%),radial-gradient(60%_40%_at_80%_100%,rgba(34,212,253,0.10),transparent_60%)]" />
      <Navigation />
      <main className="relative z-10">
        {/* Hero */}
        <section className="relative w-full overflow-hidden min-h-[70vh] text-center mb-12 rounded-[28px] flex items-center justify-center">
          <div className="absolute inset-0 -z-10 opacity-30 overflow-hidden">
            <video className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.78vh] h-[100vh] md:w-[177.78vw] md:h-[56.25vw] max-w-none" autoPlay muted loop playsInline>
              <source src="/videos/contact-hero.mp4" />
            </video>
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,1)_0%,rgba(0,0,0,0.85)_10%,rgba(0,0,0,0)_40%,rgba(0,0,0,0)_60%,rgba(0,0,0,0.85)_90%,rgba(0,0,0,1)_100%)]" />
            <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_82%)]" />
          </div>
          <div className="max-w-5xl mx-auto px-6 py-20 md:py-24 lg:py-28 min-h-[70vh] flex flex-col items-center justify-center">
                        <div className="mt-6 mb-6 flex justify-center">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white/90 bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_8px_30px_rgba(112,66,210,0.25)] ring-1 ring-inset ring-[#7042D2]/25">
                14 Years Experience Since 2011
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black gradient-text px-3">Ready to activate your brand?</h1>
            <p className="text-lg md:text-xl text-white/85 mt-4 max-w-3xl mx-auto px-3">Let’s create something extraordinary together.</p>

          </div>
        </section>

        {/* Get Your Quote (Form) */}
        <section className="max-w-7xl mx-auto px-6 mb-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-4">Get Your Quote</h2>
            {selectedProduct && (
              <div className="mb-4 p-3 rounded-2xl border border-white/10 bg-white/5 flex items-center gap-3">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-12 h-12 rounded object-cover border border-white/10" />
                <div>
                  <div className="text-xs text-white/70">Selected Product</div>
                  <div className="font-semibold">{selectedProduct.name}</div>
                </div>
              </div>
            )}
            <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Honeypot field, hidden from users */}
              <div style={{ position: 'absolute', left: '-10000px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }} aria-hidden>
                <label htmlFor="company-website">Company Website</label>
                <input id="company-website" name="company-website" autoComplete="off" value={form._hp} onChange={(e)=>update('_hp', e.target.value)} />
              </div>
              <div className="col-span-1 md:col-span-1">
                <label className="block text-sm text-white/80 mb-1">Full Name *</label>
                <input required value={form.name} onChange={(e) => update("name", e.target.value)} className="w-full rounded-xl bg-black/40 border border-white/15 px-4 py-3 outline-none focus:ring-2 focus:ring-[#7042D2]" placeholder="Jane Doe" />
              </div>
              <div className="col-span-1 md:col-span-1">
                <label className="block text-sm text-white/80 mb-1">Email Address *</label>
                <input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className="w-full rounded-xl bg-black/40 border border-white/15 px-4 py-3 outline-none focus:ring-2 focus:ring-[#7042D2]" placeholder="you@company.com" />
              </div>
              <div>
                <label className="block text-sm text-white/80 mb-1">Phone Number</label>
                <input value={form.phone} onChange={(e) => update("phone", e.target.value)} className="w-full rounded-xl bg-black/40 border border-white/15 px-4 py-3 outline-none focus:ring-2 focus:ring-[#7042D2]" placeholder="+971 4 44 88 563" />
              </div>
              <div>
                <label className="block text-sm text-white/80 mb-1">Company</label>
                <input value={form.company} onChange={(e) => update("company", e.target.value)} className="w-full rounded-xl bg-black/40 border border-white/15 px-4 py-3 outline-none focus:ring-2 focus:ring-[#7042D2]" placeholder="Your Company" />
              </div>
              {!selectedProduct && (
                <div className="md:col-span-2">
                  <label className="block text-sm text-white/80 mb-1">Product Interest</label>
                  <select value={form.product} onChange={(e) => update("product", e.target.value)} className="w-full rounded-xl bg-black/40 border border-white/15 px-4 py-3 outline-none focus:ring-2 focus:ring-[#7042D2]">
                    <option value="">Select a product (optional)</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="md:col-span-2">
                <label className="block text-sm text-white/80 mb-1">Message</label>
                <textarea value={form.message} onChange={(e) => update("message", e.target.value)} rows={6} className="w-full rounded-xl bg-black/40 border border-white/15 px-4 py-3 outline-none focus:ring-2 focus:ring-[#7042D2]" placeholder="Tell us about your event or activation needs…" />
              </div>
              <div className="md:col-span-2 mt-2">
                <Button type="submit" variant="creativePrimary" size="lg" disabled={submitting}>
                  {submitting ? 'Sending…' : 'Send Message'}
                </Button>
              </div>
            </form>
          </div>
          {/* Offices */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8 space-y-6">
            <h3 className="text-xl font-semibold mb-2">Our Offices</h3>
            <OfficeCard title="UAE" address="Mazaya Business Avenue AA1, 1402, Jumeirah Lakes Towers, Dubai, UAE" phone="+971 4 44 88 563" />
            <OfficeCard title="Qatar" address="Al Mirqab Complex, Ground Floor, Office 01, Doha, Qatar" phone="+974 4001 7012" />
            <OfficeCard title="Saudi Arabia" address="Spring Towers, 3rd Floor, Office 314, Building B, Riyadh, KSA" phone="+966 53 168 5546" />
          </div>
        </section>

        {/* Quick Contact */}
        <section className="max-w-7xl mx-auto px-6 mb-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <QuickInfo label="Email" value="info@iboothme.com" />
          <QuickInfo label="Phone" value="+971 4 44 88 563" />
          <QuickInfo label="Hours" value="Sun – Thu: 9:00 AM – 6:00 PM" />
        </section>

        {/* Stats */}
        <section className="max-w-6xl mx-auto px-6 pb-16 grid grid-cols-1 sm:grid-cols-4 gap-6">
          {[
            { k: "14", v: "Years Experience" },
            { k: "45K+", v: "Activations Powered" },
            { k: "AI First", v: "Technology" },
            { k: "Custom", v: "Solutions" },
          ].map((s, i) => (
            <div key={i} className="relative rounded-3xl lg:rounded-[2.5rem] border border-white/10 bg-white/5 p-10 text-center overflow-hidden transition-all duration-500 hover:bg-gradient-to-br hover:from-white/10 hover:to-white/5 hover:border-white/20">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120px_60px_at_50%_0%,rgba(255,255,255,0.12),transparent)]" />
              <div className="text-3xl md:text-4xl font-black mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">{s.k}</div>
              <div className="text-sm md:text-base text-white/70 tracking-wide uppercase">{s.v}</div>
            </div>
          ))}
        </section>
      </main>
      <FooterSection />
    </div>
  );
}

function OfficeCard({ title, address, phone }: { title: string; address: string; phone: string }) {
  return (
    <div className="group relative rounded-3xl border border-white/10 bg-white/5 p-5 overflow-hidden transition-all duration-500 hover:border-white/20 hover:bg-white/10 hover:shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.18)_0%,transparent_28%,transparent_72%,rgba(255,255,255,0.09)_100%)] opacity-60 mix-blend-overlay transition-transform duration-700 group-hover:translate-y-[-2%]" />
      <div className="flex items-start gap-3">
        <div className="mt-0.5 inline-flex items-center justify-center w-8 h-8 text-white/90">
          <MapPin className="w-5 h-5" />
        </div>
        <div>
          <div className="text-lg font-semibold">{title}</div>
          <div className="text-white/80 text-sm mt-1 mb-2 leading-relaxed max-w-prose">{address}</div>
          <a href={`tel:${phone.replace(/\s+/g,'')}`} className="inline-flex items-center gap-2 text-sm font-medium text-white/90 hover:text-white">
            <PhoneIcon className="w-4 h-4" />
            {phone}
          </a>
        </div>
      </div>
    </div>
  );
}

function QuickInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="group relative rounded-3xl border border-white/10 bg-white/5 p-6 text-center overflow-hidden transition-all duration-500 hover:border-white/20 hover:bg-white/10 hover:shadow-[0_18px_60px_rgba(0,0,0,0.35)] hover:-translate-y-[2px]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.18)_0%,transparent_28%,transparent_72%,rgba(255,255,255,0.09)_100%)] opacity-60 mix-blend-overlay transition-transform duration-700 group-hover:translate-y-[-2%]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120px_60px_at_50%_0%,rgba(255,255,255,0.12),transparent)]" />
      <div className="flex flex-col items-center gap-2">
        <span aria-hidden className="inline-flex items-center justify-center w-10 h-10 text-white/90">
          {label.toLowerCase().includes('email') ? (
            <Mail className="w-5 h-5" />
          ) : label.toLowerCase().includes('phone') ? (
            <Phone className="w-5 h-5" />
          ) : (
            <Clock className="w-5 h-5" />
          )}
        </span>
        <div className="text-xs uppercase tracking-wide text-white/70">{label}</div>
        {label.toLowerCase().includes('email') ? (
          <a href={`mailto:${value}`} className="text-xl font-bold mt-1 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 underline-offset-4 hover:underline">
            {value}
          </a>
        ) : label.toLowerCase().includes('phone') ? (
          <a href={`tel:${value.replace(/\s+/g,'')}`} className="text-xl font-bold mt-1 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 underline-offset-4 hover:underline">
            {value}
          </a>
        ) : (
          <div className="text-xl font-bold mt-1 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">{value}</div>
        )}
      </div>
    </div>
  );
}
