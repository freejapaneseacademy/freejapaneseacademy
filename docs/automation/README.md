# Lesson automation — infrastructure and operation

## Sources
The complete blueprint and master prompt are now version-controlled:
- `docs/curriculum/FreeJapaneseAcademy_Master_Curriculum_Blueprint.txt`
- `docs/automation/Master_Prompt_v2.txt`

All six extracted custom skills, their references and validators live under `.agents/skills/`. They are local repository instructions, not automatically activated ChatGPT plugins; agents must explicitly read them.

## CI
`.github/workflows/lesson-quality.yml` installs an isolated Node 22/Python build environment on GitHub's runner and runs source integrity validation, existing exercise-bank checks, Astro diagnostics, Vitest tests, production build and Chromium Playwright end-to-end checks. This supplies a reproducible build environment even when ChatGPT scheduled tasks have no shell.

The GitHub Action **does not generate educational content itself** and **does not supply API credentials** to scheduled ChatGPT. Its successful CI run is evidence of tested repository code, not evidence of autonomous agent execution or Japanese-language human review.

## Scheduling and access
The four existing ChatGPT hourly tasks (:00, :15, :30, :45) were paused after failures. Keep them paused until ONE unattended end-to-end test has verified that scheduled tasks can (1) read these files through GitHub, (2) edit the repository, (3) obtain CI results, and (4) confirm a Cloudflare production deployment. The existence of `AGENTS.md` does not grant tools to a scheduled process.

If scheduled ChatGPT tool access remains restricted, a separately authenticated coding agent running in GitHub Actions (or another supported runner) is required. Such a runner needs an explicitly configured AI provider/API key and write permissions; neither is set up by this source-only change. Do not put credentials in the repository.

## Concurrency
GitHub Actions uses a concurrency group to avoid competing CI checks on the same ref. This does **not** fully serialize separate scheduled content-generation agents. A future agent runner must acquire a cross-run lock, re-read the canonical lesson inventory, and use optimistic concurrency or protected merges before publishing.

## One-run smoke test before resuming
1. Manually trigger the `Lesson Quality Gates` workflow or create a pull request.
2. Verify every job passes, and inspect the resulting logs/artifacts.
3. Run a SINGLE attended/scheduled lesson-generator invocation and confirm it reads the exact blueprint, uses the six skills, writes one correct lesson, waits for CI and confirms production.
4. Only then resume the hourly schedules, preferably one at a time.
