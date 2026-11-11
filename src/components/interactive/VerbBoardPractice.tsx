import { useEffect, useState } from 'react';
import bank from '../../content/exercises/n5-m06-c01-l01-v1.json';
import { recordAttempt } from '../../lib/progress';

export function gradeVerbBoard(answers: Record<string,string>) {
  return bank.items.filter(q => answers[q.id] === q.answerKey.choiceId).length;
}
export default function VerbBoardPractice() {
  const [hydrated,setHydrated] = useState(false);
  const [answers,setAnswers] = useState<Record<string,string>>({});
  const [submitted,setSubmitted] = useState(false);
  const [notice,setNotice] = useState('');
  useEffect(()=>setHydrated(true),[]);
  const ready = bank.items.every(q => Boolean(answers[q.id]));
  async function submit() {
    if (!hydrated || !ready || submitted) return;
    setSubmitted(true);
    try {
      await recordAttempt('n5-m06-c01-l01-context-v1','n5',gradeVerbBoard(answers),bank.items.length);
      setNotice('Your practice attempt was saved on this device.');
    } catch {
      setNotice('Progress storage is unavailable; your result remains visible here.');
    }
  }
  return <section className="min-w-0 space-y-5" aria-label="Verb form reading check">
    <h2 className="text-2xl font-semibold">Check the activity board</h2>
    <p>Choose one answer for each question. Use Tab, arrow keys and Space to select answers. Explanations appear after submission.</p>
    {bank.items.map((q,i)=><fieldset key={q.id} data-question-id={q.id} disabled={!hydrated||submitted} className="min-w-0 rounded-xl border border-current/20 p-4">
      <legend className="font-semibold">{i+1}. {q.prompt}</legend>
      {q.choices.map(c=><label key={c.id} className="flex min-h-11 items-start gap-3 rounded-lg p-2 focus-within:outline focus-within:outline-2">
        <input type="radio" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/>
        <span className="break-words">{c.text}</span>
      </label>)}
      {submitted&&<div role="status" className="mt-2"><p><strong>{answers[q.id]===q.answerKey.choiceId?'Correct.':'Review this answer.'}</strong> {q.explanation}</p><p>{q.choices.find(c=>c.id===answers[q.id])?.rationale}</p></div>}
    </fieldset>)}
    {!submitted?<button type="button" disabled={!hydrated||!ready} onClick={submit} className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50">Check 12 answers</button>:<div role="status" className="space-y-2">
      <p>Written recognition score: {gradeVerbBoard(answers)}/12. This is not an official JLPT score.</p>
      <button type="button" className="rounded-lg border border-current px-4 py-2" onClick={()=>{setAnswers({});setSubmitted(false);setNotice('Ready to try again.')}}>Retry questions</button>
    </div>}
    <p role="status" aria-live="polite">{notice}</p>
  </section>;
}
