# N5-M04-C03-CHK — educational and release QA
Owner: :30 / 6ae7c291cefc81919a2bd5a0162f0a93
Status: internally screened; independent qualified Japanese, assessment and pronunciation reviews **pending**.

## Blueprint traceability
CAN-DO: Describe food, places and objects with adjectives.
Language: い/な adjectives, です, adjective negatives; taste, size and evaluation.
Input: original short product/bakery/café reviews. Listening transfer links to predecessor L06 only when genuine audio is available.
This is a 12-item **written** checkpoint, not a listening or speaking score.

## Evidence and self-screen
- Every Japanese reading question cites an explicit phrase in original reviews A–D; no real-world commercial claims.
- Morphology checked: おいしくない, 高くない, 静かじゃありません, にぎやかじゃありません, 静かな, きれいな, いい→よくない.
- Twelve unique versioned item IDs; each has three distinct choices, explicit answerKey.choiceId, explanation, per-choice rationale, objectiveIds and knowledgeItemIds.
- Unrestricted writing is learner self-reviewed, not machine graded; no microphone or audio playback is fabricated.
- Uses existing Dexie recordAttempt ID n5-m04-c03-chk-v1, Base.astro, dark-mode utility classes, keyboard-native radios and 320px test.
- Original text only; no third-party copyrighted passages.
- Unit, Playwright, exercise validator, Astro build, content/catalog and release_queue gates must be executed on exact head. Do not infer passing CI from committed test files.
- Publication: draft/noindex pending trusted serial release queue, exact-head gates and verified Cloudflare production.
