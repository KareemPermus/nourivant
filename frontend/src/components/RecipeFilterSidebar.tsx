interface Props {
  categories: string[];
  selected: string;
  onSelect: (c: string) => void;
}

export default function RecipeFilterSidebar({ categories, selected, onSelect }: Props) {
  return (
    <aside className="filter-sidebar">
      <h3 className="filter-title">Categories</h3>
      <button
        className={`filter-btn ${selected === '' ? 'active' : ''}`}
        onClick={() => onSelect('')}
      >
        All
      </button>
      {categories.map(c => (
        <button
          key={c}
          className={`filter-btn ${selected === c ? 'active' : ''}`}
          onClick={() => onSelect(c)}
        >
          {c}
        </button>
      ))}
      <style jsx>{`
        .filter-sidebar {
          width: 180px; flex-shrink: 0;
        }
        .filter-title {
          font-size: 0.75rem; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.05em; color: #78716c; margin-bottom: 12px;
        }
        .filter-btn {
          display: block; width: 100%; text-align: left;
          padding: 8px 12px; border-radius: 8px; border: none; background: transparent;
          font-size: 0.875rem; color: #57534e; cursor: pointer; margin-bottom: 2px;
          transition: background 0.12s;
        }
        .filter-btn:hover { background: #f5f5f4; }
        .filter-btn.active { background: #ecfdf5; color: #059669; font-weight: 500; }
        @media (max-width: 768px) {
          .filter-sidebar {
            width: 100%; display: flex; gap: 8px; flex-wrap: wrap;
          }
          .filter-btn { width: auto; }
        }
      `}</style>
    </aside>
  );
}