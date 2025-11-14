import Navigation from "@/components/navigation";
import FooterSection from "@/components/footer-section";
import Seo from "@/components/seo";
import { applySeoToHead, fetchSeoConfig } from "@/lib/seoOverride";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

type YTVideo = {
  videoId: string;
  title: string;
  publishedAt: string;
  thumbnail: string;
};

const CHANNEL_HANDLE = "@iboothmeCreative";

export default function GalleryPage() {
  useEffect(() => { (async () => { const cfg = await fetchSeoConfig('/gallery'); if (cfg) applySeoToHead(cfg); })(); }, []);
  const [videos, setVideos] = useState<YTVideo[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playing, setPlaying] = useState<YTVideo | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        // Prefer backend proxy (implemented in /api/youtube), else fall back to RSS
        const params = new URLSearchParams();
        params.set('mode', 'data'); // prefer Data API when available
        const resp = await fetch(`/api/youtube?${params.toString()}`);
        const ct = resp.headers.get('content-type') || '';
        if (resp.ok && ct.includes('application/json')) {
          const data = await resp.json();
          const mapped = (data.items || []).map((it: any) => ({
            videoId: it.videoId,
            title: it.title,
            publishedAt: it.publishedAt,
            thumbnail: it.thumbnail,
          } as YTVideo)).filter((v: YTVideo) => v.videoId);
          if (!cancelled) {
            setVideos(mapped);
            setNextPageToken(data.nextPageToken || null);
            setLoading(false);
            return;
          }
        }
        // Fallback to RSS without API key via rss2json
        const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=UC4cN7K1u4u_9H2o0f2Gf5xQ`;
        const rssResp = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
        const rssCt = rssResp.headers.get('content-type') || '';
        if (!rssResp.ok || !rssCt.includes('application/json')) throw new Error("Failed to fetch RSS JSON");
        const rss = await rssResp.json();
        const mappedRss: YTVideo[] = (rss.items || []).map((it: any) => {
          const videoId = (it.guid as string)?.split(":").pop() || (it.link?.split("v=")[1] ?? "");
          const thumb = it.thumbnail || it.enclosure?.link || "";
          return { videoId, title: it.title, publishedAt: it.pubDate, thumbnail: thumb };
        }).filter((v: YTVideo) => v.videoId);
        if (!cancelled) {
          setVideos(mappedRss);
          setLoading(false);
        }
      } catch (e: any) {
        if (!cancelled) {
          // Provide a clearer error and keep UI responsive
          const msg = typeof e?.message === 'string' ? e.message : 'Failed to load videos';
          setError(msg.includes("Unexpected token") ? 'Received non-JSON response from source' : msg);
          setLoading(false);
        }
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const grid = useMemo(() => videos.slice(0, 48), [videos]);
  async function loadMore() {
    if (!nextPageToken) return;
    try {
      const params = new URLSearchParams();
      params.set('mode', 'data');
      params.set('max', '50');
      params.set('pageToken', nextPageToken);
      const r = await fetch(`/api/youtube?${params.toString()}`);
      if (!r.ok) return;
      const data = await r.json();
      const more = (data.items || []).map((it: any) => ({ videoId: it.videoId, title: it.title, publishedAt: it.publishedAt, thumbnail: it.thumbnail } as YTVideo));
      setVideos(v => [...v, ...more]);
      setNextPageToken(data.nextPageToken || null);
    } catch {}
  }

  return (
    <div className="relative min-h-screen text-white">
      <Seo title="Gallery" description="Watch our latest videos" canonical="/gallery" />
      <Navigation />
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-10 md:py-14">
        <header className="text-center mb-8 md:mb-10">
          <h1 className="text-3xl md:text-5xl font-black">Video Gallery</h1>
          <p className="text-white/80 mt-2">Latest from YouTube channel iboothmeCreative</p>
        </header>

        {loading && (
          <div className="text-center text-white/70">Loading videos…</div>
        )}
        {error && !loading && (
          <div className="text-center text-red-300">{error}</div>
        )}

        {!loading && !error && (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {grid.map((v) => (
              <article key={v.videoId} className="group overflow-hidden rounded-2xl bg-white/5 border border-white/10 shadow-md hover:shadow-lg transition-shadow">
                <div className="relative aspect-video bg-black">
                  <img src={v.thumbnail} alt={v.title} className="absolute inset-0 w-full h-full object-cover" />
                  <button aria-label={`Play ${v.title}`} onClick={() => setPlaying(v)} className="absolute inset-0 grid place-items-center bg-black/0 group-hover:bg-black/20 transition-colors">
                    <span className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-white/90 text-black shadow-lg">
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M8 5v14l11-7z"/></svg>
                    </span>
                  </button>
                </div>
                <div className="px-4 pt-3 pb-4">
                  <h3 className="font-semibold text-sm md:text-base leading-tight text-white/90 line-clamp-2">{v.title}</h3>
                  <p className="text-white/60 text-xs mt-1">{new Date(v.publishedAt || Date.now()).toLocaleDateString()}</p>
                </div>
              </article>
            ))}
          </section>
        )}
        {!loading && !error && nextPageToken && (
          <div className="flex justify-center mt-8">
            <button onClick={loadMore} className="px-5 py-2 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 transition">Load more</button>
          </div>
        )}
      </main>
      <FooterSection />

      {playing && createPortal(
        <div className="fixed inset-0 z-[9999] grid min-h-screen place-items-center p-4 md:p-6">
          <div className="absolute inset-0 bg-black/80" onClick={() => setPlaying(null)} />
          <div className="relative z-10 w-full max-w-5xl">
            <div className="relative w-full pt-[56.25%] rounded-xl overflow-hidden shadow-xl">
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${playing.videoId}?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1`}
                title={playing.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <button aria-label="Close" className="absolute -top-3 -right-3 z-20 h-10 w-10 rounded-full bg-white/90 text-black grid place-items-center shadow" onClick={() => setPlaying(null)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M18.3 5.71 12 12l6.3 6.29-1.41 1.42L10.59 13.4 4.29 19.7 2.88 18.29 9.17 12 2.88 5.71 4.29 4.29l6.3 6.3 6.29-6.3z"/></svg>
            </button>
          </div>
        </div>, document.body)
      }
    </div>
  );
}
