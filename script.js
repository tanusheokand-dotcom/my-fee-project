/* =========================================================
   INKSPACE — SHARED SCRIPT
   Sections:
   1. Utilities (storage, dates, toasts, modals)
   2. Mock data (articles, users, comments seed)
   3. Theme + navbar (runs on every page)
   4. Home page
   5. Explore page
   6. Article page (content render, TOC, comments)
   7. Write page (editor, toolbar, autosave)
   8. My Posts page
   9. Bookmarks page
   10. Profile page
   11. Settings page
   12. Boot
   ========================================================= */

/* ---------- 1. UTILITIES ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const Store = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage write failed', e);
    }
  }
};

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(iso);
}

function wordsIn(str) {
  const clean = str.trim();
  return clean ? clean.split(/\s+/).length : 0;
}

function readingTimeFromWords(wordCount) {
  return Math.max(1, Math.round(wordCount / 200));
}

function uid(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function escapeHtml(str = '') {
  return str.replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

/* Toasts */
function ensureToastContainer() {
  let c = $('.toast-container');
  if (!c) {
    c = document.createElement('div');
    c.className = 'toast-container';
    document.body.appendChild(c);
  }
  return c;
}
function showToast(message, type = 'default') {
  const c = ensureToastContainer();
  const toast = document.createElement('div');
  toast.className = `toast ${type === 'default' ? '' : type}`;
  toast.textContent = message;
  c.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity .25s ease';
    setTimeout(() => toast.remove(), 250);
  }, 2600);
}

/* Modal (confirm dialogs) */
function ensureModalOverlay() {
  let o = $('.modal-overlay');
  if (!o) {
    o = document.createElement('div');
    o.className = 'modal-overlay';
    o.innerHTML = `<div class="modal-box">
      <h3 id="modalTitle"></h3>
      <p id="modalDesc"></p>
      <div class="modal-actions">
        <button class="btn btn-ghost" id="modalCancel">Cancel</button>
        <button class="btn btn-danger" id="modalConfirm">Confirm</button>
      </div>
    </div>`;
    document.body.appendChild(o);
    o.addEventListener('click', (e) => { if (e.target === o) closeConfirm(); });
  }
  return o;
}
function closeConfirm() {
  const o = $('.modal-overlay');
  if (o) o.classList.remove('open');
}
function openConfirm({ title, desc, confirmLabel = 'Delete', onConfirm }) {
  const o = ensureModalOverlay();
  $('#modalTitle', o).textContent = title;
  $('#modalDesc', o).textContent = desc;
  const confirmBtn = $('#modalConfirm', o);
  confirmBtn.textContent = confirmLabel;
  const cancelBtn = $('#modalCancel', o);
  const newConfirm = confirmBtn.cloneNode(true);
  confirmBtn.parentNode.replaceChild(newConfirm, confirmBtn);
  newConfirm.addEventListener('click', () => { onConfirm(); closeConfirm(); });
  cancelBtn.onclick = closeConfirm;
  o.classList.add('open');
}

/* ---------- 2. MOCK DATA ---------- */
const AUTHORS = {
  maya: { name: 'Maya Chen', username: '@mayachen', avatar: 'https://i.pravatar.cc/100?img=47', bio: 'Frontend engineer writing about design systems, CSS and the craft of building interfaces.', followers: 3200, social: { twitter: '#', github: '#', website: '#' } },
  arjun: { name: 'Arjun Mehta', username: '@arjunm', avatar: 'https://i.pravatar.cc/100?img=12', bio: 'Backend engineer and occasional writer on distributed systems.', followers: 1800, social: { twitter: '#', github: '#' } },
  lena: { name: 'Lena Kowalski', username: '@lenak', avatar: 'https://i.pravatar.cc/100?img=32', bio: 'AI researcher exploring practical machine learning.', followers: 5400, social: { twitter: '#', linkedin: '#' } },
  sam: { name: 'Sam Osei', username: '@samosei', avatar: 'https://i.pravatar.cc/100?img=15', bio: 'Product designer who writes about career growth in tech.', followers: 2100, social: { website: '#' } },
  you: { name: 'You', username: '@you', avatar: 'https://i.pravatar.cc/100?img=68', bio: 'Sharing what I learn about building things on the web.', followers: 128, social: {} }
};

const ARTICLE_CONTENT = `
## Introduction

Every craft has a set of quiet decisions that separate work that merely functions from work that feels considered. Writing for the web is no different — the difference often comes down to rhythm, restraint, and a willingness to cut.

This piece walks through a few of the ideas that have shaped how I approach it, with examples drawn from real projects.

## Start with structure, not decoration

Before reaching for color or imagery, it helps to ask what the page actually needs to communicate, and in what order. A clear hierarchy does more for a reader than any visual flourish.

**A few things worth checking early:**

* Does the heading structure describe the content on its own, without styling?
* Is there one clear next action, not five competing ones?
* Would removing an element change how the page reads?

> Good structure is invisible. You only notice it when it's missing.

## Writing for scanning, not just reading

Most readers scan before they commit. Short paragraphs, deliberate emphasis, and predictable patterns help someone decide quickly whether to keep going.

Here's a small snippet showing how a simple reading-time helper might be written:

\`\`\`
function readingTime(words) {
  const wordsPerMinute = 200;
  return Math.max(1, Math.round(words / wordsPerMinute));
}
\`\`\`

### Keep paragraphs short

Long unbroken paragraphs are the easiest thing to fix and the thing most often left alone. Breaking a thought into two or three sentences usually improves it.

### Use lists sparingly

1. Lists are for genuinely discrete items
2. Overusing them flattens nuance
3. A well-written paragraph often does more work than five bullet points

## Closing thoughts

None of this is a formula. The goal is simply to make the reader's path through the page a little clearer than it would otherwise be — one honest sentence at a time.

Read more on this topic at [the InkSpace style guide](#).
`;

function seedArticles() {
  const base = [
    { title: 'Designing Interfaces That Age Well', category: 'Design', author: 'maya', img: 'https://picsum.photos/seed/inkspace1/900/600', days: 1, views: 4210, likes: 312 },
    { title: 'A Practical Guide to Distributed Caching', category: 'Programming', author: 'arjun', img: 'https://picsum.photos/seed/inkspace2/900/600', days: 2, views: 2870, likes: 190 },
    { title: 'What Large Language Models Still Get Wrong', category: 'AI', author: 'lena', img: 'https://picsum.photos/seed/inkspace3/900/600', days: 3, views: 6120, likes: 540 },
    { title: 'Ten Years Into a Design Career, What I d Change', category: 'Career', author: 'sam', img: 'https://picsum.photos/seed/inkspace4/900/600', days: 4, views: 1990, likes: 158 },
    { title: 'The Modern CSS Layout Toolkit', category: 'Web Development', author: 'maya', img: 'https://picsum.photos/seed/inkspace5/900/600', days: 5, views: 3320, likes: 275 },
    { title: 'Rethinking On-call: A Calmer Approach', category: 'Technology', author: 'arjun', img: 'https://picsum.photos/seed/inkspace6/900/600', days: 6, views: 1540, likes: 98 },
    { title: 'Slow Mornings, Better Code', category: 'Lifestyle', author: 'sam', img: 'https://picsum.photos/seed/inkspace7/900/600', days: 7, views: 980, likes: 61 },
    { title: 'Fine-Tuning Small Models on a Budget', category: 'AI', author: 'lena', img: 'https://picsum.photos/seed/inkspace8/900/600', days: 8, views: 2650, likes: 203 },
    { title: 'Building a Component Library From Scratch', category: 'Programming', author: 'maya', img: 'https://picsum.photos/seed/inkspace9/900/600', days: 9, views: 3010, likes: 221 },
    { title: 'The Case for Boring Technology', category: 'Technology', author: 'arjun', img: 'https://picsum.photos/seed/inkspace10/900/600', days: 10, views: 4400, likes: 356 },
    { title: 'Negotiating Your First Design Offer', category: 'Career', author: 'sam', img: 'https://picsum.photos/seed/inkspace11/900/600', days: 11, views: 1720, likes: 132 },
    { title: 'Typography Fundamentals for Developers', category: 'Design', author: 'maya', img: 'https://picsum.photos/seed/inkspace12/900/600', days: 12, views: 2230, likes: 174 }
  ];
  return base.map((a, i) => {
    const words = wordsIn(ARTICLE_CONTENT) + 380;
    const date = new Date(Date.now() - a.days * 86400000).toISOString();
    return {
      id: `art_${i + 1}`,
      slug: a.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      title: a.title,
      description: 'A closer look at the ideas, trade-offs and small decisions behind the topic — written for people who want the practical version, not just the theory.',
      category: a.category,
      author: a.author,
      image: a.img,
      date,
      readingTime: readingTimeFromWords(words),
      views: a.views,
      likes: a.likes,
      content: ARTICLE_CONTENT
    };
  });
}

const MOCK_ARTICLES = seedArticles();

function getAllArticles() {
  const userPosts = Store.get('inkspace_posts', []).filter(p => p.status === 'published');
  const normalized = userPosts.map(p => ({
    id: p.id, slug: p.slug, title: p.title, description: p.description, category: p.category,
    author: 'you', image: p.cover || 'https://picsum.photos/seed/' + p.id + '/900/600',
    date: p.publishedAt || p.updatedAt, readingTime: p.readingTime || 1, views: p.views || 0,
    likes: p.likes || 0, content: p.body
  }));
  return [...normalized, ...MOCK_ARTICLES];
}

function findArticleById(id) {
  return getAllArticles().find(a => a.id === id);
}

/* ---------- 3. THEME + NAVBAR (every page) ---------- */
function initTheme() {
  const saved = Store.get('inkspace_theme', 'light');
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcons(saved);
}
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  Store.set('inkspace_theme', next);
  updateThemeIcons(next);
}
function updateThemeIcons(theme) {
  $$('.theme-toggle').forEach(btn => {
    btn.innerHTML = theme === 'dark' ? ICONS.sun : ICONS.moon;
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  });
}

const ICONS = {
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>'
};

function initNavbar() {
  // Highlight active link based on filename
  const page = location.pathname.split('/').pop() || 'index.html';
  $$('.nav-links a, .mobile-drawer a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) a.classList.add('active');
  });

  $$('.theme-toggle').forEach(btn => btn.addEventListener('click', toggleTheme));

  const hamburger = $('.hamburger');
  const drawer = $('.mobile-drawer');
  if (hamburger && drawer) {
    hamburger.addEventListener('click', () => drawer.classList.toggle('open'));
    $$('.mobile-drawer a').forEach(a => a.addEventListener('click', () => drawer.classList.remove('open')));
  }

  // Global search icon -> go to explore
  $$('.nav-search-btn').forEach(btn => btn.addEventListener('click', () => {
    window.location.href = 'explore.html';
  }));
}

/* Shared bookmark logic */
function getBookmarks() { return Store.get('inkspace_bookmarks', []); }
function isBookmarked(id) { return getBookmarks().includes(id); }
function toggleBookmark(id, btnEl) {
  let list = getBookmarks();
  const already = list.includes(id);
  if (already) {
    list = list.filter(x => x !== id);
    showToast('Removed from bookmarks');
  } else {
    list.push(id);
    showToast('Saved to bookmarks');
  }
  Store.set('inkspace_bookmarks', list);
  if (btnEl) btnEl.classList.toggle('active', !already);
}

/* Reusable card markup */
function bookmarkIconSvg() {
  return '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 3a2 2 0 0 0-2 2v16l8-4.5L20 21V5a2 2 0 0 0-2-2H6z"/></svg>';
}
function articleCardHtml(a) {
  const author = AUTHORS[a.author];
  const bookmarked = isBookmarked(a.id);
  return `
  <article class="article-card" data-id="${a.id}">
    <a href="article.html?id=${a.id}" class="ac-image"><img src="${a.image}" alt="${escapeHtml(a.title)}" loading="lazy"></a>
    <div class="ac-body">
      <span class="category-pill">${a.category}</span>
      <a href="article.html?id=${a.id}"><h4>${escapeHtml(a.title)}</h4></a>
      <p>${escapeHtml(a.description)}</p>
      <div class="card-meta">
        <div class="card-author">
          <img src="${author.avatar}" alt="${author.name}">
          <span>${author.name}</span>
        </div>
        <button class="bookmark-btn ${bookmarked ? 'active' : ''}" data-bookmark="${a.id}" aria-label="Bookmark">${bookmarkIconSvg()}</button>
      </div>
      <div class="card-meta" style="margin-top:8px;">
        <span>${formatDate(a.date)}</span>
        <span>${a.readingTime} min read</span>
      </div>
    </div>
  </article>`;
}
function attachBookmarkHandlers(root = document) {
  $$('[data-bookmark]', root).forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault(); e.stopPropagation();
      toggleBookmark(btn.dataset.bookmark, btn);
    });
  });
}

/* ---------- 4. HOME PAGE ---------- */
function initHomePage() {
  const featuredEl = $('#featuredArticle');
  const latestEl = $('#latestGrid');
  if (!featuredEl && !latestEl) return;

  const all = getAllArticles().sort((a, b) => new Date(b.date) - new Date(a.date));
  const featured = all[0];
  const latest = all.slice(1, 7);

  if (featuredEl && featured) {
    const author = AUTHORS[featured.author];
    const bookmarked = isBookmarked(featured.id);
    featuredEl.innerHTML = `
      <div class="fc-image">
        <img src="${featured.image}" alt="${escapeHtml(featured.title)}">
        <button class="bookmark-btn fc-bookmark ${bookmarked ? 'active' : ''}" data-bookmark="${featured.id}" aria-label="Bookmark">${bookmarkIconSvg()}</button>
      </div>
      <div class="fc-body">
        <span class="category-pill">${featured.category}</span>
        <h3><a href="article.html?id=${featured.id}">${escapeHtml(featured.title)}</a></h3>
        <p class="fc-desc">${escapeHtml(featured.description)}</p>
        <div class="card-meta" style="margin-bottom:16px;">
          <div class="card-author"><img src="${author.avatar}" alt=""><span>${author.name}</span></div>
          <span>${formatDate(featured.date)} <span class="dot-sep"></span> ${featured.readingTime} min read</span>
        </div>
        <a href="article.html?id=${featured.id}" class="btn btn-primary" style="align-self:flex-start;">Read Article</a>
      </div>`;
  }

  if (latestEl) {
    latestEl.innerHTML = latest.map(articleCardHtml).join('');
  }
  attachBookmarkHandlers();
}

/* ---------- 5. EXPLORE PAGE ---------- */
let exploreState = { query: '', category: 'All', sort: 'latest', page: 1 };
const PAGE_SIZE = 6;

function initExplorePage() {
  const grid = $('#exploreGrid');
  if (!grid) return;

  const searchInput = $('#exploreSearch');
  const chips = $$('.chip-group .chip');
  const sortSelect = $('#sortSelect');

  searchInput?.addEventListener('input', debounce(() => {
    exploreState.query = searchInput.value.trim().toLowerCase();
    exploreState.page = 1;
    renderExplore();
  }, 200));

  chips.forEach(chip => chip.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    exploreState.category = chip.dataset.category;
    exploreState.page = 1;
    renderExplore();
  }));

  sortSelect?.addEventListener('change', () => {
    exploreState.sort = sortSelect.value;
    renderExplore();
  });

  renderExplore();
}

function debounce(fn, wait) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
}

function renderExplore() {
  const grid = $('#exploreGrid');
  const countEl = $('#resultsCount');
  const pagerEl = $('#pagination');
  if (!grid) return;

  let list = getAllArticles();

  if (exploreState.category !== 'All') {
    list = list.filter(a => a.category === exploreState.category);
  }
  if (exploreState.query) {
    const q = exploreState.query;
    list = list.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q) ||
      AUTHORS[a.author].name.toLowerCase().includes(q)
    );
  }
  if (exploreState.sort === 'latest') list.sort((a, b) => new Date(b.date) - new Date(a.date));
  if (exploreState.sort === 'popular') list.sort((a, b) => b.likes - a.likes);
  if (exploreState.sort === 'read') list.sort((a, b) => b.views - a.views);

  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  exploreState.page = Math.min(exploreState.page, totalPages);
  const start = (exploreState.page - 1) * PAGE_SIZE;
  const pageItems = list.slice(start, start + PAGE_SIZE);

  countEl.textContent = `${total} article${total !== 1 ? 's' : ''} found`;

  if (!pageItems.length) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">
      <div class="empty-icon">🔍</div>
      <h3>No articles match your search</h3>
      <p>Try a different keyword or clear the category filter.</p>
    </div>`;
  } else {
    grid.innerHTML = pageItems.map(articleCardHtml).join('');
  }
  attachBookmarkHandlers();

  if (pagerEl) {
    let btns = '';
    for (let i = 1; i <= totalPages; i++) {
      btns += `<button class="page-btn ${i === exploreState.page ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }
    pagerEl.innerHTML = btns;
    $$('.page-btn', pagerEl).forEach(b => b.addEventListener('click', () => {
      exploreState.page = Number(b.dataset.page);
      renderExplore();
      window.scrollTo({ top: grid.offsetTop - 100, behavior: 'smooth' });
    }));
  }
}

/* ---------- 5b. CATEGORIES PAGE ---------- */
const CATEGORY_NAMES = ['Technology', 'Programming', 'Web Development', 'AI', 'Design', 'Career', 'Lifestyle'];

function initCategoriesPage() {
  const grid = $('#categoriesGrid');
  if (!grid) return;

  const categoryButtons = $$('#categoryList .chip');
  const requestedCategory = getQueryParam('category');
  const initialCategory = CATEGORY_NAMES.includes(requestedCategory) ? requestedCategory : 'All';

  categoryButtons.forEach(button => button.addEventListener('click', () => {
    categoryButtons.forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    renderCategories(button.dataset.category);
  }));

  categoryButtons.forEach(button => button.classList.toggle('active', button.dataset.category === initialCategory));
  renderCategories(initialCategory);
}

function renderCategories(category) {
  const grid = $('#categoriesGrid');
  const count = $('#categoryResultsCount');
  if (!grid) return;

  const articles = getAllArticles()
    .filter(article => category === 'All' || article.category === category)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  count.textContent = `${articles.length} article${articles.length !== 1 ? 's' : ''}`;
  grid.innerHTML = articles.length
    ? articles.map(articleCardHtml).join('')
    : '<div class="empty-state" style="grid-column:1/-1;"><h3>No articles in this category yet</h3><p>Check back soon for new writing.</p></div>';
  attachBookmarkHandlers();
}

/* ---------- 6. ARTICLE PAGE ---------- */
function simpleMarkdownToHtml(md) {
  // A small, dependency-free markdown renderer covering the subset used across the app.
  const lines = md.split('\n');
  let html = '';
  let inList = null; // 'ul' | 'ol'
  let inCode = false;
  let codeBuffer = [];

  const closeList = () => { if (inList) { html += `</${inList}>`; inList = null; } };
  const inlineFormat = (text) => {
    text = escapeHtml(text);
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
    text = text.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');
    return text;
  };

  lines.forEach(raw => {
    const line = raw;
    if (line.trim().startsWith('```')) {
      if (!inCode) { inCode = true; codeBuffer = []; }
      else { inCode = false; html += `<pre><code>${escapeHtml(codeBuffer.join('\n'))}</code></pre>`; }
      return;
    }
    if (inCode) { codeBuffer.push(line); return; }

    if (/^###\s+/.test(line)) { closeList(); html += `<h3>${inlineFormat(line.replace(/^###\s+/, ''))}</h3>`; return; }
    if (/^##\s+/.test(line)) { closeList(); html += `<h2>${inlineFormat(line.replace(/^##\s+/, ''))}</h2>`; return; }
    if (/^#\s+/.test(line)) { closeList(); html += `<h2>${inlineFormat(line.replace(/^#\s+/, ''))}</h2>`; return; }
    if (/^>\s?/.test(line)) { closeList(); html += `<blockquote>${inlineFormat(line.replace(/^>\s?/, ''))}</blockquote>`; return; }
    if (/^\s*[-*]\s+/.test(line)) {
      if (inList !== 'ul') { closeList(); html += '<ul>'; inList = 'ul'; }
      html += `<li>${inlineFormat(line.replace(/^\s*[-*]\s+/, ''))}</li>`;
      return;
    }
    if (/^\s*\d+\.\s+/.test(line)) {
      if (inList !== 'ol') { closeList(); html += '<ol>'; inList = 'ol'; }
      html += `<li>${inlineFormat(line.replace(/^\s*\d+\.\s+/, ''))}</li>`;
      return;
    }
    if (/^---+$/.test(line.trim())) { closeList(); html += '<hr>'; return; }
    if (line.trim() === '') { closeList(); return; }
    closeList();
    html += `<p>${inlineFormat(line)}</p>`;
  });
  closeList();
  return html;
}

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function initArticlePage() {
  const container = $('#articleContent');
  if (!container) return;

  const id = getQueryParam('id') || MOCK_ARTICLES[0].id;
  const article = findArticleById(id) || MOCK_ARTICLES[0];
  const author = AUTHORS[article.author];

  $('#articleCategory').textContent = article.category;
  $('#articleTitle').textContent = article.title;
  $('#articleDesc').textContent = article.description;
  $('#authorAvatar').src = author.avatar;
  $('#authorName').textContent = author.name;
  $('#authorMeta').textContent = `${formatDate(article.date)} · ${article.readingTime} min read`;

  const bookmarkBtn = $('#articleBookmarkBtn');
  if (bookmarkBtn) {
    bookmarkBtn.classList.toggle('active', isBookmarked(article.id));
    bookmarkBtn.dataset.bookmark = article.id;
    attachBookmarkHandlers();
  }
  $('#shareBtn')?.addEventListener('click', () => {
    navigator.clipboard?.writeText(window.location.href).catch(() => {});
    showToast('Link copied to clipboard');
  });

  container.innerHTML = simpleMarkdownToHtml(article.content);

  // Table of contents
  const toc = $('#tableOfContents');
  if (toc) {
    const headings = $$('h2, h3', container);
    headings.forEach((h, i) => { h.id = h.id || `sec-${i}`; });
    toc.innerHTML = headings.map(h =>
      `<li><a href="#${h.id}" class="${h.tagName === 'H3' ? 'lvl-3' : ''}" data-target="${h.id}">${h.textContent}</a></li>`
    ).join('');

    const tocLinks = $$('a', toc);
    tocLinks.forEach(link => link.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById(link.dataset.target)?.scrollIntoView({ behavior: 'smooth' });
    }));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const link = toc.querySelector(`a[data-target="${entry.target.id}"]`);
        if (!link) return;
        if (entry.isIntersecting) {
          tocLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      });
    }, { rootMargin: '-100px 0px -70% 0px' });
    headings.forEach(h => observer.observe(h));
  }

  // Tags (mocked from category)
  const tagsEl = $('#articleTags');
  if (tagsEl) {
    tagsEl.innerHTML = [article.category, 'Writing', 'Best Practices'].map(t => `<span class="tag-pill">${t}</span>`).join('');
  }

  initComments(article.id);
}

/* Comments */
function seedCommentsFor(articleId) {
  return [
    {
      id: uid('c'), author: 'lena', date: new Date(Date.now() - 3 * 3600000).toISOString(),
      text: 'This matches my experience almost exactly — especially the point about short paragraphs.',
      likes: 8, liked: false, replies: [
        { id: uid('r'), author: 'maya', date: new Date(Date.now() - 2 * 3600000).toISOString(), text: 'Glad it landed! Curious which part you apply most often.', likes: 2, liked: false }
      ]
    },
    {
      id: uid('c'), author: 'sam', date: new Date(Date.now() - 26 * 3600000).toISOString(),
      text: 'Would love a follow-up on how this applies to documentation specifically.',
      likes: 3, liked: false, replies: []
    }
  ];
}
function getCommentsStore() { return Store.get('inkspace_comments', {}); }
function setCommentsStore(store) { Store.set('inkspace_comments', store); }
function getCommentsFor(articleId) {
  const store = getCommentsStore();
  if (!store[articleId]) {
    store[articleId] = seedCommentsFor(articleId);
    setCommentsStore(store);
  }
  return store[articleId];
}

function commentHtml(c, articleId) {
  const author = AUTHORS[c.author] || AUTHORS.you;
  const mine = c.author === 'you';
  return `
  <div class="comment" data-cid="${c.id}">
    <img src="${author.avatar}" alt="${author.name}">
    <div style="flex:1;">
      <div class="comment-body">
        <div class="comment-head">
          <b>${author.name}</b>
          <span class="faint">${timeAgo(c.date)}</span>
        </div>
        <div class="comment-text">${escapeHtml(c.text)}</div>
        <div class="comment-actions">
          <button class="comment-action ${c.liked ? 'liked' : ''}" data-like="${c.id}">
            <svg viewBox="0 0 24 24" fill="${c.liked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
            <span>${c.likes}</span>
          </button>
          <button class="comment-action" data-reply="${c.id}">Reply</button>
          ${mine ? `<button class="comment-action" data-delete="${c.id}">Delete</button>` : ''}
        </div>
        <div class="reply-input-row" id="replyRow-${c.id}">
          <img src="${AUTHORS.you.avatar}" style="width:32px;height:32px;border-radius:50%;flex-shrink:0;">
          <input type="text" class="input" placeholder="Write a reply..." id="replyInput-${c.id}">
          <button class="btn btn-primary btn-sm" data-submit-reply="${c.id}">Reply</button>
        </div>
      </div>
      <div class="reply-list">
        ${(c.replies || []).map(r => {
          const ra = AUTHORS[r.author] || AUTHORS.you;
          return `<div class="comment" data-cid="${r.id}">
            <img src="${ra.avatar}" alt="${ra.name}">
            <div style="flex:1;">
              <div class="comment-body">
                <div class="comment-head"><b>${ra.name}</b><span class="faint">${timeAgo(r.date)}</span></div>
                <div class="comment-text">${escapeHtml(r.text)}</div>
                <div class="comment-actions">
                  <button class="comment-action ${r.liked ? 'liked' : ''}" data-like-reply="${c.id}:${r.id}">
                    <svg viewBox="0 0 24 24" fill="${r.liked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
                    <span>${r.likes}</span>
                  </button>
                  ${r.author === 'you' ? `<button class="comment-action" data-delete-reply="${c.id}:${r.id}">Delete</button>` : ''}
                </div>
              </div>
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>
  </div>`;
}

function initComments(articleId) {
  const list = $('#commentList');
  const countEl = $('#commentCount');
  if (!list) return;

  function render() {
    const comments = getCommentsFor(articleId);
    const totalCount = comments.reduce((sum, c) => sum + 1 + (c.replies?.length || 0), 0);
    if (countEl) countEl.textContent = totalCount;
    list.innerHTML = comments.length
      ? comments.map(c => commentHtml(c, articleId)).join('')
      : `<div class="empty-state"><div class="empty-icon">💬</div><h3>No comments yet</h3><p>Be the first to share your thoughts.</p></div>`;
    attachCommentHandlers();
  }

  function attachCommentHandlers() {
    $$('[data-like]', list).forEach(btn => btn.addEventListener('click', () => {
      const store = getCommentsStore();
      const comments = store[articleId];
      const c = comments.find(x => x.id === btn.dataset.like);
      c.liked = !c.liked;
      c.likes += c.liked ? 1 : -1;
      setCommentsStore(store);
      render();
    }));
    $$('[data-like-reply]', list).forEach(btn => btn.addEventListener('click', () => {
      const [cid, rid] = btn.dataset.likeReply.split(':');
      const store = getCommentsStore();
      const c = store[articleId].find(x => x.id === cid);
      const r = c.replies.find(x => x.id === rid);
      r.liked = !r.liked;
      r.likes += r.liked ? 1 : -1;
      setCommentsStore(store);
      render();
    }));
    $$('[data-reply]', list).forEach(btn => btn.addEventListener('click', () => {
      const row = $(`#replyRow-${btn.dataset.reply}`);
      row.classList.toggle('open');
      if (row.classList.contains('open')) $(`#replyInput-${btn.dataset.reply}`).focus();
    }));
    $$('[data-submit-reply]', list).forEach(btn => btn.addEventListener('click', () => {
      const cid = btn.dataset.submitReply;
      const input = $(`#replyInput-${cid}`);
      const text = input.value.trim();
      if (!text) return;
      const store = getCommentsStore();
      const c = store[articleId].find(x => x.id === cid);
      c.replies = c.replies || [];
      c.replies.push({ id: uid('r'), author: 'you', date: new Date().toISOString(), text, likes: 0, liked: false });
      setCommentsStore(store);
      showToast('Reply posted');
      render();
    }));
    $$('[data-delete]', list).forEach(btn => btn.addEventListener('click', () => {
      openConfirm({
        title: 'Delete comment?', desc: 'This action cannot be undone.', confirmLabel: 'Delete',
        onConfirm: () => {
          const store = getCommentsStore();
          store[articleId] = store[articleId].filter(c => c.id !== btn.dataset.delete);
          setCommentsStore(store);
          showToast('Comment deleted');
          render();
        }
      });
    }));
    $$('[data-delete-reply]', list).forEach(btn => btn.addEventListener('click', () => {
      const [cid, rid] = btn.dataset.deleteReply.split(':');
      openConfirm({
        title: 'Delete reply?', desc: 'This action cannot be undone.', confirmLabel: 'Delete',
        onConfirm: () => {
          const store = getCommentsStore();
          const c = store[articleId].find(x => x.id === cid);
          c.replies = c.replies.filter(r => r.id !== rid);
          setCommentsStore(store);
          showToast('Reply deleted');
          render();
        }
      });
    }));
  }

  $('#commentSubmit')?.addEventListener('click', () => {
    const input = $('#commentInput');
    const text = input.value.trim();
    if (!text) { showToast('Write something before posting', 'error'); return; }
    const store = getCommentsStore();
    store[articleId] = store[articleId] || [];
    store[articleId].unshift({ id: uid('c'), author: 'you', date: new Date().toISOString(), text, likes: 0, liked: false, replies: [] });
    setCommentsStore(store);
    input.value = '';
    showToast('Comment posted');
    render();
  });

  render();
}

/* ---------- 7. WRITE PAGE ---------- */
function initWritePage() {
  const editor = $('#markdownInput');
  if (!editor) return;

  const preview = $('#markdownPreview');
  const titleInput = $('#postTitle');
  const slugInput = $('#postSlug');
  const descInput = $('#postDescription');
  const categorySelect = $('#postCategory');
  const tagsInput = $('#postTags');
  const coverInput = $('#coverInput');
  const coverPreviewWrap = $('#coverUploadBox');

  const editId = getQueryParam('edit');
  const posts = Store.get('inkspace_posts', []);
  let current = editId ? posts.find(p => p.id === editId) : null;
  let coverDataUrl = current?.cover || '';

  if (current) {
    titleInput.value = current.title || '';
    slugInput.value = current.slug || '';
    descInput.value = current.description || '';
    categorySelect.value = current.category || 'Technology';
    tagsInput.value = current.tags || '';
    editor.value = current.body || '';
    if (coverDataUrl) showCoverPreview(coverDataUrl);
  }

  titleInput.addEventListener('input', () => {
    if (!slugInput.dataset.touched) {
      slugInput.value = titleInput.value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
  });
  slugInput.addEventListener('input', () => { slugInput.dataset.touched = 'true'; });

  coverInput?.addEventListener('change', () => {
    const file = coverInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { coverDataUrl = reader.result; showCoverPreview(coverDataUrl); };
    reader.readAsDataURL(file);
  });
  function showCoverPreview(src) {
    coverPreviewWrap.innerHTML = `<img src="${src}" alt="Cover preview"><span>Click to change cover image</span>
      <input type="file" id="coverInput" accept="image/*">`;
    $('#coverInput').addEventListener('change', () => {
      const file = $('#coverInput').files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => { coverDataUrl = reader.result; showCoverPreview(coverDataUrl); };
      reader.readAsDataURL(file);
    });
  }

  // Markdown toolbar
  function wrapSelection(before, after = before, placeholder = '') {
    const start = editor.selectionStart, end = editor.selectionEnd;
    const selected = editor.value.slice(start, end) || placeholder;
    const newText = editor.value.slice(0, start) + before + selected + after + editor.value.slice(end);
    editor.value = newText;
    editor.focus();
    editor.selectionStart = start + before.length;
    editor.selectionEnd = start + before.length + selected.length;
    updatePreviewAndStats();
  }
  function insertLinePrefix(prefix) {
    const start = editor.selectionStart;
    const lineStart = editor.value.lastIndexOf('\n', start - 1) + 1;
    editor.value = editor.value.slice(0, lineStart) + prefix + editor.value.slice(lineStart);
    editor.focus();
    updatePreviewAndStats();
  }
  const toolbarActions = {
    heading: () => insertLinePrefix('## '),
    bold: () => wrapSelection('**', '**', 'bold text'),
    italic: () => wrapSelection('*', '*', 'italic text'),
    link: () => wrapSelection('[', '](https://)', 'link text'),
    image: () => wrapSelection('![', '](https://)', 'alt text'),
    quote: () => insertLinePrefix('> '),
    ol: () => insertLinePrefix('1. '),
    ul: () => insertLinePrefix('- '),
    code: () => wrapSelection('`', '`', 'code'),
    hr: () => { editor.value += '\n\n---\n'; updatePreviewAndStats(); }
  };
  $$('.tb-btn').forEach(btn => btn.addEventListener('click', () => toolbarActions[btn.dataset.action]?.()));

  function updatePreviewAndStats() {
    preview.innerHTML = simpleMarkdownToHtml(editor.value || '_Nothing to preview yet — start writing on the left._');
    const words = wordsIn(editor.value);
    $('#wordCount').textContent = words;
    $('#charCount').textContent = editor.value.length;
    $('#readTimeCount').textContent = readingTimeFromWords(words);
  }
  editor.addEventListener('input', updatePreviewAndStats);
  updatePreviewAndStats();

  // Autosave (debounced)
  const saveStatus = $('#saveStatus');
  const autosave = debounce(() => {
    saveStatus?.classList.add('saving');
    setTimeout(() => {
      current = persistPost('draft', current);
      saveStatus?.classList.remove('saving');
      const timeEl = $('#lastSavedTime');
      if (timeEl) timeEl.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }, 400);
  }, 900);
  [titleInput, slugInput, descInput, categorySelect, tagsInput, editor].forEach(el => el?.addEventListener('input', autosave));

  function collectPostData() {
    return {
      title: titleInput.value.trim(),
      slug: slugInput.value.trim(),
      description: descInput.value.trim(),
      category: categorySelect.value,
      tags: tagsInput.value.trim(),
      cover: coverDataUrl,
      body: editor.value,
      readingTime: readingTimeFromWords(wordsIn(editor.value))
    };
  }

  function persistPost(status, existing) {
    const data = collectPostData();
    if (!data.title) return existing;
    const list = Store.get('inkspace_posts', []);
    const now = new Date().toISOString();
    let record = existing ? list.find(p => p.id === existing.id) : null;
    if (!record) {
      record = { id: uid('post'), status: 'draft', createdAt: now, views: 0, likes: 0, comments: 0 };
      list.push(record);
    }
    Object.assign(record, data, { updatedAt: now });
    if (status === 'published' && record.status !== 'published') {
      record.publishedAt = now;
    }
    if (status) record.status = status;
    Store.set('inkspace_posts', list);
    return record;
  }

  $('#saveDraftBtn')?.addEventListener('click', () => {
    current = persistPost('draft', current);
    showToast('Draft saved');
  });

  $('#publishBtn')?.addEventListener('click', () => {
    const data = collectPostData();
    if (!data.title || !data.body.trim()) {
      showToast('Add a title and some content before publishing', 'error');
      return;
    }
    current = persistPost('published', current);
    showToast('Post published', 'success');
    setTimeout(() => { window.location.href = 'posts.html'; }, 900);
  });

  $('#previewBtn')?.addEventListener('click', () => {
    preview.scrollIntoView({ behavior: 'smooth' });
    showToast('Showing live preview');
  });
}

/* ---------- 8. MY POSTS PAGE ---------- */
function initPostsPage() {
  const tableBody = $('#postsTableBody');
  if (!tableBody) return;

  let state = { query: '', status: 'all' };

  function seedIfEmpty() {
    const posts = Store.get('inkspace_posts', []);
    if (posts.length) return;
    const seeded = [
      { id: uid('post'), title: 'Why I Switched My Notes to Markdown', slug: 'notes-to-markdown', description: 'A short reflection on tooling.', category: 'Lifestyle', tags: 'writing', cover: 'https://picsum.photos/seed/mypost1/400/300', body: '## Intro\n\nSome thoughts on markdown note-taking.', status: 'published', views: 340, likes: 22, comments: 4, readingTime: 3, createdAt: new Date(Date.now() - 5 * 86400000).toISOString(), publishedAt: new Date(Date.now() - 4 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 4 * 86400000).toISOString() },
      { id: uid('post'), title: 'Draft: Thoughts on Remote Onboarding', slug: 'remote-onboarding', description: 'Unfinished notes.', category: 'Career', tags: 'remote', cover: 'https://picsum.photos/seed/mypost2/400/300', body: '## Draft\n\nStill collecting ideas here.', status: 'draft', views: 0, likes: 0, comments: 0, readingTime: 2, createdAt: new Date(Date.now() - 1 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 1 * 86400000).toISOString() }
    ];
    Store.set('inkspace_posts', seeded);
  }
  seedIfEmpty();

  function render() {
    let posts = Store.get('inkspace_posts', []).slice().sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    if (state.status !== 'all') posts = posts.filter(p => p.status === state.status);
    if (state.query) posts = posts.filter(p => p.title.toLowerCase().includes(state.query));

    if (!posts.length) {
      tableBody.innerHTML = `<tr><td colspan="7"><div class="empty-state"><div class="empty-icon">📝</div><h3>No posts yet</h3><p>Start writing your first article.</p><a href="write.html" class="btn btn-primary" style="margin-top:14px;">Write a Post</a></div></td></tr>`;
      return;
    }

    tableBody.innerHTML = posts.map(p => `
      <tr data-id="${p.id}">
        <td>
          <div class="post-title-cell">
            <img src="${p.cover || 'https://picsum.photos/seed/' + p.id + '/200/150'}" alt="">
            <div>
              <div style="font-weight:600;">${escapeHtml(p.title)}</div>
              <div class="faint" style="font-size:12.5px;">${p.readingTime || 1} min read</div>
            </div>
          </div>
        </td>
        <td>${p.category}</td>
        <td><span class="status-badge ${p.status}">${p.status === 'published' ? 'Published' : 'Draft'}</span></td>
        <td>${p.views || 0}</td>
        <td>${p.comments || 0}</td>
        <td class="faint">${formatDate(p.updatedAt)}</td>
        <td>
          <div class="row-actions">
            <a class="icon-action" href="write.html?edit=${p.id}" aria-label="Edit"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg></a>
            <button class="icon-action danger" data-delete-post="${p.id}" aria-label="Delete"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg></button>
          </div>
        </td>
      </tr>`).join('');

    $$('[data-delete-post]', tableBody).forEach(btn => btn.addEventListener('click', () => {
      openConfirm({
        title: 'Delete this post?', desc: 'This will permanently remove the post and its stats.', confirmLabel: 'Delete',
        onConfirm: () => {
          const list = Store.get('inkspace_posts', []).filter(p => p.id !== btn.dataset.deletePost);
          Store.set('inkspace_posts', list);
          showToast('Post deleted');
          render();
        }
      });
    }));
  }

  $('#postsSearch')?.addEventListener('input', debounce((e) => { state.query = e.target.value.toLowerCase(); render(); }, 200));
  $$('.chip[data-status]').forEach(chip => chip.addEventListener('click', () => {
    $$('.chip[data-status]').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    state.status = chip.dataset.status;
    render();
  }));

  render();
}

/* ---------- 9. BOOKMARKS PAGE ---------- */
function initBookmarksPage() {
  const grid = $('#bookmarksGrid');
  if (!grid) return;

  function render() {
    const ids = getBookmarks();
    const all = getAllArticles();
    const items = ids.map(id => all.find(a => a.id === id)).filter(Boolean);

    if (!items.length) {
      grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">
        <div class="empty-icon">🔖</div>
        <h3>Nothing saved yet</h3>
        <p>Bookmark articles you want to read later and they'll show up here.</p>
        <a href="explore.html" class="btn btn-primary" style="margin-top:14px;">Explore Articles</a>
      </div>`;
      return;
    }

    grid.innerHTML = items.map(a => {
      const author = AUTHORS[a.author];
      return `<div class="bookmark-card" data-id="${a.id}">
        <a href="article.html?id=${a.id}"><img src="${a.image}" alt="${escapeHtml(a.title)}"></a>
        <div class="bc-body">
          <a href="article.html?id=${a.id}"><h4>${escapeHtml(a.title)}</h4></a>
          <div class="bc-meta">${author.name} · ${a.readingTime} min read</div>
          <div class="row between">
            <span class="faint" style="font-size:12px;">Saved ${timeAgo(a.date)}</span>
            <button class="btn btn-outline btn-sm" data-remove="${a.id}">Remove</button>
          </div>
        </div>
      </div>`;
    }).join('');

    $$('[data-remove]', grid).forEach(btn => btn.addEventListener('click', () => {
      toggleBookmark(btn.dataset.remove);
      render();
    }));
  }
  render();
}

/* ---------- 10. PROFILE PAGE ---------- */
function initProfilePage() {
  const el = $('#profileHeader');
  if (!el) return;

  let profile = Store.get('inkspace_profile', {
    name: 'You', username: '@you', bio: AUTHORS.you.bio, avatar: AUTHORS.you.avatar
  });
  const posts = Store.get('inkspace_posts', []).filter(p => p.status === 'published');
  const totalViews = posts.reduce((s, p) => s + (p.views || 0), 0);

  function renderProfile() {
    el.innerHTML = `
      <div class="profile-main">
        <img src="${profile.avatar}" class="p-avatar" alt="${escapeHtml(profile.name)}">
        <div class="profile-details">
          <h1>${escapeHtml(profile.name)}</h1>
          <div class="p-username">${escapeHtml(profile.username)}</div>
          <p class="p-bio">${escapeHtml(profile.bio)}</p>
          <div class="social-links">
            <a class="icon-btn" href="#" aria-label="Twitter">𝕏</a>
            <a class="icon-btn" href="#" aria-label="GitHub">GH</a>
            <a class="icon-btn" href="#" aria-label="Website">🔗</a>
          </div>
        </div>
        <button type="button" class="btn btn-outline btn-sm profile-edit-trigger" id="editProfileBtn">Edit Profile</button>
      </div>
      <div class="profile-stats">
        <div class="p-stat"><b>${posts.length}</b><span>Posts</span></div>
        <div class="p-stat"><b>128</b><span>Followers</span></div>
        <div class="p-stat"><b>${totalViews}</b><span>Total Views</span></div>
      </div>
      <form class="profile-editor" id="profileEditor" hidden>
        <div class="profile-editor-fields">
          <div class="field"><label for="profileEditName">Name</label><input class="input" id="profileEditName" value="${escapeHtml(profile.name)}" required></div>
          <div class="field"><label for="profileEditUsername">Username</label><input class="input" id="profileEditUsername" value="${escapeHtml(profile.username)}" required></div>
          <div class="field profile-editor-full"><label for="profileEditBio">Bio</label><textarea class="textarea" id="profileEditBio" rows="3" required>${escapeHtml(profile.bio)}</textarea></div>
        </div>
        <div class="profile-editor-photo">
          <img src="${profile.avatar}" id="profileEditPhotoPreview" class="p-avatar" alt="Profile photo preview">
          <label class="btn btn-ghost btn-sm" for="profilePhotoInput">Change Photo</label>
          <input type="file" id="profilePhotoInput" accept="image/jpeg,image/png,image/webp" hidden>
        </div>
        <div class="profile-editor-actions">
          <button type="submit" class="btn btn-primary btn-sm">Save</button>
          <button type="button" class="btn btn-ghost btn-sm" id="cancelProfileBtn">Cancel</button>
        </div>
      </form>`;

    let pendingAvatar = profile.avatar;
    const editor = $('#profileEditor');
    $('#editProfileBtn').addEventListener('click', () => { editor.hidden = false; });
    $('#cancelProfileBtn').addEventListener('click', () => { renderProfile(); });
    $('#profilePhotoInput').addEventListener('change', () => {
      const file = $('#profilePhotoInput').files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        pendingAvatar = reader.result;
        $('.p-avatar', el).src = pendingAvatar;
        $('#profileEditPhotoPreview').src = pendingAvatar;
      };
      reader.readAsDataURL(file);
    });
    editor.addEventListener('submit', event => {
      event.preventDefault();
      profile = {
        name: $('#profileEditName').value.trim(),
        username: $('#profileEditUsername').value.trim(),
        bio: $('#profileEditBio').value.trim(),
        avatar: pendingAvatar
      };
      Store.set('inkspace_profile', profile);
      renderProfile();
      showToast('Profile updated', 'success');
    });
  }

  renderProfile();

  const grid = $('#profilePostsGrid');
  if (grid) {
    grid.innerHTML = posts.length
      ? posts.map(p => articleCardHtml({
          id: p.id, title: p.title, description: p.description, category: p.category,
          author: 'you', image: p.cover || 'https://picsum.photos/seed/' + p.id + '/900/600',
          date: p.publishedAt, readingTime: p.readingTime || 1
        })).join('')
      : `<div class="empty-state" style="grid-column:1/-1;"><div class="empty-icon">✍️</div><h3>No published articles yet</h3><p>Your published posts will appear here.</p></div>`;
    attachBookmarkHandlers();
  }
}

/* ---------- 11. SETTINGS PAGE ---------- */
function initSettingsPage() {
  const nav = $('#settingsNav');
  if (!nav) return;

  const profile = Store.get('inkspace_profile', { name: 'You', username: '@you', bio: AUTHORS.you.bio, avatar: AUTHORS.you.avatar });
  const notifSettings = Store.get('inkspace_notifications', { comments: true, likes: true, followers: false });

  $('#settingsName').value = profile.name;
  $('#settingsUsername').value = profile.username;
  $('#settingsBio').value = profile.bio;

  $('#settingsProfileForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const updated = { ...profile, name: $('#settingsName').value.trim(), username: $('#settingsUsername').value.trim(), bio: $('#settingsBio').value.trim() };
    Store.set('inkspace_profile', updated);
    showToast('Profile updated', 'success');
  });

  $$('.settings-nav button').forEach(btn => btn.addEventListener('click', () => {
    $$('.settings-nav button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    $$('.panel-section').forEach(p => p.classList.remove('active'));
    $(`#panel-${btn.dataset.panel}`).classList.add('active');
  }));

  // Appearance
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  $$('input[name="appearance"]').forEach(r => { r.checked = r.value === currentTheme; });
  $$('input[name="appearance"]').forEach(r => r.addEventListener('change', () => {
    document.documentElement.setAttribute('data-theme', r.value);
    Store.set('inkspace_theme', r.value);
    updateThemeIcons(r.value);
  }));

  // Notifications
  Object.keys(notifSettings).forEach(key => {
    const input = $(`#notif-${key}`);
    if (input) {
      input.checked = notifSettings[key];
      input.addEventListener('change', () => {
        notifSettings[key] = input.checked;
        Store.set('inkspace_notifications', notifSettings);
        showToast('Notification preferences saved');
      });
    }
  });
}

/* ---------- 12. BOOT ---------- */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavbar();
  initHomePage();
  initExplorePage();
  initCategoriesPage();
  initArticlePage();
  initWritePage();
  initPostsPage();
  initBookmarksPage();
  initProfilePage();
  initSettingsPage();
});