import { useEffect, useState } from 'react';
import bank from '../../content/exercises/n5-m06-c02-chk-v1.json';
import { recordAttempt } from '../../lib/progress';
export const scoreTeFormCheckpoint = (answers: Record<string,string>) => bank.items.filter(q => answers[q.id] === q.answerKey.choiceId).length;
export default function TeFormChapterCheckpoint() {
  const [ready,setReady] = useState(false);
  const [answers,setAnswers] = useState<Record<string,string>>({});
  const [submitted,setSubmitted] = useState(false);
  const [notice,setNotice] = useState('');
  useEffect(() => setReady(true), []);
  const complete = bank.items.every(q => Boolean(answers[q.id]));
  async function submit() {
    if (!ready || submitted || !complete) return;
    setSubmitted(true);
    try {
      await recordAttempt('n5-m06-c02-chk-written-v1','n5',scoreTeFormCheckpoint(answers),bank.items.length);
      setNotice('Written checkpoint attempt saved on this device.');
    } catch {
      setNotice('Browser storage unavailable; your written score is still visible.');
    }
  }
  return <section className="min-w-0 space-y-5" aria-label="Te-form chapter checkpoint">
    <h2 className="text-2xl font-semibold">Written chapter checkpoint</h2>
    <p>Choose one answer per question. Use Tab and arrow keys. This is not a listening or speaking assessment.</p>
    {bank.items.map((q,i) => <fieldset key={q.id} data-question-id={q.id} disabled={!ready || submitted} className="min-w-0 rounded-xl border border-current/30 p-3 sm:p-4">
      <legend className="font-semibold">{i+1}. {q.prompt}</legend>
      {q.choices.map(c => <label key={c.id} className="flex min-h-11 items-start gap-3 rounded-lg p-2 focus-within:outline focus-within:outline-2">
        <input type="radio" name={q.id} checked={answers[q.id] === c.id} onChange={() => setAnswers(prev => ({...prev,[q.id]:c.id}))} />
        <span className="break-words" lang="ja">{c.text}</span>
      </label>)}
      {submitted && <p role="status"><strong>{answers[q.id] === q.answerKey.choiceId ? 'Correct. ' : 'Review. '}</strong>{q.choices.find(c => c.id === answers[q.id])?.rationale}</p>}
    </fieldset>)}
    {!submitted ? <button type="button" disabled={!ready || !complete} onClick={submit} className="min-h-11 rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50">Check 16 answers</button> : <div role="status" className="space-y-3">
      <p>Written recognition score: {scoreTeFormCheckpoint(answers)}/{bank.items.length}. Not an official JLPT score.</p>
      <button type="button" onClick={() => {setAnswers({});setSubmitted(false);setNotice('');}} className="min-h-11 rounded-lg border border-current px-4 py-2">Retry questions</button>
    </div>}
    <p role="status" aria-live="polite">{notice}</p>
  </section>;
}