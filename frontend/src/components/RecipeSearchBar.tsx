import { FiSearch } from 'react-icons/fi';

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function RecipeSearchBar({ value, onChange }: Props) {
  return (
    <div className="recipe-search-wrapper">
      <FiSearch className="recipe-search-icon" />
      <input
        type="text"
        placeholder="Search recipes…"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="recipe-search-input"
      />
      <style jsx>{`
        .recipe-search-wrapper {
          position: relative; margin-bottom: 24px; max-width: 480px;
        }
        .recipe-search-input {
          width: 100%; padding: 10px 12px 10px 40px; border-radius: 12px;
          border: 1px solid #e7e5e4; background: #fff; font-size: 0.875rem;
          outline: none; transition: border-color 0.15s;
        }
        .recipe-search-input:focus { border-color: #10b981; box-shadow: 0 0 0 2px rgba(16,185,129,0.15); }
      `}</style>
      <style jsx global>{`
        .recipe-search-icon {
          position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
          color: #a8a29e; width: 16px; height: 16px; pointer-events: none;
        }
      `}</style>
    </div>
  );
}