import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, FileText, Pencil, PenSquare, Trash2, Upload, Download } from "lucide-react";
import SearchBar from "../components/SearchBar";
import ConfirmDialog from "../components/ConfirmDialog";
import { useAuth } from "../context/AuthContext";
import { getUserArticles, upsertArticle, deleteArticle } from "../utils/storage";
import { formatDate, validatePublish } from "../utils/helpers";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Drafts" },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [articles, setArticles] = useState(() => getUserArticles(user.id));
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [toDelete, setToDelete] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const refresh = () => setArticles(getUserArticles(user.id));

  const stats = useMemo(() => {
    const published = articles.filter((a) => a.status === "published").length;
    return {
      total: articles.length,
      published,
      drafts: articles.length - published,
      words: articles.reduce((sum, a) => sum + a.wordCount, 0),
    };
  }, [articles]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return articles.filter((a) => {
      if (status !== "all" && a.status !== status) return false;
      if (!term) return true;
      return (
        a.title.toLowerCase().includes(term) ||
        a.category.toLowerCase().includes(term) ||
        a.tags.some((t) => t.includes(term))
      );
    });
  }, [articles, query, status]);

  const togglePublish = (article) => {
    if (article.status === "published") {
      upsertArticle({ ...article, status: "draft", updatedAt: new Date().toISOString() });
      setToast({ type: "ok", text: `"${article.title}" moved to drafts.` });
    } else {
      const errs = validatePublish(article);
      const first = Object.values(errs)[0];
      if (first) {
        setToast({ type: "error", text: `Can't publish yet: ${first} Open the editor to fix it.` });
        return;
      }
      const now = new Date().toISOString();
      upsertArticle({ ...article, status: "published", date: now, updatedAt: now });
      setToast({ type: "ok", text: `"${article.title}" is now published.` });
    }
    refresh();
  };

  const confirmDelete = () => {
    deleteArticle(toDelete.id);
    setToast({ type: "ok", text: "Article deleted." });
    setToDelete(null);
    refresh();
  };

  return (
    <div className="container page">
      <div className="write-head">
        <div>
          <h1>Dashboard</h1>
          <p className="muted">Welcome back, {user.name}. Manage your stories here.</p>
        </div>
        <Link to="/write" className="btn btn-primary"><PenSquare size={16} /> New article</Link>
      </div>

      <div className="stats">
        <div className="stat-card"><span className="muted">Total articles</span><strong>{stats.total}</strong></div>
        <div className="stat-card"><span className="muted">Published</span><strong>{stats.published}</strong></div>
        <div className="stat-card"><span className="muted">Drafts</span><strong>{stats.drafts}</strong></div>
        <div className="stat-card"><span className="muted">Words written</span><strong>{stats.words.toLocaleString()}</strong></div>
      </div>

      <div className="toolbar">
        <SearchBar value={query} onChange={setQuery} placeholder="Search your articles by title, category or tag..." />
      </div>

      <div className="chips" role="group" aria-label="Filter by status">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            className={`chip ${status === f.value ? "active" : ""}`}
            onClick={() => setStatus(f.value)}
            aria-pressed={status === f.value}
          >
            {f.label}
          </button>
        ))}
      </div>

      {articles.length === 0 ? (
        <div className="empty-state">
          <FileText size={44} />
          <h3>You haven't written anything yet</h3>
          <p className="muted">Your first story is one click away.</p>
          <Link to="/write" className="btn btn-primary">Write your first article</Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <FileText size={40} />
          <h3>No articles match</h3>
          <p className="muted">Try another search or filter.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Words</th>
                <th>Updated</th>
                <th className="right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id}>
                  <td>
                    <Link to={`/write/${a.id}`} className="row-title">{a.title}</Link>
                    <div className="muted small-text">{a.category}</div>
                  </td>
                  <td><span className={`badge ${a.status}`}>{a.status}</span></td>
                  <td>{a.wordCount}</td>
                  <td>{formatDate(a.updatedAt || a.date)}</td>
                  <td>
                    <div className="row-actions">
                      <Link to={`/write/${a.id}`} className="icon-btn small" title="Edit" aria-label={`Edit ${a.title}`}>
                        <Pencil size={14} />
                      </Link>
                      {a.status === "published" && (
                        <Link to={`/article/${a.id}`} className="icon-btn small" title="View" aria-label={`View ${a.title}`}>
                          <Eye size={14} />
                        </Link>
                      )}
                      <button
                        className="icon-btn small"
                        title={a.status === "published" ? "Unpublish" : "Publish"}
                        aria-label={`${a.status === "published" ? "Unpublish" : "Publish"} ${a.title}`}
                        onClick={() => togglePublish(a)}
                      >
                        {a.status === "published" ? <Download size={14} /> : <Upload size={14} />}
                      </button>
                      <button
                        className="icon-btn small danger"
                        title="Delete"
                        aria-label={`Delete ${a.title}`}
                        onClick={() => setToDelete(a)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {toDelete && (
        <ConfirmDialog
          title="Delete this article?"
          message={`"${toDelete.title}" will be permanently removed. This can't be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setToDelete(null)}
        />
      )}

      {toast && <div className={`toast ${toast.type === "error" ? "error" : ""}`} role="status">{toast.text}</div>}
    </div>
  );
}