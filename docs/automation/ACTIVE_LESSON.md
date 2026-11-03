# Incremental publication handoff — 2026-11-03

Canonical candidate: **L0-M01-C02-CHK**, Japanese sound system mixed checkpoint.
Branch: **lesson/l0-m01-c02-chk-20261103-1113**
PR: https://github.com/freejapaneseacademy/freejapaneseacademy/pull/28

## Ready-for-release integration
The branch now has original checkpoint MDX, twelve written and four
AivisSpeech spoken-meaning items, two accessible React grading islands,
full canonical Astro route, Foundations navigation and progression links,
published-status inventory, explicit blind/assisted Dexie score keys,
Playwright browser tests and unit/content validation.
The earlier /learn/l0/... preview route is now a noindex pointer to canonical
route and must not be treated as a second published checkpoint.

## Mandatory exact-head release steps
Check the CURRENT HEAD of PR #28, not a stale commit cited here:
1. Inspect and repair failed actual GitHub Actions checks (including audio,
   browser, source validators, build and accessibility). Wait for all checks
   to finish successfully against exactly the current head SHA.
2. If full implementation and CI pass, owner already preapproved automatic
   publication. MARK DRAFT PR READY AND MERGE with expected_head_sha.
   No human approval, manual signoff, review request or separate confirmation.
3. Verify Cloudflare production deploy succeeds for exact merged commit SHA.
4. After checkpoint is live, ignore historical draft instructions, select
   next missing canonical lesson **L0-M01-C03-L01** from current inventory.
5. If CI is still running, do not call it published; leave branch intact.
   If any check fails, fix its actual problem and commit on existing PR.

Independent Japanese/pronunciation and assessment-editor reviews remain
truthfully PENDING; they are not owner-approval gates.
