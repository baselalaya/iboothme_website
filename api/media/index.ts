import type { VercelRequest, VercelResponse } from 'vercel';
import { getSupabaseAdmin, requireAdmin } from '../_supabase.js';

function getCdnBase() {
  const base = process.env.CDN_BASE_URL || '';
  return base.replace(/\/$/, '');
}

function qualifyUrl(keyOrUrl: string) {
  if (!keyOrUrl) return keyOrUrl;
  // If already absolute URL, return as-is
  if (/^https?:\/\//i.test(keyOrUrl)) return keyOrUrl;
  const base = getCdnBase();
  return base ? `${base}/${keyOrUrl.replace(/^\//,'')}` : keyOrUrl;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const supabase = getSupabaseAdmin();
  // Sub-route handling for /api/media/:id and /api/media/upload-url
  const url = new URL(req.url || '', 'http://localhost');
  const parts = url.pathname.split('/').filter(Boolean);
  const mediaIdx = parts.findIndex(p => p === 'media');
  const sub = mediaIdx >= 0 ? parts[mediaIdx + 1] : undefined;

  // Upload URL endpoint folded in
  if (sub === 'upload-url') {
    if (!requireAdmin(req, res)) return;
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ message: 'Method Not Allowed' });
    }
    try {
      const SUPABASE_URL = process.env.SUPABASE_URL as string;
      const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE as string;
      if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE');
      const bucket = (process.env.SUPABASE_MEDIA_BUCKET || 'media');
      const body = ((req as any).body && typeof (req as any).body === 'object') ? (req as any).body : {};
      const access = typeof (body as any).access === 'string' ? (body as any).access : 'public';
      const rawFileName = typeof (body as any).fileName === 'string' ? (body as any).fileName : 'upload';
      const safe = (rawFileName as string).replace(/[^a-zA-Z0-9._-]+/g, '-');
      const contentType = typeof (body as any).contentType === 'string' && (body as any).contentType ? (body as any).contentType : 'application/octet-stream';
      const rawSubDir = typeof (body as any).subDir === 'string' ? (body as any).subDir : '';
      const subDir = rawSubDir ? String(rawSubDir) : '';
      const y = new Date().getFullYear();
      const m = String(new Date().getMonth() + 1).padStart(2, '0');
      const normSub = subDir ? subDir.replace(/^\/+|\/+$/g, '') : '';
      const uid = (globalThis as any).crypto?.randomUUID ? (globalThis as any).crypto.randomUUID() : String(Date.now());
      const key = [normSub, y, m, `${uid}-${safe}`].filter(Boolean).join('/');
      const { createClient } = await import('@supabase/supabase-js');
      const storage = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, { auth: { persistSession: false } });
      const { data, error } = await (storage as any).storage.from(bucket).createSignedUploadUrl(key, { upsert: true, contentType });
      if (error) return res.status(500).json({ message: `Supabase error: ${error.message}` });
      const { data: pub } = (storage as any).storage.from(bucket).getPublicUrl(key);
      return res.json({ uploadUrl: data?.signedUrl, key, url: pub?.publicUrl || null, bucket, access });
    } catch (e: any) {
      return res.status(500).json({ message: e?.message || 'Server error' });
    }
  }

  // ID subresource folded in
  if (sub && sub !== 'upload-url') {
    if (!requireAdmin(req, res)) return;
    const id = String(sub);
    if (req.method === 'PUT') {
      try {
        const patch = req.body || {};
        patch.updated_at = new Date().toISOString();
        const { data, error } = await supabase
          .from('media_items')
          .update(patch)
          .eq('id', id)
          .select()
          .single();
        if (error) return res.status(500).json({ message: error.message });
        return res.json(data);
      } catch (e: any) {
        return res.status(500).json({ message: e?.message || 'Server error' });
      }
    }

    if (req.method === 'DELETE') {
      try {
        const { error } = await supabase.from('media_items').delete().eq('id', id);
        if (error) return res.status(500).json({ message: error.message });
        return res.status(204).end();
      } catch (e: any) {
        return res.status(500).json({ message: e?.message || 'Server error' });
      }
    }

    res.setHeader('Allow', 'PUT,DELETE');
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  if (req.method === 'GET') {
    try {
      const { page = '1', pageSize = '24', q, tag, type, includeAll } = req.query as any;
      const p = Math.max(1, parseInt(String(page)) || 1);
      const ps = Math.min(100, Math.max(1, parseInt(String(pageSize)) || 24));

      let query = supabase
        .from('media_items')
        .select('id,title,slug,type,url,thumbnail_url,tags,published,created_at', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((p - 1) * ps, p * ps - 1);

      // Only show published for public callers. Allow includeAll=true for admins.
      const isAdmin = req.headers['x-admin-key'] && req.headers['x-admin-key'] === process.env.ADMIN_PASSWORD;
      const wantAll = String(includeAll||'').toLowerCase() === 'true';
      if (!(isAdmin && wantAll)) {
        query = query.eq('published', true);
      }

      if (q) {
        const s = String(q);
        query = query.or(`title.ilike.%${s}%,slug.ilike.%${s}%`);
      }
      if (tag) query = query.contains('tags', [String(tag)] as any);
      if (type) query = query.eq('type', String(type));

      const { data, error, count } = await query;
      if (error) return res.status(500).json({ message: error.message });
      const cdnData = (data || []).map((it) => ({
        ...it,
        url: qualifyUrl((it as any).url),
        thumbnail_url: qualifyUrl((it as any).thumbnail_url),
      }));
      return res.json({ data: cdnData, count: count || 0, page: p, pageSize: ps });
    } catch (e: any) {
      return res.status(500).json({ message: e?.message || 'Server error' });
    }
  }

  if (req.method === 'POST') {
    if (!requireAdmin(req, res)) return;
    try {
      const body = req.body || {};
      body.created_at = new Date().toISOString();
      body.updated_at = body.created_at;
      const { data, error } = await supabase
        .from('media_items')
        .insert(body)
        .select()
        .single();
      if (error) return res.status(500).json({ message: error.message });
      return res.status(201).json(data);
    } catch (e: any) {
      return res.status(500).json({ message: e?.message || 'Server error' });
    }
  }

  res.setHeader('Allow', 'GET,POST');
  return res.status(405).json({ message: 'Method Not Allowed' });
}
