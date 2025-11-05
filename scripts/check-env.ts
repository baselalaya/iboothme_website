const required = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE',
  'ADMIN_PASSWORD',
  'SITEMAP_BASE_URL',
];

function main() {
  const missing = required.filter((k) => !process.env[k] || String(process.env[k]).trim() === '');
  if (missing.length) {
    console.error('\n[check-env] Missing required environment variables:');
    missing.forEach((k) => console.error(` - ${k}`));
    console.error('\nSet these in your environment (e.g., Vercel Project Settings → Environment Variables) and redeploy.');
    process.exit(1);
  }
  // Soft warnings for optional GA credentials used by admin GA summary
  const ga = ['GA_PROPERTY_ID','GA_CLIENT_EMAIL','GA_PRIVATE_KEY'];
  const gaMissing = ga.filter((k)=>!process.env[k] || String(process.env[k]).trim() === '');
  if (gaMissing.length) {
    console.warn('[check-env] GA credentials not fully configured (optional):', gaMissing.join(', '));
  }
}

main();

