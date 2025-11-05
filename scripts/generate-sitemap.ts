import { writeFileSync } from "fs";
import { resolve } from "path";
// Import product IDs to include detail pages
import { products } from "../client/src/data/products";

const BASE_URL = process.env.SITEMAP_BASE_URL || "https://www.iboothme.com";
const routes = [
  "/",
  "/products",
  "/analytics",
  "/ai-technology",
  "/our-story",
  "/robotics",
  "/personalised-merch",
  "/get-ideas",
  "/gamifications",
  "/tailored-software-solutions",
  "/contact-us",
];

// Product detail routes
const productRoutes = products.map(p => `/products/${p.id}`);

const allRoutes = Array.from(new Set([...routes, ...productRoutes]));
const now = new Date().toISOString().split('T')[0];
const urls = allRoutes
  .map(
    (path) => `  <url>\n    <loc>${BASE_URL}${path}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>${path.startsWith('/products/') ? 'monthly' : 'weekly'}</changefreq>\n    <priority>${path === "/" ? "1.0" : path.startsWith('/products/') ? '0.6' : "0.7"}</priority>\n  </url>`
  )
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

const out = resolve("client", "public", "sitemap.xml");
writeFileSync(out, xml, "utf8");
console.log(`Wrote sitemap to ${out}`);
