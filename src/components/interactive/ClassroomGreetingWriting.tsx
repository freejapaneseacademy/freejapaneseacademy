import { useState } from 'react';
import bank from '../../content/exercises/l0-m05-c01-l07-v1.json';
import { recordAttempt } from '../../lib/progress';
const criteria=['Greeting suits the recipient and time.','Kana and punctuation are recognizable.','The second line is a clear classroom request.','Tone is appropriately polite.'];
const draftKey='l0-m05-c01-l07-draft-v1';
export default function ClassroomGreetingWriting(){
 const [answers,setAnswers]=useState<Record<string,number>>({});
 const [submitted,setSubmitted]=useState(false);
 const [draft,setDraft]=useState('');
 const [checks,setChecks]=useState<boolean[]>([false,false,false,false]);
 const [model,setModel]=useState(false);
 const [notice,setNotice]=useState('');
 const complete=bank.items.every(q=>answers[q.id]!==undefined);
 const score=bank.items.filter(q=>answers[q.id]===q.correctIndex).length;
 function save(){try{localStorage.setItem(draftKey,draft);setNotice('Draft saved locally.')}catch{setNotice('Local storage unavailable; copy your text elsewhere.')}}
 function load(){try{setDraft(localStorage.getItem(draftKey)||'');setNotice('Draft loaded.')}catch{setNotice('Local storage unavailable.')}}
 function clear(){try{localStorage.removeItem(draftKey)}catch{}setDraft('');setChecks([false,false,false,false]);setNotice('Draft cleared.')}
 async function submit(){if(!complete||submitted)return;setSubmitted(true);try{await recordAttempt('l0-m05-c01-l07-written-v1','l0',score,bank.items.length);setNotice('Written quiz attempt saved locally.')}catch{setNotice('Progress storage unavailable; score is still visible.')}}
 return <section className="min-w-0 space-y-6" aria-label="Classroom greeting writing practice">
 <div className="space-y-3"><h2 className="text-2xl font-semibold">Write a two-line note</h2><p>Use a greeting followed by one classroom request. Your writing is self-reviewed, not automatically graded.</p>
 <label htmlFor="greeting-writing-draft" className="block font-semibold">Your Japanese message</label>
 <textarea id="greeting-writing-draft" lang="ja" rows={5} value={draft} onChange={e=>setDraft(e.target.value)} className="w-full min-w-0 rounded-lg border border-current/30 bg-transparent p-3" placeholder={'こんにちは。\nよんでください。'}/>
 <div className="flex flex-wrap gap-2"><button type="button" onClick={save} className="rounded-lg border border-current px-3 py-2">Save draft</button><button type="button" onClick={load} className="rounded-lg border border-current px-3 py-2">Load draft</button><button type="button" onClick={clear} className="rounded-lg border border-current px-3 py-2">Clear draft</button><button type="button" aria-expanded={model} onClick={()=>setModel(v=>!v)} className="rounded-lg border border-current px-3 py-2">{model?'Hide model':'Compare model'}</button></div>
 {model&&<div className="rounded-lg border border-current/20 p-3"><p>Model for a classmate after lunch:</p><p lang="ja">こんにちは。<br/>このカードを よんでください。</p><p>“Hello. Please read this card.” Other suitable messages are possible.</p></div>}
 <fieldset className="rounded-lg border border-current/20 p-3"><legend className="font-semibold">Self-review: four criteria</legend>{criteria.map((c,i)=><label key={c} className="flex items-start gap-3 py-2"><input type="checkbox" checked={checks[i]} onChange={e=>setChecks(v=>v.map((x,j)=>j===i?e.target.checked:x))}/><span>{c}</span></label>)}<p role="status">{checks.filter(Boolean).length}/4 criteria self-checked; no automated writing grade.</p></fieldset></div>
 <div className="space-y-4"><h2 className="text-2xl font-semibold">Written expression check</h2><p>Choose one answer for each of eight questions.</p>
 {bank.items.map((q,i)=><fieldset key={q.id} data-question-id={q.id} disabled={submitted} className="min-w-0 rounded-xl border border-current/20 p-4"><legend className="font-semibold">{i+1}. {q.prompt}</legend>{q.choices.map((choice,j)=><label key={choice.id} className="flex min-h-11 items-start gap-3 p-3 focus-within:outline focus-within:outline-2"><input type="radio" name={q.id} checked={answers[q.id]===j} onChange={()=>setAnswers(a=>({...a,[q.id]:j}))}/><span lang="ja">{choice.text}</span></label>)}{submitted&&<p role="status"><strong>{answers[q.id]===q.correctIndex?'Correct.':'Review:'}</strong> {q.explanation}</p>}</fieldset>)}
 {!submitted?<button type="button" disabled={!complete} onClick={submit} className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50">Check eight answers</button>:<div role="status"><p>Written recognition score: {score}/{bank.items.length}</p><button type="button" onClick={()=>{setSubmitted(false);setAnswers({})}} className="rounded-lg border border-current px-4 py-2">Retry questions</button></div>}
 <p role="status" aria-live="polite">{notice}</p></div></section>;
}