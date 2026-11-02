# Japanese TTS generation — FreeJapaneseAcademy v3 (2026-11-02)

## Default free, offline Japanese narrator

**New recordings:** Qwen3-TTS-12Hz-0.6B-CustomVoice, voiced by **ono_anna**, Japanese `ja`, via the MIT-licensed `speech.cpp` local CPU inference CLI. **Do not use Cloudflare MeloTTS for new audio or silently fall back to browser speechSynthesis, a paid API, unlicensed source audio, or a generic non-Japanese voice.**

- [Qwen3-TTS source](https://github.com/QwenLM/Qwen3-TTS) and [Apache-2.0 model](https://huggingface.co/Qwen/Qwen3-TTS-12Hz-0.6B-CustomVoice)
- [speech.cpp Qwen3 usage](https://github.com/nyosegawa/speech.cpp/blob/main/docs/models/qwen3-tts.md): `speech tts qwen3-tts-0.6b --voice ono_anna --language ja --seed 1001 -o clip.wav '日本語のテキスト。'`
- Qwen3 0.6B quantized model is about 1.21 GB; local inference and GitHub-hosted standard Linux runners on this **public repository** do not require a paid speech API. Build minutes and availability remain subject to GitHub policy.
- Optional upgrade for approved stronger narration: `qwen3-tts-1.7b`; do not change models without new listening QA and runtime proof.
- Record voice and model identities, language, license URIs, pronunciation corrections, seed, script, duration, checksum, and QA outcomes per clip. Original scripts must be safe to publish. Do not clone real voices.
- Narration should use complete, idiomatic Japanese written with correct kanji/kana readings. Do not improvise pronunciations; have a Japanese reviewer check pitch accent, particles, morae, proper nouns, and actual voice against text.
- Generate WAVs on GitHub Actions using `scripts/tts/qwen3_generate.py` and attach artifacts to the run. A sample workflow: `.github/workflows/audio-qwen3-pilot.yml`. For further lessons prepare a jobs JSON in `scripts/tts/jobs/` (schema in pilot) and run the tool with that job.
- **Production gate:** Do not replace original, working lesson WAVs until a listener reviews real model output and the resulting recordings pass SHA-256/RIFF/PCM, non-silence/non-clipping, duration, transcript/prosody and playback checks. A machine-only waveform check is NOT a human naturalness or Japanese pronunciation review.
- Once approved, put versioned immutable audio under `public/audio/`, update the matching source/lesson manifests, verify frontend player URLs and range semantics, run strict exact-head GitHub CI and the live Cloudflare Pages audio monitor, then deploy. Never rename or overwrite existing audio URLs to mask unreviewed changes.
- No secrets, microphone input, or recurring paid inference required. Generation jobs are bounded. If no authenticated GitHub runner can execute speech.cpp, keep the lesson's media at `script-only` and block publication of scored listening; don't make a fake audio placeholder.

## Existing audio

The two L06 MeloTTS tracks currently also supply L08 and the chapter checkpoint. They remain published while Qwen3 candidate clips are independently assessed. Cloudflare Pages static audio is the delivery system; the older workers.dev KV endpoint is a legacy fallback, **not the new TTS engine**. Never delete the originals during a voice migration.
