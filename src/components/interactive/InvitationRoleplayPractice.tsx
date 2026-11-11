import React, { useState } from 'react';
import bank from '../../content/exercises/n5-m04-c04-l08-v1.json';
import { recordAttempt } from '../../lib/progress';

export const invitationRoleplayQuestions = bank.items;
export function scoreInvitationRoleplay(answers: Record<string,string>) {
  return invitationRoleplayQuestions.reduce((n,q)=>n+(answers[q.id]===q.answerKey.choiceId?1:0),0);
}
export default function InvitationRoleplayPractice() {
  const [answers,setAnswers] = useState<Record<string,string>>({});
  const [submitted,setSubmitted] = useState(false);
  const [saved,setSaved] = useState('');
  const [draft,setDraft] = useState('');
  const [showModel,setShowModel] = useState(false);
  const [checked,setChecked] = useState<Record<string,boolean>>({});
  const score = scoreInvitationRoleplay(answers);
  async function submit() {
    setSubmitted(true);
    try { await recordAttempt('n5-m04-c04-l08-v1','n5',score,invitationRoleplayQuestions.length); setSaved('Written quiz attempt saved on this device.'); }
    catch { setSaved('Score shown; browser storage is unavailable.'); }
  }
  const rubric = ['I invited with ませんか.','I accepted with ましょう or declined considerately.','I chose a place with にします when needed.','I practised both speaker roles.'];
  return <section aria-label="Optional invitation role-play practice" className="my-8 min-w-0 rounded-xl border border-slate-300 p-4 dark:border-slate-600">
    <h2 className="text-2xl font-semibold">Optional role-switch rehearsal</h2>
    <p>Type two to five short Japanese lines. This writing is private to this page session and is not scored or uploaded. You can practise silently.</p>
    <label htmlFor="invitation-roleplay-draft" className="block mt-3 font-medium">Your invitation exchange</label>
    <textarea id="invitation-roleplay-draft" rows={5} value={draft} onChange={e=>setDraft(e.target.value)} className="mt-2 w-full max-w-full rounded-lg border border-slate-400 bg-white p-3 text-slate-950 dark:bg-slate-900 dark:text-white" placeholder="いっしょにカフェに行きませんか。" />
    <button type="button" className="btn btn-outline mt-3" aria-expanded={showModel} onClick={()=>setShowModel(v=>!v)}>{showModel?'Hide model exchange':'Compare with model exchange'}</button>
    {showModel&&<div className="mt-3 rounded-lg border border-slate-300 p-3 dark:border-slate-600"><p lang="ja">いっしょにカフェに行きませんか。<br/>いいですね。行きましょう。<br/>駅のカフェと公園のカフェ、どちらがいいですか。<br/>駅のカフェにします。</p><p>Invitation → acceptance → preference question → choice. Adapt the places and change roles.</p></div>}
    <fieldset className="mt-4"><legend className="font-semibold">Ungraded self-review</legend>{rubric.map((s,i)=><label key={s} className="flex min-h-11 items-center gap-3"><input type="checkbox" checked={!!checked[s]} onChange={e=>setChecked(v=>({...v,[s]:e.target.checked}))}/><span>{s}</span></label>)}</fieldset>
    <p className="mt-3 text-sm">No microphone is accessed and no pronunciation grade is calculated. This lesson is optional.</p>
    <h2 className="text-2xl font-semibold mt-8">Written knowledge check</h2>
    <p>These questions check understanding of invitation functions, not speech or listening.</p>
    {invitationRoleplayQuestions.map((q,i)=><fieldset key={q.id} disabled={submitted} className="my-5 min-w-0 border-t border-slate-300 pt-4 dark:border-slate-600">
      <legend className="font-semibold pt-2">{i+1}. {q.prompt}</legend>
      <div className="mt-3 grid gap-2">{q.choices.map(c=><label key={c.id} className="flex min-h-11 cursor-pointer items-start gap-3 break-words rounded-lg border border-slate-300 p-3 dark:border-slate-600">
        <input type="radio" className="mt-1" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(v=>({...v,[q.id]:c.id}))}/><span>{c.text}</span>
      </label>)}</div>
      {submitted&&<div role="status" className="mt-3"><p>{answers[q.id]===q.answerKey.choiceId?'Correct.':'Review this one.'} {q.explanation}</p><p>{q.choices.find(c=>c.id===answers[q.id])?.rationale??'No answer selected.'}</p><p>Answer: {q.choices.find(c=>c.id===q.answerKey.choiceId)?.text}</p></div>}
    </fieldset>)}
    {!submitted?<button type="button" className="btn btn-primary" disabled={Object.keys(answers).length!==invitationRoleplayQuestions.length} onClick={submit}>Check written answers</button>:<div aria-live="polite"><p className="font-semibold">Written score: {score} / {invitationRoleplayQuestions.length}</p><p>{saved}</p><button type="button" className="btn btn-outline" onClick={()=>{setAnswers({});setSubmitted(false);setSaved('');}}>Retry written questions</button></div>}
  </section>;
}
