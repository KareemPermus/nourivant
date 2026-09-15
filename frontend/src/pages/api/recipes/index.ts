import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/db';

function slugify(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const dbClient = getDb();
  const isSupabase = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (req.method === 'GET') {
    try {
      const { search, category } = req.query;

      if (isSupabase) {
        let query = dbClient.from('recipes').select('id, title, description, image_url, prep_time, cook_time, servings, category, created_at');
        if (search) query = query.ilike('title', `%${search}%`);
        if (category) query = query.eq('category', category);
        query = query.order('created_at', { ascending: false });
        const { data, error } = await query;
        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json(data);
      }

      let sql = 'SELECT id, title, description, image_url, prep_time, cook_time, servings, category, created_at FROM recipes';
      const conditions: string[] = [];
      const params: any[] = [];
      if (search) { conditions.push('title LIKE ?'); params.push(`%${search}%`); }
      if (category) { conditions.push('category = ?'); params.push(category); }
      if (conditions.length) sql += ' WHERE ' + conditions.join(' AND ');
      sql += ' ORDER BY created_at DESC';
      const rows = dbClient.prepare(sql).all(...params);
      return res.status(200).json(rows);
    } catch (e: any) {
      console.error(e);
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const { title, description, image_url, prep_time, cook_time, servings, category, ingredients, instructions } = req.body;
      if (!title) return res.status(400).json({ error: 'Title is required' });

      if (isSupabase) {
        const slug = slugify(title);
        const { data: recipe, error: recipeErr } = await dbClient.from('recipes')
          .insert({ title, slug, description: description || null, image_url: image_url || null, prep_time: prep_time || null, cook_time: cook_time || null, servings: servings || null, category: category || null })
          .select().single();
        if (recipeErr) return res.status(500).json({ error: recipeErr.message });

        let ingData: any[] = [];
        if (ingredients?.length) {
          const { data, error } = await dbClient.from('ingredients')
            .insert(ingredients.map((i: any) => ({ recipe_id: recipe.id, name: i.name, quantity: i.quantity || null, unit: i.unit || null })))
            .select();
          if (error) return res.status(500).json({ error: error.message });
          ingData = data || [];
        }

        let insData: any[] = [];
        if (instructions?.length) {
          const { data, error } = await dbClient.from('instructions')
            .insert(instructions.map((i: any, idx: number) => ({ recipe_id: recipe.id, step_number: i.step_number || idx + 1, content: i.content })))
            .select();
          if (error) return res.status(500).json({ error: error.message });
          insData = data || [];
        }

        return res.status(201).json({
          ...recipe,
          ingredients: ingData.map((i: any) => ({ id: i.id, name: i.name, quantity: i.quantity, unit: i.unit })),
          instructions: insData.map((i: any) => ({ id: i.id, step_number: i.step_number, content: i.content })),
        });
      }

      // SQLite
      const slug = slugify(title);
      const result = dbClient.prepare(
        'INSERT INTO recipes (title, slug, description, image_url, prep_time, cook_time, servings, category) VALUES (?,?,?,?,?,?,?,?)'
      ).run(title, slug, description || null, image_url || null, prep_time || null, cook_time || null, servings || null, category || null);

      const recipeId = result.lastInsertRowid;
      const ingInsert = dbClient.prepare('INSERT INTO ingredients (recipe_id, name, quantity, unit) VALUES (?,?,?,?)');
      const insInsert = dbClient.prepare('INSERT INTO instructions (recipe_id, step_number, content) VALUES (?,?,?)');

      if (ingredients?.length) {
        for (const i of ingredients) {
          ingInsert.run(recipeId, i.name, i.quantity || null, i.unit || null);
        }
      }
      if (instructions?.length) {
        instructions.forEach((i: any, idx: number) => {
          insInsert.run(recipeId, i.step_number || idx + 1, i.content);
        });
      }

      const recipe = dbClient.prepare('SELECT * FROM recipes WHERE id = ?').get(recipeId);
      const ings = dbClient.prepare('SELECT id, name, quantity, unit FROM ingredients WHERE recipe_id = ?').all(recipeId);
      const inss = dbClient.prepare('SELECT id, step_number, content FROM instructions WHERE recipe_id = ? ORDER BY step_number').all(recipeId);

      return res.status(201).json({ ...recipe, ingredients: ings, instructions: inss });
    } catch (e: any) {
      console.error(e);
      return res.status(500).json({ error: e.message });
    }
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ error: 'Method not allowed' });
}