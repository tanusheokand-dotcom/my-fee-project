import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import ArticleGrid from "../components/ArticleGrid";
import useArticles from "../hooks/useArticles";
import { CATEGORIES } from "../data/articles";

export default function Home() {
  const navigate = useNavigate();
  const { articles, loading, error } = useArticles();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const featured = useMemo(
    () => articles.filter((a) => a.featured).slice(0, 3),
    [articles]
  );

  const latest = useMemo(() => {
    const list =
      category === "All" ? articles : articles.filter((a) => a.category === category);
    return list.slice(0, 6);
  }, [articles, category]);

  const goSearch = (value) => {
    const q = value.trim();
    navigate(q ? `/explore?q=${encodeURIComponent(q)}` : "/explore");
  };

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <p className="eyebrow">Welcome to InkSpace</p>
          <h1>Ideas Worth Sharing.</h1>
          <p className="hero-sub">
            Read thoughtful stories on code, careers, AI and everyday life, or
            start writing your own.
          </p>
          <SearchBar value={query} onChange={setQuery} onSubmit={goSearch} />
        </div>
      </section>

      <div className="container">
        {error && <div className="alert error" role="alert">{error}</div>}

        <section className="section">
          <div className="section-head">
            <h2>Featured</h2>
          </div>
          <ArticleGrid articles={featured} loading={loading} />
        </section>

        <section className="section">
          <div className="section-head">
            <h2>Latest articles</h2>
            <Link to="/explore" className="link-arrow">
              View all <ArrowRight size={16} />
            </Link>
          </div>
          <CategoryFilter
            categories={CATEGORIES}
            active={category}
            onChange={setCategory}
          />
          <ArticleGrid
            articles={latest}
            loading={loading}
            emptyTitle="Nothing here yet"
            emptyText="No articles in this category right now."
          />
        </section>
      </div>
    </>
  );
}