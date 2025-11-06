// Top admin nav removed; using floating bottom nav
import AdminBottomNav from "@/components/admin-bottom-nav";
import Seo from "@/components/seo";
import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { getAdminKey, adminApi } from "@/lib/adminApi";
import { apiBaseJoin } from "@/lib/publicApi";

type MediaItem = {
  id: string;
  title: string; // Title *
  slug: string;
  type: 'image'|'video'|'creative-effects'; // Type * (mapped)
  url: string; // Source
  target?: string; // Target
  video_url?: string; // Video
  short_description?: string; // Short Description *
  order_by?: number; // Order By
  thumbnail_url?: string;
  tags?: string[]; // Tags *
  published?: boolean;
  created_at?: string;
};

function toSlug(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function uploadViaPresign(file: File, access: 'public'|'private' = 'public') {
  const ext = file.name.split('.').pop() || 'bin';
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, '-');
  const presign = await adminApi('POST', '/api/media/upload-url', {
    filename: safeName,
    contentType: file.type || `application/octet-stream`,
    access,
  });
  const { uploadUrl, publicUrl } = presign as any;
  const put = await fetch(uploadUrl, { method: 'PUT', headers: { 'Content-Type': file.type || 'application/octet-stream' }, body: file });
  if (!put.ok) throw new Error('Failed to upload to storage');
  return (publicUrl as string) || '';
}

export default function AdminMediaPage() {
  const [q, setQ] = useState('');
  const [tag, setTag] = useState('');
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [items, setItems] = useState<MediaItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|undefined>();
  const [editing, setEditing] = useState<MediaItem|null>(null);
  const [picker, setPicker] = useState<null | { field: 'url'|'target'|'video_url'; filter?: 'image'|'video' }>(null);
  const { toast } = useToast?.() || ({ toast: (args: any) => console.log(args) } as any);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(()=>{ (async()=>{
    setLoading(true); setError(undefined);
    try{
      const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize), includeAll: 'true' });
      if (q) params.set('q', q);
      if (tag) params.set('tag', tag);
      if (type) params.set('type', type);
      const res = await adminApi<{ data: MediaItem[]; count: number }>('GET', `/api/media?${params.toString()}`);
      setItems(res.data||[]); setTotal(res.count||0);
    }catch(e:any){ setError(e?.message||'Failed to load media'); }
    finally{ setLoading(false); }
  })(); }, [q, tag, type, page]);

  const tags = useMemo(()=> Array.from(new Set(items.flatMap(i=> i.tags||[]))).sort(), [items]);

  const onSave = async (draft: MediaItem) => {
    if (!draft.title) throw new Error('Title is required');
    const body = { ...draft, slug: draft.slug || toSlug(draft.title) } as any;
    if (draft.id) {
      const updated = await adminApi('PUT', `/api/media/${draft.id}`, body);
      toast({ title: 'Media updated', description: `${updated.title} saved.` });
    } else {
      const created = await adminApi('POST', `/api/media`, body);
      toast({ title: 'Media created', description: `${created.title} added.` });
    }
    // refresh
    setEditing(null);
    const res = await fetch(apiBaseJoin(`/api/media?page=${page}&pageSize=${pageSize}`));
    const json = await res.json();
    setItems(json.data||[]); setTotal(json.count||0);
  };

  const onDelete = async (id: string) => {
    if (!confirm('Delete this item?')) return;
    await adminApi('DELETE', `/api/media/${id}`);
    toast({ title: 'Media deleted' });
    // refresh
    const res = await fetch(apiBaseJoin(`/api/media?page=${page}&pageSize=${pageSize}`));
    const json = await res.json();
    setItems(json.data||[]); setTotal(json.count||0);
  };

  return (
    <div className="relative min-h-screen text-white">
      <Seo title="Admin • Media" canonical="/admin/media" robots="noindex,nofollow" />
      {null}
      <main className="relative z-20 max-w-7xl mx-auto px-6 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-black">Media Library</h1>
          <p className="text-white/70 text-sm">Manage images and videos for AI Effects</p>
        </header>

        <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4 mb-5">
          <div className="flex flex-wrap items-center gap-3">
            <input value={q} onChange={e=>{ setPage(1); setQ(e.target.value); }} placeholder="Search title or slug" className="rounded-full bg-white/10 border border-white/15 px-4 py-2 outline-none focus:ring-2 focus:ring-purple-400/60" />
            <select value={tag} onChange={e=>{ setPage(1); setTag(e.target.value); }} className="rounded-full bg-white/10 border border-white/15 px-4 py-2 outline-none focus:ring-2 focus:ring-purple-400/60">
              <option value="">All tags</option>
              {tags.map(t=> (<option key={t} value={t}>{t}</option>))}
            </select>
            <select value={type} onChange={e=>{ setPage(1); setType(e.target.value); }} className="rounded-full bg-white/10 border border-white/15 px-4 py-2 outline-none focus:ring-2 focus:ring-purple-400/60">
              <option value="">All types</option>
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
            <button onClick={()=> setEditing({ id: '', title:'', slug:'', type:'image', url:'', thumbnail_url:'', tags:[], published:true })} className="ml-auto px-4 py-2 rounded-full bg-white text-black font-semibold">New Item</button>
          </div>
        </section>

        {error && (<div className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-red-200">{error}</div>)}
        <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-0 overflow-hidden">
          {loading ? (
            <div className="min-h-[30vh] w-full flex items-center justify-center p-4">
              <div className="flex items-center gap-3 text-white/80 bg-white/5 border border-white/10 rounded-xl px-4 py-3 animate-fade-in">
                <svg className="animate-spin h-4 w-4 text-white/70" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>
                <span className="text-sm">Loading media…</span>
              </div>
            </div>
          ) : (
            <div className="w-full overflow-auto">
              <table className="w-full text-sm">
                <thead className="bg-white/5 border-b border-white/10 text-white/70">
                  <tr>
                    <th className="text-left px-4 py-3">Preview</th>
                    <th className="text-left px-4 py-3">Title</th>
                    <th className="text-left px-4 py-3">Type</th>
                    <th className="text-left px-4 py-3">Tags</th>
                    <th className="text-left px-4 py-3">Published</th>
                    <th className="text-left px-4 py-3">Created</th>
                    <th className="text-left px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(m => (
                    <tr key={m.id} className="border-b border-white/10">
                      <td className="px-4 py-3">
                        <div className="w-16 h-10 bg-black rounded overflow-hidden">
                          {m.type==='video' ? (
                            <video src={m.url} poster={m.thumbnail_url} className="w-full h-full object-cover" muted playsInline preload="metadata" />
                          ) : (
                            <img src={m.url} alt={m.title} className="w-full h-full object-cover" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium">{m.title}</td>
                      <td className="px-4 py-3 uppercase text-white/70">{m.type}</td>
                      <td className="px-4 py-3 text-white/70">{(m.tags||[]).slice(0,3).join(', ')}</td>
                      <td className="px-4 py-3">
                        <label className="inline-flex items-center gap-2 text-xs">
                          <input type="checkbox" checked={!!m.published} onChange={async (e)=>{
                            try { await adminApi('PUT', `/api/media/${m.id}`, { published: e.target.checked }); toast({ title: e.target.checked ? 'Published' : 'Unpublished' });
                              setItems(prev=> prev.map(x=> x.id===m.id ? { ...x, published: e.target.checked } : x));
                            } catch(err:any){ toast({ title:'Failed to update', description: err?.message||'Error', variant:'destructive' as any }); }
                          }} />
                          {m.published ? 'Yes' : 'No'}
                        </label>
                      </td>
                      <td className="px-4 py-3 text-white/60">{m.created_at ? new Date(m.created_at).toLocaleDateString() : '-'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={()=> setEditing(m)} className="px-3 py-1.5 rounded-full border border-white/20">Edit</button>
                          <button onClick={()=> onDelete(m.id)} className="px-3 py-1.5 rounded-full border border-red-400/30 text-red-200">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button disabled={page<=1} onClick={()=>setPage(p=>Math.max(1,p-1))} className="px-4 py-2 rounded-full border border-white/20 text-white/90 disabled:opacity-50">Prev</button>
          <div className="text-white/70 text-sm">Page {page} of {totalPages}</div>
          <button disabled={page>=totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))} className="px-4 py-2 rounded-full border border-white/20 text-white/90 disabled:opacity-50">Next</button>
        </div>

        {editing && (
          <div className="fixed inset-0 z-50 grid place-items-center p-4">
            <div className="absolute inset-0 bg-black/70" onClick={()=> setEditing(null)} />
            <div className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-black/70 backdrop-blur p-5">
              <h3 className="text-xl font-bold mb-3">Create/Edit Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="block">Type<span className="text-red-400"> *</span>
                  <select value={editing.type} onChange={e=> setEditing({ ...editing, type: e.target.value as any })} className="mt-1 w-full rounded-lg bg-white/10 border border-white/15 px-3 py-2">
                    <option value="ai-effects">AI Effects</option>
                    <option value="creative-effects">Creative Effects</option>
                  </select>
                </label>
                <label className="block">Tags<span className="text-red-400"> *</span>
                  <input value={(editing.tags||[]).join(', ')} onChange={e=> setEditing({ ...editing, tags: e.target.value.split(',').map(s=>s.trim()).filter(Boolean) })} placeholder="Ai, Beauty" className="mt-1 w-full rounded-lg bg-white/10 border border-white/15 px-3 py-2" />
                </label>
                <label className="block">Title<span className="text-red-400"> *</span>
                  <input value={editing.title} onChange={e=> setEditing({ ...editing, title: e.target.value })} className="mt-1 w-full rounded-lg bg-white/10 border border-white/15 px-3 py-2" />
                </label>
                <label className="block md:col-span-2">Short Description<span className="text-red-400"> *</span>
                  <input value={editing.short_description||''} onChange={e=> setEditing({ ...editing, short_description: e.target.value })} className="mt-1 w-full rounded-lg bg-white/10 border border-white/15 px-3 py-2" />
                </label>
                <label className="block">Source
                  <div className="flex gap-2 mt-1">
                    <input value={editing.url} onChange={e=> setEditing({ ...editing, url: e.target.value })} placeholder="Creative result" className="flex-1 rounded-lg bg-white/10 border border-white/15 px-3 py-2" />
                    <button onClick={async()=>{ const inp=document.createElement('input'); inp.type='file'; inp.accept='*/*'; inp.onchange= async()=>{ const f=inp.files?.[0]; if(!f) return; const url= await uploadViaPresign(f,'public'); setEditing(e=> e?{...e,url}:e); }; inp.click(); }} className="px-3 py-2 rounded-lg border border-white/20">Browse</button>
                    <button onClick={()=> setPicker({ field:'url' })} className="px-3 py-2 rounded-lg border border-white/20">Pick</button>
                  </div>
                </label>
                <label className="block">Target
                  <div className="flex gap-2 mt-1">
                    <input value={editing.target||''} onChange={e=> setEditing({ ...editing, target: e.target.value })} placeholder="creative Results" className="flex-1 rounded-lg bg-white/10 border border-white/15 px-3 py-2" />
                    <button onClick={async()=>{ const inp=document.createElement('input'); inp.type='file'; inp.accept='image/*'; inp.onchange= async()=>{ const f=inp.files?.[0]; if(!f) return; const url= await uploadViaPresign(f,'public'); setEditing(e=> e?{...e,target:url}:e); }; inp.click(); }} className="px-3 py-2 rounded-lg border border-white/20">Browse</button>
                    <button onClick={()=> setPicker({ field:'target', filter:'image' })} className="px-3 py-2 rounded-lg border border-white/20">Pick</button>
                  </div>
                </label>
                <label className="block">Video
                  <div className="flex gap-2 mt-1">
                    <input value={editing.video_url||''} onChange={e=> setEditing({ ...editing, video_url: e.target.value })} placeholder="Creative Result" className="flex-1 rounded-lg bg-white/10 border border-white/15 px-3 py-2" />
                    <button onClick={async()=>{ const inp=document.createElement('input'); inp.type='file'; inp.accept='video/*'; inp.onchange= async()=>{ const f=inp.files?.[0]; if(!f) return; const url= await uploadViaPresign(f,'public'); setEditing(e=> e?{...e,video_url:url}:e); }; inp.click(); }} className="px-3 py-2 rounded-lg border border-white/20">Browse</button>
                    <button onClick={()=> setPicker({ field:'video_url', filter:'video' })} className="px-3 py-2 rounded-lg border border-white/20">Pick</button>
                  </div>
                </label>
                <label className="block">Order By
                  <input type="number" value={editing.order_by || 0} onChange={e=> setEditing({ ...editing, order_by: parseInt(e.target.value||'0',10) })} className="mt-1 w-full rounded-lg bg-white/10 border border-white/15 px-3 py-2" />
                </label>
                <label className="block">Slug
                  <input value={editing.slug} onChange={e=> setEditing({ ...editing, slug: e.target.value })} placeholder={toSlug(editing.title)} className="mt-1 w-full rounded-lg bg-white/10 border border-white/15 px-3 py-2" />
                </label>
                <div className="md:col-span-2">
                  <label className="inline-flex items-center gap-2 mt-1"><input type="checkbox" checked={!!editing.published} onChange={e=> setEditing({ ...editing, published: e.target.checked })} /> Published</label>
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button onClick={()=> setEditing(null)} className="px-4 py-2 rounded-full border border-white/20">Cancel</button>
                <button onClick={async()=>{ try { await onSave(editing); } catch(e:any){ alert(e?.message||'Failed to save'); } }} className="px-4 py-2 rounded-full bg-white text-black font-semibold">Save</button>
              </div>
            </div>
          </div>
        )}
        {picker && (
          <MediaPicker
            filter={picker.filter}
            onClose={()=> setPicker(null)}
            onPick={(url)=>{ if (!editing) return; setEditing({ ...editing, [picker.field]: url } as any); setPicker(null); }}
          />
        )}
      </main>
      {null}
      <AdminBottomNav />
    </div>
  );
}

function MediaPicker({ filter, onClose, onPick }: { filter?: 'image'|'video'; onClose: ()=>void; onPick: (url: string)=>void }){
  const [q, setQ] = useState('');
  const [data, setData] = useState<MediaItem[]>([] as any);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|undefined>();
  useEffect(()=>{ (async()=>{
    setLoading(true); setError(undefined);
    try{
      const params = new URLSearchParams({ page:'1', pageSize:'50', includeAll:'true' });
      const res = await fetch(apiBaseJoin(`/api/media?${params.toString()}`));
      const json = await res.json();
      const arr = (json?.data||[]) as MediaItem[];
      // Permissive filtering: treat anything not 'video' as image when filter==='image'
      const filtered = filter
        ? arr.filter(x => filter==='video' ? x.type==='video' : x.type!=='video')
        : arr;
      setData(filtered);
    }catch(e:any){ setError(e?.message||'Failed to load'); setData([]); }
    finally{ setLoading(false); }
  })(); }, [filter]);
  const visible = useMemo(()=> data.filter(d => !q || d.title.toLowerCase().includes(q.toLowerCase())), [q, data]);
  return (
    <div className="fixed inset-0 z-[10000] grid place-items-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative w-full max-w-3xl rounded-2xl border border-white/10 bg-black/80 backdrop-blur p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-lg font-semibold">Pick Existing {filter? filter.charAt(0).toUpperCase()+filter.slice(1):'Resource'}</h4>
          <button onClick={onClose} className="px-3 py-1.5 rounded-full border border-white/20">Close</button>
        </div>
        <input value={q} onChange={e=> setQ(e.target.value)} placeholder="Search by title" className="w-full mb-3 rounded-lg bg-white/10 border border-white/15 px-3 py-2" />
        {loading ? (
          <div className="p-6 text-center text-white/70">Loading…</div>
        ) : error ? (
          <div className="p-4 rounded border border-red-500/40 bg-red-500/10 text-red-200">{error}</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[50vh] overflow-auto">
            {visible.map(m => {
              const previewUrl = m.url || m.thumbnail_url || '';
              const disabled = !previewUrl;
              return (
                <button key={m.id} disabled={disabled} onClick={()=> onPick(m.url || m.thumbnail_url || '')} className={`group relative rounded-lg overflow-hidden border ${disabled? 'border-white/10 opacity-50 cursor-not-allowed' : 'border-white/10 hover:border-white/25'}`}>
                  {m.type==='video' ? (
                    previewUrl ? <video src={previewUrl} poster={m.thumbnail_url || undefined} className="w-full h-28 object-cover" muted playsInline preload="metadata" /> : <div className="w-full h-28 grid place-items-center text-xs text-white/60">No preview</div>
                  ) : (
                    previewUrl ? <img src={previewUrl} alt={m.title} className="w-full h-28 object-cover" /> : <div className="w-full h-28 grid place-items-center text-xs text-white/60">No preview</div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black/80 via-black/30 to-transparent text-xs text-left truncate">{m.title || 'Untitled'}</div>
                </button>
              );
            })}
            {visible.length === 0 && (
              <div className="col-span-full p-6 text-center text-white/70">No matching items. Try clearing the search or filter.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
