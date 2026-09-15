export interface Recipe {
  id: number;
  title: string;
  description?: string;
  image_url?: string;
  prep_time?: number;
  cook_time?: number;
  servings?: number;
  category?: string;
  created_at: string;
}

export interface Ingredient {
  id: number;
  recipe_id: number;
  name: string;
  quantity?: string;
  unit?: string;
}

export interface Instruction {
  id: number;
  recipe_id: number;
  step_number: number;
  content: string;
}

export interface RecipeDetail extends Recipe {
  ingredients: Omit<Ingredient, 'recipe_id'>[];
  instructions: Omit<Instruction, 'recipe_id'>[];
}

export interface StatsResponse {
  total_recipes: number;
  recent_count: number;
  categories: string[];
}

export interface DeleteResponse {
  success: boolean;
}