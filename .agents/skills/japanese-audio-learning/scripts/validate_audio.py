#!/usr/bin/env python3
"""Validate script-only/recorded Japanese asset manifest. Does not verify audio file itself."""
import json,sys
from pathlib import Path

VALID={'script-only','recorded','transcript-checked','pronunciation-reviewed','rights-cleared','published'}
def check(d):
 errors=[]
 assets=d.get('assets') if isinstance(d,dict) else None
 if not isinstance(assets,list) or not assets:return ['assets list is required']
 seen=set()
 for i,a in enumerate(assets):
  p=f'assets[{i}]'
  if not isinstance(a,dict):errors.append(p+' must be an object');continue
  ident=a.get('id')
  if not isinstance(ident,str) or not ident.startswith('audio-') or ident in seen:errors.append(p+' ID must be unique and start audio-')
  seen.add(ident)
  if a.get('status') not in VALID:errors.append(p+' unknown status')
  if a.get('language')!='ja-JP':errors.append(p+' language must be ja-JP')
  if not isinstance(a.get('transcript'),str) or not a['transcript'].strip():errors.append(p+' transcript required')
  if not isinstance(a.get('objectiveIds'),list) or not a['objectiveIds']:errors.append(p+' objectiveIds required')
  path=a.get('mediaPath');status=a.get('status')
  qa=a.get('qa',{});rights=a.get('rights',{})
  if status=='script-only' and path is not None:errors.append(p+' script-only asset must not claim a mediaPath')
  if status!='script-only' and (not isinstance(path,str) or not path.strip()):errors.append(p+' recorded asset requires mediaPath')
  if status=='published' and not all([isinstance(qa,dict),qa.get('nativePronunciationReviewed'),qa.get('transcriptMatchedToAudio'),qa.get('playbackTested'),isinstance(rights,dict),rights.get('redistributionCleared')]):errors.append(p+' published audio requires all QA and rights signoffs')
 return errors

if __name__=='__main__':
 if len(sys.argv)!=2:sys.exit('Usage: python validate_audio.py manifest.json')
 try:d=json.loads(Path(sys.argv[1]).read_text(encoding='utf-8'))
 except (OSError,json.JSONDecodeError) as e:sys.exit(str(e))
 errors=check(d)
 if errors:
  print('\n'.join('ERROR: '+e for e in errors),file=sys.stderr);sys.exit(1)
 print('Manifest structure checked. Recordings and rights remain subject to actual human verification.')
