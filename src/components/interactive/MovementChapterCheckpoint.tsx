import React,{useState} from 'react';
import bank from '../../content/exercises/n5-m05-c01-chk-v1.json';
import {recordAttempt} from '../../lib/progress';
export const movementCheckpointItems=bank.items;
export function scoreMovementCheckpoint(answers:Record<string,string>){return movementCheckpointItems.reduce((n,q)=>n+(answers[q.id]===q.answerKey.choiceId?1:0),0);}
export default function MovementChapterCheckpoint(){
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false);
 const [saved,setSaved]=useState('');
 const [draft,setDraft]=useState('');
 const [showModel,setShowModel]=useState(false);
 const [checks,setChecks]=useState<boolean[]>([false,false,false,false,false]);
 const score=scoreMovementCheckpoint(answers);
 async function submit(){setSubmitted(true);try{await recordAttempt('n5-m05-c01-chk-v1','n5',score,movementCheckpointItems.length);setSaved('Attempt saved on this device.');}catch{setSaved('Score shown; browser storage unavailable.');}}
 return <section aria-label="Movement chapter written checkpoint" className="my-8 rounded-xl border border-slate-300 dark:border-slate-600 p-4 min-w-0">
 <h2 className="text-2xl font-semibold">Written checkpoint — 12 questions</h2>
 <p>Choose one answer per question. Use Tab to reach a question and arrow keys to change the selected radio option. This is not a listening score.</p>
 {movementCheckpointItems.map((q,i)=><fieldset key={q.id} disabled={submitted} className="my-6 border-t border-slate-300 dark:border-slate-600 pt-4 min-w-0">
 <legend className="font-semibold pt-2">{i+1}. {q.prompt}</legend>
 <div className="grid gap-2 mt-3">{q.choices.map(c=><label key={c.id} className="flex gap-3 items-start rounded-lg border border-slate-300 dark:border-slate-600 p-3 min-h-11 cursor-pointer break-words"><input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))} className="mt-1"/><span lang={/[ぁ-んァ-ン一-龯]/.test(c.text)?'ja':undefined}>{c.text}</span></label>)}</div>
 {submitted&&<div role="status" className="mt-3"><p>{answers[q.id]===q.answerKey.choiceId?'Correct.':'Review this item.'} {q.explanation}</p><p>{q.choices.find(c=>c.id===answers[q.id])?.rationale??'No answer selected.'}</p><p>Evidence: <span lang="ja">{q.evidence}</span></p></div>}
 </fieldset>)}
 {!submitted?<button type="button" className="btn btn-primary" disabled={Object.keys(answers).length!==movementCheckpointItems.length} onClick={submit}>Submit all answers</button>:<div aria-live="polite"><p className="font-semibold">Written score: {score} / {movementCheckpointItems.length}</p><p>{saved}</p><button type="button" className="btn btn-outline" onClick={()=>{setAnswers({});setSubmitted(false);setSaved('');}}>Retry checkpoint</button></div>}
 <div className="mt-8 border-t border-slate-300 dark:border-slate-600 pt-4"><h3 className="font-semibold">Ungraded travel writing</h3><label htmlFor="movement-chk-draft">Your two to five connected Japanese sentences</label><textarea id="movement-chk-draft" rows={5} value={draft} onChange={e=>setDraft(e.target.value)} className="w-full max-w-full rounded-lg border border-slate-400 bg-white text-slate-950 dark:bg-slate-900 dark:text-white p-3 mt-2"/>
 <button type="button" className="btn btn-outline mt-2" onClick={()=>setShowModel(v=>!v)}>{showModel?'Hide model':'Compare with model'}</button>{showModel&&<p lang="ja" className="mt-3">土曜日に電車で図書館に行きます。友だちは図書館に来ます。午後四時に家に帰ります。</p>}
 <fieldset className="mt-4"><legend className="font-semibold">Self-review (not an automatic grade)</legend>{['Destination uses に or へ','Transport uses で','Going or coming viewpoint is clear','Returning uses 帰ります','Sentences connect and use polite endings'].map((t,i)=><label key={t} className="flex gap-2 items-center my-2"><input type="checkbox" checked={checks[i]} onChange={e=>setChecks(a=>a.map((v,j)=>j===i?e.target.checked:v))}/>{t}</label>)}</fieldset><p>Your writing is not uploaded or automatically graded; the draft remains only in this page session.</p></div></section>;
