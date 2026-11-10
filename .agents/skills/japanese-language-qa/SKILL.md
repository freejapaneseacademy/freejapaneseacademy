---
name: japanese-language-qa
description: "Review Japanese-language course drafts, grammar, kana/kanji readings, translations, listening transcripts, distractors, level appropriateness, and release readiness for FreeJapaneseAcademy. Use before approval or publication and when correcting content bugs."
license: MIT
metadata:
  author: FreeJapaneseAcademy
  version: "1.0.0"
---

# japanese-language-qa

## Core rule: independent review required
AI-assisted QA is a **screening pass**, not a substitute for qualified Japanese-language reviewers or real audio playback. Do not invent names, credentials, timestamps, pronunciation checks or pass statuses. The source blueprint remains a draft subject to review.

## Review workflow
1. Read `references/blueprint-guardrails.md` and `references/review-rubric.md` plus relevant chapter ticket, entity inventory, current artifact, assessment key and audio/transcript artifacts.
2. Check fidelity to the exact Can-do/level/step. Verify grammar formation, particles, morphology, subject omission, collocations, transitivity, politeness/register, pragmatic intent, Japanese punctuation, kana/kanji readings, furigana and English translations. Identify misleading literal one-to-one equivalences.
3. Check level scaffolding: L0 no kanji mastery, N5 needs strong reading aid, N2/N1 allow appropriate Japanese-first content; prerequisite IDs and first-exposure/recall distinctions must be respected.
4. Check original example sentences for naturalness, varied context, accessibility, unwanted stereotypes, cultural oversimplification and invented claims.
5. Audit every scored question: exactly supported answer(s), all distractors plausible and distinct, rationales accurate, question answerable from passage/audio, no leaked correct answer; answer keys and content revisions versioned.
6. Check media declarations against actual recordings and rights metadata; if unable to listen, explicitly mark **audio pronunciation unverified**. Verify learner writing rubrics without pretending to give an objectively graded free-composition score.
7. Check rights/source permissions and appropriate study pages/indexing. Treat third-party dictionary data as a source requiring licensing/attribution, not as automatically public-domain.
8. Produce `assets/review-report.template.md`-style report with per-issue severity, exact location, proposed fix, confidence, reviewer and unresolved questions. Separate defects from stylistic preferences. Run structural validators from other skills where available.
9. Unless a qualified human reviewer has signed off, recommend at most `internally-checked`, even if an AI-assisted pass finds zero issues. Never mark `japanese-reviewed`, `pronunciation-reviewed`, `assessment-validated` or `published` on AI judgment alone.

## Severity policy
- BLOCKER: invalid answer key, misleading Japanese, missing audio/license/rights, unsafe data handling, inaccessible indispensable task, fabricated JLPT claims.
- MAJOR: contextual unnaturalness, misleading translation, wrong difficulty, missing rationale, conflicting vocabulary/kanji ID, nonfunctional exercise.
- MINOR: typography, phrasing or optional pedagogical enhancement not likely to mislead.

## Release gates
A chapter must have human Japanese review, independently checked scored questions, actual reviewed audio and transcripts, license clearance, accessibility validation, working browser tests, and editorial signoff before it is indexed as complete. Report `not verified` for any check not executed. The user can still review a preview in draft/noindex state.
