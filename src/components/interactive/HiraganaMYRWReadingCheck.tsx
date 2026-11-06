import {useState} from 'react';
import {recordAttempt} from '../../lib/progress';
import bank from '../../content/exercises/l0-m02-c03-l05-v1.json';

export default function HiraganaMYRWReadingCheck(){
 const [answers,setAnswers]=useState<Record<string,number>>({});
 const [submitted,setSubmitted]=useState(false);
 const [saving,setSaving]=useState<'idle'|'saving'|'saved'|'error'>('idle');
 const items=bank.items;
 const complete=items.every(q=>Number.isInteger(answers[q.id]));
 const score=items.filter(q=>answers[q.id]===q.correctIndex).length;
 async function submit(){
  if(!complete||submitted)return;
  setSubmitted(true);setSaving('saving');
  try{await recordAttempt('l0-m02-c03-l05-reading-v1','l0',score,items.length);setSaving('saved')}
  catch{setSaving('error')}
 }
 return <section aria-labelledby="myrw-reading-check" className="min-w-0 space-y-5">
  <h2 id="myrw-reading-check" className="text-2xl font-semibold">Picture-label evidence check</h2>
  <p>Read the ten labels and two notices above. Choose one answer for each of twelve questions. You can consult the printed passage at any time.</p>
  {items.map((q,i)=><fieldset key={q.id} disabled={submitted} className="min-w-0 rounded-xl border border-current/30 p-4">
   <legend className="px-1 font-semibold">{i+1}. {q.prompt}</legend>
   <div className="mt-3 space-y-2">{q.options.map((option,j)=><label key={j} className="flex min-w-0 items-start gap-3 rounded-lg border border-current/20 p-3">
    <input type="radio" name={q.id} value={j} checked={answers[q.id]===j} onChange={()=>setAnswers(a=>({...a,[q.id]:j}))}/>
    <span lang={/[ぁ-ゖ]/u.test(option)?'ja':undefined} className="min-w-0 break-words">{option}</span>
   </label>)}</div>
   {submitted&&<p role="status" className="mt-3"><strong>{answers[q.id]===q.correctIndex?'Correct.':'Review this answer.'}</strong> Answer: <span lang="ja">{q.answer}</span>. Evidence: <span lang="ja">{q.evidence.phrase}</span>. {q.explanation}</p>}
  </fieldset>)}
  {!submitted?<button type="button" className="btn btn-primary" disabled={!complete} onClick={submit}>Check all 12 reading answers</button>:<div role="status" aria-live="polite" className="space-y-3">
   <p><strong>Reading score: {score}/12.</strong> Revisit any missed evidence above.</p>
   <p>{saving==='saved'?'Attempt saved locally.':saving==='saving'?'Saving…':saving==='error'?'Local storage unavailable; your score remains visible.':''}</p>
   <button type="button" className="btn btn-outline" onClick={()=>{setAnswers({});setSubmitted(false);setSaving('idle')}}>Retry reading questions</button>
  </div>}
  <p>Only numeric assessment results are saved locally. No speech, handwriting or external account is required.</p>
 </section>;
}
