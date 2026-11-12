import { useEffect, useState } from 'react';
import bank from '../../content/exercises/n5-m07-c03-l02-v1.json';
import { recordAttempt } from '../../lib/progress';
export const QUIZ_ID = 'n5-m07-c03-l02-recognition-v1';
export const questions = bank.items;
export function scoreComparisonVocabulary(answers: Record<string,string>) {
  return questions.filter(q => answers[q.id] === q.answerKey.choiceId).length;
}
export default function ComparisonVocabularyPractice() {
  const [ready,setReady]=useState(false);
  const [answers,setAnswers]=useState<Record<string,string>>({});
  const [submitted,setSubmitted]=useState(false);
  const [notice,setNotice]=useState('');
  useEffect(()=>setReady(true),[]);
  const complete=questions.every(q=>Boolean(answers[q.id]));
  async function submit(){
    if(!ready||submitted||!complete)return;
    setSubmitted(true);
    try{await recordAttempt(QUIZ_ID,'n5',scoreComparisonVocabulary(answers),questions.length);setNotice('Written attempt saved in this browser.');}
    catch{setNotice('Browser storage unavailable; feedback remains visible.');}
  }
  return <section className="min-w-0 space-y-5" aria-labelledby="comparison-vocab-heading">
    <h2 id="comparison-vocab-heading" className="text-2xl font-semibold">Check comparison words</h2>
    <p>Choose one answer per question. The check measures written recognition, not listening or speaking.</p>
    {questions.map((q,i)=><fieldset key={q.id} className="foundation-question min-w-0 rounded-xl border border-current/30 p-3 sm:p-4" disabled={!ready||submitted}>
      <legend className="font-semibold">{i+1}. {q.prompt}</legend>
      {q.choices.map(c=><label key={c.id} className="flex min-h-11 min-w-0 items-start gap-3 rounded p-2 focus-within:outline focus-within:outline-2"><input type="radio" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span className="min-w-0 break-words">{c.text}</span></label>)}
      {submitted&&<div className="foundation-feedback rounded border border-current/20 p-3" role="status"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct. ':'Review. '}</strong>{q.choices.find(c=>c.id===answers[q.id])?.rationale}<p>Evidence: <span lang="ja">{q.evidence}</span></p></div>}
    </fieldset>)}
    {!submitted?<button type="button" className="min-h-11 rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50" disabled={!ready||!complete} onClick={submit}>Check 12 answers</button>:<div role="status"><p>Written recognition: {scoreComparisonVocabulary(answers)}/{questions.length}. Not a speaking score.</p><button type="button" className="min-h-11 rounded border border-current p-3" onClick={()=>{setAnswers({});setSubmitted(false);setNotice('')}}>Retry written check</button></div>}
    <p aria-live="polite" role="status">{notice}</p>
  </section>;
}
