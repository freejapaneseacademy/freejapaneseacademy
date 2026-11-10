# Architecture and editorial conventions

## Visual identity
White background, Japan red `#D71920`, charcoal `#20242C`, warm neutral `#F5F5F2`. Quiet editorial typography, generous whitespace, accessible contrast and very limited motion. The red torii-and-book logo is used on the header, with a simplified SVG favicon.

## Lessons
Add an `.mdx` file under `src/content/lessons/<level>/` and fill the schema keys in `src/content.config.ts`: `title`, `description`, `level`, `module`, `chapter`, `order`, `minutes`, `objectives`, `prerequisites`, `related`, `version`, and `isDemo`.

The route is `/learn/<level>/<filename>/`. Use stable, immutable IDs once actual learner progress is recorded; if content moves, introduce explicit ID aliases/migrations rather than losing saved completions.

Use `<ruby>漢字<rt>かんじ</rt></ruby>` for Japanese furigana, with `lang="ja"` on Japanese spans. For audio, use a real licensed source and controls with text alternatives. Do not render nonfunctional play buttons. Never invent official JLPT content.

## Progress and extension points
IndexedDB database is `freejapaneseacademy-progress`, schema v1. Tables: `lessons`, `attempts`, `bookmarks`, `preferences`. Every saved attempt records the original question-bank ID and number correct. JSON backups use schema version 1; the import validator rejects malformed or oversized payloads, and imports replace all data within one IndexedDB transaction.

Future progress schema changes should use Dexie version increments and backup-file version migration. Level statistics must always be derived from the actual published content; never fabricate course counts or examination scores.

## Search and discovery
Astro produces fully rendered static HTML for discoverable public pages. Demo/placeholder pages use `noindex` and sitemap filtering. Structured data describes real site/organization identity and page breadcrumbs only. After custom-domain migration update `PUBLIC_SITE_URL`, canonical tags and robots sitemap. Avoid low-value mass-generated pages.

## Roadmap
Level → module → chapter → lesson → exercise → assessment. One accurate, reviewed lesson or exam module is more useful than hundreds of unreviewed examples. The course structure in `src/lib/curriculum.ts` is aspirational and specifically labeled as planned on the site.
