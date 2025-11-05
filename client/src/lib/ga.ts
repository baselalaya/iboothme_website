declare global {
  interface Window {
    dataLayer?: any[];
  }
}

export function loadGA(measurementId: string) {
  if (!measurementId) return;
  if (document.getElementById('ga4-script')) return;
  // Inject gtag script
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  s.id = 'ga4-script';
  document.head.appendChild(s);

  // Init dataLayer and gtag
  window.dataLayer = window.dataLayer || [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const gtag: any = function(){ window.dataLayer?.push(arguments); };
  gtag('js', new Date());
  gtag('config', measurementId, { send_page_view: false });
}

export function trackPageView(path: string) {
  if (!window.dataLayer) return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const gtag: any = function(){ window.dataLayer?.push(arguments); };
  gtag('event', 'page_view', { page_path: path });
}

export function trackEvent(eventName: string, params?: Record<string, any>) {
  if (!window.dataLayer) return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const gtag: any = function(){ window.dataLayer?.push(arguments); };
  gtag('event', eventName, params || {});
}
