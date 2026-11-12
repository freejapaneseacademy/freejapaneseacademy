import { useState } from 'react';
import bank from '../../content/exercises/n5-m02-c01-l05-v1.json';
import { recordAttempt } from '../../lib/progress';

export const QUIZ_ID='n5-m02-c01-l05-reading-v1';
export const questions=bank.items;
export const scoreLostFoundReading=(answers:Record<string,string>)=>questions.filter(q=>answers[q.id]===q.answerKey.choiceId).length;

export default function LostFoundReadingPractice(){
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false);
 const [saving,setSaving]=useState(false);
 const [error,setError]=useState('');
 const [draft,setDraft]=useState('');
 const [showModel,setShowModel]=useState(false);
 const answered=questions.filter(q=>Boolean(answers[q.id])).length;
 async function submit(){
  if(saving||submitted||answered!==questions.length)return;
  setSaving(true);setError('');
  try{await recordAttempt(QUIZ_ID,'n5',scoreLostFoundReading(answers),questions.length);setSubmitted(true);}
  catch(e){setError(e instanceof Error?e.message:'Local progress unavailable');}
  finally{setSaving(false);}
 }
 return <section className="foundation-practice" aria-labelledby="lost-found-reading-heading">
 <div className="foundation-practice__header"><span className="eyebrow">WRITTEN READING CHECK</span><h2 id="lost-found-reading-heading">Find the evidence in each note</h2><p>Answer ten questions. Revisit the Japanese phrase in the feedback; do not guess ownership.</p>
 <p aria-live="polite">{answered} of {questions.length} answered</p><div className="foundation-progress" role="progressbar" aria-label="Questions answered" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={answered}><span style={{width:(answered/questions.length*100)+'%'}}/></div></div>
 {questions.map((q,i)=><fieldset className="foundation-question" key={q.id} disabled={submitted||saving}><legend><span className="foundation-question__number">{String(i+1).padStart(2,'0')}</span>{q.prompt}</legend>
 <div className="foundation-options">{q.choices.map(c=><label key={c.id} className={'foundation-option '+(answers[q.id]===c.id?'foundation-option--selected':'')}><input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span>{c.text}</span></label>)}</div>
 {submitted&&<div className="foundation-feedback" role="note"><strong>{answers[q.id]===q.answerKey.choiceId?'✓ Correct':'Review this answer'}</strong><p>{q.explanation}</p>{answers[q.id]!==q.answerKey.choiceId&&<p>{q.choices.find(c=>c.id===answers[q.id])?.rationale}</p>}</div>}</fieldset>)}
 {error&&<p className="inline-error" role="alert">{error}. Selections retained; retry saving.</p>}
 {!submitted?<button type="button" className="btn btn-primary" disabled={saving||answered!==questions.length} onClick={submit}>{saving?'Saving…':'Check answers and save score'}</button>:<div className="foundation-result" role="status"><h3>{scoreLostFoundReading(answers)} / {questions.length} correct</h3><p>Attempt saved to local browser progress.</p><button type="button" className="btn btn-outline" onClick={()=>{setAnswers({});setSubmitted(false);setError('');}}>Retry reading check</button></div>}
 <div className="foundation-teachback"><h3>Optional ungraded writing</h3><label htmlFor="lost-found-reading-draft">Write a three-line lost-and-found notice with an object, an owner or unknown owner, and a location.</label><textarea id="lost-found-reading-draft" rows={4} value={draft} onChange={e=>setDraft(e.target.value)} placeholder="白い ほんが あります。"/>
 <button type="button" className="btn btn-outline" aria-expanded={showModel} onClick={()=>setShowModel(v=>!v)}>{showModel?'Hide model':'Compare with model'}</button>
 {showModel&&<p className="foundation-feedback" lang="ja">白い ほんが あります。これは ユイさんのです。うけつけに あります。</p>}</div><p className="foundation-storage-note">Writing stays in this page only and is not graded or uploaded. Quiz attempts use local progress storage.</p>
 </section>;
}
