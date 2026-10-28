export const DEMO_USER = {
  id: "demo-user",
  name: "Demo Writer",
  email: "demo@inkspace.dev",
  password: "demo1234",
  createdAt: "2026-10-01T09:00:00.000Z",
};

export const DEMO_ARTICLES = [
  {
    id: "why-i-started-writing-online",
    title: "Why I Started Writing Online (and Why You Should Too)",
    description:
      "Writing in public sharpens your thinking, builds a portfolio and connects you with people who share your interests.",
    author: DEMO_USER.name,
    authorId: DEMO_USER.id,
    category: "Productivity",
    tags: ["writing", "habits", "portfolio"],
    date: "2026-10-12T10:00:00.000Z",
    createdAt: "2026-10-12T10:00:00.000Z",
    updatedAt: "2026-10-12T10:00:00.000Z",
    coverImage: "",
    featured: false,
    status: "published",
    content: `## Writing clarifies thinking

When you try to explain an idea in plain words, the gaps in your understanding show up fast. That is a **feature**, not a bug.

## It builds a portfolio

Every post is proof of what you know. Employers and collaborators can see how you think, not just what you list on a resume.

## How to begin

1. Pick one topic you learned this week.
2. Write 300 messy words about it.
3. Edit once, then publish.

> Done and shared beats perfect and hidden.
`,
  },
  {
    id: "notes-on-learning-react-router",
    title: "Notes on Learning React Router",
    description:
      "A draft of my notes on routes, links, params and protected pages while building InkSpace.",
    author: DEMO_USER.name,
    authorId: DEMO_USER.id,
    category: "React.js",
    tags: ["react", "routing"],
    date: "2026-10-20T10:00:00.000Z",
    createdAt: "2026-10-20T10:00:00.000Z",
    updatedAt: "2026-10-20T10:00:00.000Z",
    coverImage: "",
    featured: false,
    status: "draft",
    content: `## Routes

A route maps a URL to a component.

## Still to write

- Route params
- Protected routes
- Redirects after login
`,
  },
];