import type { VercelRequest, VercelResponse } from 'vercel';
import { getSupabaseAdmin, requireAdmin } from '../_supabase.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const supabase = getSupabaseAdmin();
  // Subpaths: /api/settings/public and /api/settings/ga
  const url = new URL(req.url || '', 'http://localhost');
  const parts = url.pathname.split('/').filter(Boolean);
  const idx = parts.findIndex(p => p === 'settings');
  const sub = idx >= 0 ? parts[idx + 1] : undefined;

  if (sub === 'public') {
    // Public subset; no admin required
    try {
      const allowed = ['google_site_verification', 'bing_site_verification'];
      const { data, error } = await supabase.from('settings').select('key,value').in('key', allowed);
      if (error) return res.status(200).json({});
      const out: Record<string, string> = {};
      (data || []).forEach((row: any) => { out[row.key] = row.value; });
      return res.json(out);
    } catch {
      return res.json({});
    }
  }

  if (sub === 'ga') {
    try {
      const { data, error } = await supabase.from('settings').select('value').eq('key', 'ga_measurement_id').single();
      if (error && (error as any).code !== 'PGRST116') return res.status(500).json({ id: null });
      return res.json({ id: data?.value || null });
    } catch {
      return res.json({ id: null });
    }
  }
  if (req.method === 'GET') {
    if (!requireAdmin(req, res)) return;
    const { data, error } = await supabase.from('settings').select('*').order('key');
    if (error) return res.status(500).json({ message: error.message });
    return res.json(data || []);
  }
  if (req.method === 'POST') {
    if (!requireAdmin(req, res)) return;
    const { key, value } = req.body || {};
    if (!key) return res.status(400).json({ message: 'key is required' });
    const { data, error } = await supabase.from('settings').upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' }).select().single();
    if (error) return res.status(500).json({ message: error.message });
    return res.json(data);
  }
  res.setHeader('Allow', 'GET,POST');
  return res.status(405).json({ message: 'Method Not Allowed' });
}
