import { useState } from 'react';
import bank from '../../content/exercises/l0-m05-c01-l01-v1.json';
import { recordAttempt } from '../../lib/progress';
export default function GreetingsClassroomContextPractice() {
 const questions=bank.items;
 const [answers,setAnswers]=useState<Record<string,number>>({});
 const [submitted,setSubmitted]=useState(false);
 const [save,setSave]=useState<'idle'|'saved'|'error'>('idle');
 const complete=questions.every(q=>answers[q.id]!==undefined);
 const score=questions.filter(q=>answers[q.id]===q.correctIndex).length;
 async function submit(){if(!complete||submitted)return;setSubmitted(true);try{await recordAttempt('l0-m05-c01-l01-written-v1','l0',score,questions.length);setSave('saved')}catch{setSave('error')}}
 function retry(){setAnswers({});setSubmitted(false);setSave('idle')}
 return <section className="min-w-0 space-y-5" aria-labelledby="greeting-context-practice">
  <h2 id="greeting-context-practice" className="text-2xl font-semibold">Classroom context check</h2>
  <p>Eight written questions. Choose one answer for each; explanations appear after submission.</p>
  {questions.map((q,i)=><fieldset key={q.id} data-question-id={q.id} disabled={submitted} className="min-w-0 rounded-xl border border-current/20 p-4">
   <legend className="px-1 font-semibold">{i+1}. {q.prompt}</legend>
   <div className="mt-3 space-y-2">{q.options.map((option,j)=><label key={j} className="flex min-h-11 cursor-pointer items-start gap-3 rounded-lg p-3 focus-within:outline focus-within:outline-2">
    <input type="radio" name={q.id} checked={answers[q.id]===j} onChange={()=>setAnswers(a=>({...a,[q.id]:j}))} className="mt-1"/>
    <span lang={/[\u3040-\u30ff\u4e00-\u9fff]/.test(option)?'ja':undefined}>{option}</span>
   </label>)}</div>
   {submitted&&<p role="status" className="mt-3"><strong>{answers[q.id]===q.correctIndex?'Correct.':'Not quite.'}</strong> {q.explanation}</p>}
  </fieldset>)}
  {!submitted?<button type="button" disabled={!complete} onClick={submit} className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50">Check all eight answers</button>:
   <div role="status" aria-live="polite" className="space-y-2"><p><strong>Written score: {score}/{questions.length}.</strong></p><p>{save==='saved'?'Attempt saved locally.':save==='error'?'Local storage unavailable; score remains visible.':'Saving…'}</p><button type="button" onClick={retry} className="rounded-lg border border-current px-4 py-3">Try again</button></div>}
 </section>;
}