import { useState } from 'react';
import bank from '../../content/exercises/n5-m05-c01-l02-v1.json';
import { recordAttempt } from '../../lib/progress';

export const QUIZ_ID = 'n5-m05-c01-l02-vocabulary-v1';
export const questions = bank.items;
export function scoreTravelVocabulary(answers: Record<string,string>) {
 return questions.filter(q => answers[q.id] === q.answerKey.choiceId).length;
}
export default function TravelVocabularyPractice() {
 const [answers,setAnswers] = useState<Record<string,string>>({});
 const [submitted,setSubmitted] = useState(false);
 const [saving,setSaving] = useState(false);
 const [error,setError] = useState('');
 const [draft,setDraft] = useState('');
 const [showModel,setShowModel] = useState(false);
 const count = questions.filter(q=>Boolean(answers[q.id])).length;
 async function submit() {
  if(saving||submitted||count!==questions.length)return;
  setSaving(true);setError('');
  try { await recordAttempt(QUIZ_ID,'n5',scoreTravelVocabulary(answers),questions.length);setSubmitted(true); }
  catch(e){setError(e instanceof Error?e.message:'Local progress storage unavailable');}
  finally{setSaving(false);}
 }
 return <section className="foundation-practice" aria-labelledby="travel-vocab-heading">
  <div className="foundation-practice__header"><span className="eyebrow">WRITTEN VOCABULARY CHECK</span>
   <h2 id="travel-vocab-heading">Where are you going, and how?</h2>
   <p>Choose one answer for each question. Keyboard: Tab to a choice and use arrow keys or Space.</p>
   <p aria-live="polite">{count} of {questions.length} answered</p>
   <div className="foundation-progress" role="progressbar" aria-label="Questions answered" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={count}><span style={{width:count/questions.length*100+'%'}}/></div>
  </div>
  {questions.map((q,i)=><fieldset className="foundation-question" key={q.id} disabled={submitted||saving}>
   <legend><span className="foundation-question__number">{String(i+1).padStart(2,'0')}</span>{q.prompt}</legend>
   <div className="foundation-options">{q.choices.map(c=><label key={c.id} className={'foundation-option '+(answers[q.id]===c.id?'foundation-option--selected':'')}>
    <input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span>{c.text}</span>
   </label>)}</div>
   {submitted&&<div className="foundation-feedback" role="note"><strong>{answers[q.id]===q.answerKey.choiceId?'✓ Correct':'Review this answer'}</strong>
    <p>{q.explanation}</p>{answers[q.id]!==q.answerKey.choiceId&&<p>{q.choices.find(c=>c.id===answers[q.id])?.rationale}</p>}</div>}
  </fieldset>)}
  {error&&<p role="alert" className="inline-error">{error}. Your answers remain selected; retry saving.</p>}
  {!submitted?<button type="button" className="btn btn-primary" disabled={saving||count!==questions.length} onClick={submit}>{saving?'Saving…':'Check answers and save score'}</button>:
   <div className="foundation-result" role="status"><h3>{scoreTravelVocabulary(answers)} / {questions.length} correct</h3><p>Attempt saved to local learning progress.</p>
    <button type="button" className="btn btn-outline" onClick={()=>{setAnswers({});setSubmitted(false);setError('');}}>Retry vocabulary check</button></div>}
  <div className="foundation-teachback"><h3>Optional travel-plan writing</h3>
   <label htmlFor="travel-vocab-draft">Write a destination, a means of travel and a return-home sentence.</label>
   <textarea id="travel-vocab-draft" rows={4} value={draft} onChange={e=>setDraft(e.target.value)} placeholder="土曜日に公園へ行きます。"/>
   <button type="button" className="btn btn-outline" aria-expanded={showModel} onClick={()=>setShowModel(v=>!v)}>{showModel?'Hide model':'Compare with model'}</button>
   {showModel&&<p className="foundation-feedback" lang="ja">土曜日に公園へ行きます。自転車で行きます。午後、家に帰ります。</p>}
  </div><p className="foundation-storage-note">Writing is not saved or automatically graded. Quiz attempts are stored locally on this device.</p>
 </section>;
}
