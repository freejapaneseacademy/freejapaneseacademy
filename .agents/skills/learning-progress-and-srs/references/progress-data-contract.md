# Progress and FSRS integration contract

## Existing website state (Phase 1; verify latest before editing)
`src/lib/progress.ts`: Dexie database `freejapaneseacademy-progress`, version(1) with `lessons: &id,level,completedAt`; `attempts: ++id,quizId,level,at`; `bookmarks: &id,addedAt`; `preferences: &key`. Backup schemaVersion 1 and import validation. This is a documented starting point, not approval to change live user data without migration tests.

## Proposed additive v2 (subject to engineering review)
- `reviewCards`: `&id,itemId,due`, with `id` distinguishing knowledge ID + review direction, `state` compatible with selected FSRS implementation; stable canonical `itemId` links to dictionary/kanji/grammar.
- `reviewEvents`: `&id,cardId,at` with rating, sourceLessonId, revision and algorithmVersion; idempotent unique event IDs.
- `itemAttempts`: `&id,questionId,questionVersion,at` for answered scored questions; include result/skill classification but no unconsented learner personal data.
- `writingDrafts`: `&taskId,updatedAt`, opt-in save and delete; avoid default server transmission.

Backups need an explicit schema version, migration from v1, independent restoration tests and caps. Older records with missing fields must be interpreted honestly, not fabricated as new-format mastery scores.

## FSRS usage
Do not hand-write fake fixed review intervals or assign mastery from the number of cards. Use FSRS scheduling with ratings appropriate to outcome; do not auto-rate a listening task as vocabulary recall unless it tests that item. Maintain a consistent timezone strategy and date serialization (`ISO 8601`). Preserve the last successful scheduler state and maintain event metadata for future audit. Account for clock changes, repeated clicks, import conflict and content-revision changes.

## Browser/privacy reliability
Try/catch storage-not-supported errors; provide explanatory UI when IndexedDB blocked; avoid quiet fallback to volatile storage that pretends persistence. Transactional restore, manual backup export, explicit clear confirmation, mobile touch accessibility and no personal analytics.

## Recommended tests
- v1 -> v2 migration preserves completion and bookmarks
- failed import leaves previous data intact
- repeated mark-complete is idempotent
- repeated review event does not count twice
- vocabulary shared across chapters creates one canonical review item
- changing lesson URL does not change stable progress record
- no writing upload or audio collection by default
