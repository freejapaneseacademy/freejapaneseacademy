#!/usr/bin/env python3
"""Generate two real Japanese dual-speaker dialogues, PCM verification and matching manifest.

AivisSpeech Engine must be listening on localhost:10101 with exact, pinned ACML
voice models installed. Does not replace or delete the archived speaking models.
No transcript or reviewer approval is inferred from binary/audio signal checks.
"""
from __future__ import annotations
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
JOB_PATH=ROOT/"scripts/tts/listening_dialogues_v2.json"
MANIFEST=ROOT/"src/content/audio/l0-m01-c01-l06.json"
OUT=ROOT/"public/audio"
BASE="http://127.0.0.1:10101"
RATE=44100
GAP_SECONDS=0.28


def get_json(path: str):
    with urllib.request.urlopen(BASE+path, timeout=90) as response:
        return json.load(response)


def post(path: str, body: bytes = b""):
    request=urllib.request.Request(BASE+path,data=body,headers={"Content-Type":"application/json"},method="POST")
    with urllib.request.urlopen(request,timeout=300) as response:
        return response.read()


def wav_frames(raw: bytes):
    if len(raw)<12000 or raw[:4]!=b"RIFF" or raw[8:12]!=b"WAVE":
        raise ValueError("Real WAV RIFF header required")
    if int.from_bytes(raw[4:8],"little")+8!=len(raw):
        raise ValueError("WAV RIFF size mismatch or truncated output")
    with wave.open(io.BytesIO(raw),"rb") as wav:
        if wav.getframerate()!=RATE or wav.getnchannels()!=1 or wav.getsampwidth()!=2:
            raise ValueError(f"Unexpected audio format: {wav.getframerate()}Hz {wav.getnchannels()}ch {wav.getsampwidth()}B")
        count=wav.getnframes()
        if not .5<=count/RATE<=45:
            raise ValueError("Invalid length of speaking turn")
        pcm=wav.readframes(count)
    values=array.array("h")
    values.frombytes(pcm)
    if sys.byteorder!="little": values.byteswap()
    sampled=values[::max(1,len(values)//40000)]
    rms=math.sqrt(sum(int(s)**2 for s in sampled)/len(sampled))/32768
    clipping=sum(abs(s)>=32760 for s in sampled)/len(sampled)
    if rms<.005 or clipping>.01:
        raise ValueError(f"Silent or clipped speaking turn: rms={rms}, clipped={clipping}")
    return pcm,count


def checked_voice_models(job):
    speakers=get_json("/speakers")
    models={}
    uuids=set()
    for role,v in job["voices"].items():
        if v["speakerUuid"] in uuids:
            raise ValueError("Separate male/female voice identity required")
        uuids.add(v["speakerUuid"])
        found=next((x for x in speakers if x.get("speaker_uuid")==v["speakerUuid"]),None)
        if not found:
            raise ValueError("Specified "+role+" voice UUID unavailable; never substitute a default model")
        name=found.get("name","")
        if role=="male" and "阿井田" not in name:
            raise ValueError("Male name/voice UUID mismatch: "+name)
        if role=="female" and "morioki" not in name.lower() and "もりおき" not in name:
            raise ValueError("Female name/voice UUID mismatch: "+name)
        style=next((x for x in found["styles"] if x["name"]==v["style"]),None)
        if style is None:
            raise ValueError("Voice has no required style: "+role+" "+v["style"])
        models[role]=int(style["id"])
        print(role, "speaker", name, "style",v["style"],"speakerID",models[role],flush=True)
    return models


def synthesis(text,voice,style):
    data=post("/audio_query?"+urllib.parse.urlencode({"speaker":style,"text":text}))
    q=json.loads(data)
    for key in ("speedScale","intonationScale","tempoDynamicsScale"):
        if key not in q:
            raise ValueError("Engine lacks expected voice control "+key)
        q[key]=voice[key]
    q["pitchScale"]=0.0
    q["outputSamplingRate"]=RATE
    q["outputStereo"]=False
    raw=post("/synthesis?speaker="+str(style),json.dumps(q,ensure_ascii=False).encode("utf-8"))
    return wav_frames(raw)


def make_audio(job,track,styles):
    pcm=bytearray()
    turns=[]
    gap=b"\x00\x00"*int(RATE*GAP_SECONDS)
    for i,turn in enumerate(track["turns"]):
        role=turn["speaker"]
        if role not in styles:
            raise ValueError("Unrecognized speaker role")
        if i and role==track["turns"][i-1]["speaker"]:
            raise ValueError("Real conversation must alternate speakers")
        start=len(pcm)/(RATE*2)
        segment,count=synthesis(turn["text"],job["voices"][role],styles[role])
        pcm.extend(segment)
        end=len(pcm)/(RATE*2)
        turns.append({"speaker":role,"speakerLabel":"Man" if role=="male" else "Woman","japanese":turn["text"],"english":turn["english"],"startSeconds":round(start,2),"endSeconds":round(end,2)})
        if i<len(track["turns"])-1:
            pcm.extend(gap)
        print("Generated",track["id"],"turn",i+1,role,"seconds",round(count/RATE,2),flush=True)
    if not 10<=len(pcm)/(RATE*2)<=120:
        raise ValueError("Unreasonable conversation duration")
    OUT.mkdir(parents=True,exist_ok=True)
    dst=OUT/track["filename"]
    with wave.open(str(dst),"wb") as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(RATE)
        wav.writeframes(pcm)
    content=dst.read_bytes()
    # Check final assembled RIFF/PCM and full audio hash.
    if not content.startswith(b"RIFF") or content[8:12]!=b"WAVE" or int.from_bytes(content[4:8],"little")+8!=len(content):
        raise ValueError("Final media invalid")
    duration=round(len(pcm)/(RATE*2),2)
    sha=hashlib.sha256(content).hexdigest()
    print("TRACK",track["id"],"complete bytes",len(content),"duration",duration,"SHA256",sha,flush=True)
    transcript="\n".join(("男性" if t["speaker"]=="male" else "女性")+"： "+t["japanese"] for t in turns)
    english="\n".join(t["speakerLabel"]+": "+t["english"] for t in turns)
    return {
       "id":track["assetId"],"status":"rights-cleared","language":"ja-JP",
       "speakerIds":["aivis-aida-shigeru-calm","aivis-morioki-normal"],
       "mediaPath":"/audio/"+track["filename"],"format":"audio/wav",
       "sampleRateHz":RATE,"channels":1,"durationSeconds":duration,
       "transcript":transcript,"english":english,
       "scriptPurpose":track["title"],"objectiveIds":[track["objectiveId"]],
       "turns":turns,
       "rights":{
         "source":"Original academy-authored two-person conversation performed by licensed AivisSpeech local models",
         "license":"AivisHub voice models ACML 1.0 (model-specific restrictions apply)",
         "licenseUris":[
           "https://hub.aivis-project.com/aivm-models/"+job["voices"]["male"]["modelUuid"],
           "https://hub.aivis-project.com/aivm-models/"+job["voices"]["female"]["modelUuid"],
           "https://github.com/Aivis-Project/ACML/blob/master/ACML-1.0.md"
         ],"redistributionCleared":True,
         "attribution":job["voices"]["male"]["credit"]+"; "+job["voices"]["female"]["credit"]
       },
       "qa":{
         "binarySignatureChecked":True,"sampleRateChecked":True,
         "nonSilentRmsChecked":True,"nonClippingPeakChecked":True,
         "nativePronunciationReviewed":False,"transcriptMatchedToAudio":False,
         "playbackTested":False,
         "sha256":sha,"bytes":len(content),
         "notes":"Two actual alternating speakers synthesized offline, licensed ACML models pinned by SHA256; no independent Japanese pronunciation or assessment review has occurred. Browser tests are separate."
       }
    }


def main():
    job=json.loads(JOB_PATH.read_text("utf-8"))
    if job["schemaVersion"]!=2 or job["lessonId"]!="l0-m01-c01-l06" or not job["candidateOnly"]:
        raise ValueError("Refusing unknown, publish-ready, or non-L06 input")
    if len(job["tracks"])!=2 or any(len(t["turns"])<4 for t in job["tracks"]):
        raise ValueError("Two real multivoice conversations required")
    if any(any(s in t["text"] for s in ("ひらがな","カタカナ","ローマ字","漢字は")) for x in job["tracks"] for t in x["turns"]):
        raise ValueError("Literacy teaching is not auditory comprehension content")
    styles=checked_voice_models(job)
    assets=[make_audio(job,t,styles) for t in job["tracks"]]
    manifest={
       "lessonId":job["lessonId"],"chapterId":"l0-m01-c01","version":2,
       "generatedBy":"AivisSpeech Engine, Aida Shigeru Calm (male) and morioki Normal (female), offline CPU",
       "storage":"Versioned static WAVs in public/audio served by Cloudflare Pages; original MeloTTS speaking-model WAVs are retained separately",
       "assets":assets
    }
    MANIFEST.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print("Manifest and both dialogue WAVs written successfully",flush=True)


if __name__=="__main__":
    main()
