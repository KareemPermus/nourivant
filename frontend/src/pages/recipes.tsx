import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import apiClient from '@/api/client';
import { Recipe } from '@/types';
import RecipeSearchBar from '@/components/RecipeSearchBar';
import RecipeFilterSidebar from '@/components/RecipeFilterSidebar';
import RecipeGrid from '@/components/RecipeGrid';

export default function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);

  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (category) params.category = category;
      const res = await apiClient.get('/api/recipes', { params });
      setRecipes(res.data);
      // extract unique categories
      const cats = Array.from(new Set((res.data as Recipe[]).map(r => r.category).filter(Boolean))) as string[];
      if (cats.length > 0 && categories.length === 0) setCategories(cats);
    } catch {
      setError('Failed to load recipes.');
    } finally {
      setLoading(false);
    }
  }, [search, category]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  return (
    <>
      <Head>
        <title>Recipes — Nourivant</title>
      </Head>

      <div className="recipes-page">
        {/* Header */}
        <div className="recipes-header">
          <div>
            <h1 className="recipes-title">Recipes</h1>
            <p className="recipes-subtitle">Browse and manage your recipe collection</p>
          </div>
          <Link href="/addrecipe" className="recipes-add-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Recipe
          </Link>
        </div>

        {/* Search */}
        <RecipeSearchBar value={search} onChange={setSearch} />

        <div className="recipes-layout">
          <RecipeFilterSidebar
            categories={categories}
            selected={category}
            onSelect={setCategory}
          />
          <div className="recipes-main">
            {loading && <div className="recipes-loading">Loading recipes…</div>}
            {error && <div className="recipes-error">{error}</div>}
            {!loading && !error && recipes.length === 0 && (
              <div className="recipes-empty">
                <p>No recipes found.</p>
                <Link href="/addrecipe" className="recipes-add-btn" style={{ marginTop: 16, display: 'inline-flex' }}>Add your first recipe</Link>
              </div>
            )}
            {!loading && !error && recipes.length > 0 && <RecipeGrid recipes={recipes} />}
          </div>
        </div>
      </div>

      <style jsx>{`
        .recipes-page { max-width: 1200px; margin: 0 auto; }
        .recipes-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
        .recipes-title { font-size: 1.75rem; font-weight: 700; letter-spacing: -0.02em; color: var(--text-primary, #1c1917); }
        .recipes-subtitle { font-size: 0.875rem; color: var(--text-secondary, #78716c); margin-top: 4px; }
        .recipes-add-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 8px 16px; border-radius: 12px;
          background: #10b981; color: #fff; font-size: 0.875rem; font-weight: 500;
          text-decoration: none; border: none; cursor: pointer; transition: background 0.15s;
        }
        .recipes-add-btn:hover { background: #059669; }
        .recipes-layout { display: flex; gap: 24px; }
        .recipes-main { flex: 1; min-width: 0; }
        .recipes-loading, .recipes-error, .recipes-empty {
          text-align: center; padding: 48px 16px; color: #78716c; font-size: 0.875rem;
        }
        .recipes-error { color: #ef4444; }
        @media (max-width: 768px) {
          .recipes-layout { flex-direction: column; }
        }
      `}</style>
    </>
  );
}