import { useEffect, useState } from 'react';
import { recordAttempt } from '../../lib/progress';
import bank from '../../content/exercises/l0-m02-c01-chk-written-v1.json';

/**
 * Written-only section of Chapter 03 checkpoint.
 * Never count this score as evidence of listening comprehension.
 * The listening score is recorded separately from written comprehension.
 */
export default function HiraganaCheckpointWritten() {
  const questions = bank.items;
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const score = questions.filter((q) => answers[q.id] === q.correctIndex).length;
  const complete = questions.every((q) => answers[q.id] !== undefined);

  async function submit() {
    if (!ready || !complete || submitted) return;
    setSubmitted(true);
    setSaving('saving');
    try {
      await recordAttempt('l0-m02-c01-chk-written-v1', 'l0', score, questions.length);
      setSaving('saved');
    } catch {
      setSaving('error');
    }
  }

  function retry() {
    setAnswers({});
    setSubmitted(false);
    setSaving('idle');
  }

  return (
    <section aria-labelledby="hiragana-checkpoint-written-title" className="space-y-6">
      <h2 id="hiragana-checkpoint-written-title" className="text-2xl font-semibold">Kana recognition and reading checkpoint</h2>
      <p>Answer all {questions.length} original questions. This section assesses written recognition, meaning and kana recognition only; it does not measure listening or pronunciation.</p>
      {questions.map((question, index) => (
        <fieldset key={question.id} disabled={!ready || submitted} className="rounded-xl border border-current/20 p-4">
          <legend className="px-1 font-semibold">{index + 1}. {question.prompt}</legend>
          <div className="mt-3 space-y-2">
            {question.options.map((option, optionIndex) => (
              <label key={optionIndex} className="flex cursor-pointer items-start gap-3 rounded-lg p-2 focus-within:outline focus-within:outline-2">
                <input
                  type="radio"
                  className="mt-1"
                  name={question.id}
                  checked={answers[question.id] === optionIndex}
                  onChange={() => setAnswers((previous) => ({ ...previous, [question.id]: optionIndex }))}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
          {submitted && (
            <p role="status" className="mt-3">
              <strong>{answers[question.id] === question.correctIndex ? 'Correct.' : 'Not quite.'}</strong>{' '}
              {question.feedback}
            </p>
          )}
        </fieldset>
      ))}
      {!submitted ? (
        <button type="button" disabled={!ready || !complete} onClick={submit} className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">
          Check all written answers
        </button>
      ) : (
        <div role="status" aria-live="polite" className="space-y-3">
          <p><strong>Written score: {score}/{questions.length}.</strong> This is not an official JLPT score or an audio comprehension result.</p>
          {saving === 'saving' && <p>Saving your written attempt locally…</p>}
          {saving === 'saved' && <p>Written attempt saved on this device.</p>}
          {saving === 'error' && <p>Local progress storage is unavailable. Your results are still shown above but were not saved.</p>}
          <button type="button" onClick={retry} className="rounded-lg border border-current px-5 py-3 font-semibold">Try the written questions again</button>
        </div>
      )}
    </section>
  );
}
