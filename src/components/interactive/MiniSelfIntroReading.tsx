import {useState} from 'react';
import {recordAttempt} from '../../lib/progress';
import bank from '../../content/exercises/l0-m05-c03-l05-v1.json';
export const scoreAnswers=(answers:Record<string,string>)=>bank.items.filter(q=>answers[q.id]===q.answerKey.choiceId).length;
export default function MiniSelfIntroReading(){
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false);
 const [save,setSave]=useState<'idle'|'saving'|'saved'|'error'>('idle');
 const ready=bank.items.every(q=>Boolean(answers[q.id]));
 async function submit(){if(!ready||submitted)return;setSubmitted(true);setSave('saving');try{await recordAttempt('l0-m05-c03-l05-reading-v1','l0',scoreAnswers(answers),bank.items.length);setSave('saved');}catch{setSave('error');}}
 return <section className="min-w-0 space-y-5" aria-labelledby="mini-intro-title"><h2 id="mini-intro-title" className="text-2xl font-semibold">Mini self-introduction evidence check</h2><p>Use Cards A and B above. Choose one answer for each question; explanations appear after you submit.</p>
 {bank.items.map((q,i)=><fieldset key={q.id} data-question-id={q.id} disabled={submitted} className="min-w-0 rounded-xl border border-current/20 p-4"><legend className="px-1 font-semibold">{i+1}. {q.prompt}</legend><div className="mt-3 space-y-2">{q.choices.map(c=><label key={c.id} className="flex min-h-11 items-center gap-3 rounded-lg p-3 focus-within:outline focus-within:outline-2"><input type="radio" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span>{c.text}</span></label>)}</div>{submitted&&<p role="status" className="mt-3"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct.':'Review the evidence.'}</strong> {q.explanation}</p>}</fieldset>)}
 {!submitted?<button type="button" disabled={!ready} onClick={submit} className="min-h-11 rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50">Check ten answers</button>:<div role="status" className="space-y-3"><p className="font-semibold">Reading score: {scoreAnswers(answers)}/{bank.items.length}</p><p>{save==='saved'?'Attempt saved on this device.':save==='error'?'Could not save locally; your visible feedback is still available.':'Saving attempt…'}</p><button type="button" onClick={()=>{setAnswers({});setSubmitted(false);setSave('idle');}} className="min-h-11 rounded-lg border border-current px-5 py-3">Try again</button></div>}
 </section>;
}