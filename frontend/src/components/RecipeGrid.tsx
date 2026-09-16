import { Recipe } from '@/types';
import RecipeCard from '@/components/RecipeCard';

interface Props {
  recipes: Recipe[];
}

export default function RecipeGrid({ recipes }: Props) {
  return (
    <div className="recipe-grid">
      {recipes.map(r => (
        <RecipeCard key={r.id} recipe={r} />
      ))}
      <style jsx>{`
        .recipe-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 20px;
        }
        @media (min-width: 640px) {
          .recipe-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 1024px) {
          .recipe-grid { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>
    </div>
  );
}