import { Link } from "react-router-dom";
import { BookmarkX } from "lucide-react";
import ArticleCard from "../components/ArticleCard";
import { useBookmarks } from "../context/BookmarksContext";
import { getPublishedArticles } from "../utils/storage";

export default function Bookmarks() {
  const { ids } = useBookmarks();
  const saved = getPublishedArticles().filter((a) => ids.includes(a.id));

  return (
    <div className="container page">
      <h1>Your bookmarks</h1>
      <p className="muted">Stories you saved to read later. Saved in this browser.</p>

      {saved.length === 0 ? (
        <div className="empty-state">
          <BookmarkX size={44} />
          <h3>No saved articles yet</h3>
          <p className="muted">
            Tap the bookmark icon on any article and it will appear here.
          </p>
          <Link to="/explore" className="btn btn-primary">Discover articles</Link>
        </div>
      ) : (
        <div className="grid">
          {saved.map((a) => <ArticleCard key={a.id} article={a} />)}
        </div>
      )}
    </div>
  );
}