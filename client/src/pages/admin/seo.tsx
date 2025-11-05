import { useEffect, useState } from 'react';
import { adminApi, getAdminKey } from '@/lib/adminApi';
// Top admin nav removed; using floating bottom nav
import AdminBottomNav from '@/components/admin-bottom-nav';

type Seo = { id: string; title?: string; description?: string; canonical?: string; og_image?: string; robots?: string; keywords?: string[]; json_ld?: any };

export default function AdminSeoPage() {
  const [items, setItems] = useState<Seo[]>([]);
  const [editing, setEditing] = useState<Seo | null>(null);

  async function load() {
    const data = await adminApi<Seo[]>('GET', '/api/seo');
    setItems(data);
  }

  useEffect(() => {
    if (!getAdminKey()) { window.location.href = '/admin/login'; return; }
    load().catch(console.error);
  }, []);

  async function save(item: Seo) {
    const payload = { ...item } as any;
    if (typeof payload.json_ld === 'string' && payload.json_ld.trim()) {
      try { payload.json_ld = JSON.parse(payload.json_ld); } catch { /* keep as string */ }
    }
    if (!payload.id) return;
    await adminApi('POST', '/api/seo', payload);
    setEditing(null);
    await load();
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      {null}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_50%_at_50%_0%,rgba(112,66,210,0.12),transparent_60%),radial-gradient(60%_40%_at_80%_100%,rgba(34,212,253,0.10),transparent_60%)]" />
      <div className="p-6 max-w-6xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold gradient-text">SEO Manager</h1>
          <button onClick={()=>setEditing({ id: '' })} className="rounded-xl bg-white/10 px-3 py-2">New Entry</button>
        </div>
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/5">
              <tr>
                <th className="text-left p-2">Route (id)</th>
                <th className="text-left p-2">Title</th>
                <th className="text-left p-2">Updated</th>
                <th className="text-left p-2"></th>
              </tr>
            </thead>
            <tbody>
              {items.map(i => (
                <tr key={i.id} className="border-t border-white/10">
                  <td className="p-2 font-mono">{i.id}</td>
                  <td className="p-2">{i.title}</td>
                  <td className="p-2 text-white/70">{/* updated_at if added to select later */}</td>
                  <td className="p-2 text-right"><button className="rounded bg-white/10 px-2 py-1" onClick={()=>setEditing(i)}>Edit</button></td>
                </tr>
              ))}
              {items.length===0 && (<tr><td className="p-4 text-white/60" colSpan={4}>No entries yet.</td></tr>)}
            </tbody>
          </table>
        </div>

        {editing && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="space-y-1">
                <div className="text-xs text-white/70">Route (e.g., /, /products)</div>
                <input value={editing.id} onChange={(e)=>setEditing({ ...editing, id: e.target.value })} className="w-full rounded bg-black/40 border border-white/15 px-3 py-2" />
              </label>
              <label className="space-y-1">
                <div className="text-xs text-white/70">Title</div>
                <input value={editing.title||''} onChange={(e)=>setEditing({ ...editing, title: e.target.value })} className="w-full rounded bg-black/40 border border-white/15 px-3 py-2" />
              </label>
              <label className="space-y-1">
                <div className="text-xs text-white/70">Description</div>
                <input value={editing.description||''} onChange={(e)=>setEditing({ ...editing, description: e.target.value })} className="w-full rounded bg-black/40 border border-white/15 px-3 py-2" />
              </label>
              <label className="space-y-1">
                <div className="text-xs text-white/70">Canonical</div>
                <input value={editing.canonical||''} onChange={(e)=>setEditing({ ...editing, canonical: e.target.value })} className="w-full rounded bg-black/40 border border-white/15 px-3 py-2" />
              </label>
              <label className="space-y-1">
                <div className="text-xs text-white/70">OG Image</div>
                <input value={editing.og_image||''} onChange={(e)=>setEditing({ ...editing, og_image: e.target.value })} className="w-full rounded bg-black/40 border border-white/15 px-3 py-2" />
              </label>
              <label className="space-y-1">
                <div className="text-xs text-white/70">Robots</div>
                <input value={editing.robots||''} onChange={(e)=>setEditing({ ...editing, robots: e.target.value })} className="w-full rounded bg-black/40 border border-white/15 px-3 py-2" />
              </label>
              <label className="space-y-1 md:col-span-2">
                <div className="text-xs text-white/70">Keywords (comma separated)</div>
                <input value={(editing.keywords||[]).join(', ')} onChange={(e)=>setEditing({ ...editing, keywords: e.target.value.split(',').map(s=>s.trim()).filter(Boolean) })} className="w-full rounded bg-black/40 border border-white/15 px-3 py-2" />
              </label>
              <label className="space-y-1 md:col-span-2">
                <div className="text-xs text-white/70">JSON-LD (object or string)</div>
                <textarea value={typeof editing.json_ld==='string' ? editing.json_ld : JSON.stringify(editing.json_ld||'', null, 2)} onChange={(e)=>setEditing({ ...editing, json_ld: e.target.value })} rows={8} className="w-full rounded bg-black/40 border border-white/15 px-3 py-2 font-mono text-xs" />
              </label>
            </div>
            <div className="flex gap-2 justify-end">
              <button className="rounded bg-white/10 px-3 py-2" onClick={()=>setEditing(null)}>Cancel</button>
              <button className="rounded bg-[#7042D2] px-3 py-2" onClick={()=>editing && save(editing)}>Save</button>
            </div>
          </div>
        )}
      </div>
      <AdminBottomNav />
    </div>
  );
}
