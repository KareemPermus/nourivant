import { useEffect, useState } from 'react';
import Link from 'next/link';
import apiClient from '@/api/client';
import { Recipe } from '@/types';
import { Clock, ChefHat, BookOpen, TrendingUp, ArrowRight, Plus, Sparkles } from 'lucide-react';
import styles from '@/styles/home.module.css';

interface Stats {
  total_recipes: number;
  recent_count: number;
  categories: string[];
}

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      apiClient.get('/api/recipes'),
      apiClient.get('/api/stats'),
    ])
      .then(([recipesRes, statsRes]) => {
        setRecipes(recipesRes.data || []);
        setStats(statsRes.data || null);
      })
      .catch(() => setError('Failed to load data'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingWrap}>
        <div className={styles.spinner} />
        <p>Loading your kitchen…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorWrap}>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className={styles.retryBtn}>Retry</button>
      </div>
    );
  }

  const featured = recipes.slice(0, 3);
  const recent = recipes.slice(0, 3);

  const statCards = [
    { label: 'Total Recipes', value: stats?.total_recipes ?? 0, icon: <BookOpen size={18} />, color: '#F97316' },
    { label: 'Categories', value: stats?.categories?.length ?? 0, icon: <ChefHat size={18} />, color: '#10b981' },
    { label: 'Added Recently', value: stats?.recent_count ?? 0, icon: <TrendingUp size={18} />, color: '#6366f1' },
    { label: 'Avg Cook Time', value: recipes.length ? Math.round(recipes.reduce((s, r) => s + (r.cook_time || 0), 0) / recipes.length) + ' min' : '—', icon: <Clock size={18} />, color: '#ec4899' },
  ];

  const placeholderImages = [
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=60',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=60',
    'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&q=60',
  ];

  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroText}>
          <h1 className={styles.heroTitle}>Welcome to Nourivant 🌿</h1>
          <p className={styles.heroSub}>Your personal recipe library — browse, create, and organize meals effortlessly.</p>
        </div>
        <div className={styles.heroActions}>
          <Link href="/recipes" className={styles.btnOutline}>
            <Sparkles size={16} className={styles.iconAccent} /> Browse Recipes
          </Link>
          <Link href="/addrecipe" className={styles.btnPrimary}>
            <Plus size={16} /> Add Recipe
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        {statCards.map((s) => (
          <div key={s.label} className={styles.statCard}>
            <div className={styles.statIcon} style={{ backgroundColor: s.color + '18', color: s.color }}>
              {s.icon}
            </div>
            <div>
              <p className={styles.statLabel}>{s.label}</p>
              <p className={styles.statValue}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Featured / Recent */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Recent Recipes</h2>
          <Link href="/recipes" className={styles.seeAll}>
            Browse all <ArrowRight size={14} />
          </Link>
        </div>

        {featured.length === 0 ? (
          <div className={styles.empty}>
            <p>No recipes yet. <Link href="/addrecipe" className={styles.linkAccent}>Create your first recipe!</Link></p>
          </div>
        ) : (
          <div className={styles.recipeGrid}>
            {featured.map((r, i) => (
              <Link href={`/recipes`} key={r.id} className={styles.recipeCard}>
                <img
                  src={r.image_url || placeholderImages[i % placeholderImages.length]}
                  alt={r.title}
                  className={styles.recipeImg}
                />
                <div className={styles.recipeInfo}>
                  {r.category && <span className={styles.badge}>{r.category}</span>}
                  <p className={styles.recipeTitle}>{r.title}</p>
                  <p className={styles.recipeMeta}>
                    {r.prep_time ? `${r.prep_time} min prep` : ''}{r.prep_time && r.cook_time ? ' · ' : ''}{r.cook_time ? `${r.cook_time} min cook` : ''}
                    {r.servings ? ` · ${r.servings} servings` : ''}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Categories */}
      {stats?.categories && stats.categories.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Categories</h2>
          <div className={styles.catWrap}>
            {stats.categories.map((c) => (
              <Link href="/recipes" key={c} className={styles.catChip}>{c}</Link>
            ))}
          </div>
        </div>
      )}

      <footer className={styles.footer}>Nourivant · Plan smarter, eat better. © 2025</footer>
    </div>
  );
}