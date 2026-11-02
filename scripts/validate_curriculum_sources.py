#!/usr/bin/env python3
"""Check that GitHub has the full FreeJapaneseAcademy authoring source files."""
from pathlib import Path
import sys

root = Path(__file__).resolve().parent.parent
skill_names = [
    'japanese-lesson-author',
    'interactive-exercise-builder',
    'japanese-audio-learning',
    'japanese-language-qa',
    'japanese-writing-practice',
    'learning-progress-and-srs',
]
errors = []
for name in skill_names:
    folder = root / '.agents' / 'skills' / name
    skill = folder / 'SKILL.md'
    if not skill.is_file():
        errors.append(f'Missing {skill.relative_to(root)}')
        continue
    content = skill.read_text(encoding='utf-8')
    if not content.startswith('---') or f'name: {name}' not in content or len(content) < 1000:
        errors.append(f'Invalid or incomplete skill file: {skill.relative_to(root)}')
    for subdir in ['references', 'assets']:
        if not (folder / subdir).is_dir():
            errors.append(f'Missing {subdir} for {name}')

blueprint = root / 'docs/curriculum/FreeJapaneseAcademy_Master_Curriculum_Blueprint.txt'
if not blueprint.is_file() or blueprint.stat().st_size < 500_000:
    errors.append('Full master curriculum blueprint missing or unexpectedly short')
else:
    content = blueprint.read_text(encoding='utf-8')
    for marker in ['l0-m01', 'N5-M01-C01', 'N1-M01-C01']:
        if marker not in content and marker.upper() not in content:
            errors.append(f'Blueprint missing expected marker: {marker}')

prompt = root / 'docs/automation/Master_Prompt_v2.txt'
if not prompt.is_file() or prompt.stat().st_size < 15_000:
    errors.append('Full master automation prompt missing or unexpectedly short')
elif 'ONE REQUEST = ONE COMPLETE LESSON' not in prompt.read_text(encoding='utf-8'):
    errors.append('Master prompt missing its one-lesson instruction')

if errors:
    for error in errors:
        print(f'ERROR: {error}', file=sys.stderr)
    sys.exit(1)
print('All six skill sources, curriculum blueprint and automation prompt are present.')
