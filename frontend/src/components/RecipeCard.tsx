import Link from 'next/link';
import { Recipe } from '@/types';
import { FiClock, FiUsers } from 'react-icons/fi';

interface Props {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: Props) {
  const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);

  return (
    <Link href={`/recipes/${recipe.id}`} className="recipe-card-link" style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="recipe-card">
        <div className="recipe-card-img-wrap">
          {recipe.image_url ? (
            <img src={recipe.image_url} alt={recipe.title} className="recipe-card-img" />
          ) : (
            <div className="recipe-card-img-placeholder">🍽️</div>
          )}
          {recipe.category && <span className="recipe-card-badge">{recipe.category}</span>}
        </div>
        <div className="recipe-card-body">
          <h3 className="recipe-card-title">{recipe.title}</h3>
          {recipe.description && (
            <p className="recipe-card-desc">{recipe.description}</p>
          )}
          <div className="recipe-card-meta">
            {totalTime > 0 && (
              <span className="recipe-card-meta-item">
                <FiClock size={14} /> {totalTime} min
              </span>
            )}
            {recipe.servings && (
              <span className="recipe-card-meta-item">
                <FiUsers size={14} /> {recipe.servings} servings
              </span>
            )}
          </div>
        </div>

        <style jsx>{`
          .recipe-card {
            border-radius: 16px; border: 1px solid #e7e5e4; background: #fff;
            overflow: hidden; transition: box-shadow 0.2s, transform 0.15s; cursor: pointer;
          }
          .recipe-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.08); transform: translateY(-2px); }
          .recipe-card-img-wrap { position: relative; height: 160px; background: #f5f5f4; }
          .recipe-card-img { width: 100%; height: 100%; object-fit: cover; }
          .recipe-card-img-placeholder {
            width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;
            font-size: 2.5rem; background: #fafaf9;
          }
          .recipe-card-badge {
            position: absolute; top: 10px; left: 10px;
            padding: 2px 10px; border-radius: 999px;
            background: #ecfdf5; color: #059669; font-size: 0.75rem; font-weight: 500;
          }
          .recipe-card-body { padding: 16px; }
          .recipe-card-title { font-size: 1rem; font-weight: 600; margin: 0 0 4px; }
          .recipe-card-desc {
            font-size: 0.8125rem; color: #78716c; margin: 0 0 12px;
            display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
          }
          .recipe-card-meta { display: flex; gap: 16px; }
          .recipe-card-meta-item {
            display: flex; align-items: center; gap: 4px;
            font-size: 0.8125rem; color: #a8a29e;
          }
        `}</style>
      </div>
    </Link>
  );
}