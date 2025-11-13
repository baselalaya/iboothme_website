import type { VercelRequest, VercelResponse } from 'vercel';

// Minimal server endpoint to fetch YouTube channel videos without client-side CORS issues.
// Priority: use channelId if provided; else accept handle but for now default to a known channelId.

// TODO: If you want dynamic handle resolution, add a small scraper or the YouTube Data API.
const DEFAULT_CHANNEL_ID = process.env.YT_CHANNEL_ID || 'UC4cN7K1u4u_9H2o0f2Gf5xQ';

function normalizeRss(json: any) {
  const items = Array.isArray(json?.items) ? json.items : [];
  return items.map((it: any) => {
    const guid: string = it?.guid || '';
    const link: string = it?.link || '';
    const videoId = guid.split(':').pop() || (link.includes('v=') ? link.split('v=')[1] : '');
    const title = it?.title || 'Untitled';
    const publishedAt = it?.pubDate || '';
    const thumbnail = it?.thumbnail || it?.enclosure?.link || '';
    return { videoId, title, publishedAt, thumbnail };
  }).filter((v: any) => v.videoId);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { channelId, handle } = req.query as { channelId?: string; handle?: string };
    // For now we use channelId directly or fallback to a default configured one.
    const cid = (channelId as string) || DEFAULT_CHANNEL_ID;
    if (!cid) {
      return res.status(400).json({ message: 'Missing channelId (and no default configured)' });
    }

    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(cid)}`;
    const r = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
    const ct = r.headers.get('content-type') || '';
    if (!r.ok || !ct.includes('application/json')) {
      return res.status(502).json({ message: 'Failed to fetch channel feed' });
    }
    const json = await r.json();
    const items = normalizeRss(json);
    return res.json({ items });
  } catch (e: any) {
    return res.status(500).json({ message: e?.message || 'Server error' });
  }
}

