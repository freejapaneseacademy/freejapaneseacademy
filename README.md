# FreeJapaneseAcademy · Phase 1

An accessible, static-first foundation for a free English-language Japanese-learning academy, designed to grow from JLPT N5 to N1. **This is a prototype, not a complete learning curriculum.**

## Stack

Astro 5, TypeScript, Tailwind CSS 4, React 19 islands, Astro MDX content collections, Dexie 4 / IndexedDB, Astro sitemap, Vitest, and Playwright. The application is built as static files and requires no server or login for learners.

## Get started

Requires Node 22 or newer.

```sh
npm install
npm run dev
npm run check
npm test
npm run build
npm run test:e2e
```

For browser tests, install Playwright's browser via `npx playwright install chromium` once. This build targets the `dist` directory.

**Note:** The original authoring environment could not reach the npm registry, so the code was created without an executable dependency installation. Validate the installation and run all checks in a connected CI or development environment before considering the site production-ready. A lockfile must be generated and committed after the first successful `npm install`.

## Cloudflare Pages (Git integration)

Create a Pages project connected to the repository's `main` branch. Set build command `npm run build`, output directory `dist`, and project name `free-japanese-academy` if available. Do not use Direct Upload if you want automatic Git-based deployments.

The initial Astro `site` value is `https://free-japanese-academy.pages.dev`. If a custom domain is configured, set `PUBLIC_SITE_URL` to the canonical origin and update `public/robots.txt` to use its sitemap URL. Verify the Pages subdomain and site URL are correct before indexing.

## Structure

- `src/content.config.ts` — versioned lesson metadata schema.
- `src/content/lessons/` — MDX lessons. Exactly one sample lesson is included.
- `src/lib/curriculum.ts` — five-level course roadmap.
- `src/lib/progress.ts` — versioned IndexedDB schema, import/export, completions, quiz attempts, bookmarks.
- `src/lib/quiz.ts` — score logic and sample questions.
- `src/components/interactive/` — React components hydrated only for working interactive features.
- `src/pages/learn/` — static course and lesson routes.
- `src/layouts/Base.astro` — shared layout, schema, meta, navigation and footer.
- `public/` — logo and favicon.

## Content policy

The N5–N1 pathway is a roadmap, **not** an official JLPT list. Incomplete levels are set to noindex. Sample lesson and quiz pages are noindex, and course pages state that the full curriculum is not yet published. Avoid creating hundreds of empty SEO pages. Published educational material should be checked by fluent Japanese speakers.

## Learner data

Dexie stores lesson completion, bookmarks, quiz attempts and preferences in the visitor's own browser. Users can export, import (replacing existing data), and clear their data in the dashboard. Progress does not sync between browsers or devices. No server-side personal learner profiles exist.

## Future phase

1. Expand the content schema to modules, chapters, question banks and listening assets.
2. Add accurate original N5 learning content and chapter checkpoints.
3. Add audio, furigana toggle, spaced repetition, search when useful, and richer question types.
4. Test accessibility, pedagogical quality, content licenses, and real-user Core Web Vitals.
