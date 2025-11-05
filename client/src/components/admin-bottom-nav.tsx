import { Link, useLocation } from 'wouter';

export default function AdminBottomNav() {
  const [location] = useLocation();
  const isActive = (href: string) => location === href || (href !== '/admin' && location.startsWith(href));
  const linkCls = (href: string) => [
    'px-3 py-1.5 rounded-full text-sm border transition',
    isActive(href) ? 'bg-white/10 border-white/25 text-white' : 'border-transparent hover:bg-white/10'
  ].join(' ');
  const logout = () => { try { localStorage.removeItem('adminKey'); } catch {} window.location.href = '/admin/login'; };
  return (
    <div aria-label="Admin navigation" className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
      <nav className="rounded-full border border-white/15 bg-black/60 backdrop-blur-md shadow-lg pl-2 pr-2 py-2 flex items-center gap-1">
        <Link href="/admin" className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-white/10">
          <img src="/images/icon.svg" alt="iboothme" className="w-5 h-5 rounded" />
          <span className="text-xs text-white/80 hidden sm:inline">Admin</span>
        </Link>
        <Link href="/admin" className={linkCls('/admin')}>Dashboard</Link>
        <Link href="/admin/leads" className={linkCls('/admin/leads')}>Leads</Link>
        <Link href="/admin/articles" className={linkCls('/admin/articles')}>Articles</Link>
        <Link href="/admin/media" className={linkCls('/admin/media')}>Media</Link>
        <Link href="/admin/seo" className={linkCls('/admin/seo')}>SEO</Link>
        <Link href="/admin/settings" className={linkCls('/admin/settings')}>Settings</Link>
        <button onClick={logout} className="ml-1 px-3 py-1.5 rounded-full text-sm border border-white/20 hover:bg-white/10">Logout</button>
      </nav>
    </div>
  );
}
