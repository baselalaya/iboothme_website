import { useState } from 'react';

export default function AdminLoginPage() {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      localStorage.setItem('adminKey', key);
      // quick ping to verify
      const res = await fetch('/api/seo', { headers: { 'x-admin-key': key }});
      if (!res.ok) {
        const text = await res.text().catch(()=> '');
        // try to extract message json
        let msg = 'Login failed';
        try { const js = JSON.parse(text || '{}'); msg = js.message || msg; } catch {}
        if (res.status === 401) msg = 'Invalid admin key';
        throw new Error(msg);
      }
      window.location.href = '/admin';
    } catch (err:any) {
      setError(err.message || 'Login failed');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 bg-white/5 border border-white/10 rounded-2xl p-6">
        <h1 className="text-xl font-bold">Admin Login</h1>
        <input value={key} onChange={(e)=>setKey(e.target.value)} placeholder="Admin Key" className="w-full rounded-xl bg-black/40 border border-white/15 px-4 py-3 outline-none" />
        {error && <div className="text-red-400 text-sm">{error}</div>}
        <button type="submit" className="w-full rounded-xl bg-[#7042D2] px-4 py-3 font-semibold">Login</button>
      </form>
    </div>
  );
}
