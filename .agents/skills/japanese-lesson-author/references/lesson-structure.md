# Lesson package & editorial authoring reference

## Production inputs
- Exact blueprint excerpt (not a paraphrase), chapter ID + lesson slot, first-introduction entity inventory, already-taught items, prior knowledge assumptions, intended publication status.
- Confirm chapter Can-do, example context, register (polite/casual), known patterns, genre, word limits, new-vs-reused words.
- For N5-M01-C01 sample the blueprint specifies polite introductions, は / です / じゃありません / か; never automatically apply these patterns to other chapters.

## Required content per micro-lesson
- metadata: stable ID, slug, level, module, chapter, order, revision, objectives, prerequisites, duration estimate, publication status
- learner-facing: goal stated as Can-do, explanation, Japanese text + reading, faithful translation, 2–5 contrasting contextual examples, common mistake and why, small active practice, feedback, recap and next step
- metadata: `newVocabularyIds`, `reviewVocabularyIds`, `kanjiIds`, `grammarIds`, `assetIds`, `exerciseIds`, `source/rights`, `reviewerStatus`.
- Japanese text wrapped with `lang="ja"`; use semantic ruby in *rendered* components, not unsafe injected HTML; a furigana renderer should be able to toggle readings without changing the underlying text.

## Chapter components
| Slot | Core outcome | Deliverable |
| L01 | contextual recognition | scenario and Can-do check |
| L02 | word/phrase recognition and use | curated lexical entries and examples |
| L03 | grammar and usage contrasts | explanation, forms, mistakes, active checks |
| L04 | writing system recognition | L0 kana; N5+ kanji in useful words |
| L05 | reading comprehension | 1 authored passage, evidence-based questions |
| L06 | listening comprehension | 2 independent audio *production scripts*, transcripts, questions |
| L07 | production | guided writing, non-machine-scored rubric |
| L08 | optional oral practice | model script, speaking rubric, optional record/playback |
| CHK | mixed skill checkpoint | normally 10–25 original scored questions with explanations; writing/speaking assessed separately |

## Language editorial style
Explain in clear English for L0–N5; define technical terms when first used. Show Japanese natural in the situation, then translations that preserve pragmatic meaning. Distinguish polite from casual, spoken from written and exceptions to simplified rules. Provide first-time vocabulary readings and context, avoid romaji after L0, give furigana controls when needed. Use neutral fictional characters rather than asking for personally identifiable learner data.

## File output convention
Use a `content/` or `drafts/` staging folder in Git with one content package per chapter (e.g. `drafts/n5-m01-c01/`). Store text separate from media manifests, stable references in JSON, and generated MDX only after checking active Astro schemas. Do not create indexed placeholder URLs. A change must include a QA report and build/test status; no review means no publication.
