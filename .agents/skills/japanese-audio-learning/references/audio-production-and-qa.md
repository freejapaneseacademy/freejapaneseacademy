# Listening asset production and QA

## Media stages
`script-only` -> `recorded` -> `transcript-checked` -> `pronunciation-reviewed` -> `rights-cleared` -> `published`.
Maintain a reviewer record, date, source, license URI and attribution requirement. Never advance stages based on the written script alone.

## Scenario content
Write genuine contextual interactions, not isolated list reading. An N5 meeting clip could feature two fictional speakers exchanging names and occupations, while a second clip provides a different speaker/context or information gap. Note cadence, pauses, speaking register, culturally appropriate interaction and what listeners need to detect. Do not conceal important information behind background music.

## Output files
Prefer accessible broadly supported audio such as MP3 for the web (verify codec licensing where applicable) and keep an archival recording where available. `public/audio/<id>.mp3` is a suggested path only after media exists. No fake binary, empty audio, or silent-placeholder. Store a human-checkable `.json` manifest with text and QA flags plus optionally a timestamped transcript for longer clips.

## Browser contract
`<audio controls src="...">` with a transcript toggle, a download/playback error state, safe loading UI and accessible labels. Do not preload many tracks on every lesson. Learners may replay, reveal text in practice, adjust speed where browser supports it and answer comprehension questions. A transcript reveal must change assessment mode from blind to assisted or be available post-submit, not silently count assisted listening as unseen mastery.

## Rights and QA checklist
Japanese pronunciation by human review; readings, particles and mora timing verified; volume and clipping checked; language tag and voices documented; transcript synchronized; translations checked; optional captions available; rights-cleared for worldwide redistribution; attribution in project ledger; no unconsented cloned voices; works on low-data mobile connection. Automated scripts validate only fields, not sound quality.

## Model policy — actual listening, not literacy narration

Follow `docs/audio/TTS_GENERATION_POLICY.md` (v4). Male Aida Shigeru **Calm** and female morioki **Normal** are the selected permitted voices for spoken dialogues; verify exact licenses, hashes and speaker UUIDs. Do not use prior Qwen3/MeloTTS generation for new listening content. Listening must be real speech: everyday scenes, stories or natural two-person exchanges. Never grade kana shapes, kanji spelling or romaji writing based on audio-only input. Keep archived writing-system model recordings solely for speaking practice. Real speech waveform QA, external native Japanese prosody review, literal question evidence, versioned score IDs, and public playback checks are separate gates; a polished script is not sufficient proof.
