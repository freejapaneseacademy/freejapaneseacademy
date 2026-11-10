import {useEffect,useState} from 'react';
import {recordAttempt} from '../../lib/progress';
import bank from '../../content/exercises/l0-m05-c04-l07-v1.json';

export const normalizeFoundationWriting=(s:string)=>s.trim().normalize('NFC');
export const scoreFoundationWriting=(answers:Record<string,string>)=>bank.items.filter(q=>q.answerKey.accepted.some(a=>normalizeFoundationWriting(a)===normalizeFoundationWriting(answers[q.id]??''))).length;
const key='l0-m05-c04-l07-draft-v1';
export default function FoundationWritingStudio(){
 const [ready,setReady]=useState(false);
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false);
 const [storage,setStorage]=useState<'idle'|'saving'|'saved'|'error'>('idle');
 const [draft,setDraft]=useState('');
 const [checks,setChecks]=useState([false,false,false,false]);
 useEffect(()=>{setReady(true);try{setDraft(localStorage.getItem(key)??'');}catch{}},[]);
 const filled=bank.items.every(q=>normalizeFoundationWriting(answers[q.id]??'').length>0);
 const score=scoreFoundationWriting(answers);
 async function submit(){if(!filled||submitted)return;setSubmitted(true);setStorage('saving');try{await recordAttempt('l0-m05-c04-l07-written-v1','l0',score,bank.items.length);setStorage('saved');}catch{setStorage('error');}}
 function saveDraft(){try{localStorage.setItem(key,draft);setStorage('saved');}catch{setStorage('error');}}
 function clearDraft(){setDraft('');setChecks([false,false,false,false]);try{localStorage.removeItem(key);setStorage('idle');}catch{setStorage('error');}}
 return <section className="min-w-0 space-y-6" aria-labelledby="foundation-writing-title">
 <h2 id="foundation-writing-title" className="text-2xl font-semibold">Ten kana writing checks</h2>
 <p>Type with a Japanese keyboard. Your answers are evaluated only when you choose to check them.</p>
 {bank.items.map((q,i)=><div key={q.id} className="min-w-0 rounded-xl border border-current/25 p-4">
 <label className="block font-semibold" htmlFor={q.id}>{i+1}. {q.prompt}</label>
 <input id={q.id} lang="ja" type="text" autoComplete="off" disabled={!ready||submitted} value={answers[q.id]??''} onChange={e=>setAnswers(v=>({...v,[q.id]:e.target.value}))} className="mt-2 min-h-11 w-full min-w-0 rounded-lg border border-current/40 bg-transparent px-3 py-2"/>
 {submitted&&<p className="mt-2"><strong>{q.answerKey.accepted.some(a=>normalizeFoundationWriting(a)===normalizeFoundationWriting(answers[q.id]??''))?'Correct.':'Review this spelling.'}</strong> Model: <span lang="ja">{q.modelAnswer}</span>. {q.explanation}</p>}
 </div>)}
 {!submitted?<button type="button" disabled={!ready||!filled} onClick={submit} className="min-h-11 rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50">Check ten spellings</button>:<div role="status" aria-live="polite"><p><strong>Written score: {score}/10.</strong></p><p>{storage==='saved'?'Attempt saved on this device.':storage==='error'?'Storage unavailable; your feedback remains visible.':'Saving attempt…'}</p><button type="button" onClick={()=>{setAnswers({});setSubmitted(false);setStorage('idle');}} className="min-h-11 rounded-lg border border-current px-4 py-2">Try again</button></div>}
 <section className="min-w-0 space-y-3 rounded-xl border border-current/25 p-4" aria-labelledby="plan-heading">
 <h3 id="plan-heading" className="text-xl font-semibold">Notebook heading and study plan · self-review</h3>
 <label htmlFor="foundation-plan" className="block font-medium">Your fictional notebook labels and review routine</label>
 <textarea id="foundation-plan" lang="ja" rows={5} disabled={!ready} value={draft} onChange={e=>setDraft(e.target.value)} className="w-full min-w-0 rounded-lg border border-current/40 bg-transparent p-3"/>
 <p>Model: <span lang="ja">にほんご　きょう / コーヒー　パン</span>. Review: five minutes on three days each week.</p>
 {['Correct hiragana/katakana script','Small kana and vowel length checked','Labels are legible','Review frequency is achievable'].map((s,i)=><label key={s} className="flex min-h-11 items-center gap-3"><input type="checkbox" checked={checks[i]} onChange={e=>setChecks(v=>v.map((x,j)=>i===j?e.target.checked:x))}/>{s}</label>)}
 <div className="flex flex-wrap gap-3"><button type="button" disabled={!ready} onClick={saveDraft} className="min-h-11 rounded-lg border border-current px-4 py-2">Save draft locally</button><button type="button" disabled={!ready} onClick={clearDraft} className="min-h-11 rounded-lg border border-current px-4 py-2">Clear draft</button></div>
 <p role="status" aria-live="polite">{storage==='saved'?'Saved locally on this device.':storage==='error'?'Local storage unavailable; you can still edit.':'Your draft is private and not automatically graded.'}</p>
 </section></section>;
}
