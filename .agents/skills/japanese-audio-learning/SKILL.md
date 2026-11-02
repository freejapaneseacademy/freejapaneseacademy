---
name: japanese-audio-learning
description: "Prepare, integrate, and quality-check Japanese listening and model-speaking audio for FreeJapaneseAcademy: original dialogues, scripts, transcripts, playback controls, listening assessments, speaker/rights metadata, and audio-production handoffs."
license: MIT
metadata:
  author: FreeJapaneseAcademy
  version: "1.0.0"
---

# japanese-audio-learning

## Activation
1. Read `references/blueprint-guardrails.md`, `references/audio-production-and-qa.md` and the chapter's exact L06/L08 specs.
2. Author a coherent real-life listening scenario with learning objectives, distinct speaker turns, natural Japanese and level-appropriate speed. Each chapter requires **two distinct** original *core listening* assets (not merely word pronunciations).
3. Produce separate scripts, accurately segmented Japanese transcripts, optional English translations, speaker directions and a production manifest. Keep transcripts in content data, never force them visible to a learner before they attempt the intended listening task.
4. For each clip define file name only if media exists; production method; speakers/voices; language `ja-JP`; recording/licensing provenance; duration if measured; QA checks; level; transcript; objective/question IDs.
5. Mark unrecorded clips as `script-only` with `mediaPath: null`; they are **not** usable in graded listening assessments. Do not assert you generated, listened to, reviewed or licensed any audio without doing it.
6. Prefer native `<audio controls>` with `preload="none"`/`metadata`, text transcript toggle, replay and optional speed control. Provide audio loading/failure states, volume control, and accessible transcript alternatives. Support light/dark and mobile. Do not require a third-party API or paid speech service.
7. Only use appropriately licensed original recordings or approved TTS voices; licenses of engines and individual voices **may differ**. Verify rights, attribution, permissible redistribution and model/voice constraints before publication. Do not scrape unlicensed entertainment/news audio.
8. Confirm transcript matches *actual* waveform and speaker sequence; arrange independent Japanese pronunciation QA. Audio asset `published` requires all signoffs and valid media, never merely a polished text prompt.
9. Validate manifest with `python scripts/validate_audio.py path/to/audio-manifest.json`. Use `assets/listening-assets.example.json` as an honest script-only example.

## Interaction and assessment cautions
- Listening should test comprehension without a transcript hint; show transcript after submit, or make reveal an explicitly separate practice mode not counted as blind listening proficiency.
- Replay at reasonable speeds must not make audio unintelligible; do not promise universal speed adjustment quality.
- Avoid automatic microphone capture. Speaking clips are learner-initiated and stored locally only when clearly consented to.

## Deliverable
Two production-ready scripts with metadata (not falsely described as finished media), questions tied to each recording, a reviewed-media status report, expected integration API, file manifest, tests and unresolved production work.
