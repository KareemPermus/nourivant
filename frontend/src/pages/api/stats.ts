import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const dbClient = getDb();
    const isSupabase = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (isSupabase) {
      const { count: total } = await dbClient.from('recipes').select('*', { count: 'exact', head: true });
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const { count: recent } = await dbClient.from('recipes').select('*', { count: 'exact', head: true }).gte('created_at', sevenDaysAgo);
      const { data: catRows } = await dbClient.from('recipes').select('category');
      const categories = [...new Set((catRows || []).map((r: any) => r.category).filter(Boolean))];
      return res.status(200).json({ total_recipes: total || 0, recent_count: recent || 0, categories });
    }

    const totalRow = dbClient.prepare('SELECT COUNT(*) as c FROM recipes').get();
    const recentRow = dbClient.prepare("SELECT COUNT(*) as c FROM recipes WHERE created_at >= datetime('now', '-7 days')").get();
    const catRows = dbClient.prepare('SELECT DISTINCT category FROM recipes WHERE category IS NOT NULL').all();
    return res.status(200).json({
      total_recipes: totalRow.c,
      recent_count: recentRow.c,
      categories: catRows.map((r: any) => r.category),
    });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
}