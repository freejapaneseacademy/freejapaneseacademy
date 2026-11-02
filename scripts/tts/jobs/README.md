# Lesson-specific AivisSpeech jobs

Create exactly one new v3 JSON job per canonical listening lesson (L06) here, named
l0-m01-c02-l06.json, n5-m01-c01-l06.json, etc. Read docs/audio/TTS_GENERATION_POLICY.md.
Only level IDs l0 and n5 through n1 are supported.

Two distinct tracks a and b are mandatory, each with a unique scene. Use
scenarioType dialogue or interview with genuine male/female speaker turns, OR
story, monologue or announcement narrated by a single selected voice.
Both voice definitions must use the exact pinned IDs/hash/styles in the
reference config scripts/tts/listening_dialogues_v2.json. A narrator may
use either voice; both voices are needed in a dialogue.

Required top-level keys: schemaVersion=3, lessonId, audioVersion (positive
integer), candidateOnly=true, auditoryOnly=true, licenseReview with
modelTermsReviewed=true, redistributionCleared=true, reviewedBy=actual
reviewer, voices, tracks. Never assert rights are cleared without checking the
model's actual terms.

Each track: id=a|b, title, scenarioType, objectiveId tied to lessonId,
turns=[{speaker: male|female, text: Japanese, english: translation}],
comprehensionPrompts=[2–5 audio-answerable questions]. Do not ask about
kana/kanji/spelling/printed letters during listening. Questions are
planning prompts, not published quiz banks. Write separately validated,
evidence-backed scored questions when authoring the listening lesson.

A lesson author pushes ONE new job to a branch named lesson/*.
.github/workflows/dual-voice-listening.yml generates both WAVs and their
manifest, performs strict media checks, and commits candidates to that branch.
The workflow can also be dispatched on that branch with job_path. It never
commits directly to main or declares human pronunciation QA complete.

The manifest name is also versioned: src/content/audio/<lesson-id>-v<version>.json.
Use new audioVersion and distinct filenames for revisions; never modify
previously published WAVs or scores. Read the generated artifact and
pronunciation/translation review flags before publishing. If generation fails,
stop that lesson's publication; do not substitute browser TTS, paid services,
MeloTTS, Qwen pilot, fake media or transcript-only quiz.

For code-only tests: python3 -m unittest discover -s tests -p 'test_listening_generator.py'
