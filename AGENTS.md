# FreeJapaneseAcademy — agent instructions

Read `docs/automation/Master_Prompt_v2_1.txt`, `docs/automation/PARALLEL_LESSON_RELEASE.md`, and the FULL relevant module/chapter/lesson section (including prerequisites and objectives) of `docs/curriculum/FreeJapaneseAcademy_Master_Curriculum_Blueprint.txt` before implementing a lesson. Follow the exact ID and objective; do NOT invent missing curriculum details or spend a scheduled production run scanning unrelated sections.

## Six educational skills (the complete extracted source ZIPs)
- `.agents/skills/japanese-lesson-author/SKILL.md`
- `.agents/skills/interactive-exercise-builder/SKILL.md`
- `.agents/skills/japanese-audio-learning/SKILL.md`
- `.agents/skills/japanese-language-qa/SKILL.md`
- `.agents/skills/japanese-writing-practice/SKILL.md`
- `.agents/skills/learning-progress-and-srs/SKILL.md`

Read the necessary references, scripts and sample assets adjacent to those files. Read `docs/LESSON_INVENTORY.json`, `src/content.config.ts` and `src/lib/progress.ts` before editing.

## Release policy
The website owner explicitly preauthorizes AUTOMATED PUBLICATION of completed lessons **after verifiable technical and content screening**. The version-controlled Master Prompt v2.1 takes precedence over any obsolete human-approval gate in the original skill sources. Preserve their educational review procedures, clearly record independent review status, and never claim a qualified human reviewed a lesson without evidence.

## Safety for concurrent scheduled agents
- One canonical micro-lesson per invocation. Do not create adjacent lessons.
- Read latest `main`, all lesson branch refs/PRs, and Cloudflare production status. If the next lesson is already claimed, atomically claim the earliest OTHER unclaimed canonical ID and author it fully in this run. Another task being in progress is NOT a reason to skip production; the trusted release queue handles strict publication order.
- Do not force-push or overwrite changes. Recheck latest `main` immediately before merge; use expected-head SHA and merge protection.
- Never infer a successful deployment from a GitHub commit; confirm production deployment from Cloudflare.
- When tools for editing/testing/deployment are unavailable, report the blocker truthfully rather than fabricating progress or skipping tests unnoticed.
- Do not create duplicate automation schedules or expose any API keys.


## Required future listening production

The listening-only and Aivis voice policy in Master Prompt v2.1 section 9A and
docs/audio/TTS_GENERATION_POLICY.md v5 takes precedence over old blueprint
examples involving identifying printed scripts by hearing them. Before
authoring any new L06, provide an original schema-v3 candidate job under
scripts/tts/jobs/, generate true WAVs via lesson-audio-generation.yml, verify
model hashes and question evidence, and use the reusable listening interface.
Do not overwrite original speaking recordings or score identifiers. The
existing first L06 is a historical reference, not a generic script to rerun.

## Global Google AdSense integration (owner directive, 2026-11-02)

All current and future Astro pages MUST render through `src/layouts/Base.astro`,
which already includes the verified Google AdSense publisher loader once in the
document `<head>`. Never duplicate the AdSense script in individual pages or
strip/change client `ca-pub-3399213817491318` without site-owner direction.
Retain `public/ads.txt` for publisher `pub-3399213817491318`. Future page
generation must not bypass the shared layout; preserve `tests/e2e/adsense.spec.ts`.
Do not invent ad slot IDs, imply approval to serve ads, or circumvent applicable
privacy/consent requirements. See `docs/monetization/ADSENSE.md`.

## Public contact route and accountable communication

Keep the accessible `/contact/` page linked from the shared footer and mobile navigation; it contains the owner's public mailbox `free-japanese-academy@protonmail.com`, a FormSubmit HTTPS contact form and a direct mailto fallback. Preserve the privacy disclosure and `tests/e2e/contact.spec.ts`. FormSubmit needs a one-time recipient email activation before delivery: do not state delivery works without confirmation. Read `docs/monetization/CONTACT_FORM.md` for details; never send test enquiries automatically.


## Foundations course catalog and autonomous publishing (2026-11-06)
- NEVER append manual lesson cards or standalone sections in src/pages/learn/start/index.astro. It renders all published activity cards in canonical order from docs/LESSON_INVENTORY.json and MDX metadata.
- Every authored lesson must update its own MDX publicationStatus to published, inventory status to published, noindex to false, and provide its real canonical Astro route. The CI script scripts/validate_foundations_catalog.py rejects duplicates, missing steps, unindexed published lessons and out-of-layout hardcoded cards.
- The browser regression tests at tests/e2e/foundations-catalog.spec.ts check order, uniqueness, chapter checkpoints, keyboard, dark mode and 320px mobile overflow. Do not skip them.
- After fully implementing, integrating and committing a lesson to its owner branch, mark its same-repo PR ready even if GitHub Actions is still running. The trusted default-branch Autonomous Lesson Release workflow can finish merging when exact-head PUSH Lesson Quality Gates succeed and all prerequisites are already published. It never merges draft, failing, fork, stale, out-of-order or workflow-modifying PRs. Cloudflare Pages deployment matching the merge SHA is a required success signal.
- On local git checkout or DNS failure, use the connected GitHub API for Git trees, commits, refs and Actions. A failed shell command does NOT mean the connected GitHub tools are unavailable.
- A task that has no eligible unclaimed lesson should report a short neutral idle/dependency status, rather than a misleading failed-publication alert. Genuine content, CI, rights and deployment problems are reported accurately and repaired by the owner task; never fabricate success.


## Parallel lesson production and the trusted release queue (2026-11-07)
Every scheduled automation must follow docs/automation/PARALLEL_LESSON_RELEASE.md. No more than one canonical lesson per task per run; create one complete lesson, not an audit. Atomically claim a unique branch lesson/<canonical-id> after checking existing lesson refs and PRs. Independent tasks may author ahead of unpublished predecessors, but publishing is strictly canonical.

Modify only your own new lesson assets, lesson-specific tests and one new inventory entry. Do not append Foundations index cards or change shared previously published files. If a predecessor is not yet deployed, keep your complete later lesson inventory entry as draft/noindex and mark its PR ready for the release queue. It will integrate and publish in order after fresh exact-head GitHub Actions pass. For L06 immediately create a valid AivisSpeech JSON job to trigger automatic WAV production, and implement all surrounding listening content and tests in the same run.

Never misreport a queued, fully authored lesson as published; never spam the owner with audits or false "NOT PUBLISHED" headlines when another lesson is in the release queue. Fix genuine CI/media errors via connected GitHub tools, retain ownership and resume automatically. Production verification remains mandatory; technical outages cannot be waved away to meet a timed publication goal.
