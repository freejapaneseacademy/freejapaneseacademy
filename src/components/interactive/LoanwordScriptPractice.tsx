import { useState } from 'react';
import { recordAttempt } from '../../lib/progress';
import bank from '../../content/exercises/l0-m04-c04-l04-v1.json';

export default function LoanwordScriptPractice() {
 const questions=bank.items;
 const [answers,setAnswers]=useState<Record<string,number>>({});
 const [submitted,setSubmitted]=useState(false);
 const [save,setSave]=useState<'idle'|'saving'|'saved'|'error'>('idle');
 const complete=questions.every(q=>answers[q.id]!==undefined);
 const score=questions.filter(q=>answers[q.id]===q.correctIndex).length;
 async function submit(){if(!complete||submitted)return;setSubmitted(true);setSave('saving');try{await recordAttempt('l0-m04-c04-l04-written-v1','l0',score,questions.length);setSave('saved');}catch{setSave('error');}}
 function retry(){setAnswers({});setSubmitted(false);setSave('idle');}
 return <section aria-labelledby="loanword-script-quiz" className="space-y-5 min-w-0">
 <h2 id="loanword-script-quiz" className="text-2xl font-semibold">Katakana sign check</h2><p>Choose the best spelling for each question. All ten answers are needed to check your work.</p>
 {questions.map((q,i)=><fieldset key={q.id} disabled={submitted} className="rounded-xl border border-current/20 p-4 min-w-0"><legend className="px-1 font-semibold">{i+1}. {q.prompt}</legend><div className="mt-3 space-y-2">{q.options.map((option,j)=><label key={j} className="flex min-h-11 cursor-pointer items-start gap-3 rounded-lg p-3 focus-within:outline focus-within:outline-2"><input type="radio" name={q.id} className="mt-1" checked={answers[q.id]===j} onChange={()=>setAnswers(old=>({...old,[q.id]:j}))}/><span lang="ja">{option}</span></label>)}</div>{submitted&&<p role="status" className="mt-3"><strong>{answers[q.id]===q.correctIndex?'Correct.':'Review this one.'}</strong> {q.explanation}</p>}</fieldset>)}
 {!submitted?<button type="button" disabled={!complete} onClick={submit} className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50">Check ten answers</button>:<div role="status" aria-live="polite"><p><strong>Written score: {score}/{questions.length}.</strong> Not a pronunciation grade.</p>{save==='saved'&&<p>Attempt saved on this device.</p>}{save==='error'&&<p>Storage unavailable; your results remain visible.</p>}{save==='saving'&&<p>Saving locally…</p>}<button type="button" onClick={retry} className="rounded-lg border border-current px-4 py-2">Try again</button></div>}
 </section>;
}
