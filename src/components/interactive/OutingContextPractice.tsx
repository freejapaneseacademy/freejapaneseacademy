import { useEffect, useState } from 'react';
import bank from '../../content/exercises/n5-m05-c04-l01-v1.json';
import { recordAttempt } from '../../lib/progress';

export function gradeOutingContext(answers: Record<string,string>) {
  return bank.items.filter(q => answers[q.id] === q.answerKey.choiceId).length;
}
export default function OutingContextPractice() {
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
      await recordAttempt('n5-m05-c04-l01-reading-v1','n5',gradeOutingContext(answers),bank.items.length);
      setNotice('Your reading attempt was saved on this device.');
    } catch {
      setNotice('Progress storage is unavailable; your result remains visible here.');
    }
  }
  return <section className="min-w-0 space-y-5" aria-label="Saturday outing reading check">
    <h2 className="text-2xl font-semibold">Check your understanding</h2>
    <p>Use the dialogue above as evidence. Choose one answer per question. Tab to a question, then use arrow keys or Space to select.</p>
    {bank.items.map((q,i)=><fieldset key={q.id} data-question-id={q.id} disabled={!hydrated||submitted} className="min-w-0 rounded-xl border border-current/20 p-4">
      <legend className="font-semibold">{i+1}. {q.prompt}</legend>
      {q.choices.map(c=><label key={c.id} className="flex min-h-11 items-start gap-3 rounded-lg p-2 focus-within:outline focus-within:outline-2">
        <input type="radio" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/>
        <span className="break-words">{c.text}</span>
      </label>)}
      {submitted&&<div role="status" className="mt-2"><p><strong>{answers[q.id]===q.answerKey.choiceId?'Correct.':'Review this answer.'}</strong> {q.explanation}</p><p>{q.choices.find(c=>c.id===answers[q.id])?.rationale}</p></div>}
    </fieldset>)}
    {!submitted?<button type="button" disabled={!hydrated||!ready} onClick={submit} className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50">Check 12 answers</button>:<div role="status" className="space-y-2">
      <p>Written reading score: {gradeOutingContext(answers)}/12. This is not an official JLPT score.</p>
      <button type="button" className="rounded-lg border border-current px-4 py-2" onClick={()=>{setAnswers({});setSubmitted(false);setNotice('Ready to try again.')}}>Retry questions</button>
    </div>}
    <p role="status" aria-live="polite">{notice}</p>
  </section>;
}
