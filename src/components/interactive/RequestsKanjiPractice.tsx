import { useEffect, useState } from 'react';
import bank from '../../content/exercises/n5-m06-c03-l04-v1.json';
import { recordAttempt } from '../../lib/progress';
export function gradeRequestsKanji(answers: Record<string,string>) { return bank.items.filter(q=>answers[q.id]===q.answerKey.choiceId).length; }
export default function RequestsKanjiPractice(){
 const [ready,setReady]=useState(false);
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false);
 const [notice,setNotice]=useState('');
 useEffect(()=>setReady(true),[]);
 const complete=bank.items.every(q=>Boolean(answers[q.id]));
 async function submit(){
  if(!ready||!complete||submitted)return;
  setSubmitted(true);
  try{await recordAttempt('n5-m06-c03-l04-kanji-v1','n5',gradeRequestsKanji(answers),bank.items.length);setNotice('Attempt saved on this device.');}
  catch{setNotice('Storage unavailable; your score is still shown.');}
 }
 return <section className="min-w-0 space-y-5" aria-label="Requests and permission kanji knowledge check">
  <h2 className="text-2xl font-semibold">Kanji and meaning check</h2>
  <p>Use Tab, arrow keys, and Space to select one answer per question. Feedback appears after submission.</p>
  {bank.items.map((q,i)=><fieldset key={q.id} data-question-id={q.id} disabled={!ready||submitted} className="min-w-0 rounded-xl border border-current/20 p-4">
   <legend className="font-semibold">{i+1}. {q.prompt}</legend>
   {q.choices.map(c=><label key={c.id} className="flex min-h-11 items-start gap-3 rounded-lg p-2 focus-within:outline focus-within:outline-2"><input type="radio" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span className="break-words">{c.text}</span></label>)}
   {submitted&&<div role="status" className="mt-2"><p><strong>{answers[q.id]===q.answerKey.choiceId?'Correct.':'Review.'}</strong> {q.explanation}</p><p>{q.choices.find(c=>c.id===answers[q.id])?.rationale}</p></div>}
  </fieldset>)}
  {!submitted?<button type="button" disabled={!ready||!complete} onClick={submit} className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50">Check 8 answers</button>:<div role="status"><p>Written practice score: {gradeRequestsKanji(answers)}/8. Not an official JLPT score.</p><button type="button" onClick={()=>{setAnswers({});setSubmitted(false);setNotice('Ready to retry.')}} className="rounded-lg border border-current px-4 py-2">Retry questions</button></div>}
  <p role="status" aria-live="polite">{notice}</p>
 </section>;
}
