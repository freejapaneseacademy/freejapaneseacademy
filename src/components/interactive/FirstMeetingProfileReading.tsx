import { useState } from 'react';
import bank from '../../content/exercises/n5-m01-c01-l05-v1.json';
import { recordAttempt } from '../../lib/progress';

export function gradeProfileReading(answers: Record<string,string>) {
  return bank.items.filter(q => answers[q.id] === q.answerKey.choiceId).length;
}
export default function FirstMeetingProfileReading() {
  const [answers,setAnswers] = useState<Record<string,string>>({});
  const [submitted,setSubmitted] = useState(false);
  const [notice,setNotice] = useState('');
  const ready = bank.items.every(q => Boolean(answers[q.id]));
  const score = gradeProfileReading(answers);
  async function submit() {
    if (!ready || submitted) return;
    setSubmitted(true);
    try { await recordAttempt('n5-m01-c01-l05-reading-v1','n5',score,bank.items.length); setNotice('Attempt saved on this device.'); }
    catch { setNotice('Browser storage is unavailable. Your results remain visible.'); }
  }
  return <section className="min-w-0 space-y-5" aria-label="First-meeting profile reading practice">
    <h2 className="text-2xl font-semibold">Reading evidence: ten questions</h2>
    <p>Choose one answer per question. Use Tab to move between groups and arrow keys within a group. After checking, review the cited evidence.</p>
    {bank.items.map((q,i)=><fieldset key={q.id} data-question-id={q.id} disabled={submitted} className="min-w-0 rounded-xl border border-current/20 p-4">
      <legend className="font-semibold">{i+1}. {q.prompt}</legend>
      {q.choices.map(c=><label key={c.id} className="flex min-h-11 items-start gap-3 rounded-lg p-2 focus-within:outline focus-within:outline-2">
        <input type="radio" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/>
        <span className="break-words">{c.text}</span>
      </label>)}
      {submitted && <p role="status"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct. ':'Review. '}</strong>{q.explanation}</p>}
    </fieldset>)}
    {!submitted?<button type="button" disabled={!ready} onClick={submit} className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50">Check {bank.items.length} answers</button>
    :<div role="status"><p>Written reading score: {score}/{bank.items.length}. This is not an official JLPT score.</p><button type="button" className="rounded-lg border border-current px-4 py-3" onClick={()=>{setAnswers({});setSubmitted(false);setNotice('');}}>Retry questions</button></div>}
    <p role="status" aria-live="polite">{notice}</p>
  </section>;
}
