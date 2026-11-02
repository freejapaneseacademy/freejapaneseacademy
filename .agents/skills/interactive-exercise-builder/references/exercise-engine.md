# Reusable exercise-engine contract

Inputs: current chapter objective IDs, reviewed knowledge items, published passages/recordings, question bank, learner progress API.

Each question: `id`, `version`, `status`, `type`, `level`, `objectiveIds`, `knowledgeItemIds`, `prompt`, `stimulusId` when needed, `answerKey`, `explanation`, `skills`, `choices` when relevant, and `timeLimitSeconds` only when intentionally timed. Choice objects: `id`, `text`, `rationale`; use stable IDs not array indices. Do **not** embed true/false as English-only pattern guessing when the lesson is about Japanese usage.

Types to implement progressively:
- `single-choice` -> one correct choice ID; explanatory text including why tempting distractors are wrong.
- `multiple-select` -> declared correct choice ID set and partial-credit policy explicitly documented.
- `match` -> pair IDs and labels with keyboard-select-then-select interaction.
- `ordering` -> token IDs in correct sequence; indicate acceptable alternative ordering where genuinely natural.
- `short-input` -> candidate accepted strings after documented normalization; no simplistic normalization of distinctions relevant to the objective (e.g. long vowels or っ).
- `reading-comprehension` -> canonical passage ID, evidence string/range, no automatically revealed correct option.
- `listening-comprehension` -> reviewed audio asset ID and disabled scoring until asset is published.

State machine: `not-started -> in-progress -> submitted -> reviewed`; track `attemptId`, `questionVersion`, selected/typed response, completion timestamp, correctness and optionally response time. Handle attempts to submit missing answers explicitly. During retry, restore defaults only for that attempt; never mutate original reviewed answer keys.

Feedback requirements: show correct response, why, relevant Japanese quotation, links to taught grammar/word pages, optional review card; never only red/green; announce after answer. Avoid DOM injection of untrusted user text.

Quality tests: all IDs unique; target IDs exist; each choice has a nonempty rationale; exactly one right answer for single choice; detect duplicate choices and impossible distractors; question stimulus exists; time limit and scoring consistent; no hints/alt text accidentally contain the correct answer; screenshot tests at narrow phone sizes.

Current website note: prototype contains a demo quiz and `recordAttempt` summary in `src/lib/progress.ts`; detailed attempts and FSRS need an explicitly versioned Dexie migration. Ensure `src/content.config.ts` changes and tests are backward compatible.
