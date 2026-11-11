import React, { useState } from 'react';
import bank from '../../content/exercises/n5-m04-c04-l05-v1.json';
import { recordAttempt } from '../../lib/progress';

export const meetingMessageQuestions = bank.items;
export function scoreMeetingMessage(answers: Record<string,string>) {
  return meetingMessageQuestions.reduce((n,q)=>n+(answers[q.id]===q.answerKey.choiceId?1:0),0);
}
export default function MeetingMessageReadingPractice(){
  const [answers,setAnswers]=useState<Record<string,string>>({});
  const [submitted,setSubmitted]=useState(false);
  const [message,setMessage]=useState('');
  const [draft,setDraft]=useState('');
  const [showModel,setShowModel]=useState(false);
  const score=scoreMeetingMessage(answers);
  async function submit(){
    if(submitted || Object.keys(answers).length!==meetingMessageQuestions.length)return;
    setSubmitted(true);
    try { await recordAttempt('n5-m04-c04-l05-v1','n5',score,meetingMessageQuestions.length);setMessage('Attempt saved in this browser.'); }
    catch { setMessage('Score shown, but local storage is unavailable.'); }
  }
  return <section aria-label="Meeting message reading practice" className="my-8 min-w-0 rounded-xl border border-slate-300 p-4 dark:border-slate-600">
    <h2 className="text-2xl font-semibold">Read for evidence</h2>
    <p>Answer all twelve questions using the original Japanese exchange above. Feedback appears after submission.</p>
    {meetingMessageQuestions.map((q,i)=><fieldset key={q.id} disabled={submitted} className="my-5 min-w-0 border-t border-slate-300 pt-4 dark:border-slate-600">
      <legend className="pt-2 font-semibold">{i+1}. {q.prompt}</legend>
      <div className="mt-3 grid gap-2">{q.choices.map(c=><label key={c.id} className="flex min-h-11 cursor-pointer items-start gap-3 break-words rounded-lg border border-slate-300 p-3 dark:border-slate-600">
        <input type="radio" name={q.id} className="mt-1" checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/>
        <span>{c.text}</span>
      </label>)}</div>
      {submitted&&<div role="status" className="mt-3"><p>{answers[q.id]===q.answerKey.choiceId?'Correct.':'Review this one.'} {q.explanation}</p><p>{q.choices.find(c=>c.id===answers[q.id])?.rationale}</p><p>Answer: {q.choices.find(c=>c.id===q.answerKey.choiceId)?.text}</p></div>}
    </fieldset>)}
    {!submitted?<button type="button" className="btn btn-primary" disabled={Object.keys(answers).length!==meetingMessageQuestions.length} onClick={submit}>Check my answers</button>:
      <div aria-live="polite"><p className="font-semibold">Score: {score} / {meetingMessageQuestions.length}</p><p>{message}</p><button type="button" className="btn btn-outline" onClick={()=>{setAnswers({});setSubmitted(false);setMessage('');}}>Retry questions</button></div>}
    <div className="mt-8 border-t border-slate-300 pt-4 dark:border-slate-600">
      <h3 className="font-semibold">Write a fictional reply (ungraded)</h3>
      <label htmlFor="meeting-message-draft">Write two to four Japanese sentences with a meeting time, place and café choice.</label>
      <textarea id="meeting-message-draft" rows={5} value={draft} onChange={e=>setDraft(e.target.value)} className="mt-2 w-full max-w-full rounded-lg border border-slate-400 bg-white p-3 text-slate-950 dark:bg-slate-900 dark:text-white"/>
      <button type="button" className="btn btn-outline mt-3" onClick={()=>setShowModel(v=>!v)}>{showModel?'Hide model':'Compare with model'}</button>
      {showModel&&<p lang="ja" className="mt-3">土曜日の午後二時に図書館の前で会いましょう。喫茶店は「さくら」にしましょう。</p>}
      <p>Your writing is not automatically scored or uploaded. The draft is temporary on this page.</p>
    </div>
  </section>;
}
