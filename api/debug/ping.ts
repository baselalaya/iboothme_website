import type { VercelRequest, VercelResponse } from 'vercel';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-cache');
  return res.status(200).json({ ok: true, ts: Date.now() });
}

