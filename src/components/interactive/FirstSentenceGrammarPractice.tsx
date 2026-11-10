import { useState } from 'react';
import bank from '../../content/exercises/l0-m05-c03-l03-v1.json';
import { recordAttempt } from '../../lib/progress';
export function gradeFirstSentenceGrammar(answers: Record<string,string>) { return bank.items.filter(q=>answers[q.id]===q.answerKey.choiceId).length; }
export default function FirstSentenceGrammarPractice() {
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false);
 const [notice,setNotice]=useState('');
 const ready=bank.items.every(q=>Boolean(answers[q.id]));
 const score=gradeFirstSentenceGrammar(answers);
 async function submit(){if(!ready||submitted)return;setSubmitted(true);try{await recordAttempt('l0-m05-c03-l03-written-v1','l0',score,bank.items.length);setNotice('Attempt saved on this device.');}catch{setNotice('Storage unavailable; your result remains visible.');}}
 return <section aria-label="First sentence grammar practice" className="min-w-0 space-y-5">
 <h2 className="text-2xl font-semibold">Topic and question practice</h2><p>Choose one answer per question. Use Tab and arrow keys or touch; explanations appear after submission.</p>
 {bank.items.map((q,i)=><fieldset key={q.id} disabled={submitted} data-question-id={q.id} className="min-w-0 rounded-xl border border-current/20 p-4"><legend className="font-semibold">{i+1}. {q.prompt}</legend>{q.choices.map(c=><label key={c.id} className="flex min-h-11 items-start gap-3 rounded-lg p-2 focus-within:outline focus-within:outline-2"><input type="radio" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span>{c.text}</span></label>)}{submitted&&<p role="status"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct. ':'Review. '}</strong>{q.explanation}</p>}</fieldset>)}
 {!submitted?<button type="button" disabled={!ready} onClick={submit} className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50">Check twelve answers</button>:<div role="status"><p>Written grammar score: {score}/{bank.items.length}. Not an official JLPT score.</p><button type="button" className="rounded-lg border border-current px-4 py-3" onClick={()=>{setAnswers({});setSubmitted(false);setNotice('');}}>Retry questions</button></div>}
 <p role="status" aria-live="polite">{notice}</p></section>;
}