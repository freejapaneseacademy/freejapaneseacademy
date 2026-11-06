import { useState } from 'react';
import { recordAttempt } from '../../lib/progress';
import bank from '../../content/exercises/l0-m03-c01-l05-v1.json';

export default function VoicedKanaReadingPractice() {
 const questions=bank.items;
 const [answers,setAnswers]=useState<Record<string,number>>({});
 const [submitted,setSubmitted]=useState(false);
 const [saving,setSaving]=useState<'idle'|'saving'|'saved'|'error'>('idle');
 const complete=questions.every(q=>answers[q.id]!==undefined);
 const score=questions.filter(q=>answers[q.id]===q.correctIndex).length;
 async function check(){if(!complete||submitted)return;setSubmitted(true);setSaving('saving');try{await recordAttempt('l0-m03-c01-l05-reading-v1','l0',score,questions.length);setSaving('saved');}catch{setSaving('error');}}
 function retry(){setAnswers({});setSubmitted(false);setSaving('idle');}
 return <section aria-labelledby="voiced-reading-practice" className="space-y-5 min-w-0">
 <h2 id="voiced-reading-practice" className="text-2xl font-semibold">Check the contrast board</h2><p>Ten written questions. Find the exact phrase on the board or in the notes before choosing.</p>
 {questions.map((q,i)=><fieldset key={q.id} disabled={submitted} className="rounded-xl border border-current/20 p-4 min-w-0"><legend className="px-1 font-semibold">{i+1}. {q.prompt}</legend><div className="mt-3 space-y-2">{q.options.map((option,j)=><label key={j} className="flex cursor-pointer items-start gap-3 rounded-lg p-3 min-h-11 focus-within:outline focus-within:outline-2"><input type="radio" name={q.id} className="mt-1" checked={answers[q.id]===j} onChange={()=>setAnswers(prev=>({...prev,[q.id]:j}))}/><span>{option}</span></label>)}</div>{submitted&&<p role="status" className="mt-3"><strong>{answers[q.id]===q.correctIndex?'Correct.':'Not quite.'}</strong> {q.explanation} <span>Evidence: {q.evidence.phrase.replaceAll('*','')}</span></p>}</fieldset>)}
 {!submitted?<button type="button" disabled={!complete} onClick={check} className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50">Check all ten answers</button>:<div role="status" aria-live="polite" className="space-y-2"><p><strong>Written reading score: {score}/{questions.length}.</strong> Not a listening or pronunciation score.</p>{saving==='saving'&&<p>Saving locally…</p>}{saving==='saved'&&<p>Attempt saved on this device.</p>}{saving==='error'&&<p>Local storage is unavailable; your result remains visible.</p>}<button type="button" onClick={retry} className="rounded-lg border border-current px-4 py-2">Try again</button></div>}
 </section>;
}