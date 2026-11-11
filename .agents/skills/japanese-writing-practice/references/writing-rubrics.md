# Writing practice by level

| Level | Core practice | Evaluation and support |
| L0 | Kana recognition, typing, short labels, optional tracing | correct glyph/string where unambiguous; comparison with examples; do not assert motor accuracy |
| N5 | 2–5 short sentences, introductions, basic messages | sentence purpose, particles, formality, readability, simple checklist |
| N4 | 5–8 connected sentences; routine messages and short narratives | sequencing, conjugation, coherence, comprehensible register |
| N3 | paragraph-length opinions, explanations and summaries | connection, nuance, relevant examples, lexical appropriateness |
| N2 | structured response/essay or summary | task fulfillment, organization, precision, register, clarity and evidence |
| N1 | synthesis, critical analysis and nuanced formal writing | argument structure, source attribution, tone, sophisticated and correct expression |

These are proposed *academy* outcomes, not published JLPT writing requirements.

## Rubric template
For each criterion include: `id`, `label`, `whatToCheck`, `selfReviewPrompts`, `exampleOfSuccess`, `commonProblem`. Avoid vague numbers like '80% fluency'. Recommended categories: completeness of task, appropriate grammar, comprehensible vocabulary, cohesion, social register, orthography, self-revision.

## Writing data/privacy
`taskId`, `revision`, `lessonId`, `text`, `createdAt`, `updatedAt`, `savedLocally`, `userRequestedExport`. Keep drafts private by default; do not transmit them to remote APIs. Warn about browser data loss and offer export/import when implemented. If offering AI feedback in future, separately ask consent before transmission and disclose processing; do not quietly change this contract.

## Input method
Do not intercept IME `compositionstart`/`compositionend` in a way that prematurely scores half-entered kana; support paste and mobile selection. For transliteration, offer a toggle rather than permanently reinterpreting intentional Latin text. Use Unicode-aware validation but do not strip long vowels or small っ.
