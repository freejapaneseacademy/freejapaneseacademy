import { useEffect, useState } from 'react';
import bank from '../../content/exercises/n5-m07-c02-l08-v1.json';
import { recordAttempt } from '../../lib/progress';
export const QUIZ_ID = 'n5-m07-c02-l08-recognition-v1';
export const questions = bank.items;
export function scoreWishesRoleplay(answers: Record<string,string>) {
  return questions.filter(q => answers[q.id] === q.answerKey.choiceId).length;
}
export default function WishesRoleplay() {
  const [ready,setReady]=useState(false);
  const [answers,setAnswers]=useState<Record<string,string>>({});
  const [submitted,setSubmitted]=useState(false);
  const [notice,setNotice]=useState('');
  const [scene,setScene]=useState<'A'|'B'>('A');
  const [role,setRole]=useState<'A'|'B'>('A');
  useEffect(()=>setReady(true),[]);
  const complete=questions.every(q=>Boolean(answers[q.id]));
  async function submit(){
    if(!ready||submitted||!complete)return;
    setSubmitted(true);
    try{await recordAttempt(QUIZ_ID,'n5',scoreWishesRoleplay(answers),questions.length);setNotice('Written attempt saved in this browser.');}
    catch{setNotice('Browser storage unavailable; feedback remains visible.');}
  }
  return <section className="min-w-0 space-y-5" aria-labelledby="roleplay-heading">
    <h2 id="roleplay-heading" className="text-2xl font-semibold">Rehearse and check your responses</h2>
    <p>Optional speaking is ungraded. Choose a scene and role to guide your rehearsal, then answer the written questions. No microphone is used.</p>
    <div className="flex flex-wrap gap-3">
      <label>Scene <select className="rounded border border-current bg-transparent p-2" value={scene} onChange={e=>setScene(e.target.value as 'A'|'B')}><option value="A">Welcome desk</option><option value="B">Afternoon plans</option></select></label>
      <label>Your role <select className="rounded border border-current bg-transparent p-2" value={role} onChange={e=>setRole(e.target.value as 'A'|'B')}><option value="A">A</option><option value="B">B</option></select></label>
    </div>
    <p role="status">Practice Scene {scene}, role {role}. Read that speaker's lines above, then switch roles.</p>
    {questions.map((q,i)=><fieldset key={q.id} className="foundation-question min-w-0 rounded-xl border border-current/30 p-3 sm:p-4" disabled={!ready||submitted}>
      <legend className="font-semibold">{i+1}. {q.prompt}</legend>
      {q.choices.map(c=><label key={c.id} className="flex min-h-11 min-w-0 items-start gap-3 rounded p-2 focus-within:outline focus-within:outline-2"><input type="radio" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span className="min-w-0 break-words">{c.text}</span></label>)}
      {submitted&&<div className="foundation-feedback rounded border border-current/20 p-3" role="status"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct. ':'Review. '}</strong>{q.choices.find(c=>c.id===answers[q.id])?.rationale}<p>Model: <span lang="ja">{q.evidence}</span></p></div>}
    </fieldset>)}
    {!submitted?<button type="button" className="min-h-11 rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50" disabled={!ready||!complete} onClick={submit}>Check 12 answers</button>:<div role="status"><p>Written recognition: {scoreWishesRoleplay(answers)}/{questions.length}. Not a speaking score.</p><button type="button" className="min-h-11 rounded border border-current p-3" onClick={()=>{setAnswers({});setSubmitted(false);setNotice('')}}>Retry written check</button></div>}
    <p aria-live="polite" role="status">{notice}</p>
  </section>;
}
