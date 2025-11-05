import type { VercelRequest, VercelResponse } from 'vercel';
import { getSupabaseAdmin } from '../_supabase';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const supabaseVars = {
    url: !!process.env.SUPABASE_URL,
    serviceRole: !!process.env.SUPABASE_SERVICE_ROLE,
  };
  const adminPassword = !!process.env.ADMIN_PASSWORD;
  const sitemapBaseUrl = !!process.env.SITEMAP_BASE_URL;
  const gaVars = {
    property: !!process.env.GA_PROPERTY_ID,
    client: !!process.env.GA_CLIENT_EMAIL,
    key: !!process.env.GA_PRIVATE_KEY,
  };

  let supabaseOk = false;
  let supabaseError: string | undefined;
  if (supabaseVars.url && supabaseVars.serviceRole) {
    try {
      const supabase = getSupabaseAdmin();
      // Try a lightweight select against settings then seo_configs
      let error: any = null;
      let r = await supabase.from('settings').select('key').limit(1);
      if (r.error) error = r.error;
      if (error) {
        r = await supabase.from('seo_configs').select('id').limit(1);
        if (r.error) error = r.error; else error = null;
      }
      if (!error) supabaseOk = true; else supabaseError = error.message || String(error);
    } catch (e: any) {
      supabaseError = e?.message || 'Unknown error';
    }
  }

  return res.json({
    adminPassword,
    supabase: { ...supabaseVars, ok: supabaseOk, error: supabaseError },
    sitemapBaseUrl,
    ga: { ...gaVars, configured: gaVars.property && gaVars.client && gaVars.key },
  });
}

