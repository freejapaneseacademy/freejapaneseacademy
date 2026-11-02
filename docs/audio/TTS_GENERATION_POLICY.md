# Japanese spoken-audio production — FreeJapaneseAcademy v5 (2026-11-02)

## Curriculum separation: listening versus reading

- **Reading lessons:** use printed hiragana, katakana, kanji, romaji, furigana and charts to teach script recognition. These are visual skills.
- **Listening lessons:** feature two authentic, beginner-accessible spoken situations per chapter, such as everyday exchanges, mini-stories, simple directions, or two people talking naturally. Test information the learner can hear: a request, answer, observation, intention, order or emotion. **Never ask which characters, kanji, writing system, spelling or Latin letters are being shown or read** in a blind listening-only assessment.
- Give every recording a genuinely original Japanese transcript and speaker-by-speaker English translation. Do not render transcripts or explanatory vocabulary that answers the question before blind scoring. Learners may reveal them freely, but then the attempt becomes assisted.
- Each audible question needs exact positive evidence in the transcript and a plausible distinct distractor. Check audio-to-transcript alignment, pronunciation and context with a Japanese reviewer. Written text and waveforms alone cannot establish language or pedagogical accuracy.
- **Speaking lessons:** model and shadowing recordings about literacy remain separate when the speaking objective requires describing writing. Do not reuse them in pure listening assessments.

## Approved voices and free synthesis

**Male teacher / dialogue voice:** AivisSpeech **阿井田 茂 (Aida Shigeru)**, model UUID `47e53151-a378-46f3-abee-ce13aa07feb1`, speaker UUID `561e4e59-3bc9-4726-9028-44a3c12a6f1d`, **Calm** style, AIVMX SHA-256 `6dabe29de5ec2c1715e12a430805e1bff6ec64a315cccec2d26fad029df83243`.

**Female conversational voice:** AivisSpeech **morioki**, model UUID `baaae3c0-7b22-4605-8ba5-80c959b41a48`, speaker UUID `396a746d-742f-4e43-b722-1182a7fab9af`, **ノーマル (Normal)** style, AIVMX SHA-256 `352858a737b23fe0bd0b7bd73a4956be262aad9bb24a7bf0d1eae9a71a466469`.

Both model pages list **ACML 1.0**: [Aida voice](https://hub.aivis-project.com/aivm-models/47e53151-a378-46f3-abee-ce13aa07feb1), [morioki voice](https://hub.aivis-project.com/aivm-models/baaae3c0-7b22-4605-8ba5-80c959b41a48), [license](https://github.com/Aivis-Project/ACML/blob/master/ACML-1.0.md). Honor attribution and usage restrictions; do not imply the real morioki voice provider or the model makers personally endorsed academy content.

**Required attribution:** AivisSpeech: 阿井田 茂 (voice/model: 古山キリヲ); AivisSpeech: morioki (voice: morioki; model: yuki). These are synthetic performed voices, not interviews or real conversations.

**Production method:** local AivisSpeech Engine CPU via GitHub Actions; download the two AIVMX voice models and validate both pinned hashes before generation, then verify speaker UUID/style names. `.github/workflows/dual-voice-listening.yml`, `scripts/tts/generate_listening_dialogues_v2.py`, and `scripts/tts/listening_dialogues_v2.json` form the implemented first two-speaker reference. Alternate speaker turns, render 44.1 kHz PCM WAV, include short natural silence between turns, use versioned asset names, and keep exact SHA-256 checksums. Do not fall back to MeloTTS, Qwen3, browser TTS, a paid API or an unlicensed model.

## Reusable AivisSpeech production for all future L06 lessons

The older v2 script and existing L0-M01-C01-L06 WAVs are preserved as immutable
historical assets. Never reuse the pilot's hardcoded lesson ID and file paths.

For each later L06 in Level 0 through N1, author exactly one
`scripts/tts/jobs/<lesson-id>.json` version-3 job, using
`scripts/tts/jobs/README.md`, with approved model identities and reviewed
license terms, two distinct scenes, and 2–5 audible comprehension prompts per
track. Select `scenarioType` dialogue/interview (male/female exchange) or
story/monologue/announcement (one approved narrator).

`scripts/tts/generate_lesson_audio.py` uses the existing AivisSpeech Engine
synthesis helper but computes lesson-specific versioned output paths and rejects
overwriting existing recordings. The `.github/workflows/lesson-audio-generation.yml`
action starts on new JSON jobs pushed to `lesson/**` branches or by manual
dispatch specifying a job on such a branch. It downloads the exact approved
models, checks both model hashes, generates real 44.1 kHz PCM WAVs, runs
`scripts/tts/validate_listening_package.py`, saves audition artifacts and
commits the candidates to that same review branch, NEVER directly to main.

The lesson author must integrate the resulting separate manifest and a scored
exercise bank into `ReusableListeningPractice`. Every answer must have genuine
spoken transcript evidence, not written-script hints, with two to five scored
questions per track. No generated job or audio artifact is itself a complete
lesson or approval to publish it. Published delivery must use same-origin
Cloudflare Pages with real WAV full/range availability. Do not advance a lesson
past a failed audio generation. Review independent Japanese pronunciation and
transcript-to-waveform status accurately; do not fabricate completed human QA.
If GitHub's bot commit does not trigger downstream CI, explicitly rerun the
quality gates against the final candidate commit before merging and verifying
Cloudflare production. Older speaking-model WAVs and progress IDs must remain.

## Production gates and score integrity

1. Validate original spoken content and question evidence against both speaker turns, not against printed script shapes.
2. Verify AIVMX identities and licenses, exact WAV RIFF/PCM, duration, non-silence, clipping, output SHA-256 and precise speaker/transcript turn order. Keep `nativePronunciationReviewed` and `transcriptMatchedToAudio` false until actual independent listening review; never fabricate review.
3. Gate browser player behavior, blind/assisted score separation, correct transcript reveal, stable 320px mobile layout, and real Cloudflare Pages audio full/range/HEAD delivery. Use `scripts/validate_real_listening.py`, `scripts/verify_static_audio.mjs`, and `scripts/check_audio_delivery.mjs`.
4. Publish only fully generated media together with matching manifests and new assessment version IDs. Version scored quiz IDs when content changes so old scores aren't treated as the new test.
5. Preserve all previous originals and retain dedicated archived speaking-model sources for any lessons that still depend on their wording.
6. Keep the lesson audio flagged as synthetic with native Japanese review pending. If the media isn't real and accessible or license isn't valid, do **not** publish a scored listening activity dependent on it.

## Historical recording paths

- `public/audio/fja-lesson-audio-l06-a.wav` and `...-b.wav` are archived complete, hash-verified MeloTTS recordings retained for **Lesson 08 speaking-writing models** and rollback; they must not be silently overwritten.
- `public/audio/fja-l06-real-dialogue-a-v2.wav` and `...-b-v2.wav` are the real male/female conversation files for **Lesson 06** and **Chapter 01 checkpoint** once deployed.
- `src/content/audio/l0-m01-c01-l08-speaking-legacy.json` keeps archived speaking models independent of `src/content/audio/l0-m01-c01-l06.json`.
