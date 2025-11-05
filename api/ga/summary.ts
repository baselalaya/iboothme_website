import type { VercelRequest, VercelResponse } from 'vercel';
import { requireAdmin } from '../_supabase.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!requireAdmin(req, res)) return;
  try {
    const propertyId = process.env.GA_PROPERTY_ID;
    const clientEmail = process.env.GA_CLIENT_EMAIL;
    let privateKey = process.env.GA_PRIVATE_KEY;
    if (!propertyId || !clientEmail || !privateKey) {
      return res.status(200).json({ available: false, message: 'GA credentials not set' });
    }
    privateKey = privateKey.replace(/\\n/g, '\n');
    const { BetaAnalyticsDataClient } = await import('@google-analytics/data');
    const analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: { client_email: clientEmail, private_key: privateKey },
    });
    const [report] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
      metrics: [
        { name: 'totalUsers' },
        { name: 'activeUsers' },
        { name: 'newUsers' },
        { name: 'screenPageViews' },
        { name: 'eventCount' },
        { name: 'sessions' },
        { name: 'conversions' }
      ],
    });
    const metricHeaders = report.metricHeaders?.map(h => h.name) || [];
    const row = report.rows?.[0]?.metricValues?.map(v => Number(v.value || 0)) || [];
    const summary: Record<string, number> = {};
    metricHeaders.forEach((name, i) => { summary[name] = row[i] || 0; });
    return res.json({ available: true, summary });
  } catch (e:any) {
    return res.status(200).json({ available: false, message: e?.message || 'GA error' });
  }
}
