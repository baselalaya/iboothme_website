type Dictionary = Record<string, any>;

declare global {
  interface Window { dataLayer?: any[] }
}

export function initGTM() {
  const id = (import.meta as any)?.env?.VITE_GTM_ID as string | undefined;
  if (!id) return false;
  window.dataLayer = window.dataLayer || [];
  return true;
}

export function gtmEvent(event: string, params?: Dictionary) {
  if (!window || !window.dataLayer) return;
  window.dataLayer.push({ event, ...(params || {}) });
}

