import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, AlertCircle, Info, Save, Send } from "lucide-react";
import FormField from "../components/FormField";
import MarkdownEditor from "../components/MarkdownEditor";
import { useAuth } from "../context/AuthContext";
import { CATEGORIES } from "../data/articles";
import { KEYS, load, save, remove, getUserArticleById, upsertArticle } from "../utils/storage";
import {
  countWords,
  calcReadingTime,
  parseTags,
  makeId,
  validatePublish,
  validateDraft,
} from "../utils/helpers";

const EMPTY_FORM = {
  title: "",
  description: "",
  category: CATEGORIES[0],
  tags: "",
  coverImage: "",
  content: "",
};

const articleToForm = (a) => ({
  title: a.title,
  description: a.description,
  category: a.category,
  tags: a.tags.join(", "),
  coverImage: a.coverImage || "",
  content: a.content,
});

// Runs once when the page opens: loads the saved article and any autosaved draft
function buildInitial(routeId, userId) {
  const key = `${KEYS.autosavePrefix}${userId}_${routeId || "new"}`;
  const existing = routeId ? getUserArticleById(routeId, userId) : null;
  if (routeId && !existing) return { notFound: true, key };

  const base = existing ? articleToForm(existing) : EMPTY_FORM;
  const auto = load(key, null);
  const restored = !!auto && JSON.stringify(auto) !== JSON.stringify(base);

  return { key, existing, base, form: restored ? auto : base, restored };
}

export default function WriteArticle() {
  const { id: routeId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [init] = useState(() => buildInitial(routeId, user.id));
  const [form, setForm] = useState(init.form || EMPTY_FORM);
  const [existing, setExisting] = useState(init.existing || null);
  const [dirty, setDirty] = useState(false);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState(location.state?.notice || null);
  const [restored, setRestored] = useState(!!init.restored);
  const [autosavedAt, setAutosavedAt] = useState(null);

  // Autosave to LocalStorage 0.8s after the user stops typing
  useEffect(() => {
    if (!dirty || init.notFound) return;
    const timer = setTimeout(() => {
      if (save(init.key, form)) setAutosavedAt(new Date());
    }, 800);
    return () => clearTimeout(timer);
  }, [form, dirty, init]);

  if (init.notFound) {
    return (
      <div className="container page empty-state">
        <h2>Article not found</h2>
        <p className="muted">It doesn't exist, or it belongs to another account.</p>
        <Link to="/dashboard" className="btn btn-primary">Back to dashboard</Link>
      </div>
    );
  }

  const update = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setDirty(true);
    setNotice(null);
  };

  const words = countWords(form.content);
  const readingTime = calcReadingTime(form.content);
  const tagList = parseTags(form.tags);

  const discardRestored = () => {
    setForm(init.base);
    remove(init.key);
    setRestored(false);
    setDirty(false);
  };

  const persist = (status) => {
    const clean = {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      tags: parseTags(form.tags),
      coverImage: form.coverImage.trim(),
      content: form.content,
    };

    const errs = status === "published" ? validatePublish(clean) : validateDraft(clean);
    setErrors(errs);
    if (Object.keys(errs).length) {
      setNotice({ type: "error", text: "Please fix the highlighted fields and try again." });
      return;
    }

    const id = existing?.id || makeId(clean.title);
    const now = new Date().toISOString();

    const article = {
      ...(existing || {}),
      ...clean,
      id,
      author: user.name,
      authorId: user.id,
      status,
      featured: existing?.featured || false,
      coverImage: clean.coverImage,
      createdAt: existing?.createdAt || now,
      updatedAt: now,
      // keep the original publish date when updating an already-published article
      date:
        status === "published"
          ? existing?.status === "published" ? existing.date : now
          : existing?.date || now,
    };

    if (!upsertArticle(article)) {
      setNotice({
        type: "error",
        text: "Couldn't save. Browser storage may be full or disabled.",
      });
      return;
    }

    remove(init.key);
    setDirty(false);
    setAutosavedAt(null);
    setRestored(false);

    const nextNotice = {
      type: "success",
      text: status === "published" ? "Article published successfully!" : "Draft saved.",
      link: status === "published" ? `/article/${id}` : null,
    };

    if (!existing) {
      // First save: move to /write/:id so later saves update this article
      navigate(`/write/${id}`, { replace: true, state: { notice: nextNotice } });
    } else {
      setExisting(article);
      setNotice(nextNotice);
    }
  };

  const isPublished = existing?.status === "published";

  return (
    <div className="container page">
      <div className="write-head">
        <div>
          <h1>{existing ? "Edit article" : "Write a new article"}</h1>
          <p className="muted">Format with Markdown. Your work autosaves as you type.</p>
        </div>
        {existing && <span className={`badge ${existing.status}`}>{existing.status}</span>}
      </div>

      {restored && (
        <div className="alert info row" role="status">
          <Info size={18} />
          <span>We restored your unsaved changes from last time.</span>
          <button className="text-btn" onClick={discardRestored}>Discard them</button>
        </div>
      )}

      {notice && (
        <div className={`alert ${notice.type} row`} role="status">
          {notice.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{notice.text}</span>
          {notice.link && <Link to={notice.link} className="text-link">View article</Link>}
        </div>
      )}

      <div className="form-grid">
        <div className="span-2">
          <FormField id="title" label="Title" error={errors.title}>
            <input
              id="title"
              value={form.title}
              maxLength={120}
              onChange={(e) => update("title", e.target.value)}
              placeholder="A headline that makes people curious"
              aria-invalid={!!errors.title}
            />
          </FormField>
        </div>

        <div className="span-2">
          <FormField id="description" label="Subtitle / short description" error={errors.description}>
            <input
              id="description"
              value={form.description}
              maxLength={200}
              onChange={(e) => update("description", e.target.value)}
              placeholder="One or two sentences that summarize the article"
              aria-invalid={!!errors.description}
            />
          </FormField>
        </div>

        <FormField id="category" label="Category" error={errors.category}>
          <select id="category" value={form.category} onChange={(e) => update("category", e.target.value)}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </FormField>

        <FormField id="coverImage" label="Cover image URL (optional)" error={errors.coverImage} hint="Leave empty to get an automatic cover.">
          <input
            id="coverImage"
            value={form.coverImage}
            onChange={(e) => update("coverImage", e.target.value)}
            placeholder="https://..."
            aria-invalid={!!errors.coverImage}
          />
        </FormField>

        <div className="span-2">
          <FormField id="tags" label="Tags" error={errors.tags} hint="Separate with commas. Up to 6 tags.">
            <input
              id="tags"
              value={form.tags}
              onChange={(e) => update("tags", e.target.value)}
              placeholder="react, beginners, tips"
              aria-invalid={!!errors.tags}
            />
          </FormField>
          {tagList.length > 0 && (
            <div className="chips tags">
              {tagList.map((t) => <span key={t} className="chip small">#{t}</span>)}
            </div>
          )}
        </div>
      </div>

      <label className="editor-label" htmlFor="content">Content</label>
      <MarkdownEditor
        value={form.content}
        onChange={(v) => update("content", v)}
        hasError={!!errors.content}
      />
      {errors.content && <small className="field-error" role="alert">{errors.content}</small>}

      <div className="write-footer">
        <div className="muted write-stats">
          <strong>{words}</strong> word{words === 1 ? "" : "s"} · ~{readingTime} min read
          {autosavedAt && (
            <span> · Autosaved {autosavedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          )}
        </div>
        <div className="write-actions">
          <button className="btn btn-ghost" onClick={() => persist("draft")}>
            <Save size={16} /> {isPublished ? "Revert to draft" : "Save draft"}
          </button>
          <button className="btn btn-primary" onClick={() => persist("published")}>
            <Send size={16} /> {isPublished ? "Update article" : "Publish article"}
          </button>
        </div>
      </div>
    </div>
  );
}