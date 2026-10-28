import { getCover, handleImgError } from "../utils/cover";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Bookmark, Clock, Share2 } from "lucide-react";
import MarkdownRenderer from "../components/MarkdownRenderer";
import ArticleCard from "../components/ArticleCard";
import { useBookmarks } from "../context/BookmarksContext";
import { getAllArticles, getArticleById } from "../utils/storage";
import { formatDate } from "../utils/helpers";

export default function ArticleDetails() {
  const { id } = useParams();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const [toast, setToast] = useState("");

  const article = useMemo(() => getArticleById(id), [id]);

  const related = useMemo(() => {
    if (!article) return [];
    return getAllArticles()
      .filter((a) => a.status === "published" && a.id !== article.id)
      .map((a) => ({
        a,
        score:
          (a.category === article.category ? 2 : 0) +
          a.tags.filter((t) => article.tags.includes(t)).length,
      }))
      .filter((x) => x.score > 0)
      .sort((x, y) => y.score - x.score)
      .slice(0, 3)
      .map((x) => x.a);
  }, [article]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  if (!article || article.status !== "published") {
    return (
      <div className="container page empty-state">
        <h2>Article not found</h2>
        <p className="muted">It may have been removed or is still a draft.</p>
        <Link to="/explore" className="btn btn-primary">Back to articles</Link>
      </div>
    );
  }

  const saved = isBookmarked(article.id);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: article.title, text: article.description, url });
      } else {
        await navigator.clipboard.writeText(url);
        setToast("Link copied to clipboard");
      }
    } catch {
      // User cancelled sharing, nothing to do
    }
  };

  return (
    <div className="container page">
      <Link to="/explore" className="back-link">
        <ArrowLeft size={16} /> Back to articles
      </Link>

      <article className="article">
        <span className="badge">{article.category}</span>
        <h1>{article.title}</h1>
        <p className="lead">{article.description}</p>

        <div className="article-meta">
          <div className="meta">
            <span className="avatar">{article.author.charAt(0)}</span>
            <strong>{article.author}</strong>
            <span>·</span>
            <span>{formatDate(article.date)}</span>
            <span>·</span>
            <span className="inline"><Clock size={14} /> {article.readingTime} min read</span>
          </div>
          <div className="actions">
            <button
              className={`btn btn-ghost ${saved ? "saved" : ""}`}
              onClick={() => toggleBookmark(article.id)}
              aria-pressed={saved}
            >
              <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
              {saved ? "Saved" : "Bookmark"}
            </button>
            <button className="btn btn-ghost" onClick={handleShare}>
              <Share2 size={16} /> Share
            </button>
          </div>
        </div>

        <img
  className="cover"
  src={getCover(article)}
  alt={`Cover for ${article.title}`}
  onError={(e) => handleImgError(e, article)}
/>

        <MarkdownRenderer content={article.content} />

        <div className="chips tags">
          {article.tags.map((t) => (
            <Link key={t} to={`/explore?tag=${t}`} className="chip small">#{t}</Link>
          ))}
        </div>
      </article>

      {related.length > 0 && (
        <section className="section">
          <div className="section-head"><h2>Related articles</h2></div>
          <div className="grid">
            {related.map((a) => <ArticleCard key={a.id} article={a} />)}
          </div>
        </section>
      )}

      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}