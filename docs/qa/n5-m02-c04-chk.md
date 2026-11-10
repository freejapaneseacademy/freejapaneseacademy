# N5-M02-C04-CHK — educational QA and release notes

Owner: :00 author; automation 6ae7c19d50c08191b18521bd6be98932.

## Blueprint alignment
Can-do: give a basic description of a room or neighborhood. Six grammar items on 上/下/前/後ろ/中/隣 and あります/います, four reading items on an original fictional lounge notice, four listening items grounded in chapter L06 guided tours. The lounge and the two audio rooms are separate scenes. Four-sentence writing and optional speaking are self-reviewed.

## Internal evidence audit
Notice A: lamp on desk; B: bag under chair; C: bookshelf next to window; D: cat behind sofa. Audio A: book on desk and bag under desk. Audio B: cup inside shelf and cat behind chair. Correct choices each have unique IDs, Japanese evidence and feedback. No official scoring or independent reviewer claimed.

## Required technical checks
- python scripts/validate_exercises.py src/content/exercises/n5-m02-c04-chk-v1.json
- npm run build
- npx vitest run src/test/n5-room-spatial-checkpoint.test.ts
- npx playwright test tests/e2e/n5-room-spatial-checkpoint.spec.ts
- content/inventory/release_queue validations and exact-head GitHub Actions

Tests are authored; execution must be verified independently. Listening scoring locks until both chapter WAVs play. Authentic WAV hashes, manifests, redistribution rights, alignment and pronunciation review remain unverified. Independent Japanese and assessment review pending. Keep draft/noindex until trusted coordinator promotion and Cloudflare confirmation.
