# L0-M01-C02-CHK — Japanese Sound System mixed checkpoint

## Curriculum and released interaction
Canonical route: /learn/start/module-01/chapter-02/checkpoint/.
Lesson source: src/content/lessons/l0/japanese-sound-system-checkpoint.mdx.
Chapter objective: distinguish five basic Japanese vowels and meaningful mora
timing, including the nasal ん, using written and spoken sources.

The chapter checkpoint contains 16 scored original questions:
- 12 written grammar/script/word/reading/concept tasks,
  from src/content/exercises/l0-m01-c02-chk-written-v1.json;
- 4 evidence-backed spoken-meaning comprehension questions, from
  src/content/exercises/l0-m01-c02-chk-listening-v1.json,
  aligned to two published Chapter 02 L06 real WAV recordings.

The two real audio files are immutable:
public/audio/fja-l0-m01-c02-l06-a-v1.wav and ...-b-v1.wav.
The authoritative SHA-256 checksums, AivisSpeech voice-model rights,
speaker-turn evidence, and English translations are preserved in
src/content/audio/l0-m01-c02-l06-v1.json. The candidate WAVs are not modified
by the checkpoint. No graded question asks for characters or spelling when
audio is hidden. Listening transcripts may be revealed for an **assisted**
attempt; scores are recorded under a different quiz ID from blind listening.
The interface requires both playable audio clips to reach playback completion
before submitting listening scores and surfaces audio failures.

## Verification
Required exact-head CI: GitHub Actions .github/workflows/lesson-quality.yml.
- Python content and exercise-bank validation for all banks
- TypeScript/Astro check, Vitest unit, production build
- Playwright Chromium E2E tests: tests/e2e/sound-checkpoint.spec.ts
  (route, questions, audio SHA/byte ranges, score saving and retry, distinct
   blind/assisted result, completion, responsive widths and dark mode)
- Cloudflare Pages production status success for the merge SHA

The independent qualified Japanese, native audio/pronunciation, and
assessment-editor reviews are **PENDING**, not approved or fabricated.
Automated tests check integrity/operation, not native linguistic naturalness.
The owner explicitly authorizes publication after required technical gates
without separate owner review. A green CI run alone is not a verified
production deployment.
