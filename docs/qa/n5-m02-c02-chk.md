# N5-M02-C02-CHK — educational QA and release notes

Owner: independent author slot :00; automation 6ae7c19d50c08191b18521bd6be98932.

## Scope and evidence
Original chapter checkpoint for the Blueprint Can-do “Say where common places and objects are.” Six grammar questions on ここ・そこ・あそこ, どこ, に, の; four reading questions using the fictional Sakura School two-floor map from L05; four listening questions using the original community-center dialogues from L06. The school and community-center settings are explicitly distinguished.

## Content checks
- Japanese examples use polite です / あります; に marks location with あります, の links floor and side.
- Sakura School: first floor west 保健室, center 入口, east 事務室; second floor west 図書室, east 教室. No cafeteria location is inferred from this map.
- Community-center track A: library second floor; cafeteria first floor near entrance. Track B: restroom right of stairs; reception ここ.
- All fourteen questions have versioned unique IDs, four distinct options, one key, explanations, Japanese evidence and choice-specific rationales.
- Open composition has a model and five self-review criteria, no invented automatic writing grade. Optional speaking is ungraded.

## Technical QA to execute
`python scripts/validate_exercises.py src/content/exercises/n5-m02-c02-chk-v1.json`
`npm run build`
`npx vitest run src/test/n5-places-directions-checkpoint.test.ts`
`npx playwright test tests/e2e/n5-places-directions-checkpoint.spec.ts`
Run canonical inventory/content/release-queue validators and exact-head CI. Tests authored; do not claim execution without workflow results.

## Media and editorial status
Reuses L06 /audio/fja-n5-m02-c02-l06-a-v1.wav and -b-v1.wav; does not synthesize new audio. Playback gating prevents scoring until both can play. Actual WAVs, SHA-256 manifests, redistribution rights, audio/transcript alignment and independent pronunciation review must be verified by the approved pipeline. Independent qualified Japanese review and assessment editor review: pending. Astro route and inventory remain draft/noindex until trusted serial coordinator promotion; no manual out-of-order merge.
