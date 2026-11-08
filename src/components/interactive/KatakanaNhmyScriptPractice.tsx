import { useState } from 'react';
import { recordAttempt } from '../../lib/progress';
import bank from '../../content/exercises/l0-m04-c02-l04-v1.json';
type Answer = string;
export const normalizeKana = (s: string) => s.trim().normalize('NFC');
export const isCorrect = (q: (typeof bank.items)[number], answer: string) =>
  q.type === 'short-input'
    ? 'accepted' in q.answerKey && Array.isArray(q.answerKey.accepted) && q.answerKey.accepted.some(a => normalizeKana(a) === normalizeKana(answer))
    : 'choiceId' in q.answerKey && answer === q.answerKey.choiceId;
export default function KatakanaNhmyScriptPractice() {
  const [answers,setAnswers] = useState<Record<string,Answer>>({});
  const [submitted,setSubmitted] = useState(false);
  const [save,setSave] = useState<'idle'|'saving'|'saved'|'error'>('idle');
  const ready = bank.items.every(q => (answers[q.id] ?? '').trim().length > 0);
  const score = bank.items.filter(q => isCorrect(q,answers[q.id] ?? '')).length;
  async function submit() {
    if (!ready || submitted) return;
    setSubmitted(true); setSave('saving');
    try { await recordAttempt('l0-m04-c02-l04-written-v1','l0',score,bank.items.length);setSave('saved'); }
    catch { setSave('error'); }
  }
  return <section aria-labelledby="nhmy-script-heading" className="min-w-0 space-y-5">
    <h2 id="nhmy-script-heading" className="text-2xl font-semibold">Recognize and type: written check</h2>
    <p>Use a Japanese keyboard/IME for kana entry. Spaces around your answer are ignored, but hiragana and katakana are different scripts. Explanations appear only after you check all answers.</p>
    {bank.items.map((q,i)=><fieldset key={q.id} disabled={submitted} className="min-w-0 rounded-xl border border-current/20 p-4">
      <legend className="px-1 font-semibold">{i+1}. {q.prompt}</legend>
      {q.type==='short-input'
        ? <label className="mt-3 flex flex-col gap-2">Your katakana answer
            <input aria-label={`Answer for question ${i+1}`} lang="ja" autoComplete="off" className="min-h-11 w-full max-w-xs rounded-lg border border-current/40 bg-transparent p-3 text-xl" value={answers[q.id] ?? ''} onChange={e=>setAnswers(a=>({...a,[q.id]:e.target.value}))}/>
          </label>
        : <div className="mt-3 space-y-2">{q.choices?.map(c=><label key={c.id} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg p-3 focus-within:outline focus-within:outline-2"><input type="radio" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span>{c.text}</span></label>)}</div>}
      {submitted&&<p role="status" className="mt-3"><strong>{isCorrect(q,answers[q.id] ?? '')?'Correct.':'Review this form.'}</strong> {q.explanation}</p>}
    </fieldset>)}
    {!submitted?<button type="button" disabled={!ready} onClick={submit} className="min-h-11 rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50">Check ten answers</button>
    : <div role="status" aria-live="polite" className="space-y-3"><p><strong>Written score: {score}/{bank.items.length}</strong></p>
      {save==='saved'&&<p>Attempt saved on this device.</p>}{save==='error'&&<p>Local storage is unavailable; your answers remain visible.</p>}{save==='saving'&&<p>Saving attempt…</p>}
      <button type="button" onClick={()=>{setAnswers({});setSubmitted(false);setSave('idle');}} className="min-h-11 rounded-lg border border-current px-5 py-2">Try again</button></div>}
  </section>;
}
