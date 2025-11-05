import Navigation from "@/components/navigation";
import FooterSection from "@/components/footer-section";
import Seo from "@/components/seo";
import { useEffect } from "react";
import { applySeoToHead, fetchSeoConfig } from "@/lib/seoOverride";
import Breadcrumbs from "@/components/breadcrumbs";

export default function TermsPage() {
  useEffect(() => { (async () => { const cfg = await fetchSeoConfig('/terms'); if (cfg) applySeoToHead(cfg); })(); }, []);
  return (
    <div className="relative min-h-screen text-white">
      <Seo
        title="Terms & Conditions"
        description="Terms & Conditions for iboothme services and website use."
        canonical="/terms"
      />
      <Navigation />
      <main className="relative z-10 px-6 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Terms & Conditions' }]} />
        </div>
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold">Terms & Conditions</h1>
          <h2 className="sr-only">Term &amp; Condition</h2>
          <p className="text-white/80">iboothme is operated by Studio 94 DMCC. Throughout the site, software, links, the terms "we", "us" and "our" refer to Studio 94 DMCC. Studio 94 DMCC offers all information, tools and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies and notices stated here.</p>
          <section className="space-y-3">
            <h3 className="text-xl font-semibold">Terms</h3>
            <p className="text-white/80">By accessing this website, you are agreeing to be bound by these website terms and conditions of use, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this website. The materials contained in this website are protected by applicable copyright and trademark law.</p>
          </section>

          <section className="space-y-3">
            <h3 className="text-xl font-semibold">Use License</h3>
            <p className="text-white/80">Permission is granted to use / download copy of the information materials on iboothme websites for personal or commercial use. However, this is the grant of a license, not a transfer of title, and under this license as a client you may not:</p>
            <ul className="list-disc pl-6 text-white/80 space-y-1">
              <li>use / modify or copy the materials for any other purpose without our written consent and approval</li>
              <li>attempt to decompile or reverse engineer any software contained on iboothme web site</li>
              <li>transfer the materials to another person or "mirror" the materials on any other server without our written consent and approval</li>
              <li>let your clients resell our services or promote this service as their own without our written consent and approval</li>
            </ul>
            <p className="text-white/80">This license shall automatically terminate if you violate any of these restrictions and may be terminated by iboothme at any time. Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession whether in electronic or printed format.</p>
          </section>

          <section className="space-y-3">
            <h3 className="text-xl font-semibold">Disclaimer</h3>
            <p className="text-white/80">The materials on iboothme website are provided "as is". iboothme makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties, including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights. Further, iboothme does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its Internet web site or otherwise relating to such materials or on any sites linked to this site.</p>
          </section>

          <section className="space-y-3">
            <h3 className="text-xl font-semibold">Limitations</h3>
            <p className="text-white/80">In no event shall iboothme or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption,) arising out of the use or inability to use the materials on iboothme website. Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.</p>
          </section>

          <section className="space-y-3">
            <h3 className="text-xl font-semibold">Revisions</h3>
            <p className="text-white/80">The materials appearing on iboothme website could include technical, typographical, or photographic errors. iboothme does not warrant that any of the materials on its website are accurate, complete, or current. iboothme may make changes to the materials contained on its web site at any time without notice. iboothme does not, however, make any commitment to update the materials.</p>
          </section>

          <section className="space-y-3">
            <h3 className="text-xl font-semibold">Links</h3>
            <p className="text-white/80">iboothme has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by iboothme of the site. Use of any such linked website is at the user's own risk.</p>
          </section>

          <section className="space-y-3">
            <h3 className="text-xl font-semibold">Site terms of use modifications</h3>
            <p className="text-white/80">iboothme may revise these terms of use for its web site at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms and conditions of use.</p>
          </section>

          <section className="space-y-3">
            <h3 className="text-xl font-semibold">Privacy Policy</h3>
            <p className="text-white/80">Your privacy is very important to us. Accordingly, we have developed this policy in order for you to understand how we collect, use, communicate and disclose and make use of personal information. The following outlines our privacy policy:</p>
            <ul className="list-disc pl-6 text-white/80 space-y-1">
              <li>Before or at the time of collecting personal information, we will identify the purposes for which information is being collected.</li>
              <li>We will collect and use of personal information solely with the objective of fulfilling those purposes specified by us and for other compatible purposes, unless we obtain the consent of the individual concerned or as required by law.</li>
              <li>We will only retain personal information as long as necessary for the fulfillment of those purposes.</li>
              <li>We will collect personal information by lawful and fair means and, where appropriate, with the knowledge or consent of the individual concerned.</li>
              <li>Personal data should be relevant to the purposes for which it is to be used, and, to the extent necessary for those purposes, should be accurate, complete, and up-to-date.</li>
              <li>We will protect personal information by reasonable security safeguards against loss or theft, as well as unauthorized access, disclosure, copying, use or modification.</li>
            </ul>
            <p className="text-white/80">We are committed to conducting our business in accordance with these principles in order to ensure that the confidentiality of personal information is protected and maintained.</p>
          </section>

          <section className="space-y-3">
            <h3 className="text-xl font-semibold">Governing law</h3>
            <p className="text-white/80">Any claim relating to iboothme website shall be governed by the laws of the Dubai, United Arab Emirates without regard to its conflict of law provisions.</p>
          </section>
        </div>
      </main>
      <FooterSection />
    </div>
  );
}
