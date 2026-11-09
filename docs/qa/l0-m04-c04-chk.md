# L0-M04-C04-CHK — Educational and technical QA

Owner :00 · task 6ae7c19d50c08191b18521bd6be98932.

## Coverage
Blueprint Chapter 04 checkpoint: ー, ティ/ファ/チェ, common loanword spelling, original fictional café menu, station notices and the two authentic predecessor L06 announcement tracks. Thirteen versioned single-choice items: 4 script, 5 reading, 4 listening. All answer keys, choice rationales, evidence and objective/knowledge mappings are authored, not independently reviewed. The café prices and station signs are fictional.

## Accessibility and privacy
Radio fieldsets, visible keyboard focus, 44px minimum targets, native audio controls, 320px overflow check, transcript-assisted mode, explicit feedback and retry. Local Dexie attempt IDs distinguish assisted from unaided; completion uses LessonActions. No microphone required, no speech scoring or personal data collection.

## Release dependencies
Do not publish until predecessor L06's original licensed AivisSpeech WAVs are present, playable and verified against manifest SHA-256, format and redistribution rights. Checkpoint reuses them unchanged. Independent qualified Japanese, pronunciation and assessment reviews remain pending, not claimed. Required checks: scripts/validate_exercises.py, source/content validators, release_queue tests, Astro check, Vitest, build, Playwright keyboard/mobile, exact-head GitHub Actions, serial release queue and matching Cloudflare production.
