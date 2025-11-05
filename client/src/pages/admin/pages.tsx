import { useEffect, useMemo, useState } from 'react';
import { publicApi, apiBaseJoin } from '../../lib/publicApi';
import AdminBottomNav from '@/components/admin-bottom-nav';

function useAdminHeaders() {
  const key = (typeof localStorage !== 'undefined' && localStorage.getItem('adminKey')) || '';
  return useMemo(() => ({ 'x-admin-key': key || '' }), [key]);
}

export default function AdminPages() {
  const headers = useAdminHeaders();
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<any[]>([]);

  async function load() {
    setLoading(true);
    const res = await publicApi<any>('GET', `/api/admin/pages?q=${encodeURIComponent(q)}`, undefined, { headers });
    setItems(res?.data || []);
    setLoading(false);
  }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  return (
    <div className="relative min-h-screen text-white">
      {null}
      <main className="relative z-20 max-w-6xl mx-auto px-6 py-8">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black">Pages</h1>
            <p className="text-white/70 text-sm">Manage static pages rendered at /s/:slug</p>
          </div>
          <a href="/admin/pages/new" className="px-4 py-2 rounded-full bg-white text-black font-semibold">New Page</a>
        </header>
        <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4 mb-5">
          <div className="flex gap-3 items-center">
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search title or slug" className="rounded-full bg-white/10 border border-white/15 px-4 py-2 outline-none focus:ring-2 focus:ring-purple-400/60 w-full" />
            <button onClick={load} className="px-4 py-2 rounded-full border border-white/20 hover:bg-white/10">Search</button>
          </div>
        </section>
        <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-0 overflow-hidden">
          {loading ? <div className="p-6 text-white/70">Loading…</div> : (
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead className="text-white/70 text-sm">
                <tr><th className="px-3">Title</th><th className="px-3">Slug</th><th className="px-3">Status</th><th className="px-3">Updated</th><th className="px-3"></th></tr>
              </thead>
              <tbody>
                {items.map(it => (
                  <tr key={it.id} className="bg-white/5">
                    <td className="px-3 py-2">{it.title}</td>
                    <td className="px-3 py-2 text-white/80"><code>{it.slug}</code></td>
                    <td className="px-3 py-2">{it.published ? 'Published' : 'Draft'}</td>
                    <td className="px-3 py-2 text-white/70">{it.updated_at?.slice(0,19).replace('T',' ')}</td>
                    <td className="px-3 py-2 text-right">
                      <a href={`/admin/pages/${it.id}`} className="underline mr-3">Edit</a>
                      <a href={`/s/${it.slug}`} target="_blank" rel="noreferrer" className="text-white/70 underline">Preview</a>
                  </td>
                </tr>
              ))}
                {items.length===0 && <tr><td className="px-3 py-6 text-white/70" colSpan={5}>No pages found.</td></tr>}
              </tbody>
            </table>
          )}
        </section>
      </main>
      <AdminBottomNav />
    </div>
  );
}
