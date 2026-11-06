#!/usr/bin/env python3
"""Keep the Foundations catalog canonical, ordered and structurally sound.

Run in GitHub Actions before Astro/build and the browser test suite.
A lesson publisher must edit docs/LESSON_INVENTORY.json and its own lesson;
it must NEVER append another manual card, <section> or markup after </Base>.
"""
import json
import re
import sys
from pathlib import Path

ROOT=Path(__file__).resolve().parent.parent
INDEX=ROOT/'src/pages/learn/start/index.astro'
INVENTORY=ROOT/'docs/LESSON_INVENTORY.json'
errors=[]

source=INDEX.read_text(encoding='utf-8')
if source.count('</Base>')!=1:
    errors.append('Foundations index must contain exactly one closing </Base>')
if '<div class="available-lesson"' in source or 'class="available-lesson"' in source:
    errors.append('Do not hardcode or append lesson cards to index.astro; render inventory')
if 'buildFoundationsCatalog(inventory.items' not in source:
    errors.append('Foundations index is not generated from the canonical inventory')
if re.search(r'</Base>[\s\S]*<\s*(?:section|div|a)\b',source):
    errors.append('Markup outside the shared Base layout')
if source.count('<section class="page-body"')!=1:
    errors.append('Foundations index must have one page-body layout containing the catalog')

entries=json.loads(INVENTORY.read_text(encoding='utf-8'))['items']
seen=set()
chapter_slots={}
for item in entries:
    if item.get('level')!='l0' or item.get('status')!='published':
        continue
    id=item['id']
    match=re.fullmatch(r'l0-m(\d{2})-c(\d{2})-(l(\d{2})|chk)',id)
    if id in seen: errors.append('Duplicate published lesson ID '+id)
    seen.add(id)
    if not match:
        errors.append('Unexpected Foundations ID '+id)
        continue
    module,chapter,slot,num=match.groups()
    expected='/learn/start/module-'+module+'/chapter-'+chapter+'/'+('checkpoint/' if slot=='chk' else 'lesson-'+num+'/')
    if item.get('url')!=expected:
        errors.append(id+' has incorrect route: '+str(item.get('url')))
    if item.get('noindex') is not False:
        errors.append(id+' is published but noindex was not set false')
    if item.get('slot')!=('CHK' if slot=='chk' else 'L'+num):
        errors.append(id+' has an inconsistent slot')
    key=module+'-'+chapter
    chapter_slots.setdefault(key,[]).append(99 if slot=='chk' else int(num))
    route=ROOT/'src/pages'/expected.strip('/')
    route=Path(str(route).rstrip('/')+'.astro')
    if not route.is_file():
        errors.append(id+' is missing canonical Astro route '+str(route.relative_to(ROOT)))
    content_path=item.get('content','')
    lesson=ROOT/content_path
    if not content_path.startswith('src/content/lessons/') or not lesson.is_file():
        errors.append(id+' has missing/invalid lesson content '+content_path)
    else:
        front=lesson.read_text(encoding='utf-8').split('---',2)
        fm=front[1] if len(front)>2 else ''
        if not re.search(r'^lessonId:\s*["\x27]?'+re.escape(id)+r'["\x27]?\s*$',fm,re.M):
            errors.append(id+' frontmatter lessonId does not match inventory')
        if not re.search(r'^publicationStatus:\s*published\s*$',fm,re.M):
            errors.append(id+' inventory is published but lesson source is not published')
for chapter,slots in chapter_slots.items():
    if len(slots)!=len(set(slots)):
        errors.append(chapter+' duplicates one or more canonical lesson slots')
    numbers=sorted(x for x in slots if x!=99)
    if numbers!=list(range(1,len(numbers)+1)):
        errors.append(chapter+' has missing or out-of-order lesson slots: '+str(numbers))
    if 99 in slots and numbers!=list(range(1,9)):
        errors.append(chapter+' has a published checkpoint before all eight lessons are published')

if errors:
    for issue in errors:
        print('CATALOG ERROR:',issue,file=sys.stderr)
    sys.exit(1)
print('Foundations catalog validated: '+str(len(seen))+' published lessons/checkpoints across '+str(len(chapter_slots))+' chapters; no hardcoded out-of-layout cards.')
