import { useEffect, useState } from 'react';
import { adminApi, getAdminKey } from '@/lib/adminApi';
// Top admin nav removed; using floating bottom nav
import AdminBottomNav from '@/components/admin-bottom-nav';

type Lead = {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  product?: string;
  message?: string;
  status: string;
  created_at: string;
  source_path?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
};

export default function AdminLeadsPage() {
  const [data, setData] = useState<Lead[]>([]);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [viewing, setViewing] = useState<Lead | null>(null);

  async function load() {
    const res = await adminApi<{ data: Lead[]; count: number }>('GET', `/api/leads?page=${page}&pageSize=20${q ? `&q=${encodeURIComponent(q)}`: ''}`);
    setData(res.data || []);
    setCount(res.count || 0);
  }

  useEffect(() => {
    if (!getAdminKey()) { window.location.href = '/admin/login'; return; }
    load().catch(console.error);
  }, [page]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') setViewing(null); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // No extra fetch required — we already have full lead objects from the list.
  function openLeadLocal(lead: Lead) {
    setViewing(lead);
  }

  function toCSV(rows: Lead[]) {
    const headers = ['id','name','email','phone','company','product','status','created_at'];
    const csv = [headers.join(',')].concat(rows.map(r => headers.map(h => JSON.stringify((r as any)[h] ?? '')).join(','))).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'leads.csv'; a.click(); URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      {null}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_50%_at_50%_0%,rgba(112,66,210,0.12),transparent_60%),radial-gradient(60%_40%_at_80%_100%,rgba(34,212,253,0.10),transparent_60%)]" />
      <div className="p-6 max-w-6xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold gradient-text">Leads</h1>
          <div className="flex gap-2">
            <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search name/email" className="rounded-xl bg-black/40 border border-white/15 px-3 py-2" />
            <button onClick={()=>{ setPage(1); load(); }} className="rounded-xl bg-white/10 px-3 py-2">Search</button>
            <button onClick={()=>toCSV(data)} className="rounded-xl bg-white/10 px-3 py-2">Export CSV</button>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 overflow-auto ">
          <table className="w-full text-sm md:text-base table-fixed ">
            <thead className="bg-white/5">
              <tr>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Company</th>
                <th className="text-left px-4 py-3">Product</th>
                {/* <th className="text-left px-4 py-3">Status</th> */}
                <th className="text-left px-4 py-3">Created</th>
                <th className="text-left px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map(l => (
                <tr key={l.id} className="border-t border-white/10 align-top">
                  <td className="px-4 py-3 break-words">{l.name}</td>
                  <td className="px-4 py-3 break-words">
                    <a href={`mailto:${l.email}`} className="underline underline-offset-2 decoration-white/30 hover:decoration-white">{l.email}</a>
                  </td>
                  <td className="px-4 py-3 break-words">{l.company}</td>
                  <td className="px-4 py-3 break-words">{l.product}</td>
                  {false && (
                    <td className="px-4 py-3">
                      <select value={l.status} onChange={async (e)=>{ const status=e.target.value; await adminApi('PATCH', `/api/leads/${l.id}`, { status }); setData(prev=>prev.map(x=>x.id===l.id?{...x,status}:x)); }} className="bg-black/40 border border-white/15 rounded px-3 py-2">
                        {['new','in_progress','closed'].map(s=> <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  )}
                  <td className="px-4 py-3 whitespace-nowrap">{new Date(l.created_at).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <button onClick={()=>openLeadLocal(l)} className="rounded bg-white/10 px-3 py-2 hover:bg-white/15">View</button>
                  </td>
                </tr>
              ))}
              {data.length===0 && (<tr><td className="p-4 text-white/60" colSpan={6}>No leads found.</td></tr>)}
            </tbody>
          </table>
        </div>
        <div className="flex gap-2 justify-end py-14">
          <button disabled={page===1} onClick={()=>setPage(p=>Math.max(1,p-1))} className="rounded-xl bg-white/10 px-3 py-2 disabled:opacity-40">Prev</button>
          <button disabled={page*20>=count} onClick={()=>setPage(p=>p+1)} className="rounded-xl bg-white/10 px-3 py-2 disabled:opacity-40">Next</button>
        </div>

        {viewing && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm" onClick={()=>setViewing(null)}>
            <div className="w-[90vw] max-w-xl rounded-2xl border border-white/15 bg-black/85 text-white p-5 shadow-[0_30px_120px_rgba(0,0,0,0.6)]" onClick={(e)=>e.stopPropagation()}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Lead Details</h2>
                <button onClick={()=>setViewing(null)} className="rounded bg-white/10 px-2 py-1 hover:bg-white/15">Close</button>
              </div>
              <div className="space-y-3 text-sm">
                <Row label="Name" value={viewing.name} />
                <Row label="Email" value={<a href={`mailto:${viewing.email}`} className="underline hover:no-underline">{viewing.email}</a>} />
                {viewing.phone && <Row label="Phone" value={<a href={`tel:${(viewing.phone||'').replace(/\s+/g,'')}`} className="underline hover:no-underline">{viewing.phone}</a>} />}
                {viewing.company && <Row label="Company" value={viewing.company} />}
                {viewing.product && <Row label="Product" value={viewing.product} />}
                {viewing.source_path && <Row label="Source" value={viewing.source_path} />}
                {(viewing.utm_source || viewing.utm_medium || viewing.utm_campaign) && (
                  <Row label="UTM" value={`${viewing.utm_source||'-'} / ${viewing.utm_medium||'-'} / ${viewing.utm_campaign||'-'}`} />
                )}
                {(viewing.utm_term || viewing.utm_content) && (
                  <Row label="UTM term/content" value={`${viewing.utm_term||'-'} / ${viewing.utm_content||'-'}`} />
                )}
                {(viewing.gclid || viewing.fbclid) && (
                  <Row label="Ad Click IDs" value={`${viewing.gclid||'-'} / ${viewing.fbclid||'-'}`} />
                )}
                {viewing.message && (
                  <div>
                    <div className="text-white/60">Message</div>
                    <div className="whitespace-pre-wrap rounded-lg border border-white/10 bg-white/5 p-3">{viewing.message}</div>
                  </div>
                )}
                <Row label="Created" value={new Date(viewing.created_at).toLocaleString()} />
              </div>
            </div>
          </div>
        )}
      </div>
      <AdminBottomNav />
    </div>
  );
}

function Row({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-24 shrink-0 text-white/60">{label}</div>
      <div className="flex-1 break-words">{value ?? '-'}</div>
    </div>
  );
}
