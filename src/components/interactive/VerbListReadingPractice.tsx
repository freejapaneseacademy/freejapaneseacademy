import { useState } from 'react';
import bank from '../../content/exercises/n5-m06-c01-l05-v1.json';
import { recordAttempt } from '../../lib/progress';
export const QUIZ_ID = 'n5-m06-c01-l05-reading-v1';
export const questions = bank.items;
export function scoreVerbReading(answers: Record<string,string>) { return questions.filter(q => answers[q.id] === q.answerKey.choiceId).length; }
export default function VerbListReadingPractice() {
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false);
 const [saving,setSaving]=useState(false);
 const [error,setError]=useState('');
 const count=questions.filter(q=>Boolean(answers[q.id])).length;
 async function submit(){
  if(submitted||saving||count!==questions.length)return;
  setSaving(true);setError('');
  try{await recordAttempt(QUIZ_ID,'n5',scoreVerbReading(answers),questions.length);setSubmitted(true);}
  catch(e){setError(e instanceof Error?e.message:'Local storage unavailable');}
  finally{setSaving(false);}
 }
 return <section className="foundation-practice" aria-labelledby="verb-reading-heading">
 <div className="foundation-practice__header"><span className="eyebrow">EVIDENCE-BASED READING CHECK</span><h2 id="verb-reading-heading">Find the phrase that proves it</h2><p>Use Tab and arrow keys to select one answer per question. All questions must be answered before submission.</p><p aria-live="polite">{count} of {questions.length} answered</p><div className="foundation-progress" role="progressbar" aria-label="Questions answered" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={count}><span style={{width:(100*count/questions.length)+'%'}}/></div></div>
 {questions.map((q,i)=><fieldset key={q.id} className="foundation-question" disabled={submitted||saving}><legend><span className="foundation-question__number">{String(i+1).padStart(2,'0')}</span>{q.prompt}</legend><div className="foundation-options">{q.choices.map(c=><label key={c.id} className={'foundation-option '+(answers[q.id]===c.id?'foundation-option--selected':'')}><input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span lang="ja">{c.text}</span></label>)}</div>{submitted&&<div className="foundation-feedback" role="note"><strong>{answers[q.id]===q.answerKey.choiceId?'✓ Correct':'Review this answer'}</strong><p>{q.explanation}</p>{answers[q.id]!==q.answerKey.choiceId&&<p>{q.choices.find(c=>c.id===answers[q.id])?.rationale}</p>}</div>}</fieldset>)}
 {error&&<p role="alert" className="inline-error">{error}. Your choices remain selected; try saving again.</p>}
 {!submitted?<button type="button" className="btn btn-primary" disabled={saving||count!==questions.length} onClick={submit}>{saving?'Saving…':'Check answers and save score'}</button>:<div className="foundation-result" role="status"><h3>{scoreVerbReading(answers)} / {questions.length} correct</h3><p>Review the evidence and try again if useful. Completion is separate from your score.</p><button type="button" className="btn btn-outline" onClick={()=>{setAnswers({});setSubmitted(false);setError('');}}>Try again</button></div>}
 </section>;
