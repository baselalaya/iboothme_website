export function getAdminKey() {
  try {
    return localStorage.getItem('adminKey') || '';
  } catch {
    return '';
  }
}

export async function adminApi<T = any>(method: string, path: string, body?: any): Promise<T> {
  const base = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_BASE) || '';
  const headers: Record<string,string> = { 'Content-Type': 'application/json' };
  const key = getAdminKey();
  if (key) headers['x-admin-key'] = key;
  const url = base ? base.replace(/\/$/, '') + (path.startsWith('/') ? path : `/${path}`) : path;

  const res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const ct = res.headers.get('content-type') || '';
  const text = await res.text();

  if (!res.ok) {
    const snippet = text ? text.slice(0, 200) : res.statusText;
    throw new Error(`${method} ${url} -> ${res.status} ${res.statusText} | ${snippet}`);
  }

  if (ct.includes('application/json')) {
    try { return JSON.parse(text) as T; } catch {}
  }
  if (!text) throw new Error('Empty response');
  // Detect if we accidentally got HTML (SPA fallback)
  if (/<!DOCTYPE html>|<html[\s>]/i.test(text)) {
    throw new Error('Received HTML from API (routing fallback). Check vercel routing.');
  }
  try { return JSON.parse(text) as T; } catch {}
  throw new Error('Unexpected non-JSON response');
}

