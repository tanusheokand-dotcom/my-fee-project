export const CATEGORIES = [
  "Web Development",
  "React.js",
  "Technology",
  "Student Life",
  "Productivity",
  "Programming",
  "Artificial Intelligence",
  "Career",
];

const PHOTOS = {
  "react-hooks": "photo-1633356122544-f134324a6cee",
  "css-layout": "photo-1555066931-4365d14bab8c",
  "ai-study": "photo-1677442136019-21780ecad995",
  "deep-work": "photo-1499750310107-5fef28a66643",
  "js-arrays": "photo-1498050108023-c5249f4df085",
  "college-life": "photo-1523240795612-9a054b0db644",
  "web-trends": "photo-1518770660439-4636190af475",
  "dev-career": "photo-1521737604893-d14cc237f11d",
  "a11y-web": "photo-1461749280684-dccba630e2f6",
};

const img = (seed) =>
  PHOTOS[seed]
    ? `https://images.unsplash.com/${PHOTOS[seed]}?auto=format&fit=crop&w=1200&q=70`
    : "";

const articles = [
  {
    id: "react-hooks-explained",
    title: "React Hooks Explained for Absolute Beginners",
    description:
      "Hooks look scary at first, but three of them cover most of what you need. Here is a calm walkthrough.",
    author: "Maya Rodriguez",
    authorId: "seed",
    category: "React.js",
    tags: ["react", "hooks", "beginners"],
    date: "2026-09-28",
    coverImage: img("react-hooks"),
    featured: true,
    status: "published",
    content: `## Why hooks exist

Before hooks, you needed **class components** to hold state. Hooks let plain functions remember things and react to changes.

## useState: remembering values

\`useState\` gives you a value and a function to update it. When you call the setter, React re-renders the component.

## useEffect: doing things after render

Use \`useEffect\` for side effects such as fetching data, subscribing to events or saving to LocalStorage.

- Pass an empty array \`[]\` to run once.
- Pass dependencies to run when they change.
- Return a function to clean up.

## useContext: sharing without prop drilling

Context lets you share a theme or the logged-in user with any component, no matter how deep.

> Start small. Build a counter, then a todo list, then a small app. Hooks click through practice.
`,
  },
  {
    id: "css-grid-vs-flexbox",
    title: "CSS Grid vs Flexbox: Which One Should You Use?",
    description:
      "Stop guessing. A simple mental model for choosing the right layout tool every time.",
    author: "Daniel Okafor",
    authorId: "seed",
    category: "Web Development",
    tags: ["css", "layout", "frontend"],
    date: "2026-09-15",
    coverImage: img("css-layout"),
    featured: true,
    status: "published",
    content: `## The one-sentence rule

**Flexbox is for one dimension (a row or a column). Grid is for two dimensions (rows and columns together).**

## When Flexbox shines

- Navigation bars
- Centering a single item
- Rows of buttons or tags

## When Grid shines

- Page layouts with header, sidebar and content
- Card galleries
- Anything that must align in both directions

## They work together

A grid of cards, where each card uses Flexbox internally to push the button to the bottom, is a very common pattern.

| Need | Use |
| --- | --- |
| Align items in a line | Flexbox |
| Build a card gallery | Grid |
| Center something | Either |
`,
  },
  {
    id: "ai-tools-for-students",
    title: "How Students Can Use AI Tools Without Losing Their Own Voice",
    description:
      "AI can speed up learning, but only if you use it as a tutor rather than a ghostwriter.",
    author: "Priya Nair",
    authorId: "seed",
    category: "Artificial Intelligence",
    tags: ["ai", "learning", "students"],
    date: "2026-10-02",
    coverImage: img("ai-study"),
    featured: true,
    status: "published",
    content: `## Treat AI like a tutor

Ask it to explain a concept three different ways. Ask it to quiz you. Ask it to find holes in your reasoning.

## Habits that help

1. Try the problem yourself first.
2. Ask for hints before answers.
3. Rewrite explanations in your own words.
4. Verify facts with trusted sources.

## Habits that hurt

- Pasting assignments and submitting the output
- Never checking whether the answer is correct

AI can be confidently wrong. Your job is still to **think**.
`,
  },
  {
    id: "deep-work-for-busy-people",
    title: "Deep Work for Busy People: A 4-Step Routine",
    description:
      "You do not need eight free hours. You need one protected hour and a plan.",
    author: "Liam Chen",
    authorId: "seed",
    category: "Productivity",
    tags: ["focus", "habits", "routine"],
    date: "2026-08-30",
    coverImage: img("deep-work"),
    featured: false,
    status: "published",
    content: `## The routine

1. **Pick one task.** Not three. One.
2. **Set a timer** for 50 minutes.
3. **Remove distractions.** Phone in another room, notifications off.
4. **Take a real break** of 10 minutes.

## Why it works

Your brain pays a heavy switching cost each time you change tasks. Fewer switches means better work in less time.

> Protect your first focused hour like an appointment with someone important.
`,
  },
  {
    id: "javascript-array-methods",
    title: "Master map, filter and reduce in JavaScript",
    description:
      "Three array methods that replace most of your for loops and make your code easier to read.",
    author: "Maya Rodriguez",
    authorId: "seed",
    category: "Programming",
    tags: ["javascript", "arrays", "es6"],
    date: "2026-09-05",
    coverImage: img("js-arrays"),
    featured: false,
    status: "published",
    content: `## map: transform every item

    const prices = [10, 20, 30];
    const withTax = prices.map((p) => p * 1.1);

## filter: keep some items

    const adults = people.filter((p) => p.age >= 18);

## reduce: combine into one value

    const total = prices.reduce((sum, p) => sum + p, 0);

## Chain them

You can chain these methods: filter first, then map, then reduce. Each step stays small and easy to test.
`,
  },
  {
    id: "first-year-survival-guide",
    title: "The First-Year College Survival Guide Nobody Gave You",
    description:
      "Practical advice on sleep, schedules and friendships from students who have been there.",
    author: "Sofia Alvarez",
    authorId: "seed",
    category: "Student Life",
    tags: ["college", "habits", "wellbeing"],
    date: "2026-09-20",
    coverImage: img("college-life"),
    featured: false,
    status: "published",
    content: `## Sleep is not optional

All-nighters feel productive but wreck memory. Aim for a consistent bedtime.

## Use a weekly planner

Write down classes, deadlines and free time. Seeing the week makes it manageable.

## Go to office hours

Professors remember students who show up. It is also the fastest way to clear doubts.

## Make one friend per class

Study groups make hard subjects easier, and campus feels smaller.
`,
  },
  {
    id: "future-of-web-technology",
    title: "Five Web Technology Trends Worth Watching",
    description:
      "From edge rendering to on-device AI, here is what is shaping the next few years of the web.",
    author: "Daniel Okafor",
    authorId: "seed",
    category: "Technology",
    tags: ["web", "trends", "future"],
    date: "2026-10-10",
    coverImage: img("web-trends"),
    featured: false,
    status: "published",
    content: `## 1. Edge rendering

Running code closer to users cuts latency.

## 2. On-device AI

Small models running in the browser enable private, instant features.

## 3. Web Components and native features

Browsers keep adding capabilities that once needed libraries.

## 4. Better performance tooling

Core Web Vitals are now part of everyday development.

## 5. Accessibility as a default

More teams treat accessibility as a requirement, not an extra.
`,
  },
  {
    id: "land-your-first-dev-job",
    title: "How to Land Your First Developer Job in 6 Months",
    description:
      "A realistic roadmap: projects, portfolio, networking and interview preparation.",
    author: "Liam Chen",
    authorId: "seed",
    category: "Career",
    tags: ["career", "jobs", "portfolio"],
    date: "2026-10-18",
    coverImage: img("dev-career"),
    featured: false,
    status: "published",
    content: `## Months 1-2: Fundamentals

Get comfortable with HTML, CSS, JavaScript and Git.

## Months 3-4: Build real projects

Make three projects that solve real problems. A blog platform is a great one.

## Month 5: Portfolio and network

Publish your work, write about what you learn, and talk to people in the industry.

## Month 6: Apply and practice

Practice explaining your projects out loud. Apply consistently and learn from each rejection.

> Consistency beats intensity. Show up daily.
`,
  },
  {
    id: "web-accessibility-basics",
    title: "Web Accessibility Basics Every Developer Should Know",
    description:
      "Small changes like alt text, labels and contrast make your site usable for far more people.",
    author: "Priya Nair",
    authorId: "seed",
    category: "Web Development",
    tags: ["accessibility", "html", "ux"],
    date: "2026-08-12",
    coverImage: img("a11y-web"),
    featured: false,
    status: "published",
    content: `## Start with semantic HTML

Use \`button\` for buttons, \`nav\` for navigation, and headings in order.

## Always label inputs

Every input needs a visible label or an \`aria-label\`.

## Check your contrast

Low-contrast text is hard to read for many users. Test both light and dark themes.

## Test with a keyboard

If you cannot reach everything with the Tab key, neither can many of your users.
`,
  },
];

export default articles;