// Define routes to pre-render with vite-plugin-ssg
// You can expand this list dynamically at build time if needed.
export async function getStaticPaths() {
  const baseApi = process.env.VITE_PUBLIC_API_URL || 'https://api.iboothme.com/api';
  const staticRoutes = [
    '/',
    '/products',
    '/blog',
    '/ai-effects',
    '/ai-technology',
    '/our-story',
    '/analytics',
    '/privacy',
    '/terms'
  ];

  async function safeJson<T>(url: string): Promise<T | null> {
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  const productIds: string[] = [];
  const insightsSlugs: string[] = [];

  // Try to fetch products list
  const products = await safeJson<any[]>(`${baseApi}/products`);
  if (products?.length) {
    for (const p of products.slice(0, 100)) {
      if (p?.id) productIds.push(String(p.id));
    }
  }

  // Try to fetch insights list
  const insights = await safeJson<any[]>(`${baseApi}/blog`);
  if (insights?.length) {
    for (const a of insights.slice(0, 100)) {
      if (a?.slug) insightsSlugs.push(String(a.slug));
    }
  }

  const dynamicRoutes = [
    ...productIds.map((id) => `/products/${id}`),
    ...insightsSlugs.map((slug) => `/blog/${slug}`),
  ];

  return [...staticRoutes, ...dynamicRoutes];
}
