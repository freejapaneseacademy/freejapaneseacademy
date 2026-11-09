import { useState } from 'react';
import { recordAttempt } from '../../lib/progress';
import bank from '../../content/exercises/l0-m04-c02-chk.json';
type Track={id:string;label:string;url:string;transcript:string;english:string};
export default function KatakanaNhmyCheckpoint({tracks}:{tracks:Track[]}) {
 const questions=bank.items;
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false);
 const [revealed,setRevealed]=useState(false);
 const [saving,setSaving]=useState<'idle'|'saving'|'saved'|'error'>('idle');
 const complete=questions.every(q=>answers[q.id]!==undefined);
 const score=questions.filter(q=>answers[q.id]===q.answerKey.choiceId).length;
 const assisted=revealed;
 async function check(){if(!complete||submitted)return;setSubmitted(true);setSaving('saving');try{await recordAttempt('l0-m04-c02-chk-'+(assisted?'assisted':'unassisted')+'-v1','l0',score,questions.length);setSaving('saved')}catch{setSaving('error')}}
 function retry(){setAnswers({});setSubmitted(false);setRevealed(false);setSaving('idle')}
 return <section aria-labelledby="nhmy-checkpoint-title" className="space-y-6 min-w-0">
 <h2 id="nhmy-checkpoint-title" className="text-2xl font-semibold">Chapter 02 checkpoint</h2>
 <p>Listen first; the transcript is hidden until submission unless you choose assisted practice.</p>
 <div className="grid gap-4">{tracks.map(t=><section key={t.id} className="rounded-xl border border-current/20 p-4 min-w-0"><h3 className="font-semibold">{t.label}</h3><audio controls preload="none" className="w-full max-w-full" aria-label={t.label}><source src={t.url} type="audio/wav"/>Your browser does not support audio playback.</audio>{(submitted||revealed)&&<div className="mt-3 space-y-2"><p lang="ja" className="whitespace-pre-line">{t.transcript}</p><p className="whitespace-pre-line">{t.english}</p></div>}</section>)}</div>
 {!submitted&&!revealed&&<button type="button" className="rounded-lg border border-current px-4 py-3" onClick={()=>setRevealed(true)}>Show transcripts (assisted practice)</button>}
 {questions.map((q,i)=><fieldset key={q.id} disabled={submitted} className="rounded-xl border border-current/20 p-4 min-w-0"><legend className="px-1 font-semibold">{i+1}. {q.prompt}</legend><div className="mt-3 space-y-2">{q.choices.map(c=><label key={c.id} className="flex min-h-11 cursor-pointer items-start gap-3 rounded-lg p-3 focus-within:outline focus-within:outline-2"><input type="radio" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))} className="mt-1"/><span>{c.text}</span></label>)}</div>{submitted&&<p role="status" className="mt-3"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct. ':'Review. '}</strong>{q.explanation} Evidence: <span lang="ja">{q.evidence}</span></p>}</fieldset>)}
 {!submitted?<button type="button" disabled={!complete} onClick={check} className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50">Check 12 answers</button>:<div role="status" aria-live="polite" className="space-y-2"><p><strong>Score: {score}/{questions.length} ({assisted?'assisted':'unassisted'} practice).</strong></p><p>{saving==='saving'?'Saving locally…':saving==='saved'?'Attempt saved on this device.':saving==='error'?'Local storage unavailable; result remains visible.':''}</p><button type="button" onClick={retry} className="rounded-lg border border-current px-4 py-2">Try again</button></div>}
 </section>;
}