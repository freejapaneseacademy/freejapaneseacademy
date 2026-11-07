# Free Japanese Academy — parallel lesson pipeline

Four independently running authors each create one complete DIFFERENT lesson per run. GitHub is the atomic ownership registry and serialized release queue. The target is one published lesson per quarter hour, but no workflow can guarantee that timing during real audio generation, failed tests or Cloudflare outages.

## Claim and build
1. Before working, read the latest published inventory, open PRs AND all refs under heads/lesson/ (including draft or not-yet-PR branches). Choose the first canonical ID not yet published and not claimed by an existing lesson branch.
2. Atomically create a branch named lesson/<canonical-lesson-id> from current main with GitHub create_branch. If the ref already exists, another task owns it: refresh and choose the next unclaimed ID. NEVER edit someone else's lesson files or branch.
3. Complete the entire lesson in this run, with original MDX, accessible canonical Astro route, interactive bank and answer feedback, responsive keyboard tests, optional speaking where needed, content integrity and QA. Add only lesson-specific files. Do not modify existing pages, styles, progress component, global course index, workflows or validators.
4. Add exactly ONE new item to docs/LESSON_INVENTORY.json. If a prerequisite is still pending, set item status to draft and noindex true until the release queue promotes it; the lesson itself must otherwise be complete. A release-ready immediate successor with full passing checks can be published/noindex false in its branch. Mark a complete PR ready, even if remote CI or audio generation is still underway.
5. For an L06 listening lesson, early in the same run add a valid rights-checked schema v3 job at scripts/tts/jobs/<lesson-id>.json to trigger the existing GitHub AivisSpeech audio generator. Write the complete instruction, listening interactions and test code in that same run while synthesis operates. The generator commits actual WAV and manifest back to the same branch. Never invent audio, license permission or pronunciation review. Do not publish until the generated assets and all audio QA actually pass.

## Release automatically, in order
- The trusted default-branch Autonomous Lesson Release workflow runs on PR, CI, main and every five minutes, serialized. It selects ONLY the first not-yet-published canonical lesson, and ONLY a ready owner-authored same-repo PR.
- Once its predecessor publishes, the coordinator safely reconciles additive lesson files with latest main, retains every already-published lesson, promotes this item's MDX/inventory to published, and dispatches fresh exact-head GitHub Actions CI on the integrated branch.
- Full source, audio, Vitest, Astro build, responsive/keyboard Playwright checks must pass for that exact head. Then the coordinator merges with expected head SHA and requires matching successful Cloudflare Pages production check.
- Later lesson authors and tests work in parallel; public merges remain sequential. No duplicate lesson is published; no publisher may overwrite another's content, skip a missing prerequisite, or disable quality checks.
- A complete lesson awaiting an earlier release is queued for publication, not failed or live. An actual failing check requires its OWNER to fix the lesson. A local Git DNS failure must not prevent use of connected GitHub API.
- Only call a lesson "published" after the exact merged main commit has succeeded on Cloudflare. An unverified or blocked release cannot truthfully be labelled success.
