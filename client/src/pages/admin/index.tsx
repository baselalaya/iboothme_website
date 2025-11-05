import { useEffect, useState } from 'react';
import { adminApi, getAdminKey } from '@/lib/adminApi';
// Top admin nav removed; using floating bottom nav
import AdminBottomNav from '@/components/admin-bottom-nav';

type Lead = { id: string; name: string; email: string; status: string; created_at: string };

export default function AdminDashboard() {
  const [recent, setRecent] = useState<Lead[]>([]);
  const [count, setCount] = useState(0);
  const [ga, setGa] = useState<{ available: boolean; summary?: Record<string, number>; message?: string } | null>(null);

  useEffect(() => {
    if (!getAdminKey()) { window.location.href = '/admin/login'; return; }
    (async () => {
      const res = await adminApi<{ data: Lead[]; count: number }>('GET', `/api/leads?page=1&pageSize=5`);
      setRecent(res.data || []);
      setCount(res.count || 0);
      try {
        const g = await adminApi<{ available: boolean; summary?: Record<string, number>; message?: string }>('GET', '/api/ga/summary');
        setGa(g);
      } catch (e) {
        setGa({ available: false, message: 'Unavailable' });
      }
    })().catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative">
      {null}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_50%_at_50%_0%,rgba(112,66,210,0.12),transparent_60%),radial-gradient(60%_40%_at_80%_100%,rgba(34,212,253,0.10),transparent_60%)]" />
      <div className="p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold gradient-text">Dashboard</h1>
          <div className="text-sm opacity-80">Total Leads: {count}</div>
        </div>
        <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4">
          <div className="font-semibold mb-3">Recent Leads</div>
          <div className="divide-y divide-white/10">
            {recent.map(l => (
              <div key={l.id} className="py-2 flex items-center justify-between text-sm">
                <div>
                  <div className="font-medium">{l.name}</div>
                  <div className="text-white/70">{l.email}</div>
                </div>
                <div className="text-white/60">{new Date(l.created_at).toLocaleString()}</div>
              </div>
            ))}
            {recent.length === 0 && <div className="py-6 text-white/60">No leads yet.</div>}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4">
          <div className="font-semibold mb-3">GA Summary (7 days)</div>
          {!ga || !ga.available ? (
            <div className="text-white/70 text-sm">{ga?.message || 'No GA data. Configure GA4 in Settings.'}</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.entries(ga.summary || {}).map(([k,v]) => (
                <div key={k} className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="text-xs text-white/60">{k}</div>
                  <div className="text-lg font-semibold">{v as number}</div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
    <AdminBottomNav />
    </div>
  );
}
