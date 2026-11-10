import {useState} from 'react';
import {recordAttempt} from '../../lib/progress';
import bank from '../../content/exercises/l0-m05-c02-l07-v1.json';
export const scoreAnswers=(answers:Record<string,string>)=>bank.items.filter(q=>answers[q.id]===q.answerKey.choiceId).length;
export const normalizeModel=(value:string)=>value.trim().normalize('NFC');
const models=[{label:'Name / なまえ',model:'ミナ'},{label:'Country / くに',model:'カナダ'},{label:'Nationality / こくせき',model:'カナダじん'},{label:'Number / ばんごう',model:'二十四'},{label:'Polite statement',model:'わたしは ミナです。'}];
export default function PersonalDetailsWriting(){
 const [drafts,setDrafts]=useState<Record<number,string>>({});
 const [showModels,setShowModels]=useState(false);
 const [free,setFree]=useState('');
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false);
 const [save,setSave]=useState<'idle'|'saving'|'saved'|'error'>('idle');
 const ready=bank.items.every(q=>Boolean(answers[q.id]));
 async function submit(){if(!ready||submitted)return;setSubmitted(true);setSave('saving');try{await recordAttempt('l0-m05-c02-l07-writing-v1','l0',scoreAnswers(answers),bank.items.length);setSave('saved');}catch{setSave('error');}}
 return <section className="min-w-0 space-y-7" aria-labelledby="writing-title">
 <div className="space-y-3"><h2 id="writing-title" className="text-2xl font-semibold">Optional typing studio</h2><p>Copy the fictional model exactly, then reveal a comparison. Differences are for self-review, not a language proficiency score.</p>
 {models.map((m,i)=><div key={m.label} className="min-w-0 space-y-2"><label className="block font-semibold" htmlFor={'model-'+i}>{m.label}</label><input id={'model-'+i} lang="ja" autoComplete="off" className="w-full min-w-0 rounded-lg border border-current/40 bg-transparent p-3" value={drafts[i]||''} onChange={e=>setDrafts(d=>({...d,[i]:e.target.value}))}/>{showModels&&<p role="status">Model: <span lang="ja">{m.model}</span> — {normalizeModel(drafts[i]||'')===m.model?'Matches the model.':'Compare your characters and punctuation.'}</p>}</div>)}
 <button type="button" className="min-h-11 rounded-lg border border-current px-4 py-2" onClick={()=>setShowModels(s=>!s)}>{showModels?'Hide models':'Compare with models'}</button>
 <label className="block font-semibold" htmlFor="fictional-writing">My fictional self-introduction (not scored)</label><textarea id="fictional-writing" lang="ja" className="w-full min-w-0 rounded-lg border border-current/40 bg-transparent p-3" rows={4} value={free} onChange={e=>setFree(e.target.value)} placeholder="わたしは ユミです。"/><p className="text-sm">This draft stays in the current page only; do not enter sensitive personal information.</p></div>
 <div className="space-y-4"><h2 className="text-2xl font-semibold">Written-form knowledge check</h2><p>Choose one answer for each question; feedback appears after submission.</p>
 {bank.items.map((q,i)=><fieldset key={q.id} data-question-id={q.id} disabled={submitted} className="min-w-0 rounded-xl border border-current/20 p-4"><legend className="px-1 font-semibold">{i+1}. {q.prompt}</legend><div className="mt-3 space-y-2">{q.choices.map(c=><label key={c.id} className="flex min-h-11 items-center gap-3 rounded-lg p-3 focus-within:outline focus-within:outline-2"><input type="radio" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span lang="ja">{c.text}</span></label>)}</div>{submitted&&<p role="status" className="mt-3"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct.':'Review this form.'}</strong> {q.explanation}</p>}</fieldset>)}
 {!submitted?<button type="button" disabled={!ready} onClick={submit} className="min-h-11 rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50">Check ten answers</button>:<div role="status" aria-live="polite" className="space-y-3"><p><strong>Writing knowledge score: {scoreAnswers(answers)}/{bank.items.length}</strong></p><p>{save==='saved'?'Attempt saved on this device.':save==='error'?'Local storage unavailable; feedback remains visible.':'Saving attempt…'}</p><button type="button" className="min-h-11 rounded-lg border border-current px-5 py-2" onClick={()=>{setAnswers({});setSubmitted(false);setSave('idle');}}>Try again</button></div>}</div></section>;
}