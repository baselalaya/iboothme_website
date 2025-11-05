import React, { useEffect, useRef, useState } from "react";
import { BarChart3, PieChart, Gauge, Users, Clock3, Smile } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button"
import Navigation from "@/components/navigation";
import { applySeoToHead, fetchSeoConfig } from "@/lib/seoOverride";
import Seo from "@/components/seo";
  import FooterSection from "@/components/footer-section";



const statCards = [
  { label: "Total Experiences", value: 2847, delta: "+12.5%", color: "from-blue-500/20 to-blue-400/10", icon: Gauge },
  { label: "Unique Participants", value: 1923, delta: "+8.3%", color: "from-purple-500/20 to-purple-400/10", icon: Users },
  { label: "Social Shares", value: 1456, delta: "+15.7%", color: "from-fuchsia-500/20 to-fuchsia-400/10", icon: BarChart3 },
  { label: "Leads Captured", value: 892, delta: "+22.1%", color: "from-indigo-500/20 to-indigo-400/10", icon: PieChart },
];

function CountUp({ to, duration = 1200 }: { to: number; duration?: number }) {
  const [val, setVal] = useState(0);
  const rafRef = useRef<number | null>(null);
  useEffect(() => {
    let start: number | null = null;
    const from = 0;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const p = Math.min(1, (ts - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const next = Math.round(from + (to - from) * eased);
      setVal(next);
      if (p < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [to, duration]);
  return <>{val.toLocaleString()}</>;
}

export default function AnalyticsPage() {
  useEffect(() => { (async () => { const cfg = await fetchSeoConfig('/analytics'); if (cfg) applySeoToHead(cfg); })(); }, []);
  return (
    <div className="relative min-h-screen text-white" data-testid="analytics-page">
      <Seo
        title="Event Analytics & Insights"
        description="Real-time dashboards and post-event insights to measure engagement, ROI, and content performance across activations."
        canonical="/analytics"
        ogImage="/images/studio-ai-example.jpg"
        keywords={["event analytics", "engagement metrics", "ROI tracking"]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Event Analytics",
          description: "Dashboards and insights for event performance.",
          provider: { "@type": "Organization", name: "iboothme" }
        }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_50%_at_50%_0%,rgba(112,66,210,0.12),transparent_60%),radial-gradient(60%_40%_at_80%_100%,rgba(34,212,253,0.10),transparent_60%)]" />
      <Navigation />
      <main className="relative z-10" data-testid="analytics-page">
        {/* Full-width hero extracted from constrained container */}
        <section className="relative w-full overflow-hidden min-h-[70vh] text-center mb-16 rounded-none mt-0 flex items-center justify-center">
          {/* background subtle gradient + bottom fade to merge */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/90" />
          <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_82%)]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
          {/* looping background video with true cover sizing */}
          <div className="absolute inset-0 -z-10 opacity-30 md:opacity-40 overflow-hidden">
              <video
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.78vh] h-[100vh] md:w-[177.78vw] md:h-[56.25vw] max-w-none"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster="/images/studio-ai-example.jpg"
                aria-label="Background analytics motion"
              >
                <source src="/videos/analytics-1.mp4" type="video/mp4" />
              </video>
              {/* top vignette for readability */}
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,1)_0%,rgba(0,0,0,0.85)_10%,rgba(0,0,0,0)_40%,rgba(0,0,0,0)_60%,rgba(0,0,0,0.85)_90%,rgba(0,0,0,1)_100%)]" />
            </div>
            <div className="relative max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-20 lg:py-24 text-center min-h-[70vh] flex flex-col items-center justify-center">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-white/15 bg-white/10 backdrop-blur mb-6 mx-auto">
                <div className="w-2 h-2 rounded-full bg-[#7042D2] animate-pulse" />
                <span className="text-sm font-medium tracking-wide uppercase">Campaign Analytics</span>
              </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black leading-tight mb-4 md:mb-5 gradient-text px-3">Analytics Dashboard</h1>
              <p className="text-base sm:text-lg md:text-xl text-white/85 max-w-[30ch] sm:max-w-3xl mx-auto leading-relaxed px-3">
                Real-time analytics for your activation. Measure impact. Optimize performance. Maximize results.
              </p>
              {/* Inline Stats */}
              <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-left max-w-6xl mx-auto px-3">
                {statCards.map(({ label, value, delta, icon: Icon }, i) => (
                  <motion.div
                    key={`h-${label}`}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.45, delay: i * 0.08 }}
                    className="rounded-2xl sm:rounded-3xl lg:rounded-[2rem] p-5 sm:p-6 bg-white/5 backdrop-blur border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition-all duration-300 hover:border-white/20 hover:bg-white/10"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 grid place-items-center border border-white/10">
                          <Icon size={20} />
                        </div>
                        <div className="text-sm text-white/70">{label}</div>
                      </div>
                      <span className="text-white/80 text-xs font-semibold">{delta}</span>
                    </div>
                    <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold mt-2 sm:mt-3"><CountUp to={value} /></div>
                </motion.div>
              ))}
              </div>
            </div>
          </section>

        <div className="max-w-7xl mx-auto px-6">
          {/* Detailed KPI grid removed to rely on hero stats */}

          {/* Charts */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 mb-12">
            {/* Daily Performance Bar Chart */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="rounded-3xl border border-white/10 bg-black/30 p-5 sm:p-6 overflow-hidden"
            >
              <h3 className="text-base sm:text-lg font-semibold mb-4">Daily Performance</h3>
              <div className="h-64 grid grid-cols-7 items-end gap-2">
                {[
                  { d: "Mon", a: 2200, b: 800 },
                  { d: "Tue", a: 2600, b: 900 },
                  { d: "Wed", a: 3100, b: 1100 },
                  { d: "Thu", a: 3800, b: 1400 },
                  { d: "Fri", a: 5200, b: 1700 },
                  { d: "Sat", a: 4700, b: 1500 },
                  { d: "Sun", a: 1300, b: 600 },
                ].map(({ d, a, b }) => {
                  const max = 6000;
                  return (
                    <div key={d} className="group relative flex flex-col items-center gap-2 h-64">
                      <div className="w-full h-full flex gap-1 items-end">
                        <div
                          className="flex-1 rounded-md bg-[#7042D2] shadow-[0_6px_20px_rgba(112,66,210,0.35)] transition-transform duration-300 group-hover:-translate-y-1"
                          style={{ height: `${(a / max) * 100}%` }}
                          aria-label={`Actions ${a}`}
                        />
                        <div
                          className="flex-1 rounded-md bg-emerald-400/90 shadow-[0_6px_20px_rgba(16,185,129,0.30)] transition-transform duration-300 group-hover:-translate-y-1"
                          style={{ height: `${(b / max) * 100}%` }}
                          aria-label={`Shares ${b}`}
                        />
                      </div>
                      <div className="pointer-events-none absolute -top-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/70 backdrop-blur px-2 py-1 rounded text-[10px] border border-white/10">
                        {d}: <span className="text-white/80">{a}</span> actions · <span className="text-white/80">{b}</span> shares
                      </div>
                      <span className="text-xs text-white/70">{d}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-4 mt-4 text-[11px] sm:text-xs text-white/70">
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-[#7042D2]"/> Actions</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-emerald-400/90"/> Shares</div>
              </div>
            </motion.div>

            {/* Experience Types Distribution Donut */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="rounded-3xl border border-white/10 bg-black/30 p-5 sm:p-6"
            >
              <h3 className="text-base sm:text-lg font-semibold mb-4">Experience Types Distribution</h3>
              <div className="w-full flex items-center justify-center py-4">
                <RadialBarsInteractive />
              </div>
            </motion.div>
          </section>

          {/* AI Powered Analytics */}
          <section className="rounded-3xl px-6 md:px-8 py-12 md:py-16 mb-12">
            <h3 className="text-2xl font-bold text-center mb-2">AI-Powered Analytics</h3>
            <p className="text-center text-white/70 mb-8">Discover deeper insights. Unlock advanced analytics to maximize your brand activation success.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.45 }}
                className="group relative overflow-hidden rounded-3xl lg:rounded-[2rem] p-5 sm:p-6 border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition will-change-transform"
                onMouseMove={(e:any)=>{
                  const card = e.currentTarget as HTMLDivElement;
                  const r = card.getBoundingClientRect();
                  const x = ((e.clientX - r.left) / r.width) * 100;
                  const y = ((e.clientY - r.top) / r.height) * 100;
                  card.style.setProperty('--mx', `${x}%`);
                  card.style.setProperty('--my', `${y}%`);
                }}
              >
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 bg-[radial-gradient(140px_80px_at_20%_0%,rgba(255,255,255,0.12),transparent)]" />
                  {/* animated conic sheen */}
                  <div className="absolute -inset-[20%] opacity-0 group-hover:opacity-100 transition-opacity duration-500 [mask-image:radial-gradient(circle_at_var(--mx,50%)_var(--my,50%),black_0%,transparent_60%)] animate-spin-slow bg-[conic-gradient(from_0deg,rgba(112,66,210,0.15),transparent_30%,rgba(34,212,253,0.15),transparent_70%,rgba(112,66,210,0.15))]" />
                </div>
                <div className="absolute top-4 right-4 text-[10px] px-2 py-1 rounded-full bg-white/10 border border-white/15">Live</div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 grid place-items-center border border-white/10"><Users size={18} className="opacity-90"/></div>
                  <span className="font-semibold">Demographic Analysis</span>
                </div>
                <p className="text-sm text-white/70">AI detects gender, age groups, and engagement patterns in real-time</p>
                <div className="mt-4 text-sm flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden relative">
                    <div className="h-full bg-gradient-to-r from-pink-400/80 to-purple-400/80 animate-fill-wide" style={{ width: '67%' }} />
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.35),transparent_30%)] animate-sheen" />
                  </div>
                  <span className="text-white/80">67% Female</span>
                </div>
              </motion.div>

              {/* Card 2 */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.45, delay: 0.08 }}
                className="group relative overflow-hidden rounded-3xl lg:rounded-[2rem] p-5 sm:p-6 border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition will-change-transform"
                onMouseMove={(e:any)=>{
                  const card = e.currentTarget as HTMLDivElement;
                  const r = card.getBoundingClientRect();
                  const x = ((e.clientX - r.left) / r.width) * 100;
                  const y = ((e.clientY - r.top) / r.height) * 100;
                  card.style.setProperty('--mx', `${x}%`);
                  card.style.setProperty('--my', `${y}%`);
                }}
              >
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 bg-[radial-gradient(140px_80px_at_20%_0%,rgba(255,255,255,0.12),transparent)]" />
                </div>
                <div className="absolute top-4 right-4 text-[10px] px-2 py-1 rounded-full bg-white/10 border border-white/15">AI Model</div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 grid place-items-center border border-white/10"><Clock3 size={18} className="opacity-90"/></div>
                  <span className="font-semibold">Peak Time Analysis</span>
                </div>
                <p className="text-sm text-white/70">Identify optimal activation periods for maximum engagement</p>
                <div className="mt-4 grid grid-cols-7 gap-1 items-end h-16">
                  {[12,18,24,32,40,28,16].map((v,i)=> (
                    <div key={i} className="bg-[#7042D2] rounded-sm origin-bottom animate-rise" style={{ height: `${v}%`, animationDelay: `${i*60}ms` }} />
                  ))}
                </div>
                <div className="mt-2 text-xs text-white/70">Peak: <span className="text-white/90 font-medium">2:30 PM - 4:00 PM</span></div>
              </motion.div>

              {/* Card 3 */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.45, delay: 0.12 }}
                className="group relative overflow-hidden rounded-3xl lg:rounded-[2rem] p-5 sm:p-6 border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition will-change-transform"
                onMouseMove={(e:any)=>{
                  const card = e.currentTarget as HTMLDivElement;
                  const r = card.getBoundingClientRect();
                  const x = ((e.clientX - r.left) / r.width) * 100;
                  const y = ((e.clientY - r.top) / r.height) * 100;
                  card.style.setProperty('--mx', `${x}%`);
                  card.style.setProperty('--my', `${y}%`);
                }}
              >
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 bg-[radial-gradient(140px_80px_at_20%_0%,rgba(255,255,255,0.12),transparent)]" />
                </div>
                <div className="absolute top-4 right-4 text-[10px] px-2 py-1 rounded-full bg-white/10 border border-white/15">Benchmark</div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 grid place-items-center border border-white/10"><Smile size={18} className="opacity-90"/></div>
                  <span className="font-semibold">Emotion Detection</span>
                </div>
                <p className="text-sm text-white/70">Track participant emotions and satisfaction levels</p>
                <div className="mt-4 flex items-center gap-3">
                  <EmotionGauge value={78} />
                  <div className="text-sm">
                    <div><span className="text-white/70">Avg. Emotion:</span> <span className="font-semibold text-indigo-300">Happy</span></div>
                    <div className="text-white/70">Stable positive sentiment across sessions.</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          { /* 3D demo moved to Home page */ }

          {/* CTA */}
          <section className="relative px-6 md:px-10a md:py-16 text-center mt-16">
            <div className="relative">

              <h3 className="text-2xl md:text-3xl font-bold mb-2 gradient-text">And More Insights to Discover</h3>
              <p className="text-white/75 max-w-4xl mx-auto mb-6">Unlock deeper analytics and advanced reporting features to maximize your brand activation success.</p>
              <div className="flex justify-center gap-3">
                <Button variant="creativePrimary" className="px-6">Choose Your Booth</Button>
                <Button variant="creativeSecondary">Contact Us</Button>
              </div>
            </div>
          </section>
        </div>
      </main>
      <FooterSection />
    </div>
  );
}

function DonutInteractive() {
  const segments = [
    { label: 'AI Photos', value: 45, color: '#8b5cf6' },
    { label: 'Videos', value: 25, color: '#22d3ee' },
    { label: 'GIFs', value: 18, color: '#34d399' },
    { label: 'Boomerangs', value: 12, color: '#f59e0b' },
  ];
  const [active, setActive] = useState(0);
  const total = segments.reduce((s, x) => s + x.value, 0);
  let offset = 0;
  // Use a slightly smaller radius and larger viewBox to prevent stroke clipping
  const r = 15;
  return (
    <div className="grid gap-4">
      <div className="h-64 grid place-items-center">
        <svg viewBox="0 0 48 48" className="w-64 h-64 -rotate-90">
          <defs>
            <filter id="ringGlowX">
              <feGaussianBlur in="SourceGraphic" stdDeviation="0.6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <circle cx="24" cy="24" r={r} fill="transparent" stroke="#111827" strokeWidth="8" />
          {segments.map((s, i) => {
            const dash = `${s.value} ${total - s.value}`;
            const dashOffset = -offset;
            offset += s.value;
            return (
              <circle
                key={s.label}
                cx="24"
                cy="24"
                r={r}
                fill="transparent"
                stroke={s.color}
                strokeWidth="8"
                strokeDasharray={dash}
                strokeDashoffset={dashOffset}
                filter={i === active ? 'url(#ringGlowX)' : undefined}
                opacity={active === i ? 1 : 0.6}
                onMouseEnter={() => setActive(i)}
                style={{ transition: 'opacity 200ms ease' }}
              />
            );
          })}
          {/* center label (not rotated) */}
          <g transform="translate(24,24) rotate(90)">
            <text x="0" y="-2" textAnchor="middle" className="fill-white" style={{fontSize: '8px', fontWeight: 700}}>{segments[active].label}</text>
            <text x="0" y="7" textAnchor="middle" className="fill-white/70" style={{fontSize: '6px'}}>{segments[active].value}%</text>
          </g>
        </svg>
      </div>
      <div className="flex flex-wrap gap-4 justify-center text-xs text-white/80">
        {segments.map((s, i) => (
          <button
            key={s.label}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            className={`inline-flex items-center gap-2 px-2 py-1 rounded ${i===active ? 'bg-white/10' : ''}`}
            aria-label={`${s.label} ${s.value}%`}
          >
            <i className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} /> {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function RadialBarsInteractive() {
  const data = [
    { label: 'AI Photos', value: 45, color: '#8b5cf6' },
    { label: 'Videos', value: 25, color: '#22d3ee' },
    { label: 'GIFs', value: 18, color: '#34d399' },
    { label: 'Boomerangs', value: 12, color: '#f59e0b' },
  ];
  const [active, setActive] = useState(0);
  // Larger canvas and slight center shift to avoid top/left clipping
  const cx = 98, cy = 100;
  const stroke = 10;
  const gap = 6;
  const baseR = 20; // smaller base for more padding
  const rings = data.map((d, i) => ({ ...d, r: baseR + i * (stroke + gap) }));
  const circ = (r: number) => 2 * Math.PI * r;
  return (
    <div className="grid gap-4">
      <div className="h-72 sm:h-80 grid place-items-center">
        <svg viewBox="0 0 192 192" className="w-72 h-72 sm:w-80 sm:h-80 overflow-visible" role="img" aria-labelledby="rbTitle rbDesc">
          <title id="rbTitle">Experience Types Distribution</title>
          <desc id="rbDesc">Concentric radial bars showing percentages for AI Photos, Videos, GIFs, and Boomerangs.</desc>
          <defs>
            <filter id="rbGlow">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* background rings */}
          {rings.map((r, i) => (
            <circle key={`bg-${i}`} cx={cx} cy={cy} r={r.r} fill="none" stroke="#111827" strokeWidth={stroke} />
          ))}
          {/* value arcs */}
          {rings.map((r, i) => {
            const total = circ(r.r);
            const dash = (r.value / 100) * total;
            return (
              <circle
                key={`fg-${i}`}
                cx={cx}
                cy={cy}
                r={r.r}
                fill="none"
                stroke={r.color}
                strokeWidth={stroke}
                strokeDasharray={`${dash} ${total - dash}`}
                strokeDashoffset={-total * 0.25} // start at top
                opacity={active === i ? 1 : 0.6}
                filter={active === i ? 'url(#rbGlow)' : undefined}
                onMouseEnter={() => setActive(i)}
                aria-label={`${r.label} ${r.value}%`}
                style={{ transition: 'opacity 200ms ease' }}
              />
            );
          })}
          {/* end caps labels */}
          {rings.map((r, i) => {
            const angle = -90 + (r.value / 100) * 360; // degrees
            const rad = (angle * Math.PI) / 180;
            const tx = cx + (r.r) * Math.cos(rad);
            const ty = cy + (r.r) * Math.sin(rad);
            return (
              <g key={`label-${i}`} transform={`translate(${tx},${ty})`}>
                <circle r={2} fill={r.color} />
              </g>
            );
          })}
          {/* center readout */}
          <g transform={`translate(${cx},${cy})`}>
            <text x="0" y="-4" textAnchor="middle" className="fill-white" style={{fontSize:'10px', fontWeight:700}}>{rings[active].label}</text>
            <text x="0" y="10" textAnchor="middle" className="fill-white/70" style={{fontSize:'9px'}}>{rings[active].value}%</text>
          </g>
        </svg>
      </div>
      <div className="flex flex-wrap gap-3 sm:gap-4 justify-center text-xs text-white/80">
        {rings.map((r, i) => (
          <button
            key={r.label}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            className={`inline-flex items-center gap-2 px-2 py-1 rounded ${i===active ? 'bg-white/10' : ''}`}
            aria-label={`${r.label} ${r.value}%`}
          >
            <i className="w-3 h-3 rounded-full" style={{ backgroundColor: r.color }} /> {r.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function EmotionGauge({ value }: { value: number }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf: number | null = null;
    const start = performance.now();
    const dur = 900;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { if (raf) cancelAnimationFrame(raf); };
  }, [value]);
  return (
    <div className="relative w-24 h-24">
      <svg viewBox="0 0 36 36" className="w-24 h-24">
        <circle cx="18" cy="18" r="16" fill="transparent" stroke="#1f2937" strokeWidth="4" />
        <circle cx="18" cy="18" r="16" fill="transparent" stroke="#22c55e" strokeWidth="4" strokeDasharray={`${v} ${100-v}`} strokeDashoffset="0" />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-sm"><span className="font-semibold">{v}%</span></div>
    </div>
  );
}

// Keyframes moved to global stylesheet (client/src/index.css)
