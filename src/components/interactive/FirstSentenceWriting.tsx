import { useEffect,useState } from 'react';
import bank from '../../content/exercises/l0-m05-c03-l07-v1.json';
import { recordAttempt } from '../../lib/progress';
const key='l0-m05-c03-l07-draft-v1';
const criteria=['The statement identifies an object or person clearly.','The topic particle is written は.','The question ends in ですか.','Kana, katakana and polite endings are legible and accurate.'];
export function gradeFirstSentenceWriting(a:Record<string,string>){return bank.items.filter(q=>a[q.id]===q.answerKey.choiceId).length}
export default function FirstSentenceWriting(){
 const [hydrated,setHydrated]=useState(false);
 useEffect(()=>setHydrated(true),[]);
 const [draft,setDraft]=useState('');const [model,setModel]=useState(false);
 const [checks,setChecks]=useState<boolean[]>([false,false,false,false]);
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false);const [notice,setNotice]=useState('');
 const ready=bank.items.every(q=>Boolean(answers[q.id]));
 async function submit(){if(!hydrated||!ready||submitted)return;setSubmitted(true);try{await recordAttempt('l0-m05-c03-l07-written-v1','l0',gradeFirstSentenceWriting(answers),bank.items.length);setNotice('Written recognition attempt saved on this device.')}catch{setNotice('Progress storage unavailable; result remains visible.')}}
 function save(){try{localStorage.setItem(key,draft);setNotice('Draft saved on this device.')}catch{setNotice('Local storage unavailable; copy your writing elsewhere.')}}
 function load(){try{setDraft(localStorage.getItem(key)||'');setNotice('Draft loaded.')}catch{setNotice('Local storage unavailable.')}}
 function clear(){try{localStorage.removeItem(key)}catch{}setDraft('');setChecks([false,false,false,false]);setNotice('Draft cleared.')}
 return <section className="min-w-0 space-y-6" aria-label="First sentence writing practice">
 <div className="space-y-3"><h2 className="text-2xl font-semibold">Compose two short sentences</h2><p>Identify a pen, then ask whether another object is a notebook. Fictional context only. Your composition is self-reviewed, not machine-graded.</p>
 <label htmlFor="first-sentence-draft" className="block font-semibold">Your two-line Japanese draft</label>
 <textarea disabled={!hydrated} id="first-sentence-draft" lang="ja" rows={4} value={draft} onChange={e=>setDraft(e.target.value)} className="w-full min-w-0 rounded-lg border border-current/30 bg-transparent p-3" placeholder={'これは ペンです。\nこれは ノートですか。'}/>
 <div className="flex flex-wrap gap-2">{[['Save draft',save],['Load draft',load],['Clear draft',clear]] .map(([label,fn])=><button key={label as string} type="button" disabled={!hydrated} onClick={fn as ()=>void} className="rounded-lg border border-current px-3 py-2">{label as string}</button>)}<button type="button" disabled={!hydrated} aria-expanded={model} onClick={()=>setModel(v=>!v)} className="rounded-lg border border-current px-3 py-2">{model?'Hide model':'Compare model'}</button></div>
 {model&&<div className="rounded-lg border border-current/20 p-3"><p>Model for a pen and notebook:</p><p lang="ja">これは ペンです。<br/>これは ノートですか。</p><p>“This is a pen. Is this a notebook?” Compare form and meaning; equivalent original writing may differ.</p></div>}
 <fieldset className="rounded-lg border border-current/20 p-3"><legend className="font-semibold">Self-review rubric (no automated writing grade)</legend>{criteria.map((c,i)=><label key={c} className="flex items-start gap-3 py-2"><input type="checkbox" disabled={!hydrated} checked={checks[i]} onChange={e=>setChecks(v=>v.map((x,j)=>j===i?e.target.checked:x))}/><span>{c}</span></label>)}<p role="status">{checks.filter(Boolean).length}/4 criteria checked by you.</p></fieldset></div>
 <div className="space-y-4"><h2 className="text-2xl font-semibold">Written recognition check</h2><p>Choose one answer per question. Tab and arrow keys work with radio groups.</p>
 {bank.items.map((q,i)=><fieldset key={q.id} data-question-id={q.id} disabled={!hydrated||submitted} className="min-w-0 rounded-xl border border-current/20 p-4"><legend className="font-semibold">{i+1}. {q.prompt}</legend>{q.choices.map(c=><label key={c.id} className="flex min-h-11 items-start gap-3 rounded-lg p-2 focus-within:outline focus-within:outline-2"><input type="radio" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span lang="ja" className="break-words">{c.text}</span></label>)}{submitted&&<p role="status"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct. ':'Review. '}</strong>{q.explanation}</p>}</fieldset>)}
 {!submitted?<button type="button" disabled={!hydrated||!ready} onClick={submit} className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50">Check 8 answers</button>:<div role="status"><p>Written recognition score: {gradeFirstSentenceWriting(answers)}/8. Not an official JLPT score.</p><button type="button" onClick={()=>{setSubmitted(false);setAnswers({});}} className="rounded-lg border border-current px-4 py-2">Retry questions</button></div>}
 <p role="status" aria-live="polite">{notice}</p></div></section>;
}
