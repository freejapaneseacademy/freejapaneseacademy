import { useState } from 'react';
import bank from '../../content/exercises/n5-m03-c03-l01-v1.json';
import { recordAttempt } from '../../lib/progress';

export function gradeYesterdayTomorrow(answers: Record<string,string>) {
  return bank.items.filter(q => answers[q.id] === q.answerKey.choiceId).length;
}
export default function YesterdayTomorrowPractice() {
  const [answers,setAnswers] = useState<Record<string,string>>({});
  const [submitted,setSubmitted] = useState(false);
  const [notice,setNotice] = useState('');
  const ready = bank.items.every(q => Boolean(answers[q.id]));
  async function submit() {
    if (!ready || submitted) return;
    setSubmitted(true);
    try {
      await recordAttempt('n5-m03-c03-l01-written-v1','n5',gradeYesterdayTomorrow(answers),bank.items.length);
      setNotice('Written recognition attempt saved on this device.');
    } catch {
      setNotice('Local storage is unavailable; feedback remains visible.');
    }
  }
  return <section className="min-w-0 space-y-5" aria-label="Yesterday and tomorrow reading check">
    <h2 className="text-2xl font-semibold">Schedule evidence check</h2>
    <p>Use the Japanese dialogue to choose one answer for each question. Submit to reveal explanations.</p>
    {bank.items.map((q,i)=><fieldset key={q.id} data-question-id={q.id} disabled={submitted} className="min-w-0 rounded-xl border border-current/30 p-4">
      <legend className="font-semibold">{i+1}. {q.prompt}</legend>
      <div className="space-y-1">{q.choices.map(c=><label key={c.id} className="flex min-h-11 items-center gap-3 rounded-lg p-2 focus-within:outline focus-within:outline-2">
        <input type="radio" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/>
        <span className="min-w-0 break-words">{c.text}</span>
      </label>)}</div>
      {submitted && <p role="status" className="mt-2"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct. ':'Review. '}</strong>{q.explanation}</p>}
    </fieldset>)}
    {!submitted ? <button type="button" disabled={!ready} onClick={submit} className="min-h-11 rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50">Check all 10 answers</button> :
      <div role="status" className="space-y-2"><p>Written context score: {gradeYesterdayTomorrow(answers)}/{bank.items.length}. Formative practice only.</p>
        <button type="button" className="min-h-11 rounded-lg border border-current px-4 py-3" onClick={()=>{setAnswers({});setSubmitted(false);setNotice('');}}>Retry questions</button>
      </div>}
    <p role="status" aria-live="polite">{notice}</p>
  </section>;
}