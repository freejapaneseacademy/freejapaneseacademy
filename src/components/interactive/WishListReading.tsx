import {useState} from 'react';
import bank from '../../content/exercises/n5-m07-c02-l05-v1.json';
import {recordAttempt} from '../../lib/progress';
export const QUIZ_ID='n5-m07-c02-l05-wish-list-v1';
export const questions=bank.items;
export function scoreWishList(answers:Record<string,string>){return questions.filter(q=>answers[q.id]===q.answerKey.choiceId).length;}
export default function WishListReading(){
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false);
 const [saving,setSaving]=useState(false);
 const [error,setError]=useState('');
 const count=questions.filter(q=>Boolean(answers[q.id])).length;
 async function submit(){
  if(saving||submitted||count!==questions.length)return;
  setSaving(true);setError('');
  try{await recordAttempt(QUIZ_ID,'n5',scoreWishList(answers),questions.length);setSubmitted(true);}
  catch(e){setError(e instanceof Error?e.message:'Progress storage unavailable');}
  finally{setSaving(false);}
 }
 return <section className="foundation-practice" aria-labelledby="wish-list-heading">
  <div className="foundation-practice__header"><span className="eyebrow">READING CHECK</span><h2 id="wish-list-heading">Find the evidence in A–H</h2><p>Choose the answer supported by the wish list.</p><p aria-live="polite">{count} of {questions.length} answered</p><div className="foundation-progress" role="progressbar" aria-label="Questions answered" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={count}><span style={{width:count/questions.length*100+'%'}}/></div></div>
  {questions.map((q,i)=><fieldset className="foundation-question" key={q.id} disabled={submitted||saving}><legend><span className="foundation-question__number">{String(i+1).padStart(2,'0')}</span>{q.prompt}</legend><div className="foundation-options">{q.choices.map(c=><label key={c.id} className={'foundation-option '+(answers[q.id]===c.id?'foundation-option--selected':'')}><input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span>{c.text}</span></label>)}</div>{submitted&&<div className="foundation-feedback" role="note"><strong>{answers[q.id]===q.answerKey.choiceId?'✓ Correct':'Review this answer'}</strong><p>{q.explanation}</p>{answers[q.id]!==q.answerKey.choiceId&&<p>{q.choices.find(c=>c.id===answers[q.id])?.rationale}</p>}</div>}</fieldset>)}
  {error&&<p role="alert" className="inline-error">{error}. Your selections are retained.</p>}
  {!submitted?<button type="button" className="btn btn-primary" disabled={saving||count!==questions.length} onClick={submit}>{saving?'Saving…':'Check answers and save score'}</button>:<div className="foundation-result" role="status"><h3>{scoreWishList(answers)} / {questions.length} correct</h3><p>Saved in your browser-local progress.</p><button type="button" className="btn btn-outline" onClick={()=>{setAnswers({});setSubmitted(false);setError('');}}>Retry reading check</button></div>}
  <p className="foundation-storage-note">Only scored attempts are saved locally. This is a written reading check; no audio or speech grading.</p>
 </section>;
}