import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import { publicApi, apiBaseJoin } from '../../lib/publicApi';
import AdminBottomNav from '@/components/admin-bottom-nav';

function useAdminHeaders() {
  const key = (typeof localStorage !== 'undefined' && localStorage.getItem('adminKey')) || '';
  return useMemo(() => ({ 'x-admin-key': key || '' }), [key]);
}

function Field({label, children}:{label:string,children:any}){
  return <label className="block mb-3"><div className="text-sm text-gray-600 mb-1">{label}</div>{children}</label>;
}

export default function AdminPageEdit(props:any){
  const headers = useAdminHeaders();
  const [loc] = useLocation();
  const path = typeof window !== 'undefined' ? window.location.pathname : loc;
  const id = path.split('/').pop();
  const isNew = id === 'new';
  const [item, setItem] = useState<any>({ title:'', slug:'', published:false, body_html:'', seo_title:'', seo_description:'' });
  const [checking, setChecking] = useState<{slug?:string, ok?:boolean}>({});
  const [saving, setSaving] = useState(false);

  useEffect(()=>{
    async function run(){
      // redirect to login if no admin key
      try { if (!localStorage.getItem('adminKey')) { window.location.href = '/admin/login'; return; } } catch {}
      if (isNew) return;
      const r = await publicApi<any>('GET', `/api/admin/pages?q=${encodeURIComponent(id||'')}`, undefined, { headers });
      const found = (r?.data||[]).find((x:any)=> x.id===id);
      if (found) setItem(found);
    }
    run();
    // eslint-disable-next-line
  },[id]);

  async function checkSlug(slug:string){
    const res = await publicApi<any>('GET', `/api/admin/pages/slug-availability?slug=${encodeURIComponent(slug)}`, undefined, { headers });
    setChecking({ slug: res?.slug, ok: !!res?.available });
  }

  function normalizeSlugLocal(s: string){
    let out = (s||'').toLowerCase().trim();
    out = out.replace(/[^a-z0-9\/-]+/g,'-'); // keep only a-z0-9, -, /
    out = out.replace(/-{2,}/g,'-');         // collapse multiple hyphens
    out = out.replace(/\/+/, '/');           // collapse multiple slashes (first)
    out = out.replace(/\/+/, '/');           // run twice to be safe on short inputs
    out = out.replace(/\/+/, '/');
    out = out.replace(/(^[-/]+|[-/]+$)/g,''); // trim leading/trailing - or /
    return out;
  }

  function isValidSlugLocal(s: string){
    if (!s) return false;
    const parts = s.split('/');
    if (parts.length > 2) return false;
    const segOk = parts.every(p => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p));
    const reserved = new Set(['api','admin','images','assets','videos','static','sitemap.xml','robots.txt','favicon.ico','_next','_vercel','s']);
    return segOk && !reserved.has(s);
  }

  async function save(){
    // client-side validation
    const errs: string[] = [];
    const next = { ...item };
    if (!next.title?.trim()) errs.push('Title is required');
    next.slug = normalizeSlugLocal(next.slug || next.title || '');
    if (!isValidSlugLocal(next.slug)) errs.push('Slug is invalid (lowercase, kebab-case, optional section/slug)');
    if (errs.length){ alert(errs.join('\n')); return; }

    setSaving(true);
    const res = await publicApi<any>(isNew ? 'POST' : 'PUT', isNew ? '/api/admin/pages' : `/api/admin/pages/${next.id}`, next, { headers });
    setSaving(false);
    if (res?.id) {
      setItem(res);
      if (isNew && typeof window!=='undefined') window.location.hash = `#/admin/pages/${res.id}`;
    }
  }

  return (
    <div className="relative min-h-screen text-white">
      <main className="relative z-20 max-w-3xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-black">{isNew? 'New Page' : 'Edit Page'}</h1>
        {item.slug ? <a className="underline" href={apiBaseJoin(`/s/${item.slug}`)} target="_blank" rel="noreferrer">Preview</a> : null}
      </div>
      <Field label="Title">
        <input className="rounded bg-white/10 border border-white/15 px-4 py-2 outline-none focus:ring-2 focus:ring-purple-400/60 w-full" value={item.title} onChange={e=>setItem({...item,title:e.target.value})} />
      </Field>
      <Field label="Slug">
        <div className="flex gap-2 items-center">
          <input className="rounded bg-white/10 border border-white/15 px-4 py-2 outline-none focus:ring-2 focus:ring-purple-400/60 w-full" value={item.slug} onChange={e=>{ const v=e.target.value; setItem({...item,slug:v}); }} onBlur={()=>{ const norm = normalizeSlugLocal(item.slug); setItem({...item, slug: norm}); if (norm) checkSlug(norm); }} />
          <span className={checking.ok===false? 'text-red-400': 'text-white/60'}>{checking.ok===false? 'Not available' : checking.ok? 'Available' : ''}</span>
        </div>
      </Field>
      <Field label="Published">
        <input type="checkbox" checked={!!item.published} onChange={e=>setItem({...item,published:e.target.checked})} />
      </Field>
      <Field label="SEO Title">
        <input className="rounded bg-white/10 border border-white/15 px-4 py-2 outline-none focus:ring-2 focus:ring-purple-400/60 w-full" value={item.seo_title||''} onChange={e=>setItem({...item,seo_title:e.target.value})} />
      </Field>
      <Field label="SEO Description">
        <textarea className="rounded bg-white/10 border border-white/15 px-4 py-2 outline-none focus:ring-2 focus:ring-purple-400/60 w-full" rows={3} value={item.seo_description||''} onChange={e=>setItem({...item,seo_description:e.target.value})} />
      </Field>
      <Field label="Body (HTML)">
        <textarea className="rounded bg-white/10 border border-white/15 px-4 py-2 outline-none focus:ring-2 focus:ring-purple-400/60 w-full font-mono" rows={16} value={item.body_html||''} onChange={e=>setItem({...item,body_html:e.target.value})} placeholder="Paste sanitized HTML here" />
      </Field>
      <div className="flex gap-2">
        <button onClick={save} className="px-4 py-2 rounded-full bg-white text-black font-semibold" disabled={saving}>{saving? 'Saving…':'Save'}</button>
        {item.slug && <a className="px-4 py-2 rounded-full border border-white/20 hover:bg-white/10" href={apiBaseJoin(`/s/${item.slug}`)} target="_blank" rel="noreferrer">Open</a>}
      </div>
      </main>
      <AdminBottomNav />
    </div>
  )
}
