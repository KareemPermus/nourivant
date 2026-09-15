CREATE TABLE IF NOT EXISTS recipes (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  prep_time INT,
  cook_time INT,
  servings INT,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ingredients (
  id SERIAL PRIMARY KEY,
  recipe_id INT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  quantity TEXT,
  unit TEXT
);

CREATE TABLE IF NOT EXISTS instructions (
  id SERIAL PRIMARY KEY,
  recipe_id INT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  step_number INT NOT NULL,
  content TEXT NOT NULL
);