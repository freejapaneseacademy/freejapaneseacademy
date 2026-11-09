import { useState } from 'react';
import bank from '../../content/exercises/l0-m05-c02-l02-v1.json';
import { recordAttempt } from '../../lib/progress';

export function gradeNumbersVocabulary(answers: Record<string,string>) {
 return bank.items.filter(q => answers[q.id] === q.answerKey.choiceId).length;
}
export default function NumbersPersonalDetailsVocabularyPractice() {
 const [answers,setAnswers] = useState<Record<string,string>>({});
 const [submitted,setSubmitted] = useState(false);
 const [notice,setNotice] = useState('');
 const complete = bank.items.every(q => Boolean(answers[q.id]));
 const score = gradeNumbersVocabulary(answers);
 async function submit() {
  if (!complete || submitted) return;
  setSubmitted(true);
  try { await recordAttempt('l0-m05-c02-l02-written-v1','l0',score,bank.items.length);setNotice('Attempt saved in this browser.'); }
  catch {setNotice('Progress storage unavailable. Your score remains visible.');}
 }
 return <section className="min-w-0 space-y-5" aria-label="Numbers and personal details practice">
  <h2 className="text-2xl font-semibold">Number and identity word check</h2>
  <p>Answer all twelve questions. Your results are written recognition practice, not a pronunciation grade.</p>
  {bank.items.map((q,i)=><fieldset key={q.id} disabled={submitted} data-question-id={q.id} className="min-w-0 rounded-xl border border-current/20 p-4">
   <legend className="font-semibold">{i+1}. {q.prompt}</legend>
   {q.choices.map(c=><label key={c.id} className="flex min-h-11 items-start gap-3 rounded-lg p-2 focus-within:outline focus-within:outline-2">
    <input type="radio" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span>{c.text}</span>
   </label>)}
   {submitted && <p role="status"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct. ':'Review. '}</strong>{q.explanation}</p>}
  </fieldset>)}
  {!submitted?<button type="button" disabled={!complete} onClick={submit} className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50">Check twelve answers</button>
  :<div role="status"><p>Written recognition score: {score}/{bank.items.length}. Not an official JLPT score.</p><button type="button" className="rounded-lg border border-current px-4 py-2" onClick={()=>{setSubmitted(false);setAnswers({});setNotice('');}}>Retry questions</button></div>}
  <p role="status" aria-live="polite">{notice}</p>
 </section>;
}
