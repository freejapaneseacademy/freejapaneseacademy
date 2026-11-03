# Active incremental lesson: l0-m01-c02-chk

Branch: `lesson/l0-m01-c02-chk-20261103-1113`  
Draft PR: https://github.com/freejapaneseacademy/freejapaneseacademy/pull/28

Status: **unpublished; implementation in progress**. Chapter 02 L08 was previously merged and is not active work.

## Completed on this branch

- Original MDX teaching and checkpoint orientation: `src/content/lessons/l0/japanese-sound-system-checkpoint.mdx`.
- Twelve original single-choice written/reading/concept questions, stable IDs, explicit answer indices and feedback: `src/content/exercises/l0-m01-c02-chk-written-v1.json`.
- Questions distinguish written reading evidence from audio comprehension. The bank is **not** a finished multi-skill checkpoint and must not be published alone.

## Required next work

1. Validate the original question bank with the repository exercise schema and Japanese QA; fix any ambiguous item or implementation mismatch.
2. Read published Chapter 02 L06 manifest and real versioned WAV metadata, confirm rights and waveform integrity, and write genuine spoken-evidence listening items. Keep transcripts hidden until scored; assisted mode must be separately identified. Do not reuse writing-system narration as blind listening.
3. Implement accessible Astro route and interactive mixed checkpoint using existing React quiz, Dexie attempt recording and retry feedback; add source validators, unit and Playwright E2E tests.
4. Update navigation, SEO and inventory without marking publication prematurely. Run authoritative exact-head lesson-quality CI, repair failures, verify Cloudflare preview, then merge with expected SHA and confirm production deployment.

Independent native Japanese pronunciation/naturalness and independent assessment reviews: **pending; no signoff claimed**.
