import { Link } from "react-router-dom";
import { Folder } from "lucide-react";
import useArticles from "../hooks/useArticles";
import { CATEGORIES } from "../data/articles";

export default function Categories() {
  const { articles, loading } = useArticles();

  return (
    <div className="container page">
      <h1>Categories</h1>
      <p className="muted">Pick a topic and dive in.</p>

      <div className="grid category-grid">
        {CATEGORIES.map((c) => {
          const count = articles.filter((a) => a.category === c).length;
          return (
            <Link
              key={c}
              to={`/explore?category=${encodeURIComponent(c)}`}
              className="category-card"
            >
              <Folder size={26} />
              <h3>{c}</h3>
              <p className="muted">
                {loading ? "Loading..." : `${count} article${count === 1 ? "" : "s"}`}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}