import { useEffect, useState } from 'react';
import { recordAttempt } from '../../lib/progress';
import bank from '../../content/exercises/l0-m02-c01-l03-v1.json';
export default function HiraganaSoundPractice() {
 const questions=bank.items;
 const [ready,setReady]=useState(false);
 useEffect(()=>setReady(true),[]);
 const [answers,setAnswers]=useState<Record<string,number>>({});
 const [submitted,setSubmitted]=useState(false);
 const [saving,setSaving]=useState<'idle'|'saving'|'saved'|'error'>('idle');
 const complete=questions.every(q=>answers[q.id]!==undefined);
 const score=questions.filter(q=>answers[q.id]===q.correctIndex).length;
 async function check(){
  if(!complete||submitted)return;
  setSubmitted(true);setSaving('saving');
  try{await recordAttempt('l0-m02-c01-l03-written-v1','l0',score,questions.length);setSaving('saved');}
  catch{setSaving('error');}
 }
 function retry(){setAnswers({});setSubmitted(false);setSaving('idle');}
 return <section aria-labelledby="hiragana-sound-practice" className="space-y-5 min-w-0">
  <h2 id="hiragana-sound-practice" className="text-2xl font-semibold">Check kana sounds and strokes</h2>
  <p>Eight written questions. Explanations appear after submission.</p>
  {questions.map((q,i)=><fieldset key={q.id} disabled={!ready||submitted} className="rounded-xl border border-current/20 p-4 min-w-0">
   <legend className="px-1 font-semibold">{i+1}. {q.prompt}</legend>
   <div className="mt-3 space-y-2">{q.options.map((option,j)=><label key={j} className="flex cursor-pointer items-start gap-3 rounded-lg p-3 min-h-11 focus-within:outline focus-within:outline-2">
    <input type="radio" name={q.id} className="mt-1" checked={answers[q.id]===j} onChange={()=>setAnswers(prev=>({...prev,[q.id]:j}))}/>
    <span>{option}</span>
   </label>)}</div>
   {submitted&&<p role="status" className="mt-3"><strong>{answers[q.id]===q.correctIndex?'Correct.':'Not quite.'}</strong> {q.explanation}</p>}
  </fieldset>)}
  {!submitted?<button type="button" disabled={!ready||!complete} onClick={check} className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50">Check all eight answers</button>:
   <div role="status" aria-live="polite" className="space-y-2"><p><strong>Written score: {score}/{questions.length}.</strong> No audio, speaking or stroke-order grade is claimed.</p>
    {saving==='saving'&&<p>Saving locally…</p>}{saving==='saved'&&<p>Attempt saved on this device.</p>}
    {saving==='error'&&<p>Local storage is unavailable; your result remains visible.</p>}
    <button type="button" onClick={retry} className="rounded-lg border border-current px-4 py-2">Try the questions again</button></div>}
 </section>;
}