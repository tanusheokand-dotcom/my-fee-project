import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { X } from "lucide-react";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import ArticleGrid from "../components/ArticleGrid";
import useArticles from "../hooks/useArticles";
import { CATEGORIES } from "../data/articles";

const PAGE_SIZE = 6;

export default function Explore() {
  const { articles, loading, error } = useArticles();
  const [params, setParams] = useSearchParams();
  const [visible, setVisible] = useState(PAGE_SIZE);

  const q = params.get("q") || "";
  const category = params.get("category") || "All";
  const tag = params.get("tag") || "";
  const sort = params.get("sort") || "latest";

  const updateParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (!value || value === "All" || (key === "sort" && value === "latest")) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setParams(next, { replace: true });
    setVisible(PAGE_SIZE);
  };

  const allTags = useMemo(
    () => [...new Set(articles.flatMap((a) => a.tags))].sort(),
    [articles]
  );

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    return articles
      .filter((a) => category === "All" || a.category === category)
      .filter((a) => !tag || a.tags.includes(tag))
      .filter((a) => {
        if (!term) return true;
        return (
          a.title.toLowerCase().includes(term) ||
          a.content.toLowerCase().includes(term) ||
          a.author.toLowerCase().includes(term) ||
          a.tags.some((t) => t.toLowerCase().includes(term))
        );
      })
      .sort((a, b) =>
        sort === "oldest"
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date)
      );
  }, [articles, q, category, tag, sort]);

  const shown = results.slice(0, visible);

  return (
    <div className="container page">
      <h1>Explore articles</h1>
      <p className="muted">Search, filter and sort every published story.</p>

      {error && <div className="alert error" role="alert">{error}</div>}

      <div className="toolbar">
        <SearchBar value={q} onChange={(v) => updateParam("q", v)} />
        <label className="select-wrap">
          <span className="sr-only">Sort articles</span>
          <select value={sort} onChange={(e) => updateParam("sort", e.target.value)}>
            <option value="latest">Latest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </label>
      </div>

      <CategoryFilter
        categories={CATEGORIES}
        active={category}
        onChange={(c) => updateParam("category", c)}
      />

      <div className="chips tags" aria-label="Filter by tag">
        {allTags.map((t) => (
          <button
            key={t}
            className={`chip small ${tag === t ? "active" : ""}`}
            onClick={() => updateParam("tag", tag === t ? "" : t)}
          >
            #{t}
          </button>
        ))}
        {tag && (
          <button className="chip small clear" onClick={() => updateParam("tag", "")}>
            <X size={12} /> Clear tag
          </button>
        )}
      </div>

      {!loading && (
        <p className="muted result-count">
          {results.length} article{results.length === 1 ? "" : "s"} found
        </p>
      )}

      <ArticleGrid
        articles={shown}
        loading={loading}
        emptyTitle="No matching articles"
        emptyText="We couldn't find anything for that search. Try different keywords or clear your filters."
      />

      {!loading && results.length > visible && (
        <div className="center">
          <button className="btn btn-ghost" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
            Load more
          </button>
        </div>
      )}
    </div>
  );
}