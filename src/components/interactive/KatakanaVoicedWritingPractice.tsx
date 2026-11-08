import {useEffect,useState} from 'react';
import {recordAttempt} from '../../lib/progress';
import bank from '../../content/exercises/l0-m04-c03-l07-v1.json';

const normalize=(s:string)=>s.trim().normalize('NFC');
export const scoreKatakanaWriting=(answers:Record<string,string>)=>bank.items.filter(q=>q.answerKey.accepted.some(a=>normalize(a)===normalize(answers[q.id]??''))).length;
export default function KatakanaVoicedWritingPractice(){
 const [hydrated,setHydrated]=useState(false);
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false);
 const [save,setSave]=useState<'idle'|'saving'|'saved'|'error'>('idle');
 const [draft,setDraft]=useState('');
 const [review,setReview]=useState<boolean[]>([false,false,false,false]);
 useEffect(()=>{setHydrated(true);try{setDraft(localStorage.getItem('l0-m04-c03-l07-draft-v1')??'');}catch{}},[]);
 const complete=bank.items.every(q=>normalize(answers[q.id]??'').length>0);
 const score=scoreKatakanaWriting(answers);
 async function submit(){if(!complete||submitted)return;setSubmitted(true);setSave('saving');try{await recordAttempt('l0-m04-c03-l07-written-v1','l0',score,bank.items.length);setSave('saved');}catch{setSave('error');}}
 function storeDraft(){try{localStorage.setItem('l0-m04-c03-l07-draft-v1',draft);setSave('saved');}catch{setSave('error');}}
 function clearDraft(){setDraft('');setReview([false,false,false,false]);try{localStorage.removeItem('l0-m04-c03-l07-draft-v1');setSave('idle');}catch{setSave('error');}}
 return <section aria-labelledby="katakana-writing-title" className="min-w-0 space-y-6">
 <h2 id="katakana-writing-title" className="text-2xl font-semibold">Eight katakana typing checks</h2>
 <p>Enter katakana with your Japanese IME. Answers are checked only after you submit; no pronunciation or handwriting is graded.</p>
 {bank.items.map((q,i)=><div key={q.id} className="min-w-0 rounded-xl border border-current/25 p-4">
 <label htmlFor={q.id} className="block font-semibold">{i+1}. {q.prompt}</label>
 <input id={q.id} type="text" lang="ja" autoComplete="off" disabled={!hydrated||submitted} value={answers[q.id]??''} onChange={e=>setAnswers(a=>({...a,[q.id]:e.target.value}))} className="mt-2 min-h-11 w-full min-w-0 rounded-lg border border-current/40 bg-transparent px-3 py-2" />
 {submitted&&<p role="status" className="mt-2"><strong>{q.answerKey.accepted.some(a=>normalize(a)===normalize(answers[q.id]??''))?'Correct.':'Review this spelling.'}</strong> Model: <span lang="ja">{q.modelAnswer}</span>. {q.explanation}</p>}
 </div>)}
 {!submitted?<button type="button" disabled={!hydrated||!complete} onClick={submit} className="min-h-11 rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50">Check eight spellings</button>:<div role="status" aria-live="polite"><p><strong>Written score: {score}/8.</strong></p><p>{save==='saved'?'Attempt saved on this device.':save==='error'?'Storage unavailable; feedback remains visible.':'Saving locally…'}</p><button type="button" className="min-h-11 rounded-lg border border-current px-4 py-2" onClick={()=>{setAnswers({});setSubmitted(false);setSave('idle');}}>Try again</button></div>}
 <section aria-labelledby="note-title" className="space-y-3 rounded-xl border border-current/25 p-4"><h3 id="note-title" className="text-xl font-semibold">Two-line shop note · learner self-review</h3><p>Choose two or more model words; write two lines. No automatic score for your own composition.</p>
 <label htmlFor="shop-note" className="block font-medium">Your fictional shop labels</label>
 <textarea id="shop-note" lang="ja" rows={4} disabled={!hydrated} value={draft} onChange={e=>setDraft(e.target.value)} className="w-full min-w-0 rounded-lg border border-current/40 bg-transparent p-3" />
 <p>Model: <span lang="ja">パン　ペン</span> / <span lang="ja">カバン　ソース</span></p>
 {['Katakana script','Correct voiced and semi-voiced marks','Correct ン versus ソ','Two clear lines'].map((s,i)=><label key={s} className="flex min-h-11 items-center gap-3"><input type="checkbox" checked={review[i]} onChange={e=>setReview(v=>v.map((x,j)=>i===j?e.target.checked:x))}/>{s}</label>)}
 <div className="flex flex-wrap gap-3"><button type="button" onClick={storeDraft} disabled={!hydrated} className="min-h-11 rounded-lg border border-current px-4 py-2">Save draft locally</button><button type="button" onClick={clearDraft} disabled={!hydrated} className="min-h-11 rounded-lg border border-current px-4 py-2">Clear draft</button></div><p role="status" aria-live="polite">{save==='saved'?'Saved locally on this device.':save==='error'?'Local storage unavailable; you can still edit.':'Your note stays on this device unless you choose to save it.'}</p>
 </section></section>;
}
