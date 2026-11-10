# n5-m04-c01-chk — educational QA and release preparation

Owner: :00; task 6ae7c19d50c08191b18521bd6be98932. Canonical Blueprint: N5-M04-C01 CHK.

## Scope
Original integrated checkpoint for が好き/嫌い, を食べます, と, food/drink/meal words, menu evidence and ordering-dialogue listening. Ten written scored questions (six grammar, four reading); four additional listening questions are drafted, explicitly excluded from score until L06 real WAVs pass verification. Writing and optional speaking are self-reviewed, never machine graded.

## Author self-check
- Basic Japanese particles and glosses reviewed against the instructional examples.
- All answer IDs unique; every answer choice has a specific rationale; all evidence strings occur in the checkpoint menu/review or the existing L06 dialogue question bank.
- Audio dependencies: N5-M04-C01-L06 candidate dialogue A/B. No WAV, rights, hash, pronunciation or playback validation is claimed here. Release coordinator must check all before any listening score is enabled.
- Dedicated Vitest and Playwright tests cover schema/key integrity, scoring isolation, keyboard radio controls, feedback, retries, 320px and dark mode.
- Independent qualified Japanese review: pending. Independent assessment editor review: pending. No artificial review score.
- Run `python scripts/validate_exercises.py src/content/exercises/n5-m04-c01-chk-v1.json`, Astro build, Vitest, Playwright, and release_queue checks on exact head. Actual remote results must be inspected; not presumed passing.

## Release
Draft and noindex until canonical predecessor lessons are merged and trusted coordinator promotes content and inventory. Do not manually merge out of order.
