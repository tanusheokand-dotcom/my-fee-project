import { Link } from "react-router-dom";
import { SearchX } from "lucide-react";
import ArticleCard from "./ArticleCard";

export default function ArticleGrid({
  articles,
  loading,
  emptyTitle = "No articles found",
  emptyText = "Try a different search or filter.",
}) {
  if (loading) {
    return (
      <div className="grid" aria-busy="true" aria-label="Loading articles">
        {Array.from({ length: 6 }).map((_, i) => (
          <div className="card skeleton-card" key={i}>
            <div className="skeleton" style={{ height: 180 }} />
            <div className="card-body">
              <div className="skeleton" style={{ height: 14, width: "40%" }} />
              <div className="skeleton" style={{ height: 22, width: "90%" }} />
              <div className="skeleton" style={{ height: 14, width: "70%" }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="empty-state">
        <SearchX size={40} />
        <h3>{emptyTitle}</h3>
        <p className="muted">{emptyText}</p>
        <Link to="/explore" className="btn btn-ghost">Browse all articles</Link>
      </div>
    );
  }

  return (
    <div className="grid">
      {articles.map((a) => (
        <ArticleCard key={a.id} article={a} />
      ))}
    </div>
  );
}