import { useState } from 'react';
import bank from '../../content/exercises/l0-m05-c03-l01-v1.json';
import { recordAttempt } from '../../lib/progress';

export default function FirstSentenceContextPractice() {
  const [answers,setAnswers] = useState<Record<string,string>>({});
  const [submitted,setSubmitted] = useState(false);
  const [notice,setNotice] = useState('');
  const complete = bank.items.every(q => Boolean(answers[q.id]));
  const score = bank.items.filter(q => answers[q.id] === q.answerKey.choiceId).length;
  async function submit() {
    if (!complete || submitted) return;
    setSubmitted(true);
    try { await recordAttempt('l0-m05-c03-l01-written-v1','l0',score,bank.items.length); setNotice('Attempt saved on this device.'); }
    catch { setNotice('Local progress storage is unavailable; your score remains visible.'); }
  }
  return <section className="min-w-0 space-y-5" aria-label="First sentence pattern written practice">
    <h2 className="text-2xl font-semibold">Check the meaning and purpose</h2>
    <p>Choose the best supported answer. All ten questions must be answered before checking.</p>
    {bank.items.map((q,i)=><fieldset key={q.id} data-question-id={q.id} disabled={submitted} className="min-w-0 rounded-xl border border-current/20 p-4">
      <legend className="font-semibold">{i+1}. {q.prompt}</legend>
      {q.choices.map(c=><label key={c.id} className="flex min-h-11 items-start gap-3 rounded-lg p-2 focus-within:outline focus-within:outline-2">
        <input type="radio" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span lang={/[\u3040-\u30ff]/.test(c.text)?'ja':undefined}>{c.text}</span>
      </label>)}
      {submitted&&<p role="status" className="mt-2"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct. ':'Review. '}</strong>{q.explanation}</p>}
    </fieldset>)}
    {!submitted?<button type="button" disabled={!complete} onClick={submit} className="min-h-11 rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50">Check ten answers</button>:<div role="status"><p>Written score: {score}/{bank.items.length}. Not an official JLPT score.</p><button type="button" className="min-h-11 rounded-lg border border-current px-4 py-2" onClick={()=>{setAnswers({});setSubmitted(false);setNotice('')}}>Retry all questions</button></div>}
    <p role="status" aria-live="polite">{notice}</p>
  </section>;
}
