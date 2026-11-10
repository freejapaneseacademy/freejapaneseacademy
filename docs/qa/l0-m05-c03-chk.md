# l0-m05-c03-chk — educational QA and release handoff

Owner: :00 / 6ae7c19d50c08191b18521bd6be98932

Blueprint: L0-M05-C03 CHK, topic-comment statements/questions; は and を preview; people/objects; mini self-intro and basic Q&A.

## Content checks
- Four new original fictional mini-profile cards; no personal data.
- Fourteen versioned single-choice questions: six grammar/script/vocabulary, four reading, four audio-first listening.
- All answer keys reference existing choices; each distractor has an explanation and each question includes supporting evidence.
- Topic は pronounced wa; object を pronounced o; ですか questions and context-driven topic omission explained.
- Two predecessor L06 AivisSpeech WAV tracks reused unchanged. Manifest on predecessor branch includes SHA-256 and redistributionCleared fields; actual audio binary and browser playback remain to be verified by CI/release.
- Transcript reveal is explicit assisted mode; no transcript shown before answer in unaided mode.
- Independent qualified Japanese review: pending, not claimed.
- Independent assessment review: pending, not claimed.
- Native pronunciation review and transcript-to-audio human matching: pending, not claimed.

## QA coverage
Dedicated Vitest validates answer keys, unique IDs and scoring. Playwright covers keyboard selection, submit/retry, transcripts and 320px overflow. Full schema validation, typecheck, build, browser tests and exact-head CI must run before publication.

Release: draft/noindex until serial coordinator promotes in strict Blueprint order. Do not merge manually or claim Cloudflare live without verified production SHA.
