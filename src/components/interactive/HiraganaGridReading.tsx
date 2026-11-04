import { useState } from 'react';
import { recordAttempt } from '../../lib/progress';
import bank from '../../content/exercises/l0-m02-c01-l05-v1.json';

export default function HiraganaGridReading() {
  const items = bank.items;
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [save, setSave] = useState<'idle'|'saving'|'saved'|'error'>('idle');
  const score = items.filter(q => answers[q.id] === q.correctIndex).length;
  const ready = items.every(q => answers[q.id] !== undefined);
  async function check() {
    if (!ready || submitted) return;
    setSubmitted(true);
    setSave('saving');
    try { await recordAttempt('l0-m02-c01-l05-reading-v1', 'l0', score, items.length); setSave('saved'); }
    catch { setSave('error'); }
  }
  return <section aria-labelledby="grid-reading-title" className="min-w-0 space-y-5">
    <h2 id="grid-reading-title" className="text-2xl font-semibold">Find the written evidence</h2>
    <p>Use Source A and Source B above. Select one answer for each of eight questions; check the exact cell or card in the explanation.</p>
    {items.map((q,i)=><fieldset key={q.id} disabled={submitted} className="min-w-0 rounded-xl border border-current/20 p-4">
      <legend className="px-1 font-semibold">{i+1}. {q.prompt}</legend>
      <div className="mt-3 space-y-2">{q.options.map((option,j)=><label key={j} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg p-3 focus-within:outline focus-within:outline-2">
        <input type="radio" name={q.id} checked={answers[q.id]===j} onChange={()=>setAnswers(a=>({...a,[q.id]:j}))}/>
        <span>{option}</span>
      </label>)}</div>
      {submitted&&<p className="mt-3" role="status"><strong>{answers[q.id]===q.correctIndex?'Correct.':'Review the source.'}</strong> {q.explanation}</p>}
    </fieldset>)}
    {!submitted?<button type="button" disabled={!ready} onClick={check} className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50">Check eight reading answers</button>
    :<div role="status" aria-live="polite" className="space-y-3">
      <p><strong>Written reading score: {score}/{items.length}.</strong> This does not assess pronunciation or listening.</p>
      {save==='saved'&&<p>Attempt saved locally on this device.</p>}
      {save==='saving'&&<p>Saving locally…</p>}
      {save==='error'&&<p>Local storage unavailable; your score remains visible.</p>}
      <button type="button" className="rounded-lg border border-current px-4 py-3" onClick={()=>{setAnswers({});setSubmitted(false);setSave('idle');}}>Retry all questions</button>
    </div>}
  </section>;
}
