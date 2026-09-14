import path from 'path';

let db: any = null;

export function getDb() {
  if (db) return db;

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const { createClient } = require('@supabase/supabase-js');
    db = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    return db;
  }

  const Database = require('better-sqlite3');
  db = new Database(path.join('/tmp', 'app.db'));
  db.pragma('journal_mode = WAL');

  db.exec(`
    CREATE TABLE IF NOT EXISTS recipes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      image_url TEXT,
      prep_time INTEGER,
      cook_time INTEGER,
      servings INTEGER,
      category TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS ingredients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      quantity TEXT,
      unit TEXT
    );
    CREATE TABLE IF NOT EXISTS instructions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
      step_number INTEGER NOT NULL,
      content TEXT NOT NULL
    );
  `);

  const count = db.prepare('SELECT COUNT(*) as c FROM recipes').get();
  if (count.c === 0) {
    const insertRecipe = db.prepare('INSERT INTO recipes (title, slug, description, prep_time, cook_time, servings, category) VALUES (?,?,?,?,?,?,?)');
    const insertIngredient = db.prepare('INSERT INTO ingredients (recipe_id, name, quantity, unit) VALUES (?,?,?,?)');
    const insertInstruction = db.prepare('INSERT INTO instructions (recipe_id, step_number, content) VALUES (?,?,?)');

    const r1 = insertRecipe.run('Classic Margherita Pizza', 'classic-margherita-pizza', 'A simple and delicious Italian pizza with fresh basil and mozzarella.', 20, 15, 4, 'Italian');
    insertIngredient.run(r1.lastInsertRowid, 'Pizza Dough', '1', 'ball');
    insertIngredient.run(r1.lastInsertRowid, 'Mozzarella', '200', 'g');
    insertIngredient.run(r1.lastInsertRowid, 'Tomato Sauce', '100', 'ml');
    insertInstruction.run(r1.lastInsertRowid, 1, 'Preheat oven to 250°C.');
    insertInstruction.run(r1.lastInsertRowid, 2, 'Roll out dough and spread tomato sauce.');
    insertInstruction.run(r1.lastInsertRowid, 3, 'Add mozzarella and bake for 12-15 minutes.');

    const r2 = insertRecipe.run('Chicken Stir Fry', 'chicken-stir-fry', 'Quick and healthy chicken stir fry with mixed vegetables.', 15, 10, 2, 'Asian');
    insertIngredient.run(r2.lastInsertRowid, 'Chicken Breast', '300', 'g');
    insertIngredient.run(r2.lastInsertRowid, 'Soy Sauce', '2', 'tbsp');
    insertInstruction.run(r2.lastInsertRowid, 1, 'Slice chicken into strips.');
    insertInstruction.run(r2.lastInsertRowid, 2, 'Stir fry chicken until golden, add vegetables.');

    const r3 = insertRecipe.run('Greek Salad', 'greek-salad', 'Fresh Mediterranean salad with feta cheese and olives.', 10, 0, 3, 'Salads');
    insertIngredient.run(r3.lastInsertRowid, 'Cucumber', '1', 'whole');
    insertIngredient.run(r3.lastInsertRowid, 'Feta Cheese', '100', 'g');
    insertInstruction.run(r3.lastInsertRowid, 1, 'Chop cucumber, tomatoes and onions.');
    insertInstruction.run(r3.lastInsertRowid, 2, 'Add feta and olives, drizzle with olive oil.');

    const r4 = insertRecipe.run('Beef Tacos', 'beef-tacos', 'Seasoned ground beef tacos with fresh toppings.', 15, 20, 4, 'Mexican');
    insertIngredient.run(r4.lastInsertRowid, 'Ground Beef', '400', 'g');
    insertIngredient.run(r4.lastInsertRowid, 'Taco Shells', '8', 'pieces');
    insertInstruction.run(r4.lastInsertRowid, 1, 'Brown the ground beef with taco seasoning.');
    insertInstruction.run(r4.lastInsertRowid, 2, 'Warm taco shells and fill with beef and toppings.');
  }

  return db;
}

function isSupabase(client: any): boolean {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL;
}

export { isSupabase };