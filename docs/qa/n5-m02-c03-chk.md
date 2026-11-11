# N5-M02-C03-CHK — educational QA and release notes

Owner: :00 lesson author; automation 6ae7c19d50c08191b18521bd6be98932.

## Blueprint alignment
Can-do: say an object or person exists in a place. Six grammar items on あります/います, に/が and negatives; four reading items grounded in original L05 classroom diagram lines A–D; four listening items grounded in L06's study-room and classroom conversations. These are distinct fictional settings. Writing and optional speaking are self-assessed.

## Internal content check
Teacher and cat use います; book, dictionary, notebook and bag use あります. に marks location, が marks newly presented existent, は supports topic/correction. L05: teacher front, book left desk, dictionary back bookshelf, cat near window. L06 A: notebook on desk, blue present, red absent. L06 B: teacher present, bag not in classroom but in hallway. Fourteen unique IDs, keys, Japanese evidence and choice-specific rationales; no official scoring claim.

## Technical QA to execute
- python scripts/validate_exercises.py src/content/exercises/n5-m02-c03-chk-v1.json
- npm run build
- npx vitest run src/test/n5-existence-location-checkpoint.test.ts
- npx playwright test tests/e2e/n5-existence-location-checkpoint.spec.ts
- inventory, content and release_queue validation; exact-head GitHub Actions

Tests authored but execution is not claimed. Listening scoring gated on actual playable chapter L06 WAVs. Actual WAV hashes, manifests, redistribution rights, model licensing, transcript alignment and independent pronunciation review remain unverified. Independent Japanese/assessment editor reviews pending. Keep draft/noindex until trusted coordinator promotion and Cloudflare production verification.
