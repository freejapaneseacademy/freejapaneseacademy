import { useState } from 'react';
import bank from '../../content/exercises/n5-m03-c02-l05-v1.json';
import { recordAttempt } from '../../lib/progress';
export const QUIZ_ID='n5-m03-c02-l05-reading-v1';
export const questions=bank.items;
export function scoreRoutine(answers:Record<string,string>){return questions.filter(q=>answers[q.id]===q.answerKey.choiceId).length;}
export default function RoutineNoteReading(){
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false);
 const [saving,setSaving]=useState(false);
 const [error,setError]=useState('');
 const [draft,setDraft]=useState('');
 const [model,setModel]=useState(false);
 const count=questions.filter(q=>Boolean(answers[q.id])).length;
 async function submit(){
  if(saving||submitted||count!==questions.length)return;
  setSaving(true);setError('');
  try{await recordAttempt(QUIZ_ID,'n5',scoreRoutine(answers),questions.length);setSubmitted(true);}
  catch(e){setError(e instanceof Error?e.message:'Progress storage unavailable');}
  finally{setSaving(false);}
 }
 return <section className="foundation-practice" aria-labelledby="routine-heading">
  <div className="foundation-practice__header"><span className="eyebrow">READING CHECK</span><h2 id="routine-heading">Find evidence in A–G</h2><p>Choose one supported answer per question.</p><p aria-live="polite">{count} of {questions.length} answered</p><div className="foundation-progress" role="progressbar" aria-label="Questions answered" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={count}><span style={{width:count/questions.length*100+'%'}}/></div></div>
  {questions.map((q,i)=><fieldset className="foundation-question" key={q.id} disabled={submitted||saving}><legend><span className="foundation-question__number">{String(i+1).padStart(2,'0')}</span>{q.prompt}</legend><div className="foundation-options">{q.choices.map(c=><label key={c.id} className={'foundation-option '+(answers[q.id]===c.id?'foundation-option--selected':'')}><input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span>{c.text}</span></label>)}</div>{submitted&&<div className="foundation-feedback" role="note"><strong>{answers[q.id]===q.answerKey.choiceId?'✓ Correct':'Review this answer'}</strong><p>{q.explanation}</p>{answers[q.id]!==q.answerKey.choiceId&&<p>{q.choices.find(c=>c.id===answers[q.id])?.rationale}</p>}</div>}</fieldset>)}
  {error&&<p role="alert" className="inline-error">{error}. Your answers remain selected; try again.</p>}
  {!submitted?<button className="btn btn-primary" type="button" disabled={saving||count!==questions.length} onClick={submit}>{saving?'Saving…':'Check answers and save score'}</button>:<div className="foundation-result" role="status"><h3>{scoreRoutine(answers)} / {questions.length} correct</h3><p>Saved to browser-local learning progress.</p><button type="button" className="btn btn-outline" onClick={()=>{setAnswers({});setSubmitted(false);setError('');}}>Retry reading check</button></div>}
  <div className="foundation-teachback"><h3>Optional writing self-check</h3><label htmlFor="routine-draft">Write three Japanese sentences about a day.</label><textarea id="routine-draft" rows={4} value={draft} onChange={e=>setDraft(e.target.value)} placeholder="わたしは七時に起きます。"/><button type="button" className="btn btn-outline" aria-expanded={model} onClick={()=>setModel(v=>!v)}>{model?'Hide model':'Compare with model'}</button>{model&&<p className="foundation-feedback" lang="ja">わたしは七時に起きます。朝ごはんを食べます。夜は本を読みます。</p>}</div><p className="foundation-storage-note">Writing is not saved or graded. Scored attempts are stored locally in your browser.</p>
 </section>;
}