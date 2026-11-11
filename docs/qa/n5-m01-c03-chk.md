# N5-M01-C03-CHK — educational QA and release notes
Owner slot :00; task 6ae7c19d50c08191b18521bd6be98932.
Blueprint: N5-M01-C03 Family and relationships; の possession, こちら/その人; family terms, honorifics, original family chart and family talk.
Original work: four fictional chart cards; fourteen versioned single-choice questions (six grammar, four reading, four listening); guided writing and optional speaking; keyboard-accessible React; persistent versioned attempts; Base.astro canonical route and dedicated unit/browser tests.
Audio: reuse ONLY licensed original N5-M01-C03-L06 recordings at /audio/fja-n5-m01-c03-l06-{a,b}-v1.wav. Verify actual WAV generation, model license, hashes, QA manifest, audio-to-transcript alignment and browser playback before publication. No fabricated recording or human pronunciation verification. Listening locked without both playable WAVs.
Japanese screening: 母/お母さん and 兄/お兄さん depend on whose family is discussed; こちら introduces a person politely; その人 is referential; の direction and じゃありません negative are tested. Independent Japanese, assessment and pronunciation reviews pending.
Required execution (not claimed passed): python scripts/validate_exercises.py src/content/exercises/n5-m01-c03-chk-v1.json; Astro check/build; Vitest; Playwright keyboard, retry, dark mode, 320px; exact-head release queue and media checks.
