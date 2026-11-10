---
name: japanese-writing-practice
description: "Design and build Japanese writing practice for FreeJapaneseAcademy, including kana and kanji tracing, Japanese IME typing, sentence building, guided composition, open response, example answers, rubrics, self-assessment and accessible mobile alternatives."
license: MIT
metadata:
  author: FreeJapaneseAcademy
  version: "1.0.0"
---

# japanese-writing-practice

## Prerequisites and scope
Read `references/blueprint-guardrails.md`, `references/writing-rubrics.md`, the selected blueprint chapter L07 and source word/grammar inventory. Students can practise writing in **every chapter**; optional handwriting is distinct from mandatory typing and comprehension.

## Activity construction
1. Specify a concrete communicative task, target language, permissible alternative wording, register, level-specific support and output size. For Level 0 emphasize kana, input-method awareness and optional tracing; N5 short sentences; N4/N3 paragraphs; N2/N1 structured arguments and nuanced responses.
2. Offer a ladder: observe model -> recombine words -> fill slots -> compose independently. Use fictional prompts to avoid collecting real names, contact information or other personal data.
3. For short *constrained* answers, define a transparent finite accepted set and minimal normalization; never auto-mark valid alternative Japanese incorrect merely for different natural word order, punctuation, or equivalent expression.
4. For open writing, provide a model answer, clear analytic rubric, targeted self-check checklist and editable draft. **Do not label unsupervised AI/simple regex feedback as teacher-graded proficiency.** If no human grader exists, call it learner self-review.
5. For kana/kanji tracing, show legitimate stroke reference data only when compatible rights/attribution are verified (e.g. KanjiVG where licensed correctly). Drawing canvases measure strokes drawn, not reliable orthographic correctness; never give a false 'correct handwriting' result based on simple point proximity.
6. Keep text entered locally with explicit save/clear controls. Avoid autosending writing to an AI or analytics endpoint. Support mobile Japanese keyboards/IME composition events, desktop keyboard, text selection, undo and accessible alternatives to drawing.
7. Produce data using `assets/writing-task.example.json`; implement component behavior in the existing React/TypeScript engine, test with different keyboard compositions and dark/light theme.
8. Link word/grammar/kanji IDs and versioned draft storage with the progress skill's migration policies.

## Good feedback pattern
After submission: show model answer, constraints checklist, grammar examples that apply, specific improvement suggestions where deterministically supported, and the ability to revise. Avoid numerical scoring for creative prose without a transparent, reviewed rubric and competent evaluator.

## Release criteria
Writing prompt and model are independently reviewed for naturalness; rubric has measurable, learner-friendly criteria; keyboard, screen-reader and IME alternatives tested; local storage/privacy explained; no forced microphone, drawing tool or user identity requirement.
