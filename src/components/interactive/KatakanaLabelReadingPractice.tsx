import { useState } from 'react';
import { recordAttempt } from '../../lib/progress';
import bank from '../../content/exercises/l0-m04-c01-l05-v1.json';

export default function KatakanaLabelReadingPractice() {
 const [answers,setAnswers]=useState<Record<string,number>>({});
 const [submitted,setSubmitted]=useState(false);
 const [save,setSave]=useState<'idle'|'saving'|'saved'|'error'>('idle');
 const questions=bank.items;
 const ready=questions.every(q=>answers[q.id]!==undefined);
 const score=questions.filter(q=>answers[q.id]===q.correctIndex).length;
 async function submit(){if(!ready||submitted)return;setSubmitted(true);setSave('saving');try{await recordAttempt('l0-m04-c01-l05-reading-v1','l0',score,questions.length);setSave('saved');}catch{setSave('error');}}
 function reset(){setAnswers({});setSubmitted(false);setSave('idle');}
 return <section aria-labelledby="katakana-label-reading-title" className="min-w-0 space-y-5">
 <h2 id="katakana-label-reading-title" className="text-2xl font-semibold">Find the printed evidence</h2>
 <p>Eight reading questions. Revisit the card above, choose one answer per question, then submit to see the evidence.</p>
 {questions.map((q,i)=><fieldset key={q.id} disabled={submitted} className="min-w-0 rounded-xl border border-current/20 p-4">
 <legend className="px-1 font-semibold">{i+1}. {q.prompt}</legend>
 <div className="mt-3 space-y-2">{q.options.map((option,j)=><label key={j} className="flex min-h-11 cursor-pointer items-start gap-3 rounded-lg p-3 focus-within:outline focus-within:outline-2"><input type="radio" name={q.id} className="mt-1" checked={answers[q.id]===j} onChange={()=>setAnswers(a=>({...a,[q.id]:j}))}/><span lang={/[\u3040-\u30ff]/.test(option)?'ja':undefined}>{option}</span></label>)}</div>
 {submitted&&<p role="status" className="mt-3"><strong>{answers[q.id]===q.correctIndex?'Correct.':'Review this one.'}</strong> {q.explanation}</p>}
 </fieldset>)}
 {!submitted?<button type="button" disabled={!ready} onClick={submit} className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50">Check eight reading answers</button>:<div role="status" aria-live="polite" className="space-y-3"><p><strong>Reading score: {score}/8.</strong> This is not a listening score.</p>{save==='saving'&&<p>Saving on this device…</p>}{save==='saved'&&<p>Attempt saved locally.</p>}{save==='error'&&<p>Local storage unavailable; your result is still visible.</p>}<button type="button" onClick={reset} className="rounded-lg border border-current px-4 py-3">Try the reading again</button></div>}
 </section>;
}
