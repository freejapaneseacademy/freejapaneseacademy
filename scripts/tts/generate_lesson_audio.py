#!/usr/bin/env python3
"""Render any approved L06 listening job with pinned AivisSpeech voices.

This creates candidate WAVs + a manifest, never publishes or signs off human QA.
The older generate_listening_dialogues_v2.py remains a reproducible L0 pilot.
"""
from __future__ import annotations

import argparse
import hashlib
import importlib.util
import io
import json
from pathlib import Path
import re
import sys
import wave

ROOT = Path(__file__).resolve().parents[2]
SCRIPT = Path(__file__).with_name("generate_listening_dialogues_v2.py")
spec = importlib.util.spec_from_file_location("fja_legacy_aivis_synthesis", SCRIPT)
if spec is None or spec.loader is None:
    raise RuntimeError("AivisSpeech synthesis utilities not found")
engine = importlib.util.module_from_spec(spec)
spec.loader.exec_module(engine)

LESSON_ID = re.compile(r"^(?:l0|n[1-5])-m[0-9]{2}-c[0-9]{2}-l06$")
JAPANESE = re.compile(r"[\u3040-\u30ff\u3400-\u9fff]")
SCENARIOS = {"dialogue", "interview", "story", "monologue", "announcement"}
VOICE_IDS = {
    "male": ("47e53151-a378-46f3-abee-ce13aa07feb1",
             "561e4e59-3bc9-4726-9028-44a3c12a6f1d", "Calm",
             "6dabe29de5ec2c1715e12a430805e1bff6ec64a315cccec2d26fad029df83243"),
    "female": ("baaae3c0-7b22-4605-8ba5-80c959b41a48",
               "396a746d-742f-4e43-b722-1182a7fab9af", "ノーマル",
               "352858a737b23fe0bd0b7bd73a4956be262aad9bb24a7bf0d1eae9a71a466469"),
}
VOICE_LABELS = {"male": "aivis-aida-shigeru-calm", "female": "aivis-morioki-normal"}
VISUAL_QUESTION = re.compile(
    r"(?i)\b(?:hiragana|katakana|kanji|romaji|script|spelling|"
    r"written|printed|letter shape|character shape|alphabet|stroke|read the text)\b"
    r"|ひらがな|カタカナ|漢字|ローマ字|字形|文字の形"
)


def validate_job(job: dict) -> None:
    if job.get("schemaVersion") != 3 or job.get("candidateOnly") is not True:
        raise ValueError("Require v3 candidate-only job; publication is a separate action")
    lesson = job.get("lessonId", "")
    if not isinstance(lesson, str) or not LESSON_ID.fullmatch(lesson):
        raise ValueError("Only canonical Level 0–N1 L06 listening IDs are allowed")
    version = job.get("audioVersion")
    if isinstance(version, bool) or not isinstance(version, int) or version < 1:
        raise ValueError("Require positive versioned audioVersion")
    rights = job.get("licenseReview", {})
    if rights.get("modelTermsReviewed") is not True or not rights.get("redistributionCleared") is True:
        raise ValueError("Record a real model-specific license check; cannot infer rights")
    if not isinstance(rights.get("reviewedBy"), str) or not rights["reviewedBy"].strip():
        raise ValueError("Name the person or agent that inspected the actual model terms")
    if job.get("auditoryOnly") is not True:
        raise ValueError("Listening exercises must be answerable through audio alone")
    voices = job.get("voices", {})
    if set(voices) != set(VOICE_IDS):
        raise ValueError("Exactly the approved male and female voice definitions are required")
    for role, (model, speaker, style, sha) in VOICE_IDS.items():
        voice = voices[role]
        if (voice.get("modelUuid"), voice.get("speakerUuid"), voice.get("style"), voice.get("sha256")) != (model, speaker, style, sha):
            raise ValueError("Approved AivisHub model identity/hash/style mismatch: " + role)
        for param in ("speedScale", "intonationScale", "tempoDynamicsScale"):
            if isinstance(voice.get(param), bool) or not isinstance(voice.get(param), (int, float)):
                raise ValueError("Invalid calm prosody control: " + param)
            if not 0.5 <= voice[param] <= 1.5:
                raise ValueError("Unsafe prosody value: " + param)
    tracks = job.get("tracks")
    if not isinstance(tracks, list) or len(tracks) != 2 or [t.get("id") for t in tracks] != ["a", "b"]:
        raise ValueError("Exactly two independent L06 tracks (a, b) are required")
    for track in tracks:
        scene = track.get("scenarioType")
        if scene not in SCENARIOS:
            raise ValueError("Track must be a real dialogue, interview, story, monologue or announcement")
        if not isinstance(track.get("title"), str) or len(track["title"].strip()) < 4:
            raise ValueError("An original scene title is required")
        if not isinstance(track.get("objectiveId"), str) or not track["objectiveId"].startswith(lesson + "-"):
            raise ValueError("Track objective must belong to this lesson")
        turns = track.get("turns")
        if not isinstance(turns, list) or not 1 <= len(turns) <= 25:
            raise ValueError("Supply 1–25 real spoken turns")
        roles = []
        for turn in turns:
            role, text, translation = turn.get("speaker"), turn.get("text"), turn.get("english")
            if role not in voices or not isinstance(text, str) or not JAPANESE.search(text):
                raise ValueError("Each turn needs a supported Japanese voice and real Japanese text")
            if not 2 <= len(text.strip()) <= 500:
                raise ValueError("Spoken turn length is outside supported range")
            if not isinstance(translation, str) or not translation.strip():
                raise ValueError("Each turn needs an English translation")
            roles.append(role)
        if scene in {"dialogue", "interview"}:
            if set(roles) != {"male", "female"} or len(turns) < 4:
                raise ValueError("Dialogues/interviews require both actual speakers and four turns")
            if not any(a != b for a, b in zip(roles, roles[1:])):
                raise ValueError("No audible speaker change")
        if scene in {"monologue", "story", "announcement"} and len(set(roles)) != 1:
            raise ValueError("Single-narrator scenes must have one consistent voice")
        prompts = track.get("comprehensionPrompts", [])
        if not isinstance(prompts, list) or not 2 <= len(prompts) <= 5:
            raise ValueError("Provide 2–5 audio-answerable comprehension prompts per track")
        for prompt in prompts:
            if not isinstance(prompt, str) or len(prompt.strip()) < 10 or VISUAL_QUESTION.search(prompt):
                raise ValueError("Reading/writing question disguised as listening assessment")
    if len(set(track["title"] for track in tracks)) != 2:
        raise ValueError("Two genuinely distinct situations are required")


def output_paths(job: dict, root: Path = ROOT) -> tuple[list[Path], Path]:
    lesson, version = job["lessonId"], job["audioVersion"]
    paths = [root / "public" / "audio" / f"fja-{lesson}-{track['id']}-v{version}.wav" for track in job["tracks"]]
    return paths, root / "src" / "content" / "audio" / f"{lesson}.json"


def render_track(job: dict, track: dict, styles: dict, destination: Path) -> dict:
    pcm = bytearray()
    turn_metadata = []
    gap = b"\x00\x00" * int(engine.RATE * engine.GAP_SECONDS)
    for index, turn in enumerate(track["turns"]):
        role = turn["speaker"]
        start = len(pcm) / (engine.RATE * 2)
        segment, _ = engine.synthesis(turn["text"], job["voices"][role], styles[role])
        pcm.extend(segment)
        end = len(pcm) / (engine.RATE * 2)
        turn_metadata.append({
            "speaker": role, "speakerLabel": "Man" if role == "male" else "Woman",
            "japanese": turn["text"], "english": turn["english"],
            "startSeconds": round(start, 2), "endSeconds": round(end, 2)
        })
        if index < len(track["turns"]) - 1:
            pcm.extend(gap)
    duration = round(len(pcm) / (engine.RATE * 2), 2)
    if not 6 <= duration <= 180:
        raise ValueError("Track must contain 6–180 seconds of real audio")
    data = io.BytesIO()
    with wave.open(data, "wb") as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(engine.RATE)
        wav.writeframes(pcm)
    raw = data.getvalue()
    if not raw.startswith(b"RIFF") or raw[8:12] != b"WAVE" or int.from_bytes(raw[4:8], "little") + 8 != len(raw):
        raise ValueError("Invalid final WAV")
    if destination.exists() and destination.read_bytes() != raw:
        raise FileExistsError(f"Refusing to overwrite existing versioned WAV: {destination}")
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_bytes(raw)
    used = [role for role in ("male", "female") if any(x["speaker"] == role for x in track["turns"])]
    transcript = "\n".join(("男性" if t["speaker"] == "male" else "女性") + "： " + t["japanese"] for t in turn_metadata)
    english = "\n".join(t["speakerLabel"] + ": " + t["english"] for t in turn_metadata)
    return {
        "id": f"audio-{job['lessonId']}-{track['id']}",
        "status": "rights-cleared", "language": "ja-JP",
        "speakerIds": [VOICE_LABELS[x] for x in used],
        "mediaPath": "/audio/" + destination.name,
        "format": "audio/wav", "sampleRateHz": engine.RATE, "channels": 1,
        "durationSeconds": duration, "transcript": transcript, "english": english,
        "scriptPurpose": track["title"], "scenarioType": track["scenarioType"],
        "objectiveIds": [track["objectiveId"]], "turns": turn_metadata,
        "rights": {
            "source": "Original academy-authored Japanese speech synthesized offline with approved AivisSpeech voices",
            "license": "AivisHub ACML 1.0; individual model restrictions reviewed separately",
            "licenseUris": [
                "https://hub.aivis-project.com/aivm-models/" + job["voices"][r]["modelUuid"]
                for r in used
            ],
            "redistributionCleared": job["licenseReview"]["redistributionCleared"],
            "reviewedBy": job["licenseReview"]["reviewedBy"],
            "attribution": "; ".join(job["voices"][r]["credit"] for r in used)
        },
        "qa": {
            "binarySignatureChecked": True, "sampleRateChecked": True,
            "nonSilentRmsChecked": True, "nonClippingPeakChecked": True,
            "nativePronunciationReviewed": False, "transcriptMatchedToAudio": False,
            "playbackTested": False,
            "sha256": hashlib.sha256(raw).hexdigest(), "bytes": len(raw),
            "notes": "Candidate WAV; automated integrity is not a Japanese pronunciation or transcript listening review."
        }
    }


def generate(job: dict, root: Path = ROOT) -> dict:
    validate_job(job)
    paths, manifest_path = output_paths(job, root)
    if manifest_path.exists():
        raise FileExistsError("Refusing to replace existing lesson manifest; increment version via reviewed migration")
    styles = engine.checked_voice_models(job)
    assets = [render_track(job, track, styles, dst) for track, dst in zip(job["tracks"], paths)]
    manifest = {
        "lessonId": job["lessonId"], "chapterId": job["lessonId"].rsplit("-l", 1)[0],
        "version": job["audioVersion"],
        "generatedBy": "AivisSpeech Engine, Aida Shigeru Calm (male) and morioki Normal (female), offline CPU",
        "storage": "Immutable versioned WAVs on same-origin Cloudflare Pages; publication requires separate quality gates",
        "assets": assets
    }
    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return manifest


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--job", type=Path, required=True, help="v3 job from scripts/tts/jobs/")
    parser.add_argument("--output-root", type=Path, default=ROOT)
    args = parser.parse_args()
    job_path = args.job.resolve()
    if job_path.parent != (ROOT / "scripts" / "tts" / "jobs").resolve() or job_path.suffix != ".json":
        parser.error("Job must be a JSON file in scripts/tts/jobs/")
    job = json.loads(job_path.read_text("utf-8"))
    manifest = generate(job, args.output_root.resolve())
    print("Candidate generated; not published:", manifest["lessonId"])
    for asset in manifest["assets"]:
        print(asset["mediaPath"], asset["qa"]["sha256"])


if __name__ == "__main__":
    main()
