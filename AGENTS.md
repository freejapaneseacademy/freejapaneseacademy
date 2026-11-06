# FreeJapaneseAcademy — agent instructions

Read `docs/automation/Master_Prompt_v2_1.txt` and the full `docs/curriculum/FreeJapaneseAcademy_Master_Curriculum_Blueprint.txt` before choosing or implementing a lesson. Follow the chapter/step's exact ID and objective, and do NOT extrapolate from a partial blueprint excerpt.

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
- Read latest `main`, active pull requests/branches, and Cloudflare production/preview deployments. If a lesson task is in progress, skip.
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
