import React, { useState } from 'react';
import bank from '../../content/exercises/n5-m04-c04-l03-v1.json';
import { recordAttempt } from '../../lib/progress';
export const invitationQuestions = bank.items;
export function scoreInvitations(answers: Record<string,string>) {
  return invitationQuestions.reduce((total,q)=>total+(answers[q.id]===q.answerKey.choiceId?1:0),0);
}
export default function InvitationGrammarPractice() {
  const [answers,setAnswers]=useState<Record<string,string>>({});
  const [submitted,setSubmitted]=useState(false);
  const [saved,setSaved]=useState('');
  const [draft,setDraft]=useState('');
  const [showModel,setShowModel]=useState(false);
  const score=scoreInvitations(answers);
  async function submit() {
    setSubmitted(true);
    try {await recordAttempt('n5-m04-c04-l03-v1','n5',score,invitationQuestions.length);setSaved('Attempt saved on this device.');}
    catch {setSaved('Score shown; browser storage is unavailable.');}
  }
  return <section aria-label="Invitation grammar practice" className="my-8 min-w-0 rounded-xl border border-slate-300 p-4 dark:border-slate-600">
    <h2 className="text-2xl font-semibold">Check your invitation and decision skills</h2>
    <p>Choose one answer for each question. You can retry after reading the feedback.</p>
    {invitationQuestions.map((q,i)=><fieldset key={q.id} disabled={submitted} className="my-5 min-w-0 border-t border-slate-300 pt-4 dark:border-slate-600">
      <legend className="font-semibold pt-2">{i+1}. {q.prompt}</legend>
      <div className="mt-3 grid gap-2">{q.choices.map(c=><label key={c.id} className="flex min-h-11 cursor-pointer items-start gap-3 break-words rounded-lg border border-slate-300 p-3 dark:border-slate-600">
        <input type="radio" className="mt-1" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/>
        <span lang="ja">{c.text}</span>
      </label>)}</div>
      {submitted&&<div role="status" className="mt-3"><p>{answers[q.id]===q.answerKey.choiceId?'Correct.':'Review this one.'} {q.explanation}</p>
        <p>{q.choices.find(c=>c.id===answers[q.id])?.rationale??'No answer selected.'}</p>
        <p>Answer: <span lang="ja">{q.choices.find(c=>c.id===q.answerKey.choiceId)?.text}</span></p></div>}
    </fieldset>)}
    {!submitted?<button type="button" className="btn btn-primary" disabled={Object.keys(answers).length!==invitationQuestions.length} onClick={submit}>Check my answers</button>
    :<div aria-live="polite"><p className="font-semibold">Score: {score} / {invitationQuestions.length}</p><p>{saved}</p>
      <button type="button" className="btn btn-outline" onClick={()=>{setAnswers({});setSubmitted(false);setSaved('');}}>Retry questions</button></div>}
    <div className="mt-8 border-t border-slate-300 pt-4 dark:border-slate-600">
      <h3 className="font-semibold">Write a short invitation exchange (ungraded)</h3>
      <label htmlFor="invitation-draft">Three or four Japanese lines: invitation, reply and decision</label>
      <textarea id="invitation-draft" rows={5} value={draft} onChange={e=>setDraft(e.target.value)} className="mt-2 w-full max-w-full rounded-lg border border-slate-400 bg-white p-3 text-slate-950 dark:bg-slate-900 dark:text-white"/>
      <button type="button" className="btn btn-outline mt-3" onClick={()=>setShowModel(v=>!v)}>{showModel?'Hide model':'Compare with model'}</button>
      {showModel&&<p lang="ja" className="mt-3">いっしょに昼ご飯を食べませんか。いいですね。食べましょう。カフェにします。</p>}
      <p>This free writing is not automatically graded or uploaded; the draft remains in this page until you leave.</p>
    </div>
  </section>;
}
