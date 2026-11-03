# Active incremental lesson: l0-m01-c02-chk

Branch: `lesson/l0-m01-c02-chk-20261103-1113`  
Draft PR: https://github.com/freejapaneseacademy/freejapaneseacademy/pull/28

Status: **unpublished, implementation in progress**. Chapter 02 L08 is merged and complete.

## Completed on this branch

- Original teaching and written evidence: `src/content/lessons/l0/japanese-sound-system-checkpoint.mdx`.
- Twelve original written/reading/concept questions with stable IDs and feedback: `src/content/exercises/l0-m01-c02-chk-written-v1.json`.
- Accessible React written checkpoint: `src/components/learning/SoundCheckpointWritten.tsx` (commit `067d0f5dbbc7955bdab8bb20e71e2f9eee9da6ea`). Includes individual radio groups, complete-answer gate, answer explanations, retry, and Dexie attempt recording under `l0-m01-c02-chk-written-v1`. This is deliberately **not** a listening score. Storage failures are disclosed.

## Required next work

1. Confirm exact published Chapter 02 L06 versioned WAV manifest, playable assets, SHA-256, rights and source transcripts; author spoken-meaning questions whose keys are supported by the actual audio. Keep transcripts hidden until scoring and assisted results separate.
2. Add accessible audio-first mixed checkpoint component and Astro route, integrate written React section, and ensure overall checkpoint score includes listening without conflating assisted/blind evidence.
3. Add unit/source validation and Playwright tests, verify the written component compiles and renders, then update inventory/navigation/SEO without claiming publication early.
4. Run exact-head lesson-quality CI and fix failures on this branch; verify Cloudflare preview, merge using expected head SHA only after all gates pass, and confirm production deployment.

Independent qualified Japanese, pronunciation/naturalness, and assessment-editor reviews are **pending**, not signed off. Do not merge this draft yet.
