import {useState} from 'react';
import {recordAttempt} from '../../lib/progress';
import bank from '../../content/exercises/l0-m04-c03-l04-v1.json';
export const scoreKatakanaR=(answers:Record<string,number>)=>bank.items.filter(q=>answers[q.id]===q.correctIndex).length;
export default function KatakanaRScriptPractice(){
 const [answers,setAnswers]=useState<Record<string,number>>({});
 const [submitted,setSubmitted]=useState(false);
 const [save,setSave]=useState<'idle'|'saving'|'saved'|'error'>('idle');
 const complete=bank.items.every(q=>answers[q.id]!==undefined);
 const score=scoreKatakanaR(answers);
 async function check(){if(!complete||submitted)return;setSubmitted(true);setSave('saving');try{await recordAttempt('l0-m04-c03-l04-script-v1','l0',score,bank.items.length);setSave('saved')}catch{setSave('error')}}
 return <section className="min-w-0 space-y-5" aria-labelledby="katakana-r-practice-title">
 <h2 id="katakana-r-practice-title" className="text-2xl font-semibold">Twelve written katakana checks</h2>
 <p>Choose one answer for each question. Use Tab to reach the radio choices and arrow keys to move between choices. Feedback appears after you submit.</p>
 {bank.items.map((q,i)=><fieldset key={q.id} disabled={submitted} className="min-w-0 rounded-xl border border-current/25 p-4"><legend className="px-1 font-semibold">{i+1}. {q.prompt}</legend>
 {q.options.map((o,j)=><label key={j} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg p-2 focus-within:outline focus-within:outline-2"><input type="radio" name={q.id} checked={answers[q.id]===j} onChange={()=>setAnswers(a=>({...a,[q.id]:j}))}/><span lang="ja">{o}</span></label>)}
 {submitted&&<p role="status" className="mt-2"><strong>{answers[q.id]===q.correctIndex?'Correct.':'Review this form.'}</strong> {q.explanation}</p>}</fieldset>)}
 {!submitted?<button type="button" disabled={!complete} onClick={check} className="min-h-11 rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50">Check twelve answers</button>:<div role="status" aria-live="polite"><p><strong>Written score: {score}/12.</strong></p><p>{save==='saved'?'Attempt saved on this device.':save==='error'?'Storage unavailable; feedback remains visible.':'Saving locally…'}</p><button type="button" className="min-h-11 rounded-lg border border-current px-4 py-2" onClick={()=>{setAnswers({});setSubmitted(false);setSave('idle')}}>Try again</button></div>}
 </section>;
}