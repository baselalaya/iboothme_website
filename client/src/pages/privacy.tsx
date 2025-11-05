import Navigation from "@/components/navigation";
import FooterSection from "@/components/footer-section";
import Seo from "@/components/seo";
import { useEffect } from "react";
import { applySeoToHead, fetchSeoConfig } from "@/lib/seoOverride";
import Breadcrumbs from "@/components/breadcrumbs";

export default function PrivacyPage() {
  useEffect(() => { (async () => { const cfg = await fetchSeoConfig('/privacy'); if (cfg) applySeoToHead(cfg); })(); }, []);
  return (
    <div className="relative min-h-screen text-white">
      <Seo
        title="Privacy Policy"
        description="How we collect, use, and protect your personal information."
        canonical="/privacy"
      />
      <Navigation />
      <main className="relative z-10 px-6 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Privacy Policy' }]} />
        </div>
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold">Privacy Policy</h1>
          <p className="text-white/80">How we collect, use, and protect your personal information</p>
          <p className="text-white/60">Last updated: January 30, 2025</p>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Our Privacy Commitment</h2>
            <p className="text-white/80">At iboothme, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you engage with our products, platforms, activations, and services—including photo booths, vending machines, AI experiences, SaaS solutions, and custom event technologies.</p>
            <p className="text-white/80">We comply with GDPR and other applicable data protection laws. By using our services, you consent to the practices described in this policy.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Information We Collect</h2>
            <h3 className="font-medium">Personal Information You Provide</h3>
            <ul className="list-disc pl-6 text-white/80 space-y-1">
              <li>Account registration details (name, email, company info)</li>
              <li>Payment and billing information</li>
              <li>Profile settings and preferences</li>
              <li>Customer support inquiries and feedback</li>
              <li>Event details and activation configurations</li>
            </ul>
            <h3 className="font-medium pt-2">Information Collected Through Activations &amp; Events</h3>
            <ul className="list-disc pl-6 text-white/80 space-y-1">
              <li>Photos, videos, and media captured during sessions</li>
              <li>Guest contact details (when shared voluntarily)</li>
              <li>Social media handles and sharing preferences</li>
              <li>Participation, engagement, and redemption data (e.g., prize unlocks, QR scans, codes used)</li>
            </ul>
            <h3 className="font-medium pt-2">Technical Information</h3>
            <ul className="list-disc pl-6 text-white/80 space-y-1">
              <li>Device and browser details</li>
              <li>IP address and geolocation data</li>
              <li>Usage patterns and interaction data</li>
              <li>Cookies and tracking technologies</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">How We Use Your Information</h2>
            <h3 className="font-medium">Service Provision</h3>
            <ul className="list-disc pl-6 text-white/80 space-y-1">
              <li>Deliver and maintain iboothme products and services</li>
              <li>Process payments and manage subscriptions/contracts</li>
              <li>Enable event activations, prize distribution, and content sharing</li>
              <li>Power AI personalization and interactive experiences</li>
            </ul>
            <h3 className="font-medium pt-2">Communication &amp; Support</h3>
            <ul className="list-disc pl-6 text-white/80 space-y-1">
              <li>Respond to inquiries and technical requests</li>
              <li>Send important updates, alerts, and notifications</li>
              <li>Share relevant product and service information</li>
              <li>Collect and process feedback for service improvement</li>
            </ul>
            <h3 className="font-medium pt-2">Analytics &amp; Innovation</h3>
            <ul className="list-disc pl-6 text-white/80 space-y-1">
              <li>Measure campaign impact and ROI for brands</li>
              <li>Optimize user and guest experiences</li>
              <li>Develop new AI effects, hardware, and features</li>
              <li>Detect fraud and enhance system security</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Information Sharing &amp; Disclosure</h2>
            <p className="text-white/80">We do not sell or trade your data. We share it only when necessary:</p>
            <ul className="list-disc pl-6 text-white/80 space-y-1">
              <li><span className="font-medium">Service Providers</span> – payment processors, hosting/cloud storage, analytics tools, communication platforms</li>
              <li><span className="font-medium">Legal Requirements</span> – if required by law, or to protect rights, safety, or security</li>
              <li><span className="font-medium">Business Transfers</span> – in mergers, acquisitions, or restructuring</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Data Security</h2>
            <p className="text-white/80">Your data is safeguarded using industry-standard measures:</p>
            <ul className="list-disc pl-6 text-white/80 space-y-1">
              <li>Encryption of data in transit and at rest</li>
              <li>Secure cloud hosting and physical access controls</li>
              <li>Regular security audits and monitoring</li>
              <li>Employee training on data protection</li>
              <li>Multi-factor authentication for sensitive accounts</li>
            </ul>
            <p className="text-white/80">No system is 100% secure, but we continuously enhance protections.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Your Privacy Rights</h2>
            <p className="text-white/80">Under GDPR and other laws, you may request:</p>
            <ul className="list-disc pl-6 text-white/80 space-y-1">
              <li>Access to your data</li>
              <li>Correction of inaccurate details</li>
              <li>Deletion of your personal data</li>
              <li>Portability of data to another service</li>
              <li>Restriction of processing</li>
              <li>Objection to certain processing</li>
              <li>Withdrawal of Consent</li>
            </ul>
            <p className="text-white/80">Contact us to exercise these rights—we respond within 30 days.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Data Retention</h2>
            <p className="text-white/80">We keep personal data only as long as necessary:</p>
            <ul className="list-disc pl-6 text-white/80 space-y-1">
              <li>Account Data: Until account deletion or 3 years after last use</li>
              <li>Event Media: As defined in activation settings or until deletion request</li>
              <li>Payment Data: Up to 7 years (legal compliance)</li>
              <li>Technical Logs: Typically 12 months</li>
            </ul>
            <p className="text-white/80">After retention, data is securely deleted or anonymized.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Cookies &amp; Tracking</h2>
            <p className="text-white/80">We use cookies to:</p>
            <ul className="list-disc pl-6 text-white/80 space-y-1">
              <li>Ensure core functionality</li>
              <li>Monitor performance and analytics</li>
              <li>Remember user preferences</li>
              <li>Provide insights into usage and engagement</li>
            </ul>
            <p className="text-white/80">You can control cookies in your browser settings. Some features may not work without them.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Children’s Privacy</h2>
            <p className="text-white/80">iboothme services are designed for brands, businesses, and events—not children under 13. If we become aware of data from a child under 13, we delete it promptly.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">International Data Transfers</h2>
            <p className="text-white/80">Your data may be processed outside your country of residence. We use safeguards such as Standard Contractual Clauses to ensure compliance with global privacy regulations.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Policy Updates</h2>
            <p className="text-white/80">We may update this Privacy Policy when our practices, technologies, or regulations change. Updates will appear here with a revised “Last updated” date.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Contact Us</h2>
            <ul className="list-none pl-0 text-white/80 space-y-1">
              <li>📧 info@iboothme.com</li>
              <li>📞 +971 4 44 88 563</li>
              <li>📍 Mazaya Business Avenue AA1, 1402, Jumeirah Lakes Towers, Dubai, UAE</li>
            </ul>
            <p className="text-white/80">Data Protection Officer: Available for GDPR-related inquiries.</p>
            <p className="text-white/80">Response Time: Within 30 days.</p>
          </section>
        </div>
      </main>
      <FooterSection />
    </div>
  );
}
