const PALETTES = [
  ["#c2410c", "#f59e0b"],
  ["#0f766e", "#14b8a6"],
  ["#4338ca", "#8b5cf6"],
  ["#be123c", "#fb7185"],
  ["#0369a1", "#38bdf8"],
  ["#15803d", "#84cc16"],
  ["#7c2d12", "#ea580c"],
  ["#1e3a8a", "#6366f1"],
];

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

const escapeXml = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Builds a cover image locally, so it always works (no internet needed)
export function generateCover(seed = "inkspace", label = "InkSpace") {
  const h = hash(String(seed));
  const [a, b] = PALETTES[h % PALETTES.length];
  const x1 = 150 + (h % 300);
  const x2 = 750 + (h % 300);
  const text = escapeXml(String(label).toUpperCase());

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 700">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/>
</linearGradient></defs>
<rect width="1200" height="700" fill="url(#g)"/>
<circle cx="${x1}" cy="150" r="260" fill="#fff" fill-opacity="0.10"/>
<circle cx="${x2}" cy="560" r="320" fill="#fff" fill-opacity="0.12"/>
<circle cx="1000" cy="120" r="90" fill="#fff" fill-opacity="0.15"/>
<text x="70" y="620" font-family="Georgia, serif" font-size="46" font-weight="700" fill="#fff" fill-opacity="0.9" letter-spacing="4">${text}</text>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Use the article's own cover, or generate one if it has none
export function getCover(article) {
  return article.coverImage || generateCover(article.id, article.category);
}

// Use as <img onError={(e) => handleImgError(e, article)} />
export function handleImgError(e, article) {
  const img = e.currentTarget;
  if (img.dataset.fallback) return; // avoid an endless error loop
  img.dataset.fallback = "1";
  img.src = generateCover(article.id, article.category);
}