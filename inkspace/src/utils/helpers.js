export function countWords(text = "") {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

export function calcReadingTime(text = "") {
  return Math.max(1, Math.ceil(countWords(text) / 200));
}

export function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function slugify(text = "") {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
}

export function makeId(title) {
  return `${slugify(title) || "untitled"}-${Date.now().toString(36)}`;
}

export function parseTags(text = "") {
  const tags = text
    .split(",")
    .map((t) => t.trim().toLowerCase().replace(/^#/, "").replace(/\s+/g, "-"))
    .filter(Boolean);
  return [...new Set(tags)].slice(0, 6);
}

export function isValidUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

// Drafts only need a title (and a valid cover URL if one is given)
export function validateDraft({ title, coverImage }) {
  const errors = {};
  if (!title || !title.trim()) errors.title = "Add a title before saving.";
  if (coverImage && !isValidUrl(coverImage)) {
    errors.coverImage = "Enter a valid URL starting with http:// or https://";
  }
  return errors;
}

// Publishing has stricter rules. `tags` must be an array.
export function validatePublish({ title, description, category, tags, content, coverImage }) {
  const errors = {};
  if (!title || title.trim().length < 5) errors.title = "Title must be at least 5 characters.";
  if (!description || description.trim().length < 20)
    errors.description = "Add a short description (at least 20 characters).";
  if (!category) errors.category = "Choose a category.";
  if (!tags || tags.length === 0) errors.tags = "Add at least one tag.";
  if (countWords(content) < 30) errors.content = "Write at least 30 words before publishing.";
  if (coverImage && !isValidUrl(coverImage))
    errors.coverImage = "Enter a valid URL starting with http:// or https://";
  return errors;
}