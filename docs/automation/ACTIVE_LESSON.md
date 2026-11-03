# Current incremental lesson build — 2026-11-03

Canonical ID: **l0-m01-c02-l08** (Level 0 Module 01 Chapter 02 Lesson 08)
Branch: **lesson/l0-m01-c02-l08-20261103**
Stage: started — substantive lesson content committed, interactive functionality and tests to follow.
Next canonical item after publication: l0-m01-c02-chk.

## Source of truth / exact lesson objective
Blueprint L0-M01-C02 L08: pronounce featured sounds or rehearse a short survival
expression in a situation requiring learners to distinguish five Japanese
vowel qualities and mora timing; rehearse from model audio, recording only
on learner request. L08 is optional, and the academy never claims automated
pronunciation scores or completed independent Japanese review.

## Approved reusable media already on main
src/content/audio/l0-m01-c02-l06-v1.json, which lists real, versioned WAVs:
- /audio/fja-l0-m01-c02-l06-a-v1.wav
- /audio/fja-l0-m01-c02-l06-b-v1.wav
Both have validated SHA-256, timing positions, speaker labels, Japanese scripts,
translations and cleared model rights. Leave original WAV bytes unchanged.

## Handoff rule
A scheduled run must RESUME the active lesson branch and existing PR, not
repeat 40–80 seconds of audits. Write substantive changes before composing its
report. Once the route, React workshop, preparation exercise bank, tests,
inventory/navigation, CI and Cloudflare verification pass, merge and publish
the single lesson. If files are incomplete, keep a DRAFT PR open, commit real
progress, and leave accurate TODOs. Never report pending work as publication.

## Work left
- Implement /learn/start/module-01/chapter-02/lesson-08/ route via Base.astro
- Implement VowelSpeakingPractice React island: two real tracks, turn-level
  shadowing, optional on-device MediaRecorder, consent/denial/error handling,
  ungraded self-review, quiz that scores preparation NOT accent
- Define 5 evidence-backed preparation questions and stable IDs
- Add comprehensive source, browser/audio and mobile tests
- Add accurate progress label, inventory item and navigation
- Run full GitHub Actions checks, fix defects and verify production deployment
