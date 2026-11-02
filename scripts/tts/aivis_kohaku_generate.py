#!/usr/bin/env python3
"""Candidate-only offline AivisSpeech Kohaku audition, with strict real-WAV checks."""
import array
import hashlib
import io
import json
import math
from pathlib import Path
import sys
import urllib.parse
import urllib.request
import wave

ROOT=Path(__file__).resolve().parents[2]
job=json.loads((ROOT/"scripts/tts/aivis_kohaku_l06.json").read_text("utf-8"))
assert job["candidateOnly"] and job["modelUuid"]=="22e8ed77-94fe-4ef2-871f-a86f94e9a579"
API="http://127.0.0.1:10101"
def get(path):
    with urllib.request.urlopen(API+path, timeout=60) as r:
        return json.load(r)
def post(path, data=b"", typ="application/json"):
    req=urllib.request.Request(API+path,data=data,method="POST",headers={"Content-Type":typ})
    with urllib.request.urlopen(req,timeout=300) as r:
        return r.read()
speakers=get("/speakers")
selected=None
for speaker in speakers:
    if speaker.get("speaker_uuid")==job["speakerUuid"] or "コハク" in speaker.get("name",""):
        styles=speaker.get("styles",[])
        selected=next((s for s in styles if s.get("name") in ("ノーマル","標準","Normal")),styles[0] if styles else None)
        name=speaker.get("name","")
        break
if not selected: raise RuntimeError("Kohaku voice not installed. Never use a fallback default voice.")
style_id=selected["id"]
out=ROOT/"public/voice-preview/kohaku"
out.mkdir(parents=True,exist_ok=True)
report={"voice":name,"style":selected.get("name"),"license":job["voiceLicense"],
        "credit":job["voiceCredit"],"candidateOnly":True,
        "humanPronunciationReviewed":False,"naturalnessReviewed":False,"tracks":[]}
# AivisSpeech parameters: intonationScale is style emotion, tempoDynamicsScale is rhythmic
# variation. pitchScale is kept at zero to avoid post-synthesis degradation.
# pauseLengthScale is unsupported by this engine; teachable pacing comes from
# speed, punctuation and the deliberate delivery style, not a fake pause slider.
assert len(job.get("teachingPresets",[]))==2
presets=job["teachingPresets"]
for preset in presets:
    assert preset["id"] in ("calm","warm")
    assert 0.5 <= preset["speedScale"] <= 1.1
    assert 0.0 <= preset["intonationScale"] <= 1.2
    assert 0.0 <= preset["tempoDynamicsScale"] <= 1.3
    assert preset["pitchScale"]==0.0
    assert 0 <= preset["prePhonemeLength"] <= 1
    assert 0 <= preset["postPhonemeLength"] <= 1
    for track in job["tracks"]:
        print("Generating Kohaku teacher "+preset["id"]+" track "+track["id"],flush=True)
        params=urllib.parse.urlencode({"speaker":style_id,"text":track["text"]})
        q=json.loads(post("/audio_query?"+params))
        for key in ("speedScale","intonationScale","tempoDynamicsScale","pitchScale","prePhonemeLength","postPhonemeLength"):
            if key not in q:
                raise RuntimeError("AivisSpeech audio query missing parameter: "+key)
            q[key]=preset[key]
        raw=post("/synthesis?speaker="+str(style_id),json.dumps(q,ensure_ascii=False).encode("utf-8"))
        if len(raw)<100000 or raw[:4]!=b"RIFF" or raw[8:12]!=b"WAVE":
            raise RuntimeError("Invalid real WAV")
        if int.from_bytes(raw[4:8],"little")+8!=len(raw):
            raise RuntimeError("Truncated WAV")
        with wave.open(io.BytesIO(raw),"rb") as w:
            assert w.getnchannels()==1 and w.getsampwidth()==2
            rate=w.getframerate()
            frames=w.getnframes()
            samples=array.array("h",w.readframes(frames))
        if sys.byteorder!="little":samples.byteswap()
        duration=frames/rate
        stride=max(1,len(samples)//45000)
        subs=samples[::stride]
        rms=math.sqrt(sum(int(s)*int(s) for s in subs)/len(subs))/32768
        clipping=sum(abs(s)>=32760 for s in subs)/len(subs)
        if not 3<=duration<=90 or rms<0.005 or clipping>0.01:
            raise RuntimeError("Suspicious duration/silence/clipping")
        dest=out/("track-"+track["id"]+"-teacher-"+preset["id"]+".wav")
        dest.write_bytes(raw)
        meta={"id":track["id"],"presetId":preset["id"],"presetName":preset["name"],
              "parameters":{key:preset[key] for key in ("speedScale","intonationScale","tempoDynamicsScale","pitchScale","prePhonemeLength","postPhonemeLength")},
              "transcript":track["text"],"file":dest.name,
              "durationSeconds":round(duration,2),"bytes":len(raw),
              "sha256":hashlib.sha256(raw).hexdigest(),"sampleRateHz":rate,
              "sampledRms":round(rms,4),"sampledClipping":round(clipping,6)}
        report["tracks"].append(meta)
        print(json.dumps(meta,ensure_ascii=False),flush=True)
(out/"teacher-candidate-report.json").write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
