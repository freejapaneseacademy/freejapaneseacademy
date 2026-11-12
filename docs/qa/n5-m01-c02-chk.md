# N5-M01-C02-CHK — educational QA and release notes

Owner slot :00; task 6ae7c19d50c08191b18521bd6be98932.
Blueprint: N5-M01-C02 Questions about people; だれ/何/どこ/どれ and も; people and classroom roles; Q&A cards and interview excerpts.
Original work: four fictional classroom Q&A cards, 14 single-choice questions (6 grammar, 4 reading, 4 listening), explanatory MDX, accessible keyboard-controlled React practice, persistent versioned Dexie attempts, Base.astro route and lesson-specific tests.
Listening reuses only N5-M01-C02-L06 interview WAV URLs. Before publication, verify actual AivisSpeech WAV playback, rights, hashes, QA manifest and correspondence of spoken audio to Japanese evidence. No placeholder audio or transcript-only listening credit.
Japanese screening: distinguish どれ from どの+noun; 何ですか reading なん; も adds a second topic; contextual きょうしつです is elliptical (fuller きょうしつにいます). Independent qualified Japanese, pronunciation and assessment reviews remain pending.
Validation required: python scripts/validate_exercises.py src/content/exercises/n5-m01-c02-chk-v1.json; Astro check/build; Vitest; Playwright keyboard, retry, dark mode, 320px; exact-head release queue validation. Results must not be marked passing until executed.
