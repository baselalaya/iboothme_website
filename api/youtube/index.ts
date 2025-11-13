import type { VercelRequest, VercelResponse } from 'vercel';

// Server endpoint to fetch YouTube channel videos by parsing the XML feed directly.
// Avoids third-party services and CORS issues.

const DEFAULT_CHANNEL_ID = process.env.YT_CHANNEL_ID || 'UC4cN7K1u4u_9H2o0f2Gf5xQ';

function textBetween(str: string, start: string, end: string) {
  const i = str.indexOf(start);
  if (i === -1) return '';
  const j = str.indexOf(end, i + start.length);
  if (j === -1) return '';
  return str.slice(i + start.length, j);
}

function parseXmlFeed(xml: string) {
  // Very small XML extraction tailored for YouTube video feed entries
  // Split by <entry> ... </entry>
  const entries: string[] = [];
  const open = '<entry>'; const close = '</entry>';
  let idx = 0;
  while (true) {
    const s = xml.indexOf(open, idx);
    if (s === -1) break;
    const e = xml.indexOf(close, s);
    if (e === -1) break;
    entries.push(xml.slice(s + open.length, e));
    idx = e + close.length;
  }

  const items = entries.map((chunk) => {
    // videoId from <yt:videoId>...</yt:videoId>
    const videoId = textBetween(chunk, '<yt:videoId>', '</yt:videoId>');
    // title may include CDATA
    let title = textBetween(chunk, '<title>', '</title>').trim();
    title = title.replace(/^<!\[CDATA\[/, '').replace(/\]\]>$/, '');
    const publishedAt = textBetween(chunk, '<published>', '</published>');
    // Try media:thumbnail url="..."
    let thumbnail = '';
    const thumbIdx = chunk.indexOf('media:thumbnail');
    if (thumbIdx !== -1) {
      const sub = chunk.slice(thumbIdx, thumbIdx + 300);
      const m = sub.match(/url=\"([^\"]+)\"/);
      if (m) thumbnail = m[1];
    }
    return { videoId, title, publishedAt, thumbnail };
  }).filter((v) => v.videoId);

  return items;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { channelId } = req.query as { channelId?: string };
    const cid = (channelId as string) || DEFAULT_CHANNEL_ID;
    if (!cid) return res.status(400).json({ message: 'Missing channelId (and no default configured)' });

    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(cid)}`;
    const r = await fetch(rssUrl, { headers: { 'accept': 'application/atom+xml,text/xml,application/xml;q=0.9,*/*;q=0.8' } });
    const ct = r.headers.get('content-type') || '';
    if (!r.ok || !/xml|atom/.test(ct)) {
      return res.status(502).json({ message: 'Failed to fetch channel feed' });
    }
    const xml = await r.text();
    const items = parseXmlFeed(xml);
    return res.json({ items });
  } catch (e: any) {
    return res.status(500).json({ message: e?.message || 'Server error' });
  }
}
