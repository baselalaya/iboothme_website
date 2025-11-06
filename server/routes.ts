import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL as string;
  const key = process.env.SUPABASE_SERVICE_ROLE as string;
  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE env");
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

function requireAdmin(req: any, res: any, next: any) {
  const header = req.headers["x-admin-key"]; 
  if (!process.env.ADMIN_PASSWORD) return res.status(500).json({ message: "ADMIN_PASSWORD not set" });
  if (header !== process.env.ADMIN_PASSWORD) return res.status(401).json({ message: "Unauthorized" });
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Basic in-memory rate limiting and honeypot validation for spam mitigation
  const submissionsWindowMs = 60_000; // 1 minute window
  const maxPerWindow = 5; // max requests per IP per window
  const ipBuckets = new Map<string, { count: number; resetAt: number }>();

  function getClientIp(req: any): string {
    const raw = (req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown").toString();
    return raw.split(",")[0].trim();
  }

  function rateLimit(req: any, res: any, next: any) {
    const ip = getClientIp(req);
    const now = Date.now();
    const bucket = ipBuckets.get(ip);
    if (!bucket || now > bucket.resetAt) {
      ipBuckets.set(ip, { count: 1, resetAt: now + submissionsWindowMs });
      return next();
    }
    if (bucket.count >= maxPerWindow) {
      return res.status(429).json({ message: "Too many requests. Please slow down." });
    }
    bucket.count += 1;
    return next();
  }

  // Shared anti-spam middleware: honeypot and content heuristic
  function antiSpam(req: any, res: any, next: any) {
    const body = req.body || {};
    if (typeof body._hp !== 'undefined' && String(body._hp).trim() !== '') {
      return res.status(204).send();
    }
    const text = [body.name, body.email, body.company, body.notes, body.message]
      .filter((x) => typeof x === 'string' && x)
      .join(' ');
    if ((text.match(/https?:\/\//gi) || []).length > 2) {
      return res.status(400).json({ message: 'Links not allowed in message.' });
    }
    next();
  }
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // simple endpoint to accept product activation requests
  app.post('/api/activate', rateLimit, antiSpam, (req, res) => {
    const { name, email, company, eventDate, guests, notes, productId } = req.body || {}
    if (!name || !email || !productId) {
      return res.status(400).json({ message: 'Missing required fields' })
    }
    // In a real implementation, persist or forward to CRM/email.
    // For now, just echo success.
    return res.status(200).json({ ok: true })
  })

  // leads: public creation
  app.post('/api/leads', rateLimit, antiSpam, async (req, res) => {
    // Explicit CORS headers as backup (in addition to global cors middleware)
    try {
      const origin = (req.headers['origin'] as string|undefined) || '';
      const allowed = [/^https?:\/\/.*\.vercel\.app$/, 'https://stagingbooth.vercel.app', 'https://www.iboothme.com', 'https://ae.iboothme.com', 'https://iboothme.com', 'https://api.iboothme.com', /^http:\/\/localhost(?::\d+)?$/, /^http:\/\/127\.0\.0\.1(?::\d+)?$/, /^http:\/\/0\.0\.0\.0(?::\d+)?$/].some((p:any)=> typeof p==='string'? p===origin : p.test(origin));
      if (allowed) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Vary', 'Origin');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, x-admin-key');
      }
    } catch {}
    try {
      const supabase = getSupabaseAdmin();
      const { name, email, phone, company, product, message, source_path, utm_source, utm_medium, utm_campaign, utm_term, utm_content, gclid, fbclid } = req.body || {};
      if (!name || !email) return res.status(400).json({ message: 'Missing required fields' });
      const inferredSource = source_path || (req.headers['referer'] as string | undefined) || null;
      const { data, error } = await supabase.from('leads').insert({ name, email, phone, company, product, message, source_path: inferredSource, utm_source, utm_medium, utm_campaign, utm_term, utm_content, gclid, fbclid }).select().single();
      if (error) return res.status(500).json({ message: error.message });
      return res.status(201).json(data);
    } catch (e:any) {
      return res.status(500).json({ message: e.message || 'Server error' });
    }
  });

  // Articles: Public list (published only)
  app.get('/api/articles', async (req, res) => {
    try {
      const supabase = getSupabaseAdmin();
      const { page = '1', pageSize = '12', q, tag } = req.query as any;
      const p = Math.max(1, parseInt(page));
      const ps = Math.min(50, Math.max(1, parseInt(pageSize)));
      let query = supabase
        .from('articles')
        .select('id,title,slug,excerpt,cover_image,tags,author,published_at', { count: 'exact' })
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .range((p - 1) * ps, p * ps - 1);
      if (q) query = query.or(`title.ilike.%${q}%,slug.ilike.%${q}%`);
      if (tag) query = query.contains('tags', [tag]);
      const { data, error, count } = await query;
      if (error) return res.status(500).json({ message: error.message });
      return res.json({ data, count, page: p, pageSize: ps });
    } catch (e: any) {
      return res.status(500).json({ message: e.message || 'Server error' });
    }
  });

  // Media: Public list (read-only)
  // Returns paginated media items ordered by created_at desc
  app.get('/api/media', async (req, res) => {
    try {
      const supabase = getSupabaseAdmin();
      const { page = '1', pageSize = '20' } = req.query as any;
      const p = Math.max(1, parseInt(page as string, 10) || 1);
      const ps = Math.min(100, Math.max(1, parseInt(pageSize as string, 10) || 20));
      const from = (p - 1) * ps;
      const to = p * ps - 1;

      const { data, error, count } = await supabase
        .from('media_items')
        .select('id,url,type,title,slug,thumbnail_url,tags,published,created_at,updated_at', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) return res.status(500).json({ message: error.message });
      return res.json({ data: data || [], count: count || 0, page: p, pageSize: ps });
    } catch (e: any) {
      return res.status(500).json({ message: e.message || 'Server error' });
    }
  });

  // Media: Admin - create Supabase Storage signed upload URL
  app.post('/api/media/upload-url', requireAdmin, async (req, res) => {
    try {
      const bucket = process.env.SUPABASE_STORAGE_BUCKET || process.env.SUPABASE_MEDIA_BUCKET || 'media';
      const { filename, contentType } = req.body || {};
      if (!filename) return res.status(400).json({ message: 'filename is required' });

      const supabase = getSupabaseAdmin();

      // Normalize key: no leading slash, optional date prefix to reduce collisions
      const safeName = String(filename).replace(/^\/+/, '').replace(/\s+/g, '-');
      const datePrefix = new Date().toISOString().slice(0,10);
      const dot = safeName.lastIndexOf('.');
      const base = dot > 0 ? safeName.slice(0, dot) : safeName;
      const ext = dot > 0 ? safeName.slice(dot) : '';

      // 1) If same-named file already exists in today's folder, reuse it
      try {
        const { data: existingList, error: listErr } = await (supabase as any)
          .storage
          .from(bucket)
          .list(datePrefix, { limit: 1000 });
        if (!listErr && Array.isArray(existingList)) {
          const match = existingList.find((o: any) => o?.name === safeName);
          if (match) {
            const reuseKey = `${datePrefix}/${match.name}`;
            const { data: pub } = (supabase as any).storage.from(bucket).getPublicUrl(reuseKey);
            return res.json({
              uploadUrl: null,
              token: null,
              key: reuseKey,
              publicUrl: pub?.publicUrl,
              bucket,
              contentType: contentType || 'application/octet-stream',
              reused: true,
            });
          }
        }
      } catch {}

      // 2) Otherwise, generate a unique key to avoid collisions
      const uniqueSuffix = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`;
      const uniqueName = `${base}-${uniqueSuffix}${ext}`;
      const key = `${datePrefix}/${uniqueName}`;

      // Create a signed URL for uploading. Supabase supports signed upload URLs via createSignedUploadUrl.
      const { data, error } = await (supabase as any)
        .storage
        .from(bucket)
        .createSignedUploadUrl(key);

      if (error || !data) return res.status(500).json({ message: error?.message || 'Failed to create signed upload url' });

      // Public URL (if bucket is public) or a storage URL that your app can transform/use
      const { data: pub } = (supabase as any).storage.from(bucket).getPublicUrl(key);
      const publicUrl: string | undefined = pub?.publicUrl;

      return res.json({
        uploadUrl: data.signedUrl as string,
        token: data.token as string,
        key,
        publicUrl,
        bucket,
        contentType: contentType || 'application/octet-stream',
      });
    } catch (e: any) {
      return res.status(500).json({ message: e.message || 'Server error' });
    }
  });

  // Media: Admin - upsert media record
  app.post('/api/media', requireAdmin, async (req, res) => {
    try {
      const supabase = getSupabaseAdmin();
      const bodyIn = req.body || {};
      // Map UI payload to DB columns
      const body: any = {
        id: bodyIn.id || undefined,
        title: bodyIn.title,
        slug: bodyIn.slug,
        // Store category in tags to not break existing "type" semantics if DB expects image/video
        type: bodyIn.type && (bodyIn.type === 'ai-effects' || bodyIn.type === 'creative-effects') ? 'image' : bodyIn.type, 
        url: bodyIn.url,
        thumbnail_url: bodyIn.thumbnail_url,
        tags: Array.isArray(bodyIn.tags) ? bodyIn.tags : (typeof bodyIn.tags === 'string' ? bodyIn.tags.split(',').map((s:string)=>s.trim()).filter(Boolean) : []),
        // New optional fields if present in schema
        short_description: bodyIn.short_description,
        target: bodyIn.target,
        video_url: bodyIn.video_url,
        order_by: typeof bodyIn.order_by === 'number' ? bodyIn.order_by : (bodyIn.order_by ? parseInt(String(bodyIn.order_by),10) : undefined),
        published: typeof bodyIn.published === 'boolean' ? bodyIn.published : undefined,
      };
      // Ensure the category tag is included for filtering in UI
      const cat = bodyIn.type;
      if (cat === 'ai-effects' || cat === 'creative-effects') {
        const set = new Set<string>(Array.isArray(body.tags) ? body.tags : []);
        set.add(cat.replace('-', ' '));
        body.tags = Array.from(set);
      }
      // sanitize id: drop empty string so DB can auto-generate UUID on insert
      if (body.id === '' || body.id === null) {
        delete body.id;
      }
      body.updated_at = new Date().toISOString();
      const { data, error } = await supabase
        .from('media_items')
        .upsert(body, { onConflict: 'id' })
        .select()
        .single();
      if (error) return res.status(500).json({ message: error.message });
      return res.status(200).json(data);
    } catch (e:any) {
      return res.status(500).json({ message: e.message || 'Server error' });
    }
  });

  // Media: Admin - update by id
  app.put('/api/media/:id', requireAdmin, async (req, res) => {
    try {
      const supabase = getSupabaseAdmin();
      const b = req.body || {};
      const patch: any = {
        title: b.title,
        slug: b.slug,
        // keep existing media kind behavior; UI categories are managed via tags/category elsewhere
        type: b.type && (b.type === 'image' || b.type === 'video') ? b.type : undefined,
        url: b.url,
        target: b.target,
        video_url: b.video_url,
        thumbnail_url: b.thumbnail_url,
        short_description: b.short_description,
        order_by: typeof b.order_by === 'number' ? b.order_by : (b.order_by ? parseInt(String(b.order_by),10) : undefined),
        tags: b.tags,
        published: typeof b.published === 'boolean' ? b.published : undefined,
        updated_at: new Date().toISOString(),
      };
      const { data, error } = await supabase
        .from('media_items')
        .update(patch)
        .eq('id', req.params.id)
        .select()
        .single();
      if (error) return res.status(500).json({ message: error.message });
      return res.json(data);
    } catch (e:any) {
      return res.status(500).json({ message: e.message || 'Server error' });
    }
  });

  // Media: Admin - delete by id
  app.delete('/api/media/:id', requireAdmin, async (req, res) => {
    try {
      const supabase = getSupabaseAdmin();
      const { error } = await supabase.from('media_items').delete().eq('id', req.params.id);
      if (error) return res.status(500).json({ message: error.message });
      return res.json({ ok: true });
    } catch (e:any) {
      return res.status(500).json({ message: e.message || 'Server error' });
    }
  });

  // Articles: Public single by slug
  app.get('/api/articles/:slug', async (req, res) => {
    try {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', req.params.slug)
        .eq('status', 'published')
        .single();
      if (error) return res.status(404).json({ message: 'Not found' });
      return res.json(data);
    } catch (e: any) {
      return res.status(500).json({ message: e.message || 'Server error' });
    }
  });

  // Static Pages: slug validation helper
  function normalizeSlug(input: string): string {
    let s = (input || '').toLowerCase().trim();
    s = s.replace(/[^a-z0-9\/-]+/g, '-'); // keep only a-z0-9, -, /
    s = s.replace(/-{2,}/g, '-');         // collapse multiple hyphens
    s = s.replace(/\/+/, '/');           // collapse multiple slashes (run a few times)
    s = s.replace(/\/+/, '/');
    s = s.replace(/\/+/, '/');
    s = s.replace(/^[-/]+|[-/]+$/g, '');  // trim leading/trailing - or /
    return s;
  }
  const reservedSlugs = new Set(['api','admin','images','assets','videos','static','sitemap.xml','robots.txt','favicon.ico','_next','_vercel','s']);
  function isValidSlugPath(s: string): boolean {
    if (!s) return false;
    if (reservedSlugs.has(s)) return false;
    const parts = s.split('/');
    if (parts.length > 2) return false; // depth <= 1
    return parts.every(p => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p));
  }

  // Admin: Static Pages list
  app.get('/api/admin/pages', requireAdmin, async (req, res) => {
    try {
      const supabase = getSupabaseAdmin();
      const { page = '1', pageSize = '50', q } = req.query as any;
      const p = Math.max(1, parseInt(page));
      const ps = Math.min(100, Math.max(1, parseInt(pageSize)));
      let query = supabase
        .from('static_pages')
        .select('*', { count: 'exact' })
        .order('updated_at', { ascending: false })
        .range((p - 1) * ps, p * ps - 1);
      if (q) query = query.or(`title.ilike.%${q}%,slug.ilike.%${q}%`);
      const { data, error, count } = await query;
      if (error) return res.status(500).json({ message: error.message });
      return res.json({ data, count, page: p, pageSize: ps });
    } catch (e:any) {
      return res.status(500).json({ message: e.message || 'Server error' });
    }
  });

  // Admin: Slug availability
  app.get('/api/admin/pages/slug-availability', requireAdmin, async (req, res) => {
    try {
      const raw = String((req.query.slug || '') as string);
      const slug = normalizeSlug(raw);
      if (!isValidSlugPath(slug)) return res.json({ available: false, slug, reason: 'invalid' });
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase.from('static_pages').select('id').eq('slug', slug).limit(1);
      if (error) return res.status(500).json({ message: error.message });
      const available = !data || data.length === 0;
      return res.json({ available, slug });
    } catch (e:any) {
      return res.status(500).json({ message: e.message || 'Server error' });
    }
  });

  // Admin: Create page
  app.post('/api/admin/pages', requireAdmin, async (req, res) => {
    try {
      const supabase = getSupabaseAdmin();
      const body = req.body || {};
      const slug = normalizeSlug(body.slug || '');
      if (!isValidSlugPath(slug)) return res.status(400).json({ message: 'Invalid slug' });
      const now = new Date().toISOString();
      const record: any = { ...body, slug, created_at: now, updated_at: now };
      // sanitize body fields
      if (record.body_html && typeof record.body_html === 'string') {
        // minimal sanitize: strip script tags
        record.body_html = String(record.body_html).replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
      }
      const { data, error } = await supabase.from('static_pages').insert(record).select().single();
      if (error) return res.status(400).json({ message: error.message });
      return res.status(201).json(data);
    } catch (e:any) {
      return res.status(500).json({ message: e.message || 'Server error' });
    }
  });

  // Admin: Update page
  app.put('/api/admin/pages/:id', requireAdmin, async (req, res) => {
    try {
      const supabase = getSupabaseAdmin();
      const patch = { ...(req.body || {}) } as any;
      if (typeof patch.slug === 'string') {
        patch.slug = normalizeSlug(patch.slug);
        if (!isValidSlugPath(patch.slug)) return res.status(400).json({ message: 'Invalid slug' });
      }
      patch.updated_at = new Date().toISOString();
      if (patch.body_html && typeof patch.body_html === 'string') {
        patch.body_html = String(patch.body_html).replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
      }
      const { data, error } = await supabase.from('static_pages').update(patch).eq('id', req.params.id).select().single();
      if (error) return res.status(400).json({ message: error.message });
      return res.json(data);
    } catch (e:any) {
      return res.status(500).json({ message: e.message || 'Server error' });
    }
  });

  // Admin: Delete page
  app.delete('/api/admin/pages/:id', requireAdmin, async (req, res) => {
    try {
      const supabase = getSupabaseAdmin();
      const { error } = await supabase.from('static_pages').delete().eq('id', req.params.id);
      if (error) return res.status(400).json({ message: error.message });
      return res.json({ ok: true });
    } catch (e:any) {
      return res.status(500).json({ message: e.message || 'Server error' });
    }
  });

  // Public: fetch page by slug (JSON)
  app.get('/api/pages/:slug', async (req, res) => {
    try {
      const supabase = getSupabaseAdmin();
      const slug = normalizeSlug(req.params.slug);
      const { data, error } = await supabase
        .from('static_pages')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();
      if (error || !data) return res.status(404).json({ message: 'Not found' });
      return res.json(data);
    } catch (e:any) {
      return res.status(500).json({ message: e.message || 'Server error' });
    }
  });

  // Public: render page at /s/:slug with meta
  app.get('/s/:slug(*)', async (req, res) => {
    try {
      const supabase = getSupabaseAdmin();
      const slug = normalizeSlug(String(req.params.slug || ''));
      if (!isValidSlugPath(slug)) return res.status(404).send('Not found');
      const { data } = await supabase
        .from('static_pages')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();
      if (!data) return res.status(404).send('Not found');
      const title = data.seo_title || data.title || 'Page';
      const desc = data.seo_description || '';
      const canonical = (process.env.PUBLIC_BASE_URL || '').replace(/\/$/, '') + `/s/${slug}`;
      const bodyHtml = data.body_html || '';
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.send(`<!doctype html><html lang="en"><head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${title}</title>
        ${desc ? `<meta name="description" content="${desc}">` : ''}
        <link rel="canonical" href="${canonical}">
        <meta property="og:title" content="${title}">
        ${desc ? `<meta property="og:description" content="${desc}">` : ''}
        <meta property="og:type" content="website">
      </head><body>
        <main>${bodyHtml || ''}</main>
      </body></html>`);
    } catch (e:any) {
      return res.status(500).send('Server error');
    }
  });

  // Admin: Articles list
  app.get('/api/admin/articles', requireAdmin, async (req, res) => {
    try {
      const supabase = getSupabaseAdmin();
      const { page = '1', pageSize = '20', q, status, tag } = req.query as any;
      const p = Math.max(1, parseInt(page));
      const ps = Math.min(100, Math.max(1, parseInt(pageSize)));
      let query = supabase
        .from('articles')
        .select('*', { count: 'exact' })
        .order('updated_at', { ascending: false })
        .range((p - 1) * ps, p * ps - 1);
      if (status) query = query.eq('status', status);
      if (q) query = query.or(`title.ilike.%${q}%,slug.ilike.%${q}%`);
      if (tag) query = query.contains('tags', [tag]);
      const { data, error, count } = await query;
      if (error) return res.status(500).json({ message: error.message });
      return res.json({ data, count, page: p, pageSize: ps });
    } catch (e: any) {
      return res.status(500).json({ message: e.message || 'Server error' });
    }
  });

  // Admin: Article by id
  app.get('/api/admin/articles/:id', requireAdmin, async (req, res) => {
    try {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase.from('articles').select('*').eq('id', req.params.id).single();
      if (error) return res.status(404).json({ message: 'Not found' });
      return res.json(data);
    } catch (e: any) {
      return res.status(500).json({ message: e.message || 'Server error' });
    }
  });

  // Admin: Create/Upsert article
  app.post('/api/admin/articles', requireAdmin, async (req, res) => {
    try {
      const body = req.body || {};
      const supabase = getSupabaseAdmin();
      body.updated_at = new Date().toISOString();
      const isUpdate = !!body.id;
      let rpc;
      if (isUpdate) {
        const { data, error } = await supabase.from('articles').update(body).eq('id', body.id).select().single();
        if (error) return res.status(400).json({ message: error.message });
        rpc = data;
      } else {
        const { data, error } = await supabase.from('articles').insert(body).select().single();
        if (error) return res.status(400).json({ message: error.message });
        rpc = data;
      }
      return res.status(200).json(rpc);
    } catch (e: any) {
      return res.status(500).json({ message: e.message || 'Server error' });
    }
  });

  // Admin: Patch article
  app.patch('/api/admin/articles/:id', requireAdmin, async (req, res) => {
    try {
      const patch = { ...(req.body || {}), updated_at: new Date().toISOString() };
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase.from('articles').update(patch).eq('id', req.params.id).select().single();
      if (error) return res.status(400).json({ message: error.message });
      return res.json(data);
    } catch (e: any) {
      return res.status(500).json({ message: e.message || 'Server error' });
    }
  });

  // Admin: Delete article
  app.delete('/api/admin/articles/:id', requireAdmin, async (req, res) => {
    try {
      const supabase = getSupabaseAdmin();
      const { error } = await supabase.from('articles').delete().eq('id', req.params.id);
      if (error) return res.status(400).json({ message: error.message });
      return res.json({ ok: true });
    } catch (e: any) {
      return res.status(500).json({ message: e.message || 'Server error' });
    }
  });

  // GA4 summary (admin) via Google Analytics Data API
  app.get('/api/ga/summary', requireAdmin, async (_req, res) => {
    try {
      // Prefer DB-stored settings, fallback to env vars
      const supabase = getSupabaseAdmin();
      const { data: creds } = await supabase
        .from('settings')
        .select('key,value')
        .in('key', ['ga_property_id','ga_client_email','ga_private_key']);
      const map: Record<string, string | undefined> = {};
      (creds || []).forEach((r: any) => { map[r.key] = r.value as string; });
      const propertyId = map['ga_property_id'] || process.env.GA_PROPERTY_ID;
      const clientEmail = map['ga_client_email'] || process.env.GA_CLIENT_EMAIL;
      let privateKey = map['ga_private_key'] || process.env.GA_PRIVATE_KEY;
      if (!propertyId || !clientEmail || !privateKey) {
        return res.status(200).json({ available: false, message: 'GA credentials not set' });
      }
      privateKey = privateKey.replace(/\\n/g, '\n');
      const { BetaAnalyticsDataClient } = await import('@google-analytics/data');
      const analyticsDataClient = new BetaAnalyticsDataClient({
        credentials: { client_email: clientEmail, private_key: privateKey },
      });
      const [report] = await analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
        metrics: [
          { name: 'totalUsers' },
          { name: 'activeUsers' },
          { name: 'newUsers' },
          { name: 'screenPageViews' },
          { name: 'eventCount' },
          { name: 'sessions' },
          { name: 'conversions' }
        ],
      });
      const metricHeaders = report.metricHeaders?.map(h => h.name) || [];
      const row = report.rows?.[0]?.metricValues?.map(v => Number(v.value || 0)) || [];
      const summary: Record<string, number> = {};
      metricHeaders.forEach((name, i) => { summary[name] = row[i] || 0; });
      return res.json({ available: true, summary });
    } catch (e:any) {
      return res.status(200).json({ available: false, message: e?.message || 'GA error' });
    }
  });

  // leads: list (admin)
  app.get('/api/leads', requireAdmin, async (req, res) => {
    try {
      const supabase = getSupabaseAdmin();
      const { page = '1', pageSize = '20', status, q } = req.query as any;
      const p = Math.max(1, parseInt(page));
      const ps = Math.min(100, Math.max(1, parseInt(pageSize)));
      let query = supabase.from('leads').select('*', { count: 'exact' }).order('created_at', { ascending: false }).range((p-1)*ps, p*ps - 1);
      if (status) query = query.eq('status', status as string);
      if (q) query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%`);
      const { data, error, count } = await query;
      if (error) return res.status(500).json({ message: error.message });
      return res.json({ data, count, page: p, pageSize: ps });
    } catch (e:any) {
      return res.status(500).json({ message: e.message || 'Server error' });
    }
  });

  app.get('/api/leads/:id', requireAdmin, async (req, res) => {
    try {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase.from('leads').select('*').eq('id', req.params.id).single();
      if (error) return res.status(404).json({ message: 'Not found' });
      return res.json(data);
    } catch (e:any) {
      return res.status(500).json({ message: e.message || 'Server error' });
    }
  });

  app.patch('/api/leads/:id', requireAdmin, async (req, res) => {
    try {
      const supabase = getSupabaseAdmin();
      const patch = req.body || {};
      const { data, error } = await supabase.from('leads').update(patch).eq('id', req.params.id).select().single();
      if (error) return res.status(500).json({ message: error.message });
      return res.json(data);
    } catch (e:any) {
      return res.status(500).json({ message: e.message || 'Server error' });
    }
  });

  // SEO config endpoints
  app.get('/api/seo', requireAdmin, async (_req, res) => {
    try {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase.from('seo_configs').select('*').order('id');
      if (error) return res.status(500).json({ message: error.message });
      return res.json(data);
    } catch (e:any) {
      return res.status(500).json({ message: e.message || 'Server error' });
    }
  });

  // Public-read SEO config for runtime overrides
  app.get('/api/seo/:id', async (req, res) => {
    try {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase.from('seo_configs').select('*').eq('id', req.params.id).single();
      if (error) return res.status(404).json({ message: 'Not found' });
      return res.json(data);
    } catch (e:any) {
      return res.status(500).json({ message: e.message || 'Server error' });
    }
  });

  app.post('/api/seo', requireAdmin, async (req, res) => {
    try {
      const supabase = getSupabaseAdmin();
      const body = req.body || {};
      if (!body.id) return res.status(400).json({ message: 'id is required (route path)' });
      body.updated_at = new Date().toISOString();
      const { data, error } = await supabase.from('seo_configs').upsert(body, { onConflict: 'id' }).select().single();
      if (error) return res.status(500).json({ message: error.message });
      return res.status(200).json(data);
    } catch (e:any) {
      return res.status(500).json({ message: e.message || 'Server error' });
    }
  });

  app.put('/api/seo/:id', requireAdmin, async (req, res) => {
    try {
      const supabase = getSupabaseAdmin();
      const patch = req.body || {};
      patch.updated_at = new Date().toISOString();
      const { data, error } = await supabase.from('seo_configs').update(patch).eq('id', req.params.id).select().single();
      if (error) return res.status(500).json({ message: error.message });
      return res.json(data);
    } catch (e:any) {
      return res.status(500).json({ message: e.message || 'Server error' });
    }
  });

  // Settings endpoints
  // Public read of GA measurement id
  app.get('/api/settings/ga', async (_req, res) => {
    try {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase.from('settings').select('value').eq('key', 'ga_measurement_id').single();
      if (error && error.code !== 'PGRST116') return res.status(500).json({ message: error.message });
      return res.json({ id: data?.value || null });
    } catch (e:any) {
      return res.status(500).json({ message: e.message || 'Server error' });
    }
  });

  // Public read of selected settings (safe keys only, e.g., search console tokens)
  app.get('/api/settings/public', async (_req, res) => {
    try {
      const supabase = getSupabaseAdmin();
      const allowed = ['google_site_verification', 'bing_site_verification'];
      const { data, error } = await supabase.from('settings').select('key,value').in('key', allowed);
      if (error) return res.status(500).json({ message: error.message });
      const out: Record<string, string> = {};
      (data || []).forEach((row: any) => { out[row.key] = row.value; });
      return res.json(out);
    } catch (e:any) {
      return res.status(500).json({ message: e.message || 'Server error' });
    }
  });

  // Admin: list all settings
  app.get('/api/settings', requireAdmin, async (_req, res) => {
    try {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase.from('settings').select('*').order('key');
      if (error) return res.status(500).json({ message: error.message });
      return res.json(data || []);
    } catch (e:any) {
      return res.status(500).json({ message: e.message || 'Server error' });
    }
  });

  // Admin: upsert a setting
  app.post('/api/settings', requireAdmin, async (req, res) => {
    try {
      const supabase = getSupabaseAdmin();
      const { key, value } = req.body || {};
      if (!key) return res.status(400).json({ message: 'key is required' });
      const { data, error } = await supabase.from('settings').upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' }).select().single();
      if (error) return res.status(500).json({ message: error.message });
      return res.json(data);
    } catch (e:any) {
      return res.status(500).json({ message: e.message || 'Server error' });
    }
  });

  const httpServer = createServer(app);

  // Public: sitemap.xml includes static pages
  app.get('/sitemap.xml', async (_req, res) => {
    try {
      const base = (process.env.SITEMAP_BASE_URL || '').replace(/\/$/, '') || 'https://example.com';
      const supabase = getSupabaseAdmin();
      const urls: string[] = [];
      const { data } = await supabase.from('static_pages').select('slug,updated_at,published,indexable').eq('published', true).eq('indexable', true);
      (data||[]).forEach((r:any)=>{ urls.push(`${base}/s/${r.slug}`); });
      const now = new Date().toISOString();
      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u=>`  <url><loc>${u}</loc><lastmod>${now}</lastmod></url>`).join('\n')}\n</urlset>`;
      res.setHeader('Content-Type', 'application/xml');
      return res.send(xml);
    } catch (e:any) {
      return res.status(500).send('');
    }
  });

  // Health: environment and settings presence (admin)
  app.get('/api/health/env', async (_req, res) => {
    try {
      const supabaseOk = { url: !!process.env.SUPABASE_URL, serviceRole: !!process.env.SUPABASE_SERVICE_ROLE, ok: false as boolean, error: undefined as string | undefined };
      try {
        const supabase = getSupabaseAdmin();
        // lightweight ping by selecting 0 rows from settings
        const { error } = await supabase.from('settings').select('key', { count: 'exact', head: true });
        if (!error) supabaseOk.ok = true; else { supabaseOk.ok = false; supabaseOk.error = error.message; }
      } catch (e:any) {
        supabaseOk.ok = false; supabaseOk.error = e?.message || 'Supabase init failed';
      }

      // Read GA creds from DB if available
      let gaConfigured = false;
      let gaSource: 'env' | 'db' | 'missing' = 'missing';
      try {
        const supabase = getSupabaseAdmin();
        const { data } = await supabase.from('settings').select('key,value').in('key', ['ga_property_id','ga_client_email','ga_private_key']);
        const map: Record<string,string|undefined> = {};
        (data||[]).forEach((r:any)=>{ map[r.key]=r.value; });
        const propertyId = map['ga_property_id'] || process.env.GA_PROPERTY_ID;
        const clientEmail = map['ga_client_email'] || process.env.GA_CLIENT_EMAIL;
        const privateKey = map['ga_private_key'] || process.env.GA_PRIVATE_KEY;
        gaConfigured = !!(propertyId && clientEmail && privateKey);
        gaSource = (map['ga_property_id'] || map['ga_client_email'] || map['ga_private_key']) ? 'db' : (process.env.GA_PROPERTY_ID || process.env.GA_CLIENT_EMAIL || process.env.GA_PRIVATE_KEY) ? 'env' : 'missing';
      } catch {}

      const body = {
        adminPassword: !!process.env.ADMIN_PASSWORD,
        sitemapBaseUrl: !!process.env.SITEMAP_BASE_URL,
        supabase: supabaseOk,
        ga: { configured: gaConfigured, source: gaSource },
      };
      return res.json(body);
    } catch (e:any) {
      return res.status(500).json({ message: e?.message || 'Health error' });
    }
  });

  return httpServer;
}
