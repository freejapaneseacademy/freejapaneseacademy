---
name: learning-progress-and-srs
description: "Design, integrate, and test browser-local student progress and spaced-repetition reviews for FreeJapaneseAcademy using Dexie IndexedDB, stable lesson/knowledge IDs, safe migrations, FSRS, backups, mastery diagnostics, bookmarks and optional writing drafts."
license: MIT
metadata:
  author: FreeJapaneseAcademy
  version: "1.0.0"
---

# learning-progress-and-srs

## Start with the real application, not an imagined schema
1. Read `references/blueprint-guardrails.md` and `references/progress-data-contract.md`. Inspect current `src/lib/progress.ts`, existing Dexie version and tests in the GitHub repository before modifying any table or API.
2. Current prototype **v1** stores `lessons`, `attempts`, `bookmarks`, `preferences` and exposes `completeLesson`, `recordAttempt`, `exportProgress`, `importProgress`, `clearProgress`; preserve these interfaces and existing user records. A new detailed attempt/review/writing schema is a **planned migration**, not an existing feature.
3. Use stable IDs from the content inventory, and immutable revision keys for questions. Maintain distinct concepts: course completion, immediate assessment accuracy, delayed recall, skill diagnostics and optional speaking practice. Never equate one click or one test to mastery.
4. For SRS, use a maintained open-source FSRS implementation (`ts-fsrs`) if installed; store per-review-card scheduler state and event history in a versioned Dexie schema. Reuse vocabulary/kanji ID across courses; don't create a second vocabulary entry if the same word is taught twice. Recognition vs production cards may have distinct card IDs pointing to the same lexeme ID.
5. Implement additive migrations (`db.version(2)...upgrade(...)`) as needed; validate and preserve existing bookmarks and quiz results. Never delete or rewrite existing backup fields without migration and explicit user confirmation for destructive operations.
6. All writes should be atomic where appropriate, idempotent for repeated completion events, and robust across refresh, offline status, missing storage and import failures. Avoid optimistic success messages before storage resolves.
7. Export user-controlled JSON with `schemaVersion`, timestamps, all relevant tables, referential integrity and size limits. Import must validate schema, prevent prototype-pollution-like keys/untrusted HTML and allow reject or confirmed replacement/merge with clear conflict rules. Report unsupported future versions rather than corrupting them.
8. Do not upload progress, recordings or writing drafts to the server by default. Never promise synchronization between devices or permanence when browser data can be cleared.
9. Run unit tests for scheduling, event deduplication, backup round trip, migration from v1, simultaneous attempts and errors; browser tests for persistence, dark-mode unaffected, mobile UI and offline behavior.

## Use this sample
`assets/progress-events.example.json` documents desired **v2-oriented future events**, not a compatible v1 backup. Do not import it with the v1 backup importer. Use `python scripts/validate_events.py ...` for basic event checks.

## Release checks
- Fresh profiles start at zero; actual data renders correctly in dashboard.
- Review queue due counts come from scheduler state, not invented metrics.
- Optional speaking never affects completion.
- Export/import validated and recoverable; no surprise data loss.
- Migrations preserve already stored results, and browser-data deletion risk is disclosed.
