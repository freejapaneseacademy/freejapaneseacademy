import React, { useState } from 'react';
import bank from '../../content/exercises/n5-m04-c02-chk-v1.json';
import { recordAttempt } from '../../lib/progress';

export const checkpointItems = bank.items;
export function scoreCheckpoint(answers: Record<string,string>) {
  return checkpointItems.reduce((n,q)=>n+(answers[q.id]===q.answerKey.choiceId?1:0),0);
}
export default function ShoppingPricesCheckpoint() {
  const [answers,setAnswers]=useState<Record<string,string>>({});
  const [submitted,setSubmitted]=useState(false);
  const [saved,setSaved]=useState('');
  const [draft,setDraft]=useState('');
  const [showModel,setShowModel]=useState(false);
  const score=scoreCheckpoint(answers);
  const submit=async()=>{setSubmitted(true);try{await recordAttempt('n5-m04-c02-chk-v1','n5',score,checkpointItems.length);setSaved('Attempt saved on this device.');}catch{setSaved('Score shown, but browser storage is unavailable.');}};
  const reset=()=>{setAnswers({});setSubmitted(false);setSaved('');setShowModel(false);};
  return <section aria-label="Shopping chapter checkpoint" className="rounded-xl border border-slate-300 dark:border-slate-600 p-4 my-8 min-w-0">
    <h2 className="text-2xl font-semibold">Written checkpoint — 12 questions</h2>
    <p>Choose one answer per question. Submit to see explanations; no audio is scored here.</p>
    {checkpointItems.map((q,i)=><fieldset key={q.id} disabled={submitted} className="my-6 border-t border-slate-300 dark:border-slate-600 pt-4 min-w-0">
      <legend className="font-semibold pt-2">{i+1}. {q.prompt}</legend>
      <div className="grid gap-2 mt-3">{q.choices.map(c=><label key={c.id} className="flex gap-3 items-start rounded-lg border border-slate-300 dark:border-slate-600 p-3 min-h-11 cursor-pointer break-words"><input type="radio" className="mt-1" name={q.id} value={c.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span lang={/[ぁ-んァ-ン一-龯]/.test(c.text)?'ja':undefined}>{c.text}</span></label>)}</div>
      {submitted&&<div role="status" className="mt-3"><p>{answers[q.id]===q.answerKey.choiceId?'Correct.':'Review this item.'} {q.explanation}</p><p>{q.choices.find(c=>c.id===answers[q.id])?.rationale??'No answer selected.'}</p><p>Answer: {q.choices.find(c=>c.id===q.answerKey.choiceId)?.text}</p></div>}
    </fieldset>)}
    {!submitted?<button type="button" disabled={Object.keys(answers).length!==checkpointItems.length} onClick={submit} className="btn btn-primary">Submit all answers</button>:<div aria-live="polite"><p className="font-semibold">Written score: {score} / {checkpointItems.length}</p><p>{saved}</p><button type="button" className="btn btn-outline" onClick={reset}>Retry checkpoint</button></div>}
    <div className="mt-8 border-t border-slate-300 dark:border-slate-600 pt-4">
      <h3 className="font-semibold">Ungraded writing rehearsal</h3>
      <label htmlFor="shopping-checkpoint-draft">Your two to five Japanese sentences</label>
      <textarea id="shopping-checkpoint-draft" rows={5} value={draft} onChange={e=>setDraft(e.target.value)} className="w-full max-w-full rounded-lg border border-slate-400 bg-white text-slate-950 dark:bg-slate-900 dark:text-white p-3 mt-2" />
      <button type="button" className="btn btn-outline mt-2" onClick={()=>setShowModel(v=>!v)}>{showModel?'Hide model':'Compare with model'}</button>
      {showModel&&<p lang="ja" className="mt-3">この青いノートはいくらですか。二冊ください。黒いペンも一本お願いします。</p>}
      <p>No automated grade or draft upload. Text remains in this page until it is closed or reloaded.</p>
    </div>
  </section>;
}
