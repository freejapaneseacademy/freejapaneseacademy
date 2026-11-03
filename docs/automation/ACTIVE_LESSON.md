# Active lesson — Chapter 03 L08

OWNER SLOT :30
TASK ID 6ae7c291cefc81919a2bd5a0162f0a93
Canonical ID: l0-m01-c03-l08
Branch: lesson/l0-m01-c03-l08-owner-30-20261103

## Release candidate
- Original full optional speaking MDX: src/content/lessons/l0/sound-changes-rhythm-speaking.mdx
- Canonical Astro route: src/pages/learn/start/module-01/chapter-03/lesson-08.astro
- Accessible React audio/turn shadowing, optional local MediaRecorder and self-review: src/components/interactive/RhythmSpeakingPractice.tsx
- Five versioned knowledge checks with answer rationales: src/content/exercises/l0-m01-c03-l08.json
- Canonical inventory and Foundations navigation updated.
- Browser tests: tests/e2e/rhythm-speaking.spec.ts

## Source/audio screening
Two existing published Chapter 03 L06 AivisSpeech WAVs are reused unchanged, as referenced by src/content/audio/l0-m01-c03-l06-v1.json. Track A: /audio/fja-l0-m01-c03-l06-a-v1.wav, manifest SHA-256 810e64cf694a51294c34ad569b06a44de9dd19ea7736b144e9bcd68d38537932. Track B: /audio/fja-l0-m01-c03-l06-b-v1.wav, SHA-256 3f2399263ff5803bc2545483800fb0bd25706cd43cf75d57eed31d2aba981556. Existing recorded turn boundaries and rights attribution preserved; no new audio generated. Speaking is optional, recording is initiated only by the learner, never uploaded, and never machine graded.

Automated Japanese-language screening: meanings, counters, particles and mora counts checked against the source transcript; no independent native Japanese pronunciation or naturalness review performed. Assessment editor review pending. The quiz is explicitly a knowledge check, not a speech evaluation.

## Required release actions
1. Obtain terminal success from exact-head GitHub Actions Lesson Quality Gates (source, exercise, Astro, Vitest, build, Playwright). Repair actual failures on this owner branch.
2. Confirm main and predecessor l0-m01-c03-l07 production; reconcile if main advanced.
3. Mark PR ready, merge with expected head SHA only after all checks pass.
4. Verify Cloudflare Pages production success for exact merge SHA and live canonical route before reporting publication.
