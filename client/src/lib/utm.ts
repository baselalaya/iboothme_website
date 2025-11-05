export type UTM = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
  ts?: number;
};

const KEY = 'utm_capture_v1';
const TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function hasAnyParams(p: URLSearchParams) {
  return (
    p.get('utm_source') ||
    p.get('utm_medium') ||
    p.get('utm_campaign') ||
    p.get('utm_term') ||
    p.get('utm_content') ||
    p.get('gclid') ||
    p.get('fbclid')
  );
}

function isInternalUtm(utm: UTM | null) {
  return !!utm && utm.utm_source === 'site';
}

export function captureUtmFromUrl(url: string) {
  try {
    const u = new URL(url, window.location.origin);
    const p = u.searchParams;
    const utm: UTM = {
      utm_source: p.get('utm_source') || undefined,
      utm_medium: p.get('utm_medium') || undefined,
      utm_campaign: p.get('utm_campaign') || undefined,
      utm_term: p.get('utm_term') || undefined,
      utm_content: p.get('utm_content') || undefined,
      gclid: p.get('gclid') || undefined,
      fbclid: p.get('fbclid') || undefined,
      ts: Date.now(),
    };
    // Only store if any param is present and avoid persisting internal-site UTMs
    if (hasAnyParams(p) && utm.utm_source !== 'site') {
      localStorage.setItem(KEY, JSON.stringify(utm));
    }
  } catch {}
}

export function getStoredUtm(): UTM | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as UTM;
    if (!parsed?.ts) return parsed;
    if (Date.now() - parsed.ts > TTL_MS) {
      // expired
      localStorage.removeItem(KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

// Prefer current URL UTM; otherwise use stored if not internal/expired
export function getEffectiveUtm(currentUrl?: string): UTM | null {
  try {
    const url = new URL(currentUrl || window.location.href);
    const p = url.searchParams;
    if (hasAnyParams(p)) {
      // If page has UTMs, capture and return those directly (and they will be stored by caller if needed)
      return {
        utm_source: p.get('utm_source') || undefined,
        utm_medium: p.get('utm_medium') || undefined,
        utm_campaign: p.get('utm_campaign') || undefined,
        utm_term: p.get('utm_term') || undefined,
        utm_content: p.get('utm_content') || undefined,
        gclid: p.get('gclid') || undefined,
        fbclid: p.get('fbclid') || undefined,
      };
    }
    const stored = getStoredUtm();
    if (isInternalUtm(stored)) return null; // avoid leaking internal-site UTMs
    return stored;
  } catch {
    return null;
  }
}
