import { useEffect, useState } from 'react';
import bank from '../../content/exercises/n5-m02-c03-l07-v1.json';
import { recordAttempt } from '../../lib/progress';
const key='n5-m02-c03-l07-draft-v1';
const criteria=['Every sentence identifies a clear place.','に marks the location and が marks the person or object.','あります describes objects; います describes people.','Japanese spelling and polite endings are readable.'];
export function gradeRoomExistenceWriting(a:Record<string,string>){return bank.items.filter(q=>a[q.id]===q.answerKey.choiceId).length}
export default function RoomExistenceWritingWorkshop(){
 const [hydrated,setHydrated]=useState(false);useEffect(()=>setHydrated(true),[]);
 const [draft,setDraft]=useState('');const [model,setModel]=useState(false);const [checks,setChecks]=useState<boolean[]>([false,false,false,false]);
 const [answers,setAnswers]=useState<Record<string,string>>({});const [submitted,setSubmitted]=useState(false);const [notice,setNotice]=useState('');
 const ready=bank.items.every(q=>Boolean(answers[q.id]));
 function save(){try{localStorage.setItem(key,draft);setNotice('Draft saved on this device.')}catch{setNotice('Local storage unavailable; copy your draft elsewhere.')}}
 function load(){try{setDraft(localStorage.getItem(key)||'');setNotice('Draft loaded.')}catch{setNotice('Local storage unavailable.')}}
 function clear(){try{localStorage.removeItem(key)}catch{}setDraft('');setChecks([false,false,false,false]);setNotice('Draft cleared.')}
 async function submit(){if(!hydrated||!ready||submitted)return;setSubmitted(true);try{await recordAttempt('n5-m02-c03-l07-written-v1','n5',gradeRoomExistenceWriting(answers),bank.items.length);setNotice('Recognition attempt saved on this device.')}catch{setNotice('Progress storage unavailable; result remains visible.')}}
 return <section className="min-w-0 space-y-6" aria-label="Classroom existence writing workshop">
 <div className="space-y-3"><h2 className="text-2xl font-semibold">Write your classroom note</h2><p>Write two to five sentences about a fictional classroom. Your free writing is self-reviewed, never automatically graded.</p>
 <label htmlFor="room-existence-draft" className="block font-semibold">Your Japanese classroom draft</label>
 <textarea id="room-existence-draft" disabled={!hydrated} lang="ja" rows={5} value={draft} onChange={e=>setDraft(e.target.value)} className="w-full min-w-0 rounded-lg border border-current/30 bg-transparent p-3" placeholder="教室に本があります。"/>
 <div className="flex flex-wrap gap-2"><button type="button" disabled={!hydrated} onClick={save} className="rounded-lg border border-current px-3 py-2">Save draft</button><button type="button" disabled={!hydrated} onClick={load} className="rounded-lg border border-current px-3 py-2">Load draft</button><button type="button" disabled={!hydrated} onClick={clear} className="rounded-lg border border-current px-3 py-2">Clear draft</button><button type="button" disabled={!hydrated} aria-expanded={model} onClick={()=>setModel(v=>!v)} className="rounded-lg border border-current px-3 py-2">{model?'Hide model':'Compare model'}</button></div>
 {model&&<div className="rounded-lg border border-current/20 p-3"><p>Model classroom note:</p><p lang="ja">教室に本があります。<br/>教室にかばんがあります。<br/>教室に先生がいます。</p><p>There is a book, a bag and a teacher in the classroom. Other appropriate descriptions are possible.</p></div>}
 <fieldset className="rounded-lg border border-current/20 p-3"><legend className="font-semibold">Four-part writing self-review (ungraded)</legend>{criteria.map((c,i)=><label key={c} className="flex items-start gap-3 py-2"><input type="checkbox" disabled={!hydrated} checked={checks[i]} onChange={e=>setChecks(v=>v.map((x,j)=>j===i?e.target.checked:x))}/><span>{c}</span></label>)}<p role="status">{checks.filter(Boolean).length}/4 criteria checked by you.</p></fieldset></div>
 <div className="space-y-4"><h2 className="text-2xl font-semibold">Written recognition check</h2><p>Choose one option per question. Use Tab, arrow keys and Space to navigate.</p>
 {bank.items.map((q,i)=><fieldset key={q.id} data-question-id={q.id} disabled={!hydrated||submitted} className="min-w-0 rounded-xl border border-current/20 p-4"><legend className="font-semibold">{i+1}. {q.prompt}</legend>{q.choices.map(c=><label key={c.id} className="flex min-h-11 items-start gap-3 rounded-lg p-2 focus-within:outline focus-within:outline-2"><input type="radio" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span lang="ja" className="break-words">{c.text}</span></label>)}{submitted&&<p role="status"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct. ':'Review. '}</strong>{q.explanation}</p>}</fieldset>)}
 {!submitted?<button type="button" disabled={!hydrated||!ready} onClick={submit} className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50">Check 8 answers</button>:<div role="status"><p>Written recognition score: {gradeRoomExistenceWriting(answers)}/8. Not an official JLPT score.</p><button type="button" onClick={()=>{setSubmitted(false);setAnswers({})}} className="rounded-lg border border-current px-4 py-2">Retry questions</button></div>}
 <p role="status" aria-live="polite">{notice}</p></div></section>;
}
