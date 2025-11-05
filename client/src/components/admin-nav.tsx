import { Link, useLocation } from 'wouter';

export default function AdminNav() {
  const [location] = useLocation();
  const base = "px-3 py-1.5 rounded-full border transition";
  const navClass = (href: string) => {
    const active = location === href || (href !== '/admin' && location.startsWith(href));
    return [
      base,
      active ? 'bg-white/15 border-white/25 text-white' : 'bg-white/5 border-white/15 hover:bg-white/10',
    ].join(' ');
  };
  function logout() {
    localStorage.removeItem('adminKey');
    window.location.href = '/admin/login';
  }
  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-black/40 bg-black/60 border-b border-white/10 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-14 flex items-center gap-3">
          <Link href="/admin" className="flex items-center gap-2">
            <img src="/images/icon.svg" alt="iboothme logo" className="w-7 h-7 rounded" />
            <span className="font-semibold tracking-wide gradient-text">iboothme Admin</span>
          </Link>
          <nav className="ml-6 flex items-center gap-2">
            <Link href="/admin" className={navClass('/admin')}>Dashboard</Link>
            <Link href="/admin/leads" className={navClass('/admin/leads')}>Leads</Link>
            <Link href="/admin/articles" className={navClass('/admin/articles')}>Articles</Link>
            <Link href="/admin/media" className={navClass('/admin/media')}>Media</Link>
            <Link href="/admin/seo" className={navClass('/admin/seo')}>SEO</Link>
            <Link href="/admin/settings" className={navClass('/admin/settings')}>Settings</Link>
          </nav>
          <div className="flex-1" />
          <button onClick={logout} className="text-sm px-3 py-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 transition">Logout</button>
        </div>
      </div>
    </header>
  );
}
