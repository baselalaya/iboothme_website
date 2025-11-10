// Resilient public API helper with base URL, timeout, retries, and safe JSON parsing

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`Request timed out after ${ms}ms`)), ms);
    p.then(v => { clearTimeout(t); resolve(v); }, e => { clearTimeout(t); reject(e); });
  });
}

function sleep(ms: number) { return new Promise(res => setTimeout(res, ms)); }

export type PublicApiOptions = { timeoutMs?: number; retries?: number; backoffMs?: number; headers?: Record<string,string> };

export function apiBaseJoin(path: string): string {
  // Prefer VITE_PUBLIC_API_URL if provided (production droplet), fallback to VITE_API_BASE for backward compat
  const env = (typeof import.meta !== 'undefined' && (import.meta as any).env) || {};
  const base = env.VITE_PUBLIC_API_URL || env.VITE_API_BASE || '';
  return base ? base.replace(/\/$/, '') + (path.startsWith('/') ? path : `/${path}`) : path;
}

export async function publicApi<T = any>(method: string, path: string, body?: any, opts?: PublicApiOptions): Promise<T | null> {
  const url = apiBaseJoin(path);
  const timeoutMs = opts?.timeoutMs ?? 5000;
  const retries = Math.max(0, opts?.retries ?? 1);
  const backoff = Math.max(0, opts?.backoffMs ?? 600);
  const headers: Record<string,string> = { 'Content-Type': 'application/json', ...(opts?.headers || {}) };

  let attempt = 0;
  while (true) {
    try {
      const res = await withTimeout(fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined }), timeoutMs);
      const ct = res.headers.get('content-type') || '';
      const text = await res.text();
      if (!res.ok) throw new Error(`${method} ${url} -> ${res.status} ${res.statusText}`);
      if (!text) return null;
      if (ct.includes('application/json')) {
        try { return JSON.parse(text) as T; } catch { return null; }
      }
      if (/<!DOCTYPE html>|<html[\s>]/i.test(text)) {
        // Likely routing fallback to SPA; treat as transient failure
        throw new Error('Received HTML from API');
      }
      try { return JSON.parse(text) as T; } catch { return null; }
    } catch (e) {
      if (attempt >= retries) {
        if (typeof window !== 'undefined') console.warn('[publicApi] failed', { url, error: (e as any)?.message });
        return null;
      }
      attempt += 1;
      await sleep(backoff * attempt);
    }
  }
}
