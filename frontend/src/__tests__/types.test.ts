import type { Recipe, Ingredient, Instruction, RecipeDetail, StatsResponse } from '@/types';

describe('Type contracts', () => {
  it('Recipe shape is valid', () => {
    const r: Recipe = { id: 1, title: 'Test', created_at: '2025-01-01' };
    expect(r.id).toBe(1);
  });

  it('StatsResponse shape is valid', () => {
    const s: StatsResponse = { total_recipes: 5, recent_count: 2, categories: ['Dinner'] };
    expect(s.total_recipes).toBe(5);
  });
});