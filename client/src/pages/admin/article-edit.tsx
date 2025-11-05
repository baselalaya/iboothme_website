import AdminNav from "@/components/admin-nav";
import { useEffect, useState } from "react";
import { adminApi } from "@/lib/adminApi";
import { useRoute } from "wouter";

type Article = { id?:string; title:string; slug:string; excerpt?:string; cover_image?:string; content:string; tags?:string[]; status:'draft'|'published'; author?:string; published_at?:string };

export default function AdminArticleEditPage(){
  const [, params] = useRoute('/admin/articles/:id');
  const isNew = params?.id === 'new' || location.pathname.endsWith('/new');
  const articleId = !isNew ? params?.id : undefined;

  const [form, setForm] = useState<Article>({ title:'', slug:'', excerpt:'', cover_image:'', content:'', tags:[], status:'draft', author:'', published_at:'' });
  const [saving,setSaving] = useState(false);
  const [error,setError] = useState<string|undefined>();

  useEffect(()=>{ (async()=>{
    if(!articleId) return;
    try{ const res = await adminApi<Article>('GET', `/api/admin/articles/${articleId}`); setForm({ ...res, tags: res.tags||[] }); }
    catch(e:any){ setError(e?.message||'Failed to load'); }
  })(); }, [articleId]);

  function slugify(v:string){ return v.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''); }

  return (
    <div className="min-h-screen text-white">
      <AdminNav />
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">{isNew? 'New Article':'Edit Article'}</h1>
          <div className="flex gap-2">
            {!isNew && (
              <button className="px-3 py-2 rounded bg-red-600" onClick={async()=>{ if(!confirm('Delete article?')) return; await adminApi('DELETE', `/api/admin/articles/${articleId}`); location.href='/admin/articles'; }}>Delete</button>
            )}
            <button className="px-4 py-2 rounded bg-white text-black font-semibold" disabled={saving} onClick={async()=>{
              setSaving(true); setError(undefined);
              try{
                const body = { ...form, tags: (form.tags||[]), id: articleId } as any;
                if (!body.slug) body.slug = slugify(body.title||'');
                if (body.published_at === '') body.published_at = null;
                await adminApi('POST', '/api/admin/articles', body);
                location.href='/admin/articles';
              }catch(e:any){ setError(e?.message||'Failed to save'); }
              finally{ setSaving(false); }
            }}>{saving? 'Saving…':'Save'}</button>
          </div>
        </div>
        {error && <div className="mb-4 rounded border border-red-500/40 bg-red-500/10 p-3 text-red-200">{error}</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <div className="text-sm text-white/80 mb-1">Title</div>
            <input value={form.title} onChange={e=>setForm(f=>({...f, title:e.target.value, slug: f.slug || slugify(e.target.value)}))} className="w-full rounded bg-black/40 border border-white/15 px-3 py-2" />
          </label>
          <label className="block">
            <div className="text-sm text-white/80 mb-1">Slug</div>
            <input value={form.slug} onChange={e=>setForm(f=>({...f, slug:e.target.value}))} className="w-full rounded bg-black/40 border border-white/15 px-3 py-2" />
          </label>
          <label className="block md:col-span-2">
            <div className="text-sm text-white/80 mb-1">Excerpt (Meta description)</div>
            <textarea value={form.excerpt} onChange={e=>setForm(f=>({...f, excerpt:e.target.value}))} rows={3} className="w-full rounded bg-black/40 border border-white/15 px-3 py-2" />
          </label>
          <label className="block">
            <div className="text-sm text-white/80 mb-1">Cover Image URL</div>
            <input value={form.cover_image} onChange={e=>setForm(f=>({...f, cover_image:e.target.value}))} className="w-full rounded bg-black/40 border border-white/15 px-3 py-2" />
          </label>
          <label className="block">
            <div className="text-sm text-white/80 mb-1">Tags (comma separated)</div>
            <input value={(form.tags||[]).join(', ')} onChange={e=>setForm(f=>({...f, tags:e.target.value.split(',').map(s=>s.trim()).filter(Boolean)}))} className="w-full rounded bg-black/40 border border-white/15 px-3 py-2" />
          </label>
          <label className="block">
            <div className="text-sm text-white/80 mb-1">Status</div>
            <select value={form.status} onChange={e=>setForm(f=>({...f, status:e.target.value as any}))} className="w-full rounded bg-black/40 border border-white/15 px-3 py-2">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>
          <label className="block">
            <div className="text-sm text-white/80 mb-1">Published At</div>
            <input type="datetime-local" value={form.published_at || ''} onChange={e=>setForm(f=>({...f, published_at:e.target.value}))} className="w-full rounded bg-black/40 border border-white/15 px-3 py-2" />
          </label>
          <label className="block md:col-span-2">
            <div className="text-sm text-white/80 mb-1">Content (Markdown)</div>
            <textarea value={form.content} onChange={e=>setForm(f=>({...f, content:e.target.value}))} rows={16} className="w-full rounded bg-black/40 border border-white/15 px-3 py-2 font-mono text-sm" />
          </label>
        </div>
      </main>
    </div>
  );
}

