INSERT INTO recipes (title, slug, description, image_url, prep_time, cook_time, servings, category)
VALUES ('Classic Margherita Pizza', 'classic-margherita-pizza', 'A simple and delicious Italian pizza with fresh basil and mozzarella.', NULL, 20, 15, 4, 'Italian')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO recipes (title, slug, description, image_url, prep_time, cook_time, servings, category)
VALUES ('Chicken Stir Fry', 'chicken-stir-fry', 'Quick and healthy chicken stir fry with mixed vegetables.', NULL, 15, 10, 2, 'Asian')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO recipes (title, slug, description, image_url, prep_time, cook_time, servings, category)
VALUES ('Greek Salad', 'greek-salad', 'Fresh Mediterranean salad with feta cheese and olives.', NULL, 10, 0, 3, 'Salads')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO recipes (title, slug, description, image_url, prep_time, cook_time, servings, category)
VALUES ('Beef Tacos', 'beef-tacos', 'Seasoned ground beef tacos with fresh toppings.', NULL, 15, 20, 4, 'Mexican')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO ingredients (recipe_id, name, quantity, unit)
SELECT r.id, v.name, v.quantity, v.unit
FROM recipes r, (VALUES
  ('classic-margherita-pizza', 'Pizza Dough', '1', 'ball'),
  ('classic-margherita-pizza', 'Mozzarella', '200', 'g'),
  ('classic-margherita-pizza', 'Tomato Sauce', '100', 'ml'),
  ('classic-margherita-pizza', 'Fresh Basil', '10', 'leaves'),
  ('chicken-stir-fry', 'Chicken Breast', '300', 'g'),
  ('chicken-stir-fry', 'Soy Sauce', '2', 'tbsp'),
  ('chicken-stir-fry', 'Mixed Vegetables', '200', 'g'),
  ('greek-salad', 'Cucumber', '1', 'whole'),
  ('greek-salad', 'Feta Cheese', '100', 'g'),
  ('greek-salad', 'Olives', '50', 'g'),
  ('beef-tacos', 'Ground Beef', '400', 'g'),
  ('beef-tacos', 'Taco Shells', '8', 'pieces'),
  ('beef-tacos', 'Lettuce', '1', 'head')
) AS v(slug, name, quantity, unit)
WHERE r.slug = v.slug
ON CONFLICT DO NOTHING;

INSERT INTO instructions (recipe_id, step_number, content)
SELECT r.id, v.step_number, v.content
FROM recipes r, (VALUES
  ('classic-margherita-pizza', 1, 'Preheat oven to 250°C.'),
  ('classic-margherita-pizza', 2, 'Roll out dough and spread tomato sauce.'),
  ('classic-margherita-pizza', 3, 'Add mozzarella and bake for 12-15 minutes.'),
  ('classic-margherita-pizza', 4, 'Top with fresh basil and serve.'),
  ('chicken-stir-fry', 1, 'Slice chicken into strips.'),
  ('chicken-stir-fry', 2, 'Stir fry chicken until golden, add vegetables and soy sauce.'),
  ('chicken-stir-fry', 3, 'Cook for 5 more minutes and serve over rice.'),
  ('greek-salad', 1, 'Chop cucumber, tomatoes and onions.'),
  ('greek-salad', 2, 'Add feta and olives, drizzle with olive oil.'),
  ('beef-tacos', 1, 'Brown the ground beef with taco seasoning.'),
  ('beef-tacos', 2, 'Warm taco shells and fill with beef and toppings.')
) AS v(slug, step_number, content)
WHERE r.slug = v.slug
ON CONFLICT DO NOTHING;