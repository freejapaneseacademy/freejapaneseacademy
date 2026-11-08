import { useState } from 'react';
import { recordAttempt } from '../../lib/progress';
import bank from '../../content/exercises/l0-m04-c02-l08-v1.json';

export const writtenScore = (answers: Record<string,string>) =>
  bank.items.filter(q => answers[q.id] === q.answerKey.choiceId).length;
const tracks = [
  {id:'a',title:'Track A — fruit stall',src:'/audio/fja-l0-m04-c02-l06-a-v1.wav',description:'Banana request, two items'},
  {id:'b',title:'Track B — deli counter',src:'/audio/fja-l0-m04-c02-l06-b-v1.wav',description:'Ham request, one item'}
] as const;
export default function KatakanaNhmyShadowing() {
  const [checks,setChecks]=useState([false,false,false]);
  const [answers,setAnswers]=useState<Record<string,string>>({});
  const [submitted,setSubmitted]=useState(false);
  const [saving,setSaving]=useState<'idle'|'saving'|'saved'|'error'>('idle');
  const score=writtenScore(answers);
  const ready=bank.items.every(q=>!!answers[q.id]);
  const submit=async()=>{
    if(!ready||submitted)return;
    setSubmitted(true);setSaving('saving');
    try{await recordAttempt('l0-m04-c02-l08-written-v1','l0',score,bank.items.length);setSaving('saved');}
    catch{setSaving('error');}
  };
  return <section className="min-w-0 space-y-6" aria-labelledby="nhmy-shadow-title">
    <h2 id="nhmy-shadow-title" className="text-2xl font-semibold">Optional model-audio shadowing</h2>
    <p>These players use the two original Chapter 02 L06 WAVs. If a track is unavailable, use the written models above; there is no browser voice synthesis or microphone recording.</p>
    {tracks.map(t=><div key={t.id} className="min-w-0 rounded-xl border border-current/25 p-4">
      <h3 className="font-semibold">{t.title}</h3><p>{t.description}</p>
      <audio controls preload="none" className="my-3 w-full max-w-full" aria-label={t.title}>
        <source src={t.src} type="audio/wav"/>Your browser cannot play WAV audio.
      </audio>
    </div>)}
    <fieldset className="rounded-xl border border-current/25 p-4"><legend className="font-semibold">Optional self-review (not graded)</legend>
      {['I identified the product word in the written script.','I tried to follow the model at a comfortable pace, aloud or silently.','I can point out ひとつ (one) and ふたつ (two) in the model text.'].map((s,i)=><label key={s} className="flex min-h-11 items-center gap-3 p-2"><input type="checkbox" checked={checks[i]} onChange={e=>setChecks(a=>a.map((v,j)=>i===j?e.target.checked:v))}/><span>{s}</span></label>)}
      <p className="text-sm">Checked {checks.filter(Boolean).length} of 3 reflections. These are self-reports, not pronunciation evidence.</p>
    </fieldset>
    <h2 className="text-2xl font-semibold">Eight written questions</h2>
    <p>These check katakana recognition only. Select one answer per question; explanations are hidden until you submit.</p>
    {bank.items.map((q,i)=><fieldset key={q.id} disabled={submitted} className="min-w-0 rounded-xl border border-current/25 p-4">
      <legend className="px-1 font-semibold">{i+1}. {q.prompt}</legend>
      {q.choices.map(c=><label key={c.id} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg p-2 focus-within:outline focus-within:outline-2"><input type="radio" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span lang="ja">{c.text}</span></label>)}
      {submitted&&<p role="status" className="mt-3"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct.':'Review this form.'}</strong> {q.explanation}</p>}
    </fieldset>)}
    {!submitted?<button type="button" disabled={!ready} onClick={submit} className="min-h-11 rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50">Check eight written answers</button>
    :<div role="status" aria-live="polite"><p><strong>Written recognition score: {score}/{bank.items.length}</strong> — not a speaking grade.</p>
      {saving==='saved'&&<p>Written attempt saved on this device.</p>}{saving==='error'&&<p>Local storage unavailable; your review remains visible.</p>}{saving==='saving'&&<p>Saving…</p>}
      <button type="button" onClick={()=>{setAnswers({});setSubmitted(false);setSaving('idle');}} className="min-h-11 rounded-lg border border-current px-5 py-3">Try written questions again</button>
    </div>}
  </section>;
}
