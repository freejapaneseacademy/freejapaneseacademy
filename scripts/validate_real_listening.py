#!/usr/bin/env python3
"""Strict audio-only Japanese conversation and scoring QA; no native pronunciation signoff."""
import hashlib
import json
from pathlib import Path
import re
import sys
import wave

ROOT=Path(__file__).resolve().parent.parent
load=lambda p:json.loads((ROOT/p).read_text('utf-8'))
job=load('scripts/tts/listening_dialogues_v2.json')
media=load('src/content/audio/l0-m01-c01-l06.json')
bank=load('src/content/exercises/l0-m01-c01-l06.json')
checkpoint=load('src/content/exercises/l0-m01-c01-chk.json')
legacy=load('src/content/audio/l0-m01-c01-l08-speaking-legacy.json')
assert job['candidateOnly'] and job['schemaVersion']==2
assert job['voices']['male']['style']=='Calm'
assert job['voices']['female']['speakerUuid']=='396a746d-742f-4e43-b722-1182a7fab9af'
assert media['version']==2 and len(media['assets'])==2
assert bank['version']==2 and len(bank['items'])==8
assert checkpoint['version']==2
assert len(legacy['assets'])==2
assert all(x['mediaPath'].startswith('/audio/fja-lesson-audio-l06-') for x in legacy['assets'])
for i,(input_track,asset) in enumerate(zip(job['tracks'],media['assets'])):
    assert input_track['assetId']==asset['id']
    assert asset['speakerIds']==['aivis-aida-shigeru-calm','aivis-morioki-normal']
    assert len(input_track['turns'])>=4 and len(asset['turns'])==len(input_track['turns'])
    assert asset['transcript']=='\n'.join(('男性' if t['speaker']=='male' else '女性')+'： '+t['text'] for t in input_track['turns'])
    assert asset['english']=='\n'.join(('Man' if t['speaker']=='male' else 'Woman')+': '+t['english'] for t in input_track['turns'])
    assert all(a['speaker']==b['speaker'] and a['japanese']==b['text'] and a['english']==b['english']
               for a,b in zip(asset['turns'],input_track['turns']))
    assert all(input_track['turns'][j]['speaker']!=input_track['turns'][j-1]['speaker'] for j in range(1,len(input_track['turns'])))
    path=ROOT/('public'+asset['mediaPath'])
    wav=path.read_bytes()
    sha=hashlib.sha256(wav).hexdigest()
    assert sha==asset['qa']['sha256'],('WAV SHA mismatch',path)
    assert len(wav)==asset['qa']['bytes']
    assert wav[:4]==b'RIFF' and wav[8:12]==b'WAVE' and int.from_bytes(wav[4:8],'little')+8==len(wav)
    with wave.open(str(path),'rb') as f:
        assert f.getnchannels()==1 and f.getsampwidth()==2 and f.getframerate()==44100
        assert abs(round(f.getnframes()/44100,2)-asset['durationSeconds'])<=.01
    assert 10<=asset['durationSeconds']<=120
    assert asset['qa']['nativePronunciationReviewed'] is False
    print('PASS',path.name,asset['durationSeconds'],'s, SHA256',sha,'both speakers with exact transcript')
transcripts={asset['id']:asset['transcript'] for asset in media['assets']}
for i,item in enumerate(bank['items']):
    assert item['version']==2 and item['status']=='published' and item['trackId']==media['assets'][i//4]['id']
    assert item['evidence'] in transcripts[item['trackId']],('Unheard answer evidence',item['id'])
    assert item['answerKey']['choiceId'] in [x['id'] for x in item['choices']]
    assert len(item['choices'])==3
    assert not re.search(r'(?i)hiragana|katakana|kanji|romaji|script|written|printed|character shape|spell|alphabet',item['prompt'])
for q in (x for x in checkpoint['items'] if x['source']=='listening'):
    assert q['version']==2 and q['evidence'] in transcripts[q['trackId']]
    assert not re.search(r'(?i)hiragana|katakana|kanji|romaji|script|written|printed|character shape|spell',q['prompt'])
assert len([x for x in checkpoint['items'] if x['source']=='listening'])==4
assert sum(x['source']=='reading' for x in checkpoint['items'])==4
assert sum(x['source']=='concept' for x in checkpoint['items'])==8
for path in ('public/audio/fja-lesson-audio-l06-a.wav','public/audio/fja-lesson-audio-l06-b.wav'):
    assert (ROOT/path).is_file(),('Legacy speaking WAV missing',path)
print('PASS genuine listening-only assessments: 8 questions + 4 checkpoint questions, old L08 models preserved')
