# L0-M03-C02-CHK — release QA (owner :00)

- Blueprint: chapter checkpoint for small ゃ・ゅ・ょ, sound blending, sound-family chart and original paired listening.
- Original mixed assessment: 12 stable-ID single-choice questions, four kana/mora, four chart reading, four spoken comprehension; explicit answers, rationales, evidence and review bookmarks.
- Media: two unchanged L06 original AivisSpeech WAVs from src/content/audio/l0-m03-c02-l06-v1.json, with SHA-256, rights, attribution and turn timing. Independent waveform/transcript and qualified Japanese pronunciation reviews remain pending, not claimed.
- Accessibility: native audio controls, transcript reveal marked assisted, keyboard radio groups, error feedback, 320px/dark mode regression.
- Progress: local recordAttempt separates assisted and unaided; missed items can be bookmarked. Optional speaking is not required.
- Automated checks: tests/yoon-checkpoint.test.ts and tests/e2e/yoon-checkpoint.spec.ts; remote exact-head CI and production deployment must pass before release is claimed.
