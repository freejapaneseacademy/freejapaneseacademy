import {useState} from 'react';
import bank from '../../content/exercises/n5-m04-c03-l08-v1.json';
import {recordAttempt} from '../../lib/progress';

type Answers = Record<string,string>;
export function scoreAdjectiveSpeaking(answers:Answers):number {
 return bank.items.filter(q=>answers[q.id]===q.answerKey.choiceId).length;
}
export default function AdjectiveSpeakingRehearsal(){
 const [answers,setAnswers]=useState<Answers>({});
 const [checked,setChecked]=useState(false);
 const [draft,setDraft]=useState('');
 const [model,setModel]=useState(false);
 const [checks,setChecks]=useState<boolean[]>([false,false,false,false]);
 const [storageMessage,setStorageMessage]=useState('');
 const count=Object.keys(answers).length;
 const score=scoreAdjectiveSpeaking(answers);
 async function submit(){
  setChecked(true);
  try{await recordAttempt('n5-m04-c03-l08-v1','n5',score,bank.items.length);setStorageMessage('Attempt saved in this browser.');}
  catch{setStorageMessage('Your answers were checked, but local progress storage is unavailable.');}
 }
 return <section aria-labelledby="adjective-speaking-heading" className="my-8 space-y-5">
 <h2 id="adjective-speaking-heading">Prepare your optional description conversation</h2>
 <p>Typing or silent rehearsal is enough. No microphone is accessed and no speaking is scored.</p>
 <label htmlFor="adjective-speaking-draft" className="block font-semibold">Write a four-turn fictional conversation or silent rehearsal notes.</label>
 <textarea id="adjective-speaking-draft" value={draft} onChange={e=>setDraft(e.target.value)} rows={5} className="w-full max-w-full rounded border p-3 bg-transparent" placeholder="A: このかばんは どうですか。"/>
 <button type="button" className="btn btn-outline" onClick={()=>setModel(v=>!v)}>{model?'Hide model':'Compare with model'}</button>
 {model&&<div role="region" aria-label="Model conversation" className="rounded border p-3"><p>このかばんは どうですか。／大きいです。でも、高いです。／あのかばんは どうですか。／小さいです。でも、安いです。</p><p>Other correct exchanges are possible. Compare particles, adjective forms and politeness yourself.</p></div>}
 <fieldset className="rounded border p-3"><legend className="font-semibold">Self-review (not graded)</legend>{['Both questions identify a thing or place','い-adjective forms are correct','な-adjective forms are correct','My exchange is polite and understandable'].map((s,i)=><label key={s} className="flex gap-2 items-center py-2"><input type="checkbox" checked={checks[i]} onChange={e=>setChecks(a=>a.map((v,j)=>i===j?e.target.checked:v))}/>{s}</label>)}</fieldset>
 <h3>Eight written recognition checks</h3><p aria-live="polite">{count} of {bank.items.length} answered</p>
 {bank.items.map((q,i)=><fieldset key={q.id} data-question-id={q.id} className="rounded border p-4 my-4 min-w-0"><legend className="font-semibold">{i+1}. {q.prompt}</legend><div className="space-y-2">{q.choices.map(c=><label key={c.id} className="flex items-start gap-3 rounded p-2 min-h-11"><input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} disabled={checked} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span>{c.text}</span></label>)}</div>{checked&&<div role="status" className="mt-3"><p>{answers[q.id]===q.answerKey.choiceId?'Correct.':'Review this item.'} {q.explanation}</p><p>{q.choices.find(c=>c.id===answers[q.id])?.rationale||'No answer selected.'}</p></div>}</fieldset>)}
 {!checked?<button type="button" className="btn btn-primary" onClick={submit}>Check answers and save attempt</button>:<><h3 aria-live="polite">{score} / {bank.items.length} correct</h3><p role="status">{storageMessage}</p><button type="button" className="btn btn-outline" onClick={()=>{setAnswers({});setChecked(false);setStorageMessage('');}}>Try again</button></>}
 </section>;
}
