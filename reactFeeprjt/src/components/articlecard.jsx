import { Link } from "react-router-dom";
import { Bookmark, Clock } from "lucide-react";
import { useBookmarks } from "../context/BookmarksContext";
import { formatDate } from "../utils/helpers";

const FALLBACK = "https://picsum.photos/seed/inkspace-fallback/1200/700";

export default function ArticleCard({ article }) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const saved = isBookmarked(article.id);

  return (
    <article className="card">
      <Link to={`/article/${article.id}`} className="card-image">
        <img
          src={article.coverImage || FALLBACK}
          alt=""
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = FALLBACK;
          }}
        />
      </Link>

      <div className="card-body">
        <div className="card-top">
          <span className="badge">{article.category}</span>
          <button
            className={`icon-btn small ${saved ? "saved" : ""}`}
            onClick={() => toggleBookmark(article.id)}
            aria-label={saved ? "Remove bookmark" : "Bookmark article"}
            aria-pressed={saved}
          >
            <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
          </button>
        </div>

        <h3>
          <Link to={`/article/${article.id}`}>{article.title}</Link>
        </h3>
        <p className="muted clamp">{article.description}</p>

        <div className="meta">
          <span className="avatar">{article.author.charAt(0)}</span>
          <span>{article.author}</span>
          <span>·</span>
          <span>{formatDate(article.date)}</span>
          <span>·</span>
          <span className="inline">
            <Clock size={13} /> {article.readingTime} min
          </span>
        </div>
      </div>
    </article>
  );
}