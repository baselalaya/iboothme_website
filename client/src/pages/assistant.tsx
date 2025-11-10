import Navigation from "@/components/navigation";
import FooterSection from "@/components/footer-section";
import Seo from "@/components/seo";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import Breadcrumbs from "@/components/breadcrumbs";
import { products as allProducts } from "@/data/products";

type Answer = string;
type Step = {
  id: string;
  title: string;
  subtitle?: string;
  options: { id: Answer; label: string; hint?: string; img?: string }[];
};

const STEPS: Step[] = [
  {
    id: 'goal',
    title: 'What’s your primary goal?',
    options: [
      { id: 'content', label: 'Create shareable content', img: '/images/photography.jpg' },
      { id: 'engagement', label: 'Drive engagement / throughput', img: '/images/events.png' },
      { id: 'wow', label: 'Deliver a WOW moment', img: '/images/360-purple.png' },
      { id: 'data', label: 'Capture leads + analytics', img: '/images/tech.png' },
    ],
  },
  {
    id: 'output',
    title: 'Preferred output?',
    options: [
      { id: 'photo', label: 'Photo', img: '/images/mirror-tech-purple.png' },
      { id: 'video', label: 'Video', img: '/images/360-purple.png' },
      { id: 'both', label: 'Both', img: '/images/gobooth-purple.png' },
      { id: 'ai', label: 'AI / AR Effects', img: '/images/robotics-talia.png' },
    ],
  },
  {
    id: 'size',
    title: 'Expected audience size?',
    options: [
      { id: 'small', label: '< 100', img: '/images/gobooth-purple.png' },
      { id: 'med', label: '100–500', img: '/images/mirror-tech-purple.png' },
      { id: 'large', label: '500+', img: '/images/retro-x.jpg' },
    ],
  },
  {
    id: 'space',
    title: 'Available space / footprint?',
    options: [
      { id: 'compact', label: 'Compact', img: '/images/gobooth-purple.png' },
      { id: 'medium', label: 'Medium', img: '/images/mirror-tech-purple.png' },
      { id: 'flex', label: 'Flexible', img: '/images/holobox-purple.png' },
    ],
  },
  {
    id: 'vibe',
    title: 'Pick a vibe',
    options: [
      { id: 'premium', label: 'Premium / Stylish', img: '/images/mirror-tech-purple.png' },
      { id: 'energetic', label: 'Energetic / Fun', img: '/images/360-purple.png' },
      { id: 'futuristic', label: 'Futuristic / Techy', img: '/images/robotics-talia.png' },
      { id: 'playful', label: 'Playful / Casual', img: '/images/gumball-x-purple.png' },
    ],
  },
  {
    id: 'extras',
    title: 'Any must‑have feature?',
    options: [
      { id: 'analytics', label: 'Analytics', img: '/images/tech.png' },
      { id: 'branding', label: 'Branded Overlays', img: '/images/Brand Activation.jpg' },
      { id: 'sharing', label: 'Instant Sharing', img: '/images/photography.jpg' },
      { id: 'throughput', label: 'High Throughput', img: '/images/retro-x.jpg' },
    ],
  },
];

function scoreProducts(answers: Record<string, Answer>) {
  const score: Record<string, number> = {};
  const bump = (id: string, n = 1) => { score[id] = (score[id] || 0) + n; };

  // Simple heuristic mapping
  const goal = answers.goal;
  if (goal === 'content') { bump('holo-booth', 2); bump('mirror-tech', 1); }
  if (goal === 'engagement') { bump('gobooth', 2); bump('gift-box', 1); }
  if (goal === 'wow') { bump('360-booth', 2); bump('holo-booth', 1); }
  if (goal === 'data') { bump('analytics', 2); bump('gobooth', 1); }

  const output = answers.output;
  if (output === 'photo') { bump('mirror-tech', 2); bump('gobooth', 1); }
  if (output === 'video') { bump('360-booth', 2); }
  if (output === 'both') { bump('mirror-tech', 1); bump('360-booth', 1); bump('gobooth', 1); }
  if (output === 'ai') { bump('holo-booth', 2); }

  const size = answers.size;
  if (size === 'small') { bump('gobooth', 2); bump('gift-box', 1); }
  if (size === 'med') { bump('mirror-tech', 1); bump('360-booth', 1); }
  if (size === 'large') { bump('360-booth', 2); }

  const space = answers.space;
  if (space === 'compact') { bump('gobooth', 2); bump('gift-box', 1); }
  if (space === 'medium') { bump('mirror-tech', 1); bump('holo-booth', 1); }
  if (space === 'flex') { bump('360-booth', 1); bump('holo-booth', 1); }

  const vibe = answers.vibe;
  if (vibe === 'premium') { bump('mirror-tech', 2); }
  if (vibe === 'energetic') { bump('360-booth', 2); }
  if (vibe === 'futuristic') { bump('holo-booth', 2); }
  if (vibe === 'playful') { bump('gift-box', 2); bump('gobooth', 1); }

  const extras = answers.extras;
  if (extras === 'analytics') { bump('analytics', 3); }
  if (extras === 'branding') { bump('mirror-tech', 1); }
  if (extras === 'sharing') { bump('gobooth', 1); }
  if (extras === 'throughput') { bump('gobooth', 1); bump('360-booth', 1); }

  const ranked = Object.entries(score).sort((a,b)=> b[1]-a[1]).slice(0,3);
  const idSet = new Set(ranked.map(([id])=> id));
  const results = allProducts.filter(p => idSet.has(p.id));
  return results;
}

export default function AssistantPage(){
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const percent = Math.round((step / STEPS.length) * 100);
  const done = step >= STEPS.length;
  const results = useMemo(()=> done ? scoreProducts(answers) : [], [done, answers]);

  return (
    <div className="relative min-h-screen text-white">
      <Seo title="Event Assistant" description="Interactive assistant to help you choose the right experience for your event." canonical="/assistant" />
      <Navigation />
      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumbs items={[{ label:'Home', href:'/' }, { label:'Assistant' }]} />
        </div>

        {/* Hero */}
        <section className="relative w-full overflow-hidden min-h-[50vh] text-center rounded-[28px] mb-10">
          <video className="absolute inset-0 w-full h-full object-cover opacity-25" src="/videos/ai-tech.mp4" autoPlay loop muted playsInline preload="metadata" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,1)_0%,rgba(0,0,0,0.85)_10%,rgba(0,0,0,0)_40%,rgba(0,0,0,0)_60%,rgba(0,0,0,0.85)_90%,rgba(0,0,0,1)_100%)]" />
          <div className="relative max-w-4xl mx-auto px-6 py-16 md:py-20">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-white/15 bg-white/10 backdrop-blur mb-6">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-sm font-semibold tracking-wide uppercase">Interactive Quiz</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black gradient-text">Find the Right Experience</h1>
            <p className="text-white/85 max-w-2xl mx-auto mt-3">Answer a few quick questions and we’ll recommend the best options for your event.</p>
          </div>
        </section>

        {/* Progress */}
        <div className="max-w-3xl mx-auto px-6 mb-6">
          <div className="h-2 rounded-full bg-white/10 overflow-hidden"><div className="h-full bg-purple-500" style={{ width: `${percent}%` }} /></div>
          <div className="mt-2 text-sm text-white/70">{done ? 'Complete' : `Step ${step+1} of ${STEPS.length}`}</div>
        </div>

        {/* Steps */}
        {!done && (
          <div className="max-w-3xl mx-auto px-6 mb-12">
            <AnimatePresence mode="wait">
              <motion.div key={STEPS[step].id} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }} transition={{ duration:0.25 }} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h2 className="text-xl sm:text-2xl font-bold mb-2">{STEPS[step].title}</h2>
                {STEPS[step].subtitle && (<p className="text-white/70 mb-4">{STEPS[step].subtitle}</p>)}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {STEPS[step].options.map((o)=> (
                    <button
                      key={o.id}
                      onClick={()=>{ setAnswers(a=> ({ ...a, [STEPS[step].id]: o.id })); setStep(s=> s+1); try{ const { gtmEvent } = require('@/lib/gtm'); gtmEvent('assistant_answer', { step: STEPS[step].id, answer:o.id }); }catch{} }}
                      className="group rounded-2xl overflow-hidden border border-white/15 bg-white/[0.06] hover:bg-white/[0.1] transition shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
                    >
                      {o.img && (
                        <div className="relative aspect-video w-full overflow-hidden">
                          <img src={o.img} alt={o.label} loading="lazy" className="w-full h-full object-cover transform-gpu transition-transform duration-500 group-hover:scale-[1.06]" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        </div>
                      )}
                      <div className="px-4 py-3 text-left">
                        <div className="font-semibold text-white drop-shadow-sm">{o.label}</div>
                        {o.hint && <div className="text-xs text-white/70 mt-1">{o.hint}</div>}
                      </div>
                    </button>
                  ))}
                </div>
                {step>0 && (
                  <div className="mt-4 flex justify-between">
                    <Button variant="secondary" onClick={()=> setStep(s=> Math.max(0, s-1))}>Back</Button>
                    <div />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* Results */}
        {done && (
          <section className="max-w-6xl mx-auto px-6 mb-16">
            <h3 className="text-2xl md:text-3xl font-semibold text-center mb-6">Your Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {results.map(p => (
                <div key={p.id} className="relative rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                  <a href={`/products/${p.id}`} className="absolute inset-0 z-20" aria-label={`View ${p.name}`}></a>
                  <div className="aspect-video w-full bg-cover bg-center" style={{ backgroundImage: `url('${p.image}')` }} />
                  <div className="p-5">
                    <div className="text-xs text-purple-300/90 mb-1">{p.meta}</div>
                    <div className="text-xl font-bold">{p.name}</div>
                    <p className="text-sm text-white/80 mt-1">{p.description}</p>
                    <div className="mt-4 flex gap-2">
                      <Button asChild variant="creativePrimary"><a href={`/products/${p.id}`}>View</a></Button>
                      <Button asChild variant="creativeSecondary"><a href={`/contact-us?product=${p.id}`}>Talk to Us</a></Button>
                    </div>
                  </div>
                </div>
              ))}
              {results.length===0 && (
                <div className="md:col-span-3 text-center text-white/80">No exact match. Tell us your goals and we’ll tailor an experience for you.
                  <div className="mt-4"><Button asChild variant="creativePrimary"><a href="/contact-us">Contact Us</a></Button></div>
                </div>
              )}
            </div>
          </section>
        )}

      </main>
      <FooterSection />
    </div>
  );
}
