export default function CategoryFilter({ categories, active, onChange }) {
  return (
    <div className="chips" role="group" aria-label="Filter by category">
      {["All", ...categories].map((c) => (
        <button
          key={c}
          className={`chip ${active === c ? "active" : ""}`}
          onClick={() => onChange(c)}
          aria-pressed={active === c}
        >
          {c}
        </button>
      ))}
    </div>
  );
}