import React, {useState} from 'react';
import bank from '../../content/exercises/n5-m04-c03-chk-v1.json';
import {recordAttempt} from '../../lib/progress';

export const adjectiveCheckpointItems=bank.items;
export function scoreAdjectiveCheckpoint(answers:Record<string,string>) {
 return adjectiveCheckpointItems.reduce((score,q)=>score+(answers[q.id]===q.answerKey.choiceId?1:0),0);
}
export default function AdjectiveChapterCheckpoint(){
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false);
 const [saved,setSaved]=useState('');
 const [draft,setDraft]=useState('');
 const [model,setModel]=useState(false);
 const score=scoreAdjectiveCheckpoint(answers);
 const submit=async()=>{setSubmitted(true);try{await recordAttempt('n5-m04-c03-chk-v1','n5',score,adjectiveCheckpointItems.length);setSaved('Attempt saved on this device.');}catch{setSaved('Score displayed; browser storage is unavailable.');}};
 const retry=()=>{setAnswers({});setSubmitted(false);setSaved('');};
 return <section aria-label="Adjective chapter written checkpoint" className="my-8 rounded-xl border border-slate-300 dark:border-slate-600 p-4 min-w-0">
  <h2 className="text-2xl font-semibold">Written chapter checkpoint — 12 questions</h2>
  <p>Choose one answer per question. You can use Tab and arrow keys to navigate radio groups. This is written practice, not an audio or speaking grade.</p>
  {adjectiveCheckpointItems.map((q,i)=><fieldset key={q.id} disabled={submitted} className="my-6 border-t border-slate-300 dark:border-slate-600 pt-4 min-w-0">
   <legend className="font-semibold pt-2">{i+1}. {q.prompt}</legend>
   <div className="grid gap-2 mt-3">{q.choices.map(c=><label key={c.id} className="flex gap-3 items-start rounded-lg border border-slate-300 dark:border-slate-600 p-3 min-h-11 cursor-pointer break-words">
    <input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))} className="mt-1"/>
    <span lang={/[ぁ-んァ-ン一-龯]/.test(c.text)?'ja':undefined}>{c.text}</span>
   </label>)}</div>
   {submitted&&<div role="status" className="mt-3"><p>{answers[q.id]===q.answerKey.choiceId?'Correct.':'Review this item.'} {q.explanation}</p><p>{q.choices.find(c=>c.id===answers[q.id])?.rationale??'No answer selected.'}</p><p>Answer: {q.choices.find(c=>c.id===q.answerKey.choiceId)?.text}</p></div>}
  </fieldset>)}
  {!submitted?<button type="button" className="btn btn-primary" disabled={Object.keys(answers).length!==adjectiveCheckpointItems.length} onClick={submit}>Submit all answers</button>:<div aria-live="polite"><p className="font-semibold">Written score: {score} / {adjectiveCheckpointItems.length}</p><p>{saved}</p><button type="button" className="btn btn-outline" onClick={retry}>Retry checkpoint</button></div>}
  <div className="mt-8 border-t border-slate-300 dark:border-slate-600 pt-4">
   <h3 className="font-semibold">Ungraded description writing</h3>
   <label htmlFor="adjective-checkpoint-draft">Your two to five Japanese sentences</label>
   <textarea id="adjective-checkpoint-draft" rows={5} value={draft} onChange={e=>setDraft(e.target.value)} className="w-full max-w-full rounded-lg border border-slate-400 bg-white text-slate-950 dark:bg-slate-900 dark:text-white p-3 mt-2"/>
   <button type="button" className="btn btn-outline mt-2" onClick={()=>setModel(v=>!v)}>{model?'Hide model':'Compare with model'}</button>
   {model&&<p lang="ja" className="mt-3">このカフェは静かです。ケーキはおいしいです。でも、安くないです。店はきれいです。</p>}
   <p>Your draft stays in this page until you close or reload it. It is not uploaded or automatically graded.</p>
  </div>
 </section>;
}
