---
name: interactive-exercise-builder
description: "Implement and author reusable, accessible interactive exercises, quizzes, dictation, kana typing, matching, ordering, listening questions, and checkpoint feedback in the FreeJapaneseAcademy Astro/React website. Use when building activity engines or writing scored question data."
license: MIT
metadata:
  author: FreeJapaneseAcademy
  version: "1.0.0"
---

# interactive-exercise-builder

## Before work
1. Read `references/blueprint-guardrails.md` and `references/exercise-engine.md`, the exact blueprint chapter, existing exercises and `src/lib/progress.ts`. Reuse components instead of implementing separate UIs per lesson.
2. Choose exercise type according to objective and *evidence of competence*; never add an activity only because it looks interactive.
3. Author original questions with stable versioned IDs, skill/objective/item references, correct keys, rationale for all alternatives and helpful wrong-answer feedback. Assess the actually taught material.
4. For reading/listening, the stimulus must exist and unambiguously support the keyed answer. If a recording is not ready, mark the item `drafted` and exclude it from deployable, scored assessments.
5. Use `assets/exercises.example.json` and the canonical contract in `references/exercise-engine.md`. Validate with `python scripts/validate_exercises.py path/to/questions.json` (stdlib only) before integration.
6. Build components as React islands when needed, but keep instructional HTML static with Astro/MDX. Support answer selection, skip, retry, back, submit, review, feedback, and clear submission state. Avoid any button that looks functional but does nothing.
7. Add keyboard equivalents for dragging/matching/ordering, descriptive screen-reader announcements, proper grouping/labels and focus management. At least 44px touch targets where practical and responsive layouts at 320px and up; test both themes.
8. Bind attempts to existing Dexie `recordAttempt()` after the answer is submitted; add detailed item responses only with a schema migration coordinated with `learning-progress-and-srs`. Keep completion, attempt score and mastery separate.
9. Provide Vitest tests for normalization/scoring and Playwright end-to-end checks for keyboard, mobile, retries, answer rationale, persistence and no unauthorized microphone/network requests.

## Assessment integrity caveat
This is a **static-first client-graded practice** site. Answers included client-side may be inspected. Do not claim secure/proctored exam integrity, verified certification or tamper-proof scores without a properly designed server-side service.

## Supported input modes
Choice (one best answer), multiple-select when explicitly intended, match pairs, tap/keyboard order, Japanese IME/kana typing, short dictation, evidence-based reading, audio comprehension and formative flashcard prompts. Free composition and spoken performance may display rubrics **but must not get a fabricated automatic grade**.

## Acceptance gates
- Every question has objective IDs, knowledge IDs, version, answer explanation, clear unambiguous key; distractors are plausible, not tricked by bad translation.
- Question text and keys receive independent Japanese-language and assessment editor review before publication.
- Correct answer not leaked before the intended reveal through captions, hidden markup, furigana, labels or option styling.
- Non-visual alternative, controlled replay, functional reset and safe no-audio/unavailable-storage states.
- Actual test results recorded; no claim of tests run without executing them.
