import React, { useState } from 'react';
import bank from '../../content/exercises/n5-m04-c03-l03-v1.json';
import { recordAttempt } from '../../lib/progress';

export const adjectiveQuestions = bank.items;
export function scoreAdjectives(answers: Record<string,string>) {
  return adjectiveQuestions.reduce((sum, q) => sum + (answers[q.id] === q.answerKey.choiceId ? 1 : 0), 0);
}
export default function AdjectiveGrammarPractice() {
  const [answers, setAnswers] = useState<Record<string,string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [saved, setSaved] = useState('');
  const [draft, setDraft] = useState('');
  const [model, setModel] = useState(false);
  const score = scoreAdjectives(answers);
  const submit = async () => {
    setSubmitted(true);
    try { await recordAttempt('n5-m04-c03-l03-v1', 'n5', score, adjectiveQuestions.length); setSaved('Attempt saved on this device.'); }
    catch { setSaved('Score shown; browser storage is unavailable.'); }
  };
  const retry = () => { setAnswers({}); setSubmitted(false); setSaved(''); };
  return <section aria-label="Adjective grammar practice" className="rounded-xl border border-slate-300 dark:border-slate-600 p-4 my-8 min-w-0">
    <h2 className="text-2xl font-semibold">Practice: describe and contrast</h2>
    <p>Choose one answer per question. Submit to see the correct forms and feedback.</p>
    {adjectiveQuestions.map((q, i) => <fieldset key={q.id} disabled={submitted} className="my-6 border-t border-slate-300 dark:border-slate-600 pt-4 min-w-0">
      <legend className="font-semibold pt-2">{i+1}. {q.prompt}</legend>
      <div className="grid gap-2 mt-3">{q.choices.map(c => <label key={c.id} className="flex items-start gap-3 rounded-lg border border-slate-300 dark:border-slate-600 p-3 min-h-11 cursor-pointer break-words">
        <input type="radio" name={q.id} className="mt-1" value={c.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))} />
        <span lang={/[ぁ-んァ-ン一-龯]/.test(c.text)?'ja':undefined}>{c.text}</span>
      </label>)}</div>
      {submitted && <div role="status" className="mt-3">
        <p>{answers[q.id]===q.answerKey.choiceId?'Correct.':'Review this one.'} {q.explanation}</p>
        <p>{q.choices.find(c=>c.id===answers[q.id])?.rationale ?? 'No answer selected.'}</p>
        <p>Answer: {q.choices.find(c=>c.id===q.answerKey.choiceId)?.text}</p>
      </div>}
    </fieldset>)}
    {!submitted ? <button type="button" className="btn btn-primary" disabled={Object.keys(answers).length!==adjectiveQuestions.length} onClick={submit}>Check my answers</button>
      : <div aria-live="polite"><p className="font-semibold">Score: {score} / {adjectiveQuestions.length}</p><p>{saved}</p><button type="button" className="btn btn-outline" onClick={retry}>Retry questions</button></div>}
    <div className="mt-8 border-t border-slate-300 dark:border-slate-600 pt-4">
      <h3 className="font-semibold">Write your own recommendation (ungraded)</h3>
      <label htmlFor="adjective-grammar-draft">Three or four Japanese sentences describing food, a place, and one negative quality</label>
      <textarea id="adjective-grammar-draft" rows={5} value={draft} onChange={e=>setDraft(e.target.value)} className="mt-2 w-full max-w-full rounded-lg border border-slate-400 bg-white text-slate-950 dark:bg-slate-900 dark:text-white p-3" />
      <button type="button" className="btn btn-outline mt-3" onClick={()=>setModel(v=>!v)}>{model?'Hide model':'Compare with model'}</button>
      {model && <p lang="ja" className="mt-3">このカフェは静かです。ケーキはおいしいです。コーヒーは高くないです。</p>}
      <p>No automatic writing grade. Your text stays in this page and is not uploaded.</p>
    </div>
  </section>;
}
