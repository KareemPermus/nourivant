import { useEffect, useState } from 'react';
import Link from 'next/link';
import apiClient from '@/api/client';
import { Recipe } from '@/types';
import { Clock, ChefHat, Layers, TrendingUp, ArrowRight, Plus, Sparkles } from 'lucide-react';
import styles from '@/components/home/HomePage.module.css';

interface Stats {
  total_recipes: number;
  recent_count: number;
  categories: string[];
}
const k = "AKIA1234567890ABCDEF";
export default function Home() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      apiClient.get('/api/stats'),
      apiClient.get('/api/recipes'),
    ])
      .then(([statsRes, recipesRes]) => {
        setStats(statsRes.data);
        setRecipes(recipesRes.data);
      })
      .catch(() => setError('Failed to load data.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingWrap}>
        <div className={styles.spinner} />
        <p className={styles.loadingText}>Loading your kitchen…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorWrap}>
        <p>{error}</p>
      </div>
    );
  }

  const recent = recipes.slice(0, 3);
  const suggested = recipes.slice(0, 3);
  const images = [
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=60',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=60',
    'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&q=60',
  ];

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.greeting}>Welcome to Nourivant 🌿</h1>
          <p className={styles.subtitle}>Your personal recipe library — browse, cook, enjoy.</p>
        </div>
        <div className={styles.headerActions}>
          <Link href="/recipes" className={styles.btnOutline}>
            <Sparkles size={16} className={styles.iconEmerald} /> Browse
          </Link>
          <Link href="/addrecipe" className={styles.btnPrimary}>
            <Plus size={16} /> Add Recipe
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}><ChefHat size={16} /> Total Recipes</div>
          <p className={styles.statValue}>{stats?.total_recipes ?? 0}</p>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}><TrendingUp size={16} /> Recently Added</div>
          <p className={styles.statValue}>{stats?.recent_count ?? 0}</p>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}><Layers size={16} /> Categories</div>
          <p className={styles.statValue}>{stats?.categories?.length ?? 0}</p>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}><Clock size={16} /> Avg Cook Time</div>
          <p className={styles.statValue}>
            {recipes.length > 0
              ? Math.round(recipes.reduce((s, r) => s + (r.cook_time || 0), 0) / recipes.length)
              : 0}
            <span className={styles.statUnit}> min</span>
          </p>
        </div>
      </div>

      <div className={styles.mainGrid}>
        {/* Recent recipes */}
        <div className={styles.sectionCard + ' ' + styles.spanTwo}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Recent Recipes</h2>
            <Link href="/recipes" className={styles.linkGreen}>
              View all <ArrowRight size={16} />
            </Link>
          </div>
          <div className={styles.mealList}>
            {recent.length === 0 && <p className={styles.emptyText}>No recipes yet. Add your first!</p>}
            {recent.map((r, i) => (
              <Link href={`/recipes`} key={r.id} className={styles.mealRow}>
                <img
                  src={r.image_url || images[i % images.length]}
                  alt={r.title}
                  className={styles.mealImg}
                />
                <div className={styles.mealInfo}>
                  {r.category && (
                    <span className={styles.badge}>{r.category}</span>
                  )}
                  <p className={styles.mealTitle}>{r.title}</p>
                  <p className={styles.mealMeta}>
                    {r.prep_time ? `${r.prep_time} min prep` : ''}
                    {r.prep_time && r.cook_time ? ' · ' : ''}
                    {r.cook_time ? `${r.cook_time} min cook` : ''}
                    {r.servings ? ` · ${r.servings} servings` : ''}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Categories</h2>
          </div>
          <ul className={styles.categoryList}>
            {(!stats?.categories || stats.categories.length === 0) && (
              <li className={styles.emptyText}>No categories yet.</li>
            )}
            {stats?.categories?.map((cat) => (
              <li key={cat} className={styles.categoryItem}>
                <span className={styles.categoryDot} />
                {cat}
              </li>
            ))}
          </ul>
          <Link href="/recipes" className={styles.categoryBtn}>Browse recipes</Link>
        </div>
      </div>

      {/* Suggested */}
      <div className={styles.sectionCard + ' ' + styles.suggestedSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Suggested for you</h2>
          <Link href="/recipes" className={styles.linkGreen}>
            Browse all <ArrowRight size={16} />
          </Link>
        </div>
        <div className={styles.suggestedGrid}>
          {suggested.map((r, i) => (
            <Link href="/recipes" key={r.id} className={styles.suggestedCard}>
              <img
                src={r.image_url || images[i % images.length]}
                alt={r.title}
                className={styles.suggestedImg}
              />
              <div className={styles.suggestedInfo}>
                <p className={styles.suggestedTitle}>{r.title}</p>
                <p className={styles.suggestedMeta}>
                  {r.cook_time ? `${r.cook_time} min` : ''}
                  {r.category ? ` · ${r.category}` : ''}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <footer className={styles.footer}>
        Nourivant · Plan smarter, eat better. © 2025
      </footer>
    </div>
  );
}
