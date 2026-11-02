---
name: japanese-lesson-author
description: "Create detailed, original Level 0–N1 Japanese lesson and chapter content from the FreeJapaneseAcademy Master Curriculum Blueprint. Use for chapter IDs, micro-lessons, grammar explanations, vocabulary, readings, and structured lesson production tickets; not for coding an entirely new UI."
license: MIT
metadata:
  author: FreeJapaneseAcademy
  version: "1.0.0"
---

# japanese-lesson-author

## Activation and contract
1. Read `references/blueprint-guardrails.md` and the actual chapter or lesson passage in `FreeJapaneseAcademy_Master_Curriculum_Blueprint.txt`. Do not infer a chapter from an approximate JLPT level.
2. Read `references/lesson-structure.md` for required deliverables and writing pedagogy. Review the existing repository inventory / actual Astro content schema before generating files. This skill does **not** create production audio or authorize publication.
3. Confirm chapter ID, level, module, Can-do, language focus, vocabulary domain, required input genres, prerequisites and already introduced words/kanji. If an inventory is absent, propose a *provisional* list with stable IDs and flag collisions for review.
4. Plan one observable outcome, real-life scenario and an appropriate complexity budget; use progressively less English support at higher levels. Differentiate first exposure, guided rehearsal and tested mastery.
5. Write **L01–L08 + CHK** following the blueprint's order; build focused, concise steps (roughly 5–15 minutes when realistic, not a fixed promise). L08 is always clearly optional; completion never depends on it. At L0, adapt L02–L04 for kana and auditory discrimination.
6. For every Japanese sentence: supply natural Japanese, faithful English meaning, accurate reading/furigana where appropriate, context and register. Avoid unrealistic literal English-to-Japanese equivalences. Mark difficult claims for independent Japanese review.
7. Link content references by stable IDs. Prepare a reader-facing explanation, multiple original examples, misconception note, *controlled practice -> guided practice -> independent use*, 3–8 lesson-check items if appropriate, and links to the reference library.
8. For L05 supply an original useful reading with questions and evidence. For L06 provide **two distinct listening scripts**, transcript(s) and production tickets; do not pretend unrecorded audio exists. For L07 supply a writing prompt and rubric; for L08 model speech and a self-review rubric.
9. Put machine-readable metadata in a lesson package. Deliver draft text/MDX, entity inventory proposals, question specs, audio scripts, asset checklist and release gate report. **Set editorial status to `drafted`; never auto-publish.**

## Website integration
The existing Astro prototype's `src/content.config.ts` originally accepted `level: n5|n4|n3|n2|n1` and fields `title, description, module, chapter, order, minutes, objectives, prerequisites, related, version, isDemo`. **L0 is not yet supported by that schema.** If producing L0, request a migration adding `l0`, adjust routes and tests, and do not claim the old app already supports it. Treat the installed schema as authoritative and add fields via a reviewed migration; do not invent working endpoints.

Use `assets/lesson-package.example.json` as an illustrative *authoring package*, not a drop-in Astro Content Collection object; conversion to verified MDX frontmatter is a separate integration step. A content file should not contain hard-coded interactive component logic or duplicate vocabulary definitions.

## Strict exclusions
- No whole-level mass generation in one batch without reviewed source inventories and a pilot.
- No fabricated source attribution, native-speaker approval, recorded media, speech assessment or scoring results.
- No invented JLPT official lists, accreditation, guaranteed mastery, and no copyright-copying from published textbooks.

## Definition of done for a draft
A specific blueprint lesson ID is mapped to authentic Japanese examples, skill-appropriate exercises and prerequisites, linked reusable content IDs, accurate drafts of required assets, an unresolved-assets list, a QA checklist and honest publication status. Use the Japanese QA skill before any public release.
