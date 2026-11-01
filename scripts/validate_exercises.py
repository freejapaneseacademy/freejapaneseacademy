#!/usr/bin/env python3
"""Validate structurally safe draft question banks; NOT linguistic or reviewer validation."""
import sys, json, unicodedata
from pathlib import Path

def fail(errors, message): errors.append(message)

def validate(data):
    errors=[]
    if not isinstance(data,dict) or not isinstance(data.get('items'),list):
        return ['Expected object with items: [question,...]']
    ids=set()
    for i,q in enumerate(data['items']):
        p=f'items[{i}]'
        if not isinstance(q,dict): fail(errors,f'{p} must be an object'); continue
        ident=q.get('id')
        if not isinstance(ident,str) or not ident.startswith('ex-'):fail(errors,f'{p}: id must start ex-')
        elif ident in ids:fail(errors,f'{p}: duplicate id {ident}')
        else:ids.add(ident)
        if type(q.get('version')) is not int or q['version']<1:fail(errors,f'{p}: positive integer version required')
        if q.get('status') not in {'drafted','internally-checked','japanese-reviewed','assessment-validated','published'}:fail(errors,f'{p}: unknown status')
        for name in ('prompt','explanation'):
            if not isinstance(q.get(name),str) or not q[name].strip():fail(errors,f'{p}: {name} is required')
        for name in ('objectiveIds','knowledgeItemIds','skills'):
            if not isinstance(q.get(name),list) or not q[name] or not all(isinstance(x,str) and x for x in q[name]):fail(errors,f'{p}: non-empty {name} required')
        typ=q.get('type'); key=q.get('answerKey')
        if not isinstance(key,dict):fail(errors,f'{p}: answerKey object required');continue
        if typ=='single-choice':
            choices=q.get('choices')
            if not isinstance(choices,list) or len(choices)<2:fail(errors,f'{p}: >=2 choices needed');continue
            cids=[c.get('id') for c in choices if isinstance(c,dict)]
            texts=[unicodedata.normalize('NFC',c.get('text','')).strip() for c in choices if isinstance(c,dict) and isinstance(c.get('text'),str)]
            if len(cids)!=len(choices) or len(set(cids))!=len(cids):fail(errors,f'{p}: missing/duplicate choice id')
            if len(set(texts))!=len(choices):fail(errors,f'{p}: duplicate/blank choices')
            if any(not isinstance(c.get('rationale'),str) or not c['rationale'].strip() for c in choices if isinstance(c,dict)):fail(errors,f'{p}: each choice requires a rationale')
            if key.get('choiceId') not in cids:fail(errors,f'{p}: correct choice must exist')
        elif typ=='short-input':
            accepted=key.get('accepted')
            if not isinstance(accepted,list) or not accepted or any(not isinstance(x,str) or not x.strip() for x in accepted):fail(errors,f'{p}: accepted answer strings required')
            if key.get('normalization') not in {'trim-and-unicode-nfc','strict'}:fail(errors,f'{p}: explicit safe normalization required')
        else:fail(errors,f'{p}: unsupported sample schema type: {typ} (author additional type-specific validator before publish)')
    return errors

if __name__=='__main__':
    if len(sys.argv)!=2:sys.exit('Usage: python validate_exercises.py exercises.json')
    try: errors=validate(json.loads(Path(sys.argv[1]).read_text(encoding='utf-8')))
    except (OSError,json.JSONDecodeError) as e:sys.exit(f'Could not read JSON: {e}')
    if errors:
        print('\n'.join('ERROR: '+v for v in errors),file=sys.stderr)
        sys.exit(1)
    print('Structural exercise validation passed. Japanese accuracy, usability and human review NOT verified.')
