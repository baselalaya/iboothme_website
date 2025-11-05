// Top admin nav removed; using floating bottom nav
import AdminBottomNav from "@/components/admin-bottom-nav";
import { useEffect, useState } from "react";
import { adminApi } from "@/lib/adminApi";

type Article = { id:string; title:string; slug:string; status:string; published_at?:string };

export default function AdminArticlesPage(){
  const [data,setData] = useState<Article[]>([]);
  const [count,setCount] = useState(0);
  const [page,setPage] = useState(1);
  const [q,setQ] = useState('');
  const [status,setStatus] = useState('');

  useEffect(()=>{ (async()=>{
    const res = await adminApi<{data:Article[]; count:number}>("GET", `/api/admin/articles?page=${page}&pageSize=20${q?`&q=${encodeURIComponent(q)}`:''}${status?`&status=${status}`:''}`);
    setData(res.data||[]); setCount(res.count||0);
  })(); }, [page,q,status]);

  const totalPages = Math.max(1, Math.ceil(count/20));

  return (
    <div className="min-h-screen text-white">
      {null}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Articles</h1>
          <a href="/admin/articles/new" className="px-4 py-2 rounded-md bg-white text-black font-semibold">New</a>
        </div>
        <div className="flex gap-3 mb-4">
          <input value={q} onChange={e=>{setPage(1); setQ(e.target.value);}} placeholder="Search" className="rounded bg-black/40 border border-white/15 px-3 py-2"/>
          <select value={status} onChange={e=>{setPage(1); setStatus(e.target.value);}} className="rounded bg-black/40 border border-white/15 px-3 py-2">
            <option value="">All</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <table className="w-full text-left border-separate border-spacing-y-2">
          <thead className="text-white/70 text-sm">
            <tr><th className="px-3">Title</th><th className="px-3">Slug</th><th className="px-3">Status</th><th className="px-3">Published</th><th className="px-3"></th></tr>
          </thead>
          <tbody>
            {data.map(a=> (
              <tr key={a.id} className="bg-white/5">
                <td className="px-3 py-2">{a.title}</td>
                <td className="px-3 py-2 text-white/80">{a.slug}</td>
                <td className="px-3 py-2">{a.status}</td>
                <td className="px-3 py-2 text-white/70">{a.published_at? new Date(a.published_at).toLocaleDateString(): '-'}</td>
                <td className="px-3 py-2 text-right">
                  <a className="underline" href={`/admin/articles/${a.id}`}>Edit</a>
                </td>
              </tr>
            ))}
            {data.length===0 && (<tr><td className="px-3 py-6 text-white/70" colSpan={5}>No articles found.</td></tr>)}
          </tbody>
        </table>
        <div className="mt-4 flex items-center gap-3">
          <button disabled={page<=1} onClick={()=>setPage(p=>Math.max(1,p-1))} className="px-3 py-1 rounded border border-white/20 disabled:opacity-50">Prev</button>
          <div className="text-white/70">Page {page} of {totalPages}</div>
          <button disabled={page>=totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))} className="px-3 py-1 rounded border border-white/20 disabled:opacity-50">Next</button>
        </div>
      </main>
      <AdminBottomNav />
    </div>
  );
}
