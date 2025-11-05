import type { VercelRequest, VercelResponse } from 'vercel';
import { getSupabaseAdmin, requireAdmin } from '../_supabase.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const supabase = getSupabaseAdmin();
  // Fold /api/seo/:id into this handler
  const url = new URL(req.url || '', 'http://localhost');
  const parts = url.pathname.split('/').filter(Boolean);
  const idx = parts.findIndex(p => p === 'seo');
  const maybeId = idx >= 0 ? parts[idx + 1] : undefined;

  if (maybeId) {
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('seo_configs').select('*').eq('id', maybeId).single();
      if (error) return res.status(404).json({ message: 'Not found' });
      return res.json(data);
    }
    if (req.method === 'PUT') {
      if (!requireAdmin(req, res)) return;
      const patch = req.body || {};
      (patch as any).updated_at = new Date().toISOString();
      const { data, error } = await supabase.from('seo_configs').update(patch).eq('id', maybeId).select().single();
      if (error) return res.status(500).json({ message: error.message });
      return res.json(data);
    }
    res.setHeader('Allow', 'GET,PUT');
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  if (req.method === 'GET') {
    if (!requireAdmin(req, res)) return;
    const { data, error } = await supabase.from('seo_configs').select('*').order('id');
    if (error) return res.status(500).json({ message: error.message });
    return res.json(data || []);
  }
  if (req.method === 'POST') {
    if (!requireAdmin(req, res)) return;
    const body = req.body || {};
    if (!body.id) return res.status(400).json({ message: 'id is required (route path)' });
    body.updated_at = new Date().toISOString();
    const { data, error } = await supabase.from('seo_configs').upsert(body, { onConflict: 'id' }).select().single();
    if (error) return res.status(500).json({ message: error.message });
    return res.json(data);
  }
  res.setHeader('Allow', 'GET,POST');
  return res.status(405).json({ message: 'Method Not Allowed' });
}
