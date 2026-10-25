import { Search, X } from "lucide-react";

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = "Search by title, content, author or tag...",
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(value);
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit} role="search">
      <Search size={18} className="search-icon" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search articles"
      />
      {value && (
        <button
          type="button"
          className="clear-btn"
          onClick={() => onChange("")}
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </form>
  );
}