import type { VercelRequest, VercelResponse } from 'vercel';

// Server endpoint to fetch YouTube channel videos by parsing the XML feed directly.
// Avoids third-party services and CORS issues.

const DEFAULT_CHANNEL_ID = process.env.YT_CHANNEL_ID || 'UC4cN7K1u4u_9H2o0f2Gf5xQ';
const DEFAULT_TTL_MS = parseInt(process.env.YT_CACHE_TTL_MS || '') || 5 * 60 * 1000; // 5 minutes

// Simple in-memory cache (per server instance). For multi-instance deployments,
// consider a shared cache like Redis.
type CacheEntry = { at: number; data: any };
const memCache = new Map<string, CacheEntry>();

function cacheKey(parts: Record<string, string | undefined>) {
  return Object.entries(parts)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${k}=${v}`)
    .sort()
    .join('&');
}

function getCached(key: string) {
  const hit = memCache.get(key);
  if (!hit) return null;
  if (Date.now() - hit.at > DEFAULT_TTL_MS) {
    memCache.delete(key);
    return null;
  }
  return hit.data;
}

function setCached(key: string, data: any) {
  memCache.set(key, { at: Date.now(), data });
}

async function parseXmlFeed(xml: string) {
  // Use fast-xml-parser for robust parsing
  const { XMLParser } = await import('fast-xml-parser');
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '', allowBooleanAttributes: true, trimValues: true, parseTagValue: true, parseAttributeValue: true });
  const doc: any = parser.parse(xml);
  const feed = doc?.feed;
  const entries = Array.isArray(feed?.entry) ? feed.entry : (feed?.entry ? [feed.entry] : []);
  const items = entries.map((e: any) => {
    const videoId = e?.['yt:videoId'] || e?.['yt:videoid'] || '';
    // title can be object if namespaced; rely on string fallback
    const title = typeof e?.title === 'string' ? e.title : (e?.title?._ || e?.title?.['#text'] || 'Untitled');
    const publishedAt = e?.published || '';
    const mediaGroup = e?.['media:group'] || {};
    const thumb = mediaGroup?.['media:thumbnail'] || e?.['media:thumbnail'] || {};
    const thumbnail = typeof thumb?.url === 'string' ? thumb.url : (Array.isArray(thumb) && thumb[0]?.url ? thumb[0].url : '');
    return { videoId, title, publishedAt, thumbnail };
  }).filter((v: any) => v.videoId);
  return items;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { channelId, mode, max = '24', pageToken } = req.query as { channelId?: string; mode?: string; max?: string; pageToken?: string };
    const cid = (channelId as string) || DEFAULT_CHANNEL_ID;
    if (!cid) return res.status(400).json({ message: 'Missing channelId (and no default configured)' });
    // If mode=data or API key exists, try Data API for pagination and larger result set
    const keyParts = { mode, cid, max: String(max), pageToken: pageToken as string | undefined };
    const ckey = cacheKey(keyParts);
    const cached = getCached(ckey);
    if (cached) return res.json(cached);

    if ((mode === 'data' || process.env.YOUTUBE_API_KEY) && mode !== 'feed') {
      const out = await (async () => {
        const key = process.env.YOUTUBE_API_KEY;
        if (!key) return { ok: false as const };
        const chUrl = new URL('https://www.googleapis.com/youtube/v3/channels');
        chUrl.searchParams.set('part', 'contentDetails');
        chUrl.searchParams.set('id', cid);
        chUrl.searchParams.set('key', key);
        const chRes = await fetch(chUrl.toString());
        if (!chRes.ok) return { ok: false as const };
        const chJson: any = await chRes.json();
        const uploads = chJson?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
        if (!uploads) return { ok: false as const };
        const plUrl = new URL('https://www.googleapis.com/youtube/v3/playlistItems');
        plUrl.searchParams.set('part', 'snippet,contentDetails');
        plUrl.searchParams.set('playlistId', uploads);
        plUrl.searchParams.set('maxResults', String(Math.min(50, Math.max(1, parseInt(String(max)) || 24))));
        if (pageToken) plUrl.searchParams.set('pageToken', String(pageToken));
        plUrl.searchParams.set('key', key);
        const plRes = await fetch(plUrl.toString());
        if (!plRes.ok) return { ok: false as const };
        const plJson: any = await plRes.json();
        const items = (plJson.items || []).map((it: any) => ({
          videoId: it.contentDetails?.videoId || it.snippet?.resourceId?.videoId,
          title: it.snippet?.title,
          publishedAt: it.contentDetails?.videoPublishedAt || it.snippet?.publishedAt,
          thumbnail: it.snippet?.thumbnails?.high?.url || it.snippet?.thumbnails?.medium?.url || it.snippet?.thumbnails?.default?.url,
        })).filter((v: any) => v.videoId);
        return { ok: true as const, items, nextPageToken: plJson.nextPageToken || null };
      })();
      if ((out as any).ok) {
        const payload = { items: (out as any).items, nextPageToken: (out as any).nextPageToken || undefined, mode: 'data' };
        setCached(ckey, payload);
        return res.json(payload);
      }
      // fall through to feed
    }

    // XML feed fallback (recent ~10-15 videos)
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(cid)}`;
    const r = await fetch(rssUrl, {
      headers: {
        'accept': 'application/atom+xml,text/xml,application/xml;q=0.9,*/*;q=0.8',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36'
      }
    });
    const ct = (r.headers.get('content-type') || '').toLowerCase();
    if (!r.ok) {
      return res.status(502).json({ message: 'Failed to fetch channel feed', status: r.status });
    }
    const xml = await r.text();
    if (!/xml|atom/.test(ct)) {
      const looksXml = xml.trimStart().startsWith('<?xml') || xml.includes('<feed') || xml.includes('<entry>');
      if (!looksXml) {
        return res.status(502).json({ message: 'Feed could not be converted, probably not a valid RSS feed.' });
      }
    }
    const items = await parseXmlFeed(xml);
    const payload = { items, mode: 'feed' };
    setCached(ckey, payload);
    return res.json(payload);
  } catch (e: any) {
    return res.status(500).json({ message: e?.message || 'Server error' });
  }
}
