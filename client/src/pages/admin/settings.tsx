import { useEffect, useState } from 'react';
import { apiBaseJoin } from '../../lib/publicApi';
// Top admin nav removed; using floating bottom nav
import AdminBottomNav from '@/components/admin-bottom-nav';
import { adminApi, getAdminKey } from '@/lib/adminApi';

export default function AdminSettingsPage() {
  const [gaId, setGaId] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [googleVerify, setGoogleVerify] = useState('');
  const [bingVerify, setBingVerify] = useState('');
  const [allowGPT, setAllowGPT] = useState(true);
  const [allowGoogleExt, setAllowGoogleExt] = useState(true);
  const [allowCCBot, setAllowCCBot] = useState(true);
  const [allowAnthropic, setAllowAnthropic] = useState(true);
  const [allowPerplexity, setAllowPerplexity] = useState(true);
  const [envHealth, setEnvHealth] = useState<any | null>(null);
  // GA server credentials (used by /api/ga/summary)
  const [gaPropertyId, setGaPropertyId] = useState('');
  const [gaClientEmail, setGaClientEmail] = useState('');
  const [gaPrivateKey, setGaPrivateKey] = useState('');

  useEffect(() => {
    if (!getAdminKey()) { window.location.href = '/admin/login'; return; }
    (async () => {
      try {
        const res = await fetch(apiBaseJoin('/api/settings/ga'));
        if (res.ok) {
          const { id } = await res.json();
          setGaId(id || '');
        }
        const pub = await fetch(apiBaseJoin('/api/settings/public'));
        if (pub.ok) {
          const js = await pub.json();
          setGoogleVerify(js.google_site_verification || '');
          setBingVerify(js.bing_site_verification || '');
        }
        // Load all settings (admin)
        const all = await adminApi<any[]>('GET', '/api/settings');
        const map: Record<string,string> = {};
        (all||[]).forEach((r: any) => { if (r && r.key) map[r.key] = r.value; });
        setAllowGPT((map['allow_gptbot'] ?? 'true') !== 'false');
        setAllowGoogleExt((map['allow_google_extended'] ?? 'true') !== 'false');
        setAllowCCBot((map['allow_ccbot'] ?? 'true') !== 'false');
        setAllowAnthropic((map['allow_anthropic_ai'] ?? 'true') !== 'false');
        setAllowPerplexity((map['allow_perplexitybot'] ?? 'true') !== 'false');
        setGaPropertyId(map['ga_property_id'] || '');
        setGaClientEmail(map['ga_client_email'] || '');
        setGaPrivateKey(map['ga_private_key'] || '');
        try {
          const h = await fetch(apiBaseJoin('/api/health/env'));
          setEnvHealth(h.ok ? await h.json() : null);
        } catch (e) {
          console.error('Health check failed', e);
        }
      } catch (e:any) {
        console.error('Failed to load settings', e);
        setMsg(e?.message || 'Failed to load settings');
      }
    })();
  }, []);

  async function save() {
    setSaving(true); setMsg('');
    try {
      await adminApi('POST', '/api/settings', { key: 'ga_measurement_id', value: gaId.trim() || null });
      await adminApi('POST', '/api/settings', { key: 'google_site_verification', value: googleVerify.trim() || null });
      await adminApi('POST', '/api/settings', { key: 'bing_site_verification', value: bingVerify.trim() || null });
      await adminApi('POST', '/api/settings', { key: 'allow_gptbot', value: String(allowGPT) });
      await adminApi('POST', '/api/settings', { key: 'allow_google_extended', value: String(allowGoogleExt) });
      await adminApi('POST', '/api/settings', { key: 'allow_ccbot', value: String(allowCCBot) });
      await adminApi('POST', '/api/settings', { key: 'allow_anthropic_ai', value: String(allowAnthropic) });
      await adminApi('POST', '/api/settings', { key: 'allow_perplexitybot', value: String(allowPerplexity) });
      await adminApi('POST', '/api/settings', { key: 'ga_property_id', value: gaPropertyId.trim() || null });
      await adminApi('POST', '/api/settings', { key: 'ga_client_email', value: gaClientEmail.trim() || null });
      await adminApi('POST', '/api/settings', { key: 'ga_private_key', value: gaPrivateKey || null });
      setMsg('Saved');
    } catch (e:any) {
      setMsg(e?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      {null}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_50%_at_50%_0%,rgba(112,66,210,0.12),transparent_60%),radial-gradient(60%_40%_at_80%_100%,rgba(34,212,253,0.10),transparent_60%)]" />
      <div className="p-6 max-w-xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold gradient-text">Settings</h1>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
          {envHealth && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-3 mb-2">
              <div className="text-sm font-semibold mb-2">Environment Health</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <Health label="ADMIN_PASSWORD" ok={!!envHealth.adminPassword} />
                <Health label="SUPABASE_URL" ok={!!envHealth.supabase?.url} />
                <Health label="SUPABASE_SERVICE_ROLE" ok={!!envHealth.supabase?.serviceRole} />
                <Health label="Supabase connectivity" ok={!!envHealth.supabase?.ok} note={envHealth.supabase?.error} />
                <Health label="SITEMAP_BASE_URL" ok={!!envHealth.sitemapBaseUrl} />
                <Health label={`GA credentials (${envHealth.ga?.source||'unknown'})`} ok={!!envHealth.ga?.configured} />
              </div>
            </div>
          )}
          {!envHealth && (
            <div className="rounded-xl border border-yellow-400/30 bg-yellow-400/10 p-3 mb-2 text-xs">Environment health unavailable. Check server logs and network.</div>
          )}
          <label className="space-y-1 block">
            <div className="text-sm text-white/80">GA4 Measurement ID</div>
            <input value={gaId} onChange={(e)=>setGaId(e.target.value)} placeholder="G-XXXXXXXXXX" className="w-full rounded bg-black/40 border border-white/15 px-3 py-2" />
            <div className="text-xs text-white/60">Example: G-ABCDE12345. Leave empty to disable tracking.</div>
          </label>
          <div className="h-px w-full bg-white/10 my-2" />
          <div className="space-y-2">
            <div className="text-sm font-semibold">GA4 Server Credentials (for Admin dashboard)</div>
            <label className="space-y-1 block">
              <div className="text-sm text-white/80">GA4 Property ID</div>
              <input value={gaPropertyId} onChange={(e)=>setGaPropertyId(e.target.value)} placeholder="123456789" className="w-full rounded bg-black/40 border border-white/15 px-3 py-2" />
              <div className="text-xs text-white/60">Numeric property id (Admin → Property Settings). Not the Measurement ID.</div>
            </label>
            <label className="space-y-1 block">
              <div className="text-sm text-white/80">Service Account Client Email</div>
              <input value={gaClientEmail} onChange={(e)=>setGaClientEmail(e.target.value)} placeholder="service-account@project.iam.gserviceaccount.com" className="w-full rounded bg-black/40 border border-white/15 px-3 py-2" />
              <div className="text-xs text-white/60">Grant this email Viewer access to the GA4 property.</div>
            </label>
            <label className="space-y-1 block">
              <div className="text-sm text-white/80">Service Account Private Key</div>
              <textarea value={gaPrivateKey} onChange={(e)=>setGaPrivateKey(e.target.value)} placeholder="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----" className="w-full rounded bg-black/40 border border-white/15 px-3 py-2 h-28" />
              <div className="text-xs text-white/60">Paste full key. Newlines are preserved automatically.</div>
            </label>
            <div className="text-xs text-white/60">Stored encrypted at rest in DB (server reads at runtime).</div>
          </div>
          <div className="h-px w-full bg-white/10 my-2" />
          <label className="space-y-1 block">
            <div className="text-sm text-white/80">Google Search Console Verification Token</div>
            <input value={googleVerify} onChange={(e)=>setGoogleVerify(e.target.value)} placeholder="paste token (not full meta tag)" className="w-full rounded bg-black/40 border border-white/15 px-3 py-2" />
            <div className="text-xs text-white/60">Enter the value for meta name="google-site-verification" content="…"</div>
          </label>
          <label className="space-y-1 block">
            <div className="text-sm text-white/80">Bing Webmaster Verification Token (optional)</div>
            <input value={bingVerify} onChange={(e)=>setBingVerify(e.target.value)} placeholder="paste token" className="w-full rounded bg-black/40 border border-white/15 px-3 py-2" />
            <div className="text-xs text-white/60">Enter the value for meta name="msvalidate.01" content="…"</div>
          </label>
          <div className="h-px w-full bg-white/10 my-2" />
          <div className="text-sm font-semibold">Crawlers</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={allowGPT} onChange={(e)=>setAllowGPT(e.target.checked)} /> GPTBot (OpenAI)
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={allowGoogleExt} onChange={(e)=>setAllowGoogleExt(e.target.checked)} /> Google-Extended (Google AI)
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={allowCCBot} onChange={(e)=>setAllowCCBot(e.target.checked)} /> CCBot (CommonCrawl)
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={allowAnthropic} onChange={(e)=>setAllowAnthropic(e.target.checked)} /> anthropic-ai (Claude)
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={allowPerplexity} onChange={(e)=>setAllowPerplexity(e.target.checked)} /> PerplexityBot
            </label>
          </div>
          <div className="text-xs text-white/60">Changes apply on next build/deploy (robots.txt and .well-known/ai.txt regenerated).</div>
          <div className="flex gap-2 justify-end">
            <button onClick={save} disabled={saving} className="rounded bg-white/10 px-3 py-2 disabled:opacity-50">{saving ? 'Saving…' : 'Save'}</button>
          </div>
          {msg && <div className="text-sm text-white/70">{msg}</div>}
        </div>
      </div>
      <AdminBottomNav />
    </div>
  );
}

function Health({ label, ok, note }: { label: string; ok: boolean; note?: string }) {
  return (
    <div className={`rounded-lg border px-2 py-1 ${ok ? 'border-emerald-400/30 bg-emerald-400/10' : 'border-red-400/30 bg-red-400/10'}`}> 
      <div className="flex items-center justify-between">
        <span>{label}</span>
        <span className={`text-[10px] px-1.5 py-0.5 rounded ${ok ? 'bg-emerald-500/30' : 'bg-red-500/30'}`}>{ok ? 'OK' : 'Missing'}</span>
      </div>
      {!ok && note && <div className="mt-1 text-[10px] opacity-80">{note}</div>}
    </div>
  );
}
