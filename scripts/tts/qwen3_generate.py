#!/usr/bin/env python3
"""Offline candidate-only Japanese Qwen3 TTS. Does not publish or alter existing media."""
from __future__ import annotations

import argparse
import array
import hashlib
import json
import math
import os
from pathlib import Path
import re
import subprocess
import sys
import wave

ID = re.compile(r"^l[0-9]+-m[0-9]+-c[0-9]+-(?:l[0-9]+|checkpoint)-[a-z0-9-]+$")
JAPANESE = re.compile(r"[\u3040-\u30ff\u3400-\u9fff]")
ENGINES = {"qwen3-tts-0.6b", "qwen3-tts-1.7b"}
ALLOWED_VOICES = {"ono_anna"}


def validate_job(job: dict) -> None:
    if not isinstance(job, dict) or job.get("schemaVersion") != 1:
        raise ValueError("Audio job schemaVersion must be 1.")
    if not job.get("candidateOnly"):
        raise ValueError("Only candidateOnly=true is supported; never auto-publish TTS.")
    if job.get("engine") not in ENGINES or job.get("voice") not in ALLOWED_VOICES:
        raise ValueError("Use a supported Qwen3 model and licensed Japanese voice.")
    if job.get("language") != "ja":
        raise ValueError("Only native Japanese voice generation is approved.")
    tracks = job.get("tracks")
    if not isinstance(tracks, list) or not (1 <= len(tracks) <= 12):
        raise ValueError("Specify between 1 and 12 original audio tracks.")
    names = set()
    for track in tracks:
        name = track.get("id")
        text = track.get("transcript")
        seed = track.get("seed")
        if not isinstance(name, str) or not ID.fullmatch(name) or name in names:
            raise ValueError("Track IDs must be unique, safe, and curriculum-linked.")
        if not isinstance(text, str) or len(text) < 10 or len(text) > 1800 or not JAPANESE.search(text):
            raise ValueError(f"Japanese original transcript required for {name}.")
        if not isinstance(seed, int) or isinstance(seed, bool) or not 0 <= seed < 2**53:
            raise ValueError(f"Safe deterministic model seed required for {name}.")
        names.add(name)


def verify_wav(path: Path) -> dict:
    content = path.read_bytes()
    if len(content) < 24044 or content[:4] != b"RIFF" or content[8:12] != b"WAVE":
        raise ValueError(f"Not an actual, nonempty RIFF/WAV recording: {path}")
    if int.from_bytes(content[4:8], "little") + 8 != len(content):
        raise ValueError(f"Truncated RIFF header for {path}")
    with wave.open(str(path), "rb") as wav:
        channels, sample_width, rate = wav.getnchannels(), wav.getsampwidth(), wav.getframerate()
        frames = wav.getnframes()
        if channels != 1 or sample_width != 2 or rate not in (24000, 44100, 48000):
            raise ValueError(f"Unexpected PCM format: {channels}ch/{sample_width}bytes/{rate}Hz")
        duration = frames / rate
        if not 1.5 <= duration <= 180:
            raise ValueError(f"Suspicious duration ({duration:.1f}s) for {path}")
        samples = array.array("h", wav.readframes(frames))
    if sys.byteorder != "little":
        samples.byteswap()
    if not samples:
        raise ValueError("Missing audio samples")
    sample_window = samples[::max(1, len(samples) // 80000)]
    rms = math.sqrt(sum(int(s)*int(s) for s in sample_window) / len(sample_window)) / 32768
    peak = max(abs(int(s)) for s in sample_window) / 32768
    clipped = sum(abs(int(s)) >= 32760 for s in sample_window) / len(sample_window)
    if rms < 0.004 or peak < 0.02:
        raise ValueError(f"Silent or nearly silent audio: RMS={rms:.5f}")
    if clipped > 0.01:
        raise ValueError(f"Clipped audio: {clipped*100:.1f}% samples near full scale")
    return {"sha256": hashlib.sha256(content).hexdigest(), "bytes": len(content),
            "sampleRateHz": rate, "channels": channels, "durationSeconds": round(duration, 2),
            "sampledRmsFraction": round(rms, 4), "sampledPeakFraction": round(peak, 4),
            "sampledClippedFraction": round(clipped, 6)}


def generate(job: dict, out: Path, speech_binary: str = "speech") -> dict:
    validate_job(job)
    out.mkdir(parents=True, exist_ok=True)
    report = {"schemaVersion": 1, "lessonId": job["lessonId"], "engine": job["engine"],
              "model": job["model"], "voice": job["voice"], "language": "ja",
              "rights": {"modelLicense": "Apache-2.0",
                         "modelUri": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-0.6B-CustomVoice",
                         "inferenceImplementation": "speech.cpp (MIT)"},
              "candidateOnly": True, "humanNaturalnessReviewed": False,
              "nativePronunciationReviewed": False, "transcriptWaveformReviewed": False,
              "tracks": []}
    for track in job["tracks"]:
        output = out / (track["id"] + ".wav")
        command = [speech_binary, "tts", job["engine"], "--voice", job["voice"],
                   "--language", "ja", "--seed", str(track["seed"]),
                   "-o", str(output), track["transcript"]]
        print("Synthesizing", track["id"], "with", job["engine"], flush=True)
        subprocess.run(command, check=True, timeout=1050)
        qa = verify_wav(output)
        report["tracks"].append({"id": track["id"], "file": output.name,
                                 "transcript": track["transcript"], "seed": track["seed"],
                                 "qa": qa})
        print("Validated:", output.name, qa, flush=True)
    (out / "candidate-report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return report


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--job", type=Path, required=True)
    parser.add_argument("--out", type=Path, required=True)
    parser.add_argument("--speech-binary", default=os.environ.get("SPEECH_BIN", "speech"))
    args = parser.parse_args()
    job = json.loads(args.job.read_text(encoding="utf-8"))
    generate(job, args.out, args.speech_binary)


if __name__ == "__main__":
    main()
