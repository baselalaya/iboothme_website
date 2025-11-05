import type { VercelRequest, VercelResponse } from 'vercel';
import { getSupabaseAdmin } from '../_supabase.js';

// Public single-article endpoint by slug
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  const supabase = getSupabaseAdmin();
  const slug = String((req.query as any).slug || '');
  if (!slug) return res.status(400).json({ message: 'Missing slug' });
  try {
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

