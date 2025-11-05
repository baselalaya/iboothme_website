import { createClient } from '@supabase/supabase-js';

export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL as string;
  const key = process.env.SUPABASE_SERVICE_ROLE as string;
  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE env');
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

export function requireAdmin(req: any, res: any) {
  if (!process.env.ADMIN_PASSWORD) {
    res.status(500).json({ message: 'ADMIN_PASSWORD not set' });
    return false;
  }
  if (req.headers['x-admin-key'] !== process.env.ADMIN_PASSWORD) {
    res.status(401).json({ message: 'Unauthorized' });
    return false;
  }
  return true;
}

