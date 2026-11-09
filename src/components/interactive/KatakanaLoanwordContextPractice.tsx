import { useState } from 'react';
import { recordAttempt } from '../../lib/progress';
import bank from '../../content/exercises/l0-m04-c04-l01-v1.json';

export default function KatakanaLoanwordContextPractice() {
  const questions = bank.items;
  const [answers, setAnswers] = useState<Record<string,string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [saveState, setSaveState] = useState<'idle'|'saving'|'saved'|'error'>('idle');
  const complete = questions.every(q => Boolean(answers[q.id]));
  const score = questions.filter(q => answers[q.id] === q.answerKey.choiceId).length;
  async function check() {
    if (!complete || submitted) return;
    setSubmitted(true);
    setSaveState('saving');
    try { await recordAttempt('l0-m04-c04-l01-written-v1','l0',score,questions.length); setSaveState('saved'); }
    catch { setSaveState('error'); }
  }
  function retry() { setAnswers({}); setSubmitted(false); setSaveState('idle'); }
  return <section className="min-w-0 space-y-5" aria-labelledby="loanword-context-practice">
    <h2 id="loanword-context-practice" className="text-2xl font-semibold">Read the station café scene</h2>
    <p>Choose one answer for each written question. Feedback appears after you submit.</p>
    {questions.map((q,i)=><fieldset key={q.id} disabled={submitted} className="min-w-0 rounded-xl border border-current/20 p-4">
      <legend className="px-1 font-semibold">{i+1}. {q.prompt}</legend>
      <div className="mt-3 space-y-2">{q.choices.map(c=><label key={c.id} className="flex min-h-11 cursor-pointer items-start gap-3 rounded-lg p-3 focus-within:outline focus-within:outline-2">
        <input type="radio" name={q.id} className="mt-1" checked={answers[q.id]===c.id} onChange={()=>setAnswers(prev=>({...prev,[q.id]:c.id}))}/>
        <span lang={/[\u3040-\u30ff]/.test(c.text)?'ja':undefined}>{c.text}</span>
      </label>)}</div>
      {submitted&&<p role="status" className="mt-3"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct.':'Not quite.'}</strong> {q.explanation}</p>}
    </fieldset>)}
    {!submitted?<button type="button" disabled={!complete} onClick={check} className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50">Check all ten answers</button>:
      <div role="status" aria-live="polite" className="space-y-2"><p><strong>Written score: {score}/{questions.length}.</strong> This is not a listening or pronunciation score.</p>
      {saveState==='saving'&&<p>Saving locally…</p>}{saveState==='saved'&&<p>Attempt saved on this device.</p>}{saveState==='error'&&<p>Browser storage unavailable; your feedback remains visible.</p>}
      <button type="button" onClick={retry} className="rounded-lg border border-current px-4 py-2">Try the questions again</button></div>}
  </section>;
}
