import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const dbClient = getDb();
  const isSupabase = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const id = Number(req.query.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

  if (req.method === 'GET') {
    try {
      if (isSupabase) {
        const { data: recipe, error } = await dbClient.from('recipes').select('*').eq('id', id).single();
        if (error || !recipe) return res.status(404).json({ error: 'Recipe not found' });
        const { data: ingredients } = await dbClient.from('ingredients').select('id, name, quantity, unit').eq('recipe_id', id);
        const { data: instructions } = await dbClient.from('instructions').select('id, step_number, content').eq('recipe_id', id).order('step_number');
        return res.status(200).json({ ...recipe, ingredients: ingredients || [], instructions: instructions || [] });
      }

      const recipe = dbClient.prepare('SELECT * FROM recipes WHERE id = ?').get(id);
      if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
      const ingredients = dbClient.prepare('SELECT id, name, quantity, unit FROM ingredients WHERE recipe_id = ?').all(id);
      const instructions = dbClient.prepare('SELECT id, step_number, content FROM instructions WHERE recipe_id = ? ORDER BY step_number').all(id);
      return res.status(200).json({ ...recipe, ingredients, instructions });
    } catch (e: any) {
      console.error(e);
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { title, description, image_url, prep_time, cook_time, servings, category, ingredients, instructions } = req.body;

      if (isSupabase) {
        const { data: existing } = await dbClient.from('recipes').select('id').eq('id', id).single();
        if (!existing) return res.status(404).json({ error: 'Recipe not found' });

        const { error: upErr } = await dbClient.from('recipes').update({
          title, description: description || null, image_url: image_url || null,
          prep_time: prep_time || null, cook_time: cook_time || null,
          servings: servings || null, category: category || null,
        }).eq('id', id);
        if (upErr) return res.status(500).json({ error: upErr.message });

        await dbClient.from('ingredients').delete().eq('recipe_id', id);
        await dbClient.from('instructions').delete().eq('recipe_id', id);

        let ingData: any[] = [];
        if (ingredients?.length) {
          const { data } = await dbClient.from('ingredients')
            .insert(ingredients.map((i: any) => ({ recipe_id: id, name: i.name, quantity: i.quantity || null, unit: i.unit || null })))
            .select();
          ingData = data || [];
        }
        let insData: any[] = [];
        if (instructions?.length) {
          const { data } = await dbClient.from('instructions')
            .insert(instructions.map((i: any, idx: number) => ({ recipe_id: id, step_number: i.step_number || idx + 1, content: i.content })))
            .select();
          insData = data || [];
        }

        const { data: recipe } = await dbClient.from('recipes').select('*').eq('id', id).single();
        return res.status(200).json({
          ...recipe,
          ingredients: ingData.map((i: any) => ({ id: i.id, name: i.name, quantity: i.quantity, unit: i.unit })),
          instructions: insData.map((i: any) => ({ id: i.id, step_number: i.step_number, content: i.content })),
        });
      }

      // SQLite
      const existing = dbClient.prepare('SELECT id FROM recipes WHERE id = ?').get(id);
      if (!existing) return res.status(404).json({ error: 'Recipe not found' });

      dbClient.prepare(
        'UPDATE recipes SET title=?, description=?, image_url=?, prep_time=?, cook_time=?, servings=?, category=? WHERE id=?'
      ).run(title, description || null, image_url || null, prep_time || null, cook_time || null, servings || null, category || null, id);

      dbClient.prepare('DELETE FROM ingredients WHERE recipe_id = ?').run(id);
      dbClient.prepare('DELETE FROM instructions WHERE recipe_id = ?').run(id);

      if (ingredients?.length) {
        const stmt = dbClient.prepare('INSERT INTO ingredients (recipe_id, name, quantity, unit) VALUES (?,?,?,?)');
        for (const i of ingredients) stmt.run(id, i.name, i.quantity || null, i.unit || null);
      }
      if (instructions?.length) {
        const stmt = dbClient.prepare('INSERT INTO instructions (recipe_id, step_number, content) VALUES (?,?,?)');
        instructions.forEach((i: any, idx: number) => stmt.run(id, i.step_number || idx + 1, i.content));
      }

      const recipe = dbClient.prepare('SELECT * FROM recipes WHERE id = ?').get(id);
      const ings = dbClient.prepare('SELECT id, name, quantity, unit FROM ingredients WHERE recipe_id = ?').all(id);
      const inss = dbClient.prepare('SELECT id, step_number, content FROM instructions WHERE recipe_id = ? ORDER BY step_number').all(id);
      return res.status(200).json({ ...recipe, ingredients: ings, instructions: inss });
    } catch (e: any) {
      console.error(e);
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      if (isSupabase) {
        const { data: existing } = await dbClient.from('recipes').select('id').eq('id', id).single();
        if (!existing) return res.status(404).json({ error: 'Recipe not found' });
        await dbClient.from('ingredients').delete().eq('recipe_id', id);
        await dbClient.from('instructions').delete().eq('recipe_id', id);
        await dbClient.from('recipes').delete().eq('id', id);
        return res.status(200).json({ success: true });
      }

      const existing = dbClient.prepare('SELECT id FROM recipes WHERE id = ?').get(id);
      if (!existing) return res.status(404).json({ error: 'Recipe not found' });
      dbClient.prepare('DELETE FROM ingredients WHERE recipe_id = ?').run(id);
      dbClient.prepare('DELETE FROM instructions WHERE recipe_id = ?').run(id);
      dbClient.prepare('DELETE FROM recipes WHERE id = ?').run(id);
      return res.status(200).json({ success: true });
    } catch (e: any) {
      console.error(e);
      return res.status(500).json({ error: e.message });
    }
  }

  res.setHeader('Allow', 'GET, PUT, DELETE');
  return res.status(405).json({ error: 'Method not allowed' });
}