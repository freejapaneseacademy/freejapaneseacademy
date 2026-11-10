import {useState} from 'react';
import {recordAttempt} from '../../lib/progress';
import bank from '../../content/exercises/l0-m04-c04-chk-v1.json';
type Track={id:string;label:string;url:string;transcript:string;english:string};
export const scoreCheckpoint=(answers:Record<string,string>)=>bank.items.filter(q=>answers[q.id]===q.answerKey.choiceId).length;
export default function KatakanaLoanwordCheckpoint({tracks}:{tracks:Track[]}){
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false);
 const [assisted,setAssisted]=useState(false);
 const [save,setSave]=useState<'idle'|'saving'|'saved'|'error'>('idle');
 const ready=bank.items.every(q=>Boolean(answers[q.id]));
 async function submit(){if(!ready||submitted)return;setSubmitted(true);setSave('saving');try{await recordAttempt('l0-m04-c04-chk-'+(assisted?'assisted':'unaided')+'-v1','l0',scoreCheckpoint(answers),bank.items.length);setSave('saved')}catch{setSave('error')}}
 function retry(){setAnswers({});setSubmitted(false);setAssisted(false);setSave('idle')}
 return <section aria-labelledby="loanword-checkpoint-heading" className="min-w-0 space-y-6">
 <h2 id="loanword-checkpoint-heading" className="text-2xl font-semibold">Chapter 04 mixed checkpoint</h2>
 <p>Read the menu and listen to both recordings. Reveal transcripts only if you want assisted listening practice.</p>
 <div className="grid gap-4">{tracks.map(t=><section key={t.id} className="min-w-0 rounded-xl border border-current/20 p-4"><h3 className="font-semibold">{t.label}</h3><audio controls preload="none" className="w-full max-w-full" aria-label={t.label}><source src={t.url} type="audio/wav"/>Audio unavailable.</audio>{(submitted||assisted)&&<div className="mt-3 space-y-2"><p lang="ja" className="whitespace-pre-line">{t.transcript}</p><p className="whitespace-pre-line">{t.english}</p></div>}</section>)}</div>
 {!submitted&&!assisted&&<button type="button" className="min-h-11 rounded-lg border border-current px-4 py-2" onClick={()=>setAssisted(true)}>Reveal transcripts (assisted practice)</button>}
 {bank.items.map((q,i)=><fieldset key={q.id} data-question-id={q.id} disabled={submitted} className="min-w-0 rounded-xl border border-current/20 p-4"><legend className="px-1 font-semibold">{i+1}. {q.prompt}</legend><div className="mt-3 space-y-2">{q.choices.map(c=><label key={c.id} className="flex min-h-11 items-center gap-3 rounded-lg p-3 focus-within:outline focus-within:outline-2"><input type="radio" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span>{c.text}</span></label>)}</div>{submitted&&<p role="status" className="mt-3"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct. ':'Review. '}</strong>{q.explanation} <span lang="ja">Evidence: {q.evidence}</span></p>}</fieldset>)}
 {!submitted?<button type="button" disabled={!ready} onClick={submit} className="min-h-11 rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50">Check 13 answers</button>:<div role="status" aria-live="polite" className="space-y-2"><p><strong>Checkpoint score: {scoreCheckpoint(answers)}/{bank.items.length} ({assisted?'assisted':'unaided'})</strong></p><p>{save==='saving'?'Saving locally…':save==='saved'?'Attempt saved on this device.':save==='error'?'Local storage unavailable; feedback remains visible.':''}</p><button type="button" className="min-h-11 rounded-lg border border-current px-4 py-2" onClick={retry}>Try again</button></div>}
 </section>;
}
