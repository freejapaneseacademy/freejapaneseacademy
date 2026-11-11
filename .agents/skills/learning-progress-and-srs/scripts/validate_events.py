#!/usr/bin/env python3
"""Check illustrative event-log shape. Not compatible with legacy v1 progress backups."""
import json,sys,datetime
from pathlib import Path

def validate(d):
 errors=[]
 if not isinstance(d,dict) or d.get('schemaVersion')!=2 or not isinstance(d.get('events'),list):return ['Expected event document with schemaVersion=2 and events list']
 ids=set()
 for i,event in enumerate(d['events']):
  p=f'events[{i}]'
  if not isinstance(event,dict):errors.append(p+' is not object');continue
  ident=event.get('id')
  if not isinstance(ident,str) or not ident or ident in ids:errors.append(p+' duplicate/missing ID')
  ids.add(ident)
  try:datetime.datetime.fromisoformat(event.get('at','').replace('Z','+00:00'))
  except (ValueError,TypeError):errors.append(p+' invalid at timestamp')
  typ=event.get('type')
  if typ=='review':
   if not event.get('cardId') or not event.get('itemId'):errors.append(p+' review missing cardId/itemId')
   if event.get('rating') not in {'again','hard','good','easy'}:errors.append(p+' invalid FSRS rating')
  elif typ=='lesson-completed':
   if not event.get('lessonId') or type(event.get('contentRevision')) is not int:errors.append(p+' lesson ID/revision missing')
  else:errors.append(p+' unknown event type')
 return errors

if __name__=='__main__':
 if len(sys.argv)!=2:sys.exit('Usage: python validate_events.py events.json')
 try:d=json.loads(Path(sys.argv[1]).read_text(encoding='utf-8'))
 except (OSError,json.JSONDecodeError) as e:sys.exit(str(e))
 errors=validate(d)
 if errors:print('\n'.join('ERROR: '+v for v in errors),file=sys.stderr);sys.exit(1)
 print('Example event structure validated. Does NOT verify application migration, FSRS schedule, or data persistence.')
