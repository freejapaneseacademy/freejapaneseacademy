#!/usr/bin/env python3
"""Verify candidate audio per lesson, without claiming human listening review."""
import argparse
import hashlib
import json
from pathlib import Path
import wave
from generate_lesson_audio import ROOT, VISUAL_QUESTION, output_paths, validate_job

def verify(job_file, require_exercises=False):
    job=json.loads(job_file.read_text("utf-8"))
    validate_job(job)
    wavs,manifest_path=output_paths(job)
    if not manifest_path.is_file():
        raise ValueError("Missing real audio manifest: "+str(manifest_path))
    manifest=json.loads(manifest_path.read_text("utf-8"))
    if manifest.get("lessonId")!=job["lessonId"] or manifest.get("version")!=job["audioVersion"]:
        raise ValueError("Manifest lesson ID/version mismatch")
    assets=manifest.get("assets",[])
    if len(assets)!=2:
        raise ValueError("Two distinct real listening recordings required")
    for track,asset,path in zip(job["tracks"],assets,wavs):
        if asset["id"]!=f"audio-{job['lessonId']}-{track['id']}" or asset["mediaPath"]!="/audio/"+path.name:
            raise ValueError("Wrong track ID or versioned filename")
        if not path.is_file():
            raise ValueError("Missing WAV: "+str(path))
        raw=path.read_bytes()
        if len(raw)<12000 or raw[:4]!=b"RIFF" or raw[8:12]!=b"WAVE" or int.from_bytes(raw[4:8],"little")+8!=len(raw):
            raise ValueError("WAV is missing, truncated or malformed")
        if hashlib.sha256(raw).hexdigest()!=asset["qa"]["sha256"] or len(raw)!=asset["qa"]["bytes"]:
            raise ValueError("WAV checksum/size mismatch")
        with wave.open(str(path),"rb") as recording:
            if (recording.getframerate(),recording.getnchannels(),recording.getsampwidth())!=(44100,1,2):
                raise ValueError("WAV PCM format mismatch")
            if abs(recording.getnframes()/44100-asset["durationSeconds"])>.02:
                raise ValueError("WAV duration mismatch")
        turns=asset.get("turns",[])
        if len(turns)!=len(track["turns"]):
            raise ValueError("Speaker-turn mismatch")
        transcript="\n".join(("男性" if t["speaker"]=="male" else "女性")+"： "+t["text"] for t in track["turns"])
        if asset.get("transcript")!=transcript:
            raise ValueError("Japanese script/transcript mismatch")
        if not all(a["speaker"]==b["speaker"] and a["japanese"]==b["text"] for a,b in zip(turns,track["turns"])):
            raise ValueError("Transcript speaker order mismatch")
        voice_labels={"male":"aivis-aida-shigeru-calm","female":"aivis-morioki-normal"}
        used=[r for r in ("male","female") if any(x["speaker"]==r for x in track["turns"])]
        if asset["speakerIds"]!=[voice_labels[r] for r in used]:
            raise ValueError("Wrong actual speaker identities")
        if not asset.get("rights",{}).get("redistributionCleared") or asset["qa"]["nativePronunciationReviewed"] is not False:
            raise ValueError("Rights/unsupported review metadata")
    bank_path=ROOT/"src/content/exercises"/(job["lessonId"]+".json")
    if require_exercises and not bank_path.is_file():
        raise ValueError("Scored listening needs a real question bank")
    if bank_path.is_file():
        bank=json.loads(bank_path.read_text("utf-8"))
        counts={a["id"]:0 for a in assets}
        transcripts={a["id"]:a["transcript"] for a in assets}
        for question in bank.get("items",[]):
            track_id=question.get("trackId")
            if track_id not in counts or VISUAL_QUESTION.search(question.get("prompt","")):
                raise ValueError("Reading question or unknown audio source in listening quiz")
            if not question.get("evidence") or question["evidence"] not in transcripts[track_id]:
                raise ValueError("Quiz answer not supported by audible speech")
            if question.get("answerKey",{}).get("choiceId") not in [c["id"] for c in question.get("choices",[])]:
                raise ValueError("Invalid listening answer key")
            counts[track_id]+=1
        if not all(2<=count<=5 for count in counts.values()):
            raise ValueError("Each track requires 2–5 evidenced listening questions")
    print("PASS reusable audio candidate:",job["lessonId"])

def main():
    parser=argparse.ArgumentParser()
    group=parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--job",type=Path)
    group.add_argument("--all",action="store_true")
    parser.add_argument("--require-exercises",action="store_true")
    args=parser.parse_args()
    jobs=sorted((ROOT/"scripts/tts/jobs").glob("*.json")) if args.all else [args.job]
    for path in jobs:
        if path.resolve().parent!=(ROOT/"scripts/tts/jobs").resolve():
            parser.error("Job must be inside scripts/tts/jobs")
        verify(path,args.require_exercises)
    print("Verified",len(jobs),"reusable listening packages")

if __name__=="__main__":
    main()
