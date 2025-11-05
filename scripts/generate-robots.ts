import { writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { createClient } from '@supabase/supabase-js';

type Setting = { key: string; value: string | null };

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL as string;
  const key = process.env.SUPABASE_SERVICE_ROLE as string;
  if (!url || !key) throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE');
  return createClient(url, key, { auth: { persistSession: false } });
}

async function fetchSettings(): Promise<Record<string, string>> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from('settings').select('key,value');
    if (error) throw error;
    const out: Record<string, string> = {};
    (data as Setting[]).forEach((row) => { if (row.value != null) out[row.key] = String(row.value); });
    return out;
  } catch {
    return {};
  }
}

function bool(v: any, def = true) {
  if (v == null) return def;
  const s = String(v).toLowerCase();
  return s === 'true' || s === '1' || s === 'yes' || s === 'allow';
}

async function main() {
  const cfg = await fetchSettings();
  const BASE_URL = process.env.SITEMAP_BASE_URL || 'https://www.iboothme.com';

  const bots = [
    { key: 'allow_gptbot', ua: 'GPTBot' },
    { key: 'allow_google_extended', ua: 'Google-Extended' },
    { key: 'allow_ccbot', ua: 'CCBot' },
    { key: 'allow_anthropic_ai', ua: 'anthropic-ai' },
    { key: 'allow_perplexitybot', ua: 'PerplexityBot' },
  ];

  const lines: string[] = [];
  lines.push('User-agent: *');
  lines.push('Allow: /');
  lines.push('Disallow: /admin');
  lines.push('Disallow: /api');
  lines.push('');
  for (const b of bots) {
    const allowed = bool(cfg[b.key], true);
    lines.push(`User-agent: ${b.ua}`);
    lines.push(allowed ? 'Allow: /' : 'Disallow: /');
    lines.push('');
  }
  lines.push(`Sitemap: ${BASE_URL}/sitemap.xml`);

  const robotsTxt = lines.join('\n') + '\n';
  const robotsPath = resolve('client/public/robots.txt');
  writeFileSync(robotsPath, robotsTxt, 'utf8');

  const aiLines: string[] = [];
  aiLines.push('# ai.txt - crawler guidance for AI/LLMs');
  aiLines.push('# More info: https://ai.txt (community proposal)');
  aiLines.push('');
  aiLines.push('User-agent: *');
  aiLines.push('Allow: /');
  aiLines.push('Disallow: /admin');
  aiLines.push('Disallow: /api');
  aiLines.push('');
  for (const b of bots) {
    const allowed = bool(cfg[b.key], true);
    aiLines.push(`User-agent: ${b.ua}`);
    aiLines.push(allowed ? 'Allow: /' : 'Disallow: /');
    aiLines.push('');
  }
  aiLines.push(`Sitemap: ${BASE_URL}/sitemap.xml`);
  aiLines.push('Contact: info@iboothme.com');

  const aiTxt = aiLines.join('\n') + '\n';
  const aiPath = resolve('client/public/.well-known/ai.txt');
  mkdirSync(dirname(aiPath), { recursive: true });
  writeFileSync(aiPath, aiTxt, 'utf8');

  console.log('Generated robots.txt and .well-known/ai.txt');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

