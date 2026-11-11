import { useState } from 'react';
import bank from '../../content/exercises/n5-m02-c03-l02-v1.json';
import { recordAttempt } from '../../lib/progress';

export const QUIZ_ID = 'n5-m02-c03-l02-vocabulary-v1';
export const questions = bank.items;
export function scoreExistenceVocabulary(answers: Record<string,string>) {
 return questions.filter(q=>answers[q.id]===q.answerKey.choiceId).length;
}
export default function ExistenceVocabularyPractice() {
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false);
 const [saving,setSaving]=useState(false);
 const [error,setError]=useState('');
 const [draft,setDraft]=useState('');
 const [model,setModel]=useState(false);
 const count=questions.filter(q=>Boolean(answers[q.id])).length;
 async function submit() {
  if(submitted||saving||count!==questions.length)return;
  setSaving(true);setError('');
  try {await recordAttempt(QUIZ_ID,'n5',scoreExistenceVocabulary(answers),questions.length);setSubmitted(true);}
  catch(e){setError(e instanceof Error?e.message:'Local progress storage unavailable');}
  finally{setSaving(false);}
 }
 return <section className="foundation-practice" aria-labelledby="existence-vocab-heading">
  <div className="foundation-practice__header"><span className="eyebrow">WRITTEN VOCABULARY CHECK</span>
   <h2 id="existence-vocab-heading">Who or what is there?</h2>
   <p>Choose one answer for each question. Use Tab and arrow keys to navigate radio groups.</p>
   <p aria-live="polite">{count} of {questions.length} answered</p>
   <div className="foundation-progress" role="progressbar" aria-label="Questions answered" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={count}><span style={{width:count/questions.length*100+'%'}}/></div>
  </div>
  {questions.map((q,i)=><fieldset className="foundation-question" key={q.id} disabled={submitted||saving}>
   <legend><span className="foundation-question__number">{String(i+1).padStart(2,'0')}</span>{q.prompt}</legend>
   <div className="foundation-options">{q.choices.map(c=><label key={c.id} className={'foundation-option '+(answers[q.id]===c.id?'foundation-option--selected':'')}>
    <input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span lang="ja">{c.text}</span>
   </label>)}</div>
   {submitted&&<div className="foundation-feedback" role="note"><strong>{answers[q.id]===q.answerKey.choiceId?'✓ Correct':'Review this answer'}</strong>
    <p>{q.explanation}</p>{answers[q.id]!==q.answerKey.choiceId&&<p>{q.choices.find(c=>c.id===answers[q.id])?.rationale}</p>}</div>}
  </fieldset>)}
  {error&&<p role="alert" className="inline-error">{error}. Your answers remain selected; retry saving.</p>}
  {!submitted?<button type="button" className="btn btn-primary" disabled={saving||count!==questions.length} onClick={submit}>{saving?'Saving…':'Check answers and save score'}</button>:
   <div className="foundation-result" role="status"><h3>{scoreExistenceVocabulary(answers)} / {questions.length} correct</h3><p>Saved in this browser's local progress.</p>
    <button type="button" className="btn btn-outline" onClick={()=>{setAnswers({});setSubmitted(false);setError('');}}>Retry vocabulary check</button></div>}
  <div className="foundation-teachback"><h3>Optional written transfer</h3>
   <label htmlFor="existence-vocab-draft">Write two sentences about a fictional room, with one living being and one object.</label>
   <textarea id="existence-vocab-draft" rows={4} value={draft} onChange={e=>setDraft(e.target.value)} placeholder="部屋に 友だちが います。かばんも あります。"/>
   <button type="button" className="btn btn-outline" aria-expanded={model} onClick={()=>setModel(v=>!v)}>{model?'Hide model':'Compare with model'}</button>
   {model&&<div className="foundation-feedback"><p lang="ja">部屋に 友だちが います。かばんも あります。</p><p>Check your location に, your choice of います／あります, and the meaning of each noun. Alternative natural sentences are welcome.</p></div>}
  </div><p className="foundation-storage-note">Open writing stays on this page and is not graded or uploaded. Quiz attempts are saved locally.</p>
 </section>;
}
