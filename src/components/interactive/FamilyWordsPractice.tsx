import { useState } from 'react';
import bank from '../../content/exercises/n5-m01-c03-l02-v1.json';
import { recordAttempt } from '../../lib/progress';

export function gradeFamilyWords(answers: Record<string,string>) {
  return bank.items.filter(q => answers[q.id] === q.answerKey.choiceId).length;
}
export default function FamilyWordsPractice() {
  const [answers,setAnswers] = useState<Record<string,string>>({});
  const [submitted,setSubmitted] = useState(false);
  const [notice,setNotice] = useState('');
  const ready = bank.items.every(q => Boolean(answers[q.id]));
  async function submit() {
    if (!ready || submitted) return;
    setSubmitted(true);
    try { await recordAttempt('n5-m01-c03-l02-vocabulary-v1','n5',gradeFamilyWords(answers),bank.items.length); setNotice('Attempt saved on this device.'); }
    catch { setNotice('Storage unavailable; your answers and result remain visible.'); }
  }
  return <section aria-label="Family vocabulary recognition practice" className="min-w-0 space-y-6">
    <h2 className="text-2xl font-semibold">Check your family vocabulary</h2>
    <p>Choose one answer for each fictional situation. Use Tab and arrow keys to navigate the native radio controls. No speech or pronunciation is scored.</p>
    {bank.items.map((q,i)=><fieldset key={q.id} data-question-id={q.id} disabled={submitted} className="min-w-0 rounded-xl border border-current/30 p-4">
      <legend className="font-semibold">{i+1}. {q.prompt}</legend>
      {q.choices.map(c=><label key={c.id} className="flex min-h-11 items-center gap-3 rounded-lg p-2 focus-within:outline focus-within:outline-2">
        <input type="radio" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/>
        <span className="break-words">{c.text}</span>
      </label>)}
      {submitted && <div role="status" className="mt-2"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct. ':'Review. '}</strong>{q.explanation}<p>{q.choices.find(c=>c.id===answers[q.id])?.rationale}</p></div>}
    </fieldset>)}
    {!submitted?<button type="button" disabled={!ready} onClick={submit} className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50">Check 10 answers</button>:<div role="status"><p>Recognition score: {gradeFamilyWords(answers)}/{bank.items.length}. This is not an official JLPT score.</p><button type="button" className="rounded-lg border border-current px-4 py-3" onClick={()=>{setAnswers({});setSubmitted(false);setNotice('');}}>Retry questions</button></div>}
    <p role="status" aria-live="polite">{notice}</p>
  </section>;
}
