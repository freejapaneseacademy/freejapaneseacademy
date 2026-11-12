import { useEffect, useState } from 'react';
import bank from '../../content/exercises/n5-m07-c02-l02-v1.json';
import { recordAttempt } from '../../lib/progress';
export const QUIZ_ID = 'n5-m07-c02-l02-vocabulary-v1';
export const questions = bank.items;
export function scoreWishesVocabulary(answers: Record<string,string>) { return questions.filter(q => answers[q.id] === q.answerKey.choiceId).length; }
export default function WishesVocabularyPractice() {
 const [ready,setReady]=useState(false);
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false);
 const [notice,setNotice]=useState('');
 useEffect(()=>{setReady(true)},[]);
 const complete=questions.every(q=>Boolean(answers[q.id]));
 async function submit(){if(!ready||submitted||!complete)return;setSubmitted(true);try{await recordAttempt(QUIZ_ID,'n5',scoreWishesVocabulary(answers),questions.length);setNotice('Practice attempt saved in this browser.')}catch{setNotice('Storage unavailable; you can still review your answers.')}}
 function retry(){setAnswers({});setSubmitted(false);setNotice('')}
 return <section className="min-w-0 space-y-5" aria-labelledby="wishes-heading"><h2 id="wishes-heading" className="text-2xl font-semibold">Check your plans and wishes vocabulary</h2><p>Select an answer for each question using keyboard or pointer, then check feedback. Writing and speaking are ungraded.</p>
 {questions.map((q,i)=><fieldset key={q.id} className="foundation-question min-w-0 rounded-xl border border-current/30 p-3 sm:p-4" disabled={!ready||submitted}><legend className="font-semibold">{i+1}. {q.prompt}</legend><div className="space-y-1">{q.choices.map(c=><label key={c.id} className="flex min-h-11 min-w-0 items-start gap-3 rounded-lg p-2 focus-within:outline focus-within:outline-2"><input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span className="min-w-0 break-words">{c.text}</span></label>)}</div>{submitted&&<div className="foundation-feedback mt-2 rounded-lg border border-current/20 p-3" role="status"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct. ':'Review. '}</strong>{q.choices.find(c=>c.id===answers[q.id])?.rationale}<p className="mt-1 text-sm">Evidence: <span lang="ja">{q.evidence}</span></p></div>}</fieldset>)}
 {!submitted?<button type="button" className="min-h-11 rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50" disabled={!ready||!complete} onClick={submit}>Check 12 answers</button>:<div role="status" className="space-y-3"><p>Written vocabulary recognition: {scoreWishesVocabulary(answers)}/{questions.length}. Not an official JLPT score.</p><button type="button" className="min-h-11 rounded-lg border border-current px-5 py-3" onClick={retry}>Retry vocabulary check</button></div>}<p role="status" aria-live="polite">{notice}</p></section>
}