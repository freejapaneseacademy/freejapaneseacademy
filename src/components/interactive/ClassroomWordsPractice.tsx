import {useEffect,useState} from 'react';
import {recordAttempt} from '../../lib/progress';
import bank from '../../content/exercises/n5-m01-c02-l02-v1.json';
export const scoreClassroomWords=(answers:Record<string,string>)=>bank.items.filter(q=>answers[q.id]===q.answerKey.choiceId).length;
export default function ClassroomWordsPractice(){
 const [hydrated,setHydrated]=useState(false);
 useEffect(()=>setHydrated(true),[]);
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false);
 const [saved,setSaved]=useState<'idle'|'saving'|'saved'|'error'>('idle');
 const complete=bank.items.every(q=>Boolean(answers[q.id]));
 async function check(){if(!hydrated||!complete||submitted)return;setSubmitted(true);setSaved('saving');try{await recordAttempt('n5-m01-c02-l02-words-v1','n5',scoreClassroomWords(answers),bank.items.length);setSaved('saved');}catch{setSaved('error');}}
 return <section className="min-w-0 space-y-5" aria-labelledby="classroom-words-heading">
 <h2 id="classroom-words-heading" className="text-2xl font-semibold">Classroom vocabulary check · ten questions</h2>
 <p>Choose one answer for each question. Keyboard, touch and mouse work. Explanations appear after submission.</p>
 {bank.items.map((q,i)=><fieldset key={q.id} data-question-id={q.id} className="min-w-0 rounded-xl border border-current/30 p-4">
 <legend className="font-semibold">{i+1}. {q.prompt}</legend>
 <div className="mt-3 space-y-2">{q.choices.map(c=><label key={c.id} className="flex min-h-11 items-center gap-3 rounded-lg border border-current/20 p-3"><input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} disabled={!hydrated||submitted} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span>{c.text}</span></label>)}</div>
 {submitted&&<p role="status" className="mt-3">{q.choices.find(c=>c.id===answers[q.id])?.rationale} {answers[q.id]!==q.answerKey.choiceId&&<>Correct answer: {q.choices.find(c=>c.id===q.answerKey.choiceId)?.text}.</>}</p>}
 </fieldset>)}
 {!submitted?<button type="button" disabled={!hydrated||!complete} onClick={check} className="min-h-11 rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50">Check answers</button>:<div role="status" aria-live="polite" className="space-y-3"><p className="font-semibold">Score: {scoreClassroomWords(answers)}/{bank.items.length}</p><p>{saved==='saved'?'Attempt saved on this device.':saved==='error'?'Storage unavailable; feedback remains visible.':'Saving attempt…'}</p><button type="button" className="min-h-11 rounded-lg border border-current px-5 py-3" onClick={()=>{setAnswers({});setSubmitted(false);setSaved('idle');}}>Try again</button></div>}
 </section>;
}