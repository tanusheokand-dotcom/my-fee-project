import seedArticles from "../data/articles";
import { DEMO_USER, DEMO_ARTICLES } from "../data/demoUser";
import { countWords, calcReadingTime } from "./helpers";

export const KEYS = {
  articles: "inkspace_articles", // articles written by users
  bookmarks: "inkspace_bookmarks",
  theme: "inkspace_theme",
  users: "inkspace_users",
  session: "inkspace_session",
  autosavePrefix: "inkspace_autosave_",
};

/* ---------- Generic helpers ---------- */

export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function remove(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

/* ---------- Articles ---------- */

const withMeta = (a) => ({
  ...a,
  wordCount: countWords(a.content),
  readingTime: calcReadingTime(a.content),
});

export function getAllArticles() {
  const mine = load(KEYS.articles, []);
  return [...mine, ...seedArticles].map(withMeta);
}

export function getPublishedArticles() {
  return getAllArticles()
    .filter((a) => a.status === "published")
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getArticleById(id) {
  return getAllArticles().find((a) => a.id === id) || null;
}

export function getUserArticles(userId) {
  return load(KEYS.articles, [])
    .filter((a) => a.authorId === userId)
    .map(withMeta)
    .sort(
      (a, b) =>
        new Date(b.updatedAt || b.date) - new Date(a.updatedAt || a.date)
    );
}

export function getUserArticleById(id, userId) {
  return getUserArticles(userId).find((a) => a.id === id) || null;
}

// Insert a new article or replace an existing one with the same id
export function upsertArticle(article) {
  // wordCount/readingTime are calculated on read, so don't store them
  // eslint-disable-next-line no-unused-vars
  const { wordCount, readingTime, ...raw } = article;
  const list = load(KEYS.articles, []);
  const index = list.findIndex((a) => a.id === raw.id);
  const next = index >= 0 ? list.map((a, i) => (i === index ? raw : a)) : [raw, ...list];
  return save(KEYS.articles, next);
}

export function deleteArticle(id) {
  const list = load(KEYS.articles, []);
  return save(KEYS.articles, list.filter((a) => a.id !== id));
}

/* ---------- Demo auth (NOT secure, for learning only) ---------- */

export function getUsers() {
  return load(KEYS.users, []);
}

export function saveUsers(users) {
  return save(KEYS.users, users);
}

export function getSessionUserId() {
  return load(KEYS.session, null);
}

export function setSessionUserId(id) {
  if (id) save(KEYS.session, id);
  else remove(KEYS.session);
}

// Creates the demo account and its starter articles on the very first visit
export function seedDemoData() {
  if (load(KEYS.users, null)) return;
  save(KEYS.users, [DEMO_USER]);
  save(KEYS.articles, [...DEMO_ARTICLES, ...load(KEYS.articles, [])]);
}