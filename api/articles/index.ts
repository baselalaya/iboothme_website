import type { VercelRequest, VercelResponse } from 'vercel';
import { getSupabaseAdmin } from '../_supabase.js';

// Public articles listing endpoint used by client Insights page
// Query params: page, pageSize, q, tag
// Response: { data: Article[], count: number, page: number, pageSize: number }
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const supabase = getSupabaseAdmin();
  // Sub-route: /api/articles?slug=... acts like former by-slug route
  if (req.method === 'GET' && typeof (req.query as any).slug === 'string' && (req.query as any).slug) {
    try {
      const slug = String((req.query as any).slug);
      const { data, error } = await supabase
        .from('articles')
        .select('id,title,slug,excerpt,cover_image,tags,author,published_at,content')
        .eq('slug', slug)
        .single();
      if (error) return res.status(404).json({ message: 'Not found' });
      return res.json(data);
    } catch (e: any) {
      return res.status(500).json({ message: e?.message || 'Server error' });
    }
  }

  if (req.method === 'GET') {
    try {
      const { page = '1', pageSize = '12', q, tag } = req.query as any;
    const p = Math.max(1, parseInt(String(page)) || 1);
    const ps = Math.min(100, Math.max(1, parseInt(String(pageSize)) || 12));

    let query = supabase
      .from('articles')
      .select('id,title,slug,excerpt,cover_image,tags,author,published_at', { count: 'exact' })
      .order('published_at', { ascending: false })
      .range((p - 1) * ps, p * ps - 1);

    if (q) {
      const s = String(q);
      query = query.or(`title.ilike.%${s}%,excerpt.ilike.%${s}%`);
    }
    if (tag) {
      // tags is expected to be text[] in Postgres; use contains for array
      query = query.contains('tags', [String(tag)] as any);
    }

      const { data, error, count } = await query;
      if (error) return res.status(500).json({ message: error.message });
      return res.json({ data: data || [], count: count || 0, page: p, pageSize: ps });
    } catch (e: any) {
      return res.status(500).json({ message: e?.message || 'Server error' });
    }
  }

  res.setHeader('Allow', 'GET');
  return res.status(405).json({ message: 'Method Not Allowed' });
}
