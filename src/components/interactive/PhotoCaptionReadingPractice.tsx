import { useEffect, useState } from 'react';
import bank from '../../content/exercises/n5-m06-c04-l05-v1.json';
import { recordAttempt } from '../../lib/progress';

export const scorePhotoCaptions = (answers: Record<string, string>) =>
  bank.items.filter((question) => answers[question.id] === question.answerKey.choiceId).length;

export default function PhotoCaptionReadingPractice() {
  const [ready, setReady] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [notice, setNotice] = useState('');
  useEffect(() => setReady(true), []);
  const complete = bank.items.every((question) => Boolean(answers[question.id]));
  async function submit() {
    if (!ready || submitted || !complete) return;
    setSubmitted(true);
    try {
      await recordAttempt('n5-m06-c04-l05-written-v1', 'n5', scorePhotoCaptions(answers), bank.items.length);
      setNotice('Attempt saved on this device.');
    } catch {
      setNotice('Storage unavailable. Your result is still displayed.');
    }
  }
  return <section aria-label="Activity photo-caption reading questions" className="min-w-0 space-y-5">
    <h2 className="text-2xl font-semibold">Check your reading evidence</h2>
    <p>Choose one answer per question. Tab to each question and use arrow keys or Space to select an option.</p>
    {bank.items.map((question, index) => <fieldset key={question.id} data-question-id={question.id} disabled={!ready || submitted} className="min-w-0 rounded-xl border border-current/30 p-3 sm:p-4">
      <legend className="font-semibold">{index + 1}. {question.prompt}</legend>
      {question.choices.map((choice) => <label key={choice.id} className="flex min-h-11 items-start gap-3 rounded-lg p-2 focus-within:outline focus-within:outline-2">
        <input type="radio" name={question.id} checked={answers[question.id] === choice.id} onChange={() => setAnswers((previous) => ({ ...previous, [question.id]: choice.id }))} />
        <span className="min-w-0 break-words">{choice.text}</span>
      </label>)}
      {submitted && <p role="status" className="mt-2"><strong>{answers[question.id] === question.answerKey.choiceId ? 'Correct. ' : 'Review. '}</strong>{question.choices.find((choice) => choice.id === answers[question.id])?.rationale}</p>}
    </fieldset>)}
    {!submitted ? <button type="button" disabled={!ready || !complete} onClick={submit} className="min-h-11 rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50">Check 12 answers</button> :
      <div role="status"><p>Written reading score: {scorePhotoCaptions(answers)}/12. This is not an official JLPT score.</p><button type="button" onClick={() => { setSubmitted(false); setAnswers({}); setNotice(''); }} className="min-h-11 rounded-lg border border-current px-4 py-2">Retry questions</button></div>}
    <p role="status" aria-live="polite">{notice}</p>
  </section>;
}
