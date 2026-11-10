import { useState } from 'react';
import bank from '../../content/exercises/n5-m04-c01-l08-v1.json';
import { recordAttempt } from '../../lib/progress';

export function gradeCafeSpeaking(answers: Record<string,string>) {
  return bank.items.filter(q => answers[q.id] === q.answerKey.choiceId).length;
}
export default function CafeSpeakingRehearsal() {
  const [answers,setAnswers]=useState<Record<string,string>>({});
  const [submitted,setSubmitted]=useState(false);
  const [notice,setNotice]=useState('');
  const [checks,setChecks]=useState([false,false,false,false]);
  const ready=bank.items.every(q=>Boolean(answers[q.id]));
  async function submit() {
    if (!ready || submitted) return;
    setSubmitted(true);
    try { await recordAttempt('n5-m04-c01-l08-written-v1','n5',gradeCafeSpeaking(answers),bank.items.length); setNotice('Written recognition attempt saved locally.'); }
    catch { setNotice('Local storage unavailable; feedback is still shown.'); }
  }
  return <section aria-label="Optional café speaking rehearsal" className="min-w-0 space-y-5">
    <h2 className="text-2xl font-semibold">Optional speaking and meaning check</h2>
    <p>Speak aloud, silently rehearse, or type your own turns. No recording, microphone permission or automatic pronunciation score is used.</p>
    <div className="rounded-xl border border-current/30 p-4">
      <h3 className="font-semibold">Your speaking self-check</h3>
      {['I asked or answered a food-preference question.','I used が with a liked food.','I used を with food or drink being consumed.','I used と for a named pair or a companion.'].map((label,i)=><label key={i} className="flex min-h-11 items-center gap-3 p-2"><input type="checkbox" checked={checks[i]} onChange={e=>setChecks(old=>old.map((v,j)=>i===j?e.target.checked:v))}/><span>{label}</span></label>)}
      <p role="status">Self-checked criteria: {checks.filter(Boolean).length}/4. This is your own reflection, not a verified speech grade.</p>
    </div>
    <h3 className="text-xl font-semibold">Written meaning check</h3>
    <p>These questions assess recognition of sentence meaning, not your speaking ability.</p>
    {bank.items.map((q,i)=><fieldset key={q.id} data-question-id={q.id} disabled={submitted} className="min-w-0 rounded-xl border border-current/30 p-4">
      <legend className="font-semibold">{i+1}. {q.prompt}</legend>
      {q.choices.map(c=><label key={c.id} className="flex min-h-11 items-center gap-3 rounded-lg p-2 focus-within:outline focus-within:outline-2"><input type="radio" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(old=>({...old,[q.id]:c.id}))}/><span className="min-w-0 break-words">{c.text}</span></label>)}
      {submitted&&<p role="status"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct. ':'Review. '}</strong>{q.choices.find(c=>c.id===answers[q.id])?.rationale} {answers[q.id]!==q.answerKey.choiceId&&q.explanation}</p>}
    </fieldset>)}
    {!submitted?<button type="button" disabled={!ready} onClick={submit} className="min-h-11 rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50">Check all {bank.items.length} answers</button>:<div role="status"><p>Written meaning score: {gradeCafeSpeaking(answers)}/{bank.items.length}. Not an official JLPT score.</p><button type="button" className="min-h-11 rounded-lg border border-current px-4 py-3" onClick={()=>{setAnswers({});setSubmitted(false);setNotice('');}}>Retry questions</button></div>}
    <p role="status" aria-live="polite">{notice}</p>
  </section>;
}
