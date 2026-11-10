import { useState } from 'react';
import bank from '../../content/exercises/n5-m03-c02-l04-v1.json';
import { recordAttempt } from '../../lib/progress';
export const QUIZ_ID='n5-m03-c02-l04-kanji-v1';
export const questions=bank.items;
export const scoreRoutineKanji=(answers:Record<string,string>)=>questions.filter(q=>answers[q.id]===q.answerKey.choiceId).length;
export default function RoutineKanjiPractice(){
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false);
 const [saving,setSaving]=useState(false);
 const [storageMessage,setStorageMessage]=useState('');
 const [draft,setDraft]=useState('');
 const [model,setModel]=useState(false);
 const answered=questions.filter(q=>answers[q.id]).length;
 async function submit(){
  if(submitted||saving||answered!==questions.length)return;
  setSaving(true);setStorageMessage('');
  try{await recordAttempt(QUIZ_ID,'n5',scoreRoutineKanji(answers),questions.length);setStorageMessage('Score saved in this browser.');}
  catch{setStorageMessage('Browser storage is unavailable. Your score is shown, but not saved.');}
  finally{setSubmitted(true);setSaving(false);}
 }
 return <section className="foundation-practice" aria-labelledby="routine-kanji-title">
  <div className="foundation-practice__header"><span className="eyebrow">KANJI READING CHECK</span><h2 id="routine-kanji-title">Read daily actions</h2>
   <p>Choose one answer for each written question.</p><p aria-live="polite">{answered} of {questions.length} answered</p>
   <div className="foundation-progress" role="progressbar" aria-label="Questions answered" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={answered}><span style={{width:(answered/questions.length*100)+'%'}}/></div>
  </div>
  {questions.map((q,i)=><fieldset key={q.id} className="foundation-question" disabled={submitted||saving}>
   <legend><span className="foundation-question__number">{String(i+1).padStart(2,'0')}</span>{q.prompt}</legend>
   <div className="foundation-options">{q.choices.map(c=><label key={c.id} className={'foundation-option '+(answers[q.id]===c.id?'foundation-option--selected':'')}>
    <input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span>{c.text}</span>
   </label>)}</div>
   {submitted&&<div className="foundation-feedback" role="note"><strong>{answers[q.id]===q.answerKey.choiceId?'✓ Correct':'Review this answer'}</strong><p>{q.explanation}</p>{answers[q.id]!==q.answerKey.choiceId&&<p>{q.choices.find(c=>c.id===answers[q.id])?.rationale}</p>}</div>}
  </fieldset>)}
  {!submitted?<button type="button" className="btn btn-primary" disabled={saving||answered!==questions.length} onClick={submit}>{saving?'Checking…':'Check answers and save score'}</button>:
  <div className="foundation-result" role="status"><h3>{scoreRoutineKanji(answers)} / {questions.length} correct</h3><p>{storageMessage}</p><button type="button" className="btn btn-outline" onClick={()=>{setAnswers({});setSubmitted(false);setStorageMessage('');}}>Retry kanji check</button></div>}
  <div className="foundation-teachback"><h3>Optional writing (ungraded)</h3><label htmlFor="routine-kanji-draft">Write three sentences about an imagined usual day.</label>
   <textarea id="routine-kanji-draft" rows={4} value={draft} onChange={e=>setDraft(e.target.value)} placeholder="朝6時に起きます。7時にパンを食べます。夜は本を読みます。"/>
   <button type="button" className="btn btn-outline" aria-expanded={model} onClick={()=>setModel(v=>!v)}>{model?'Hide model':'Compare with model'}</button>
   {model&&<p className="foundation-feedback" lang="ja">朝6時に起きます。7時にパンを食べます。夜は本を読みます。</p>}
  </div><p className="foundation-storage-note">Writing is not uploaded, saved or automatically graded. Quiz attempts are stored only in this browser when storage is available.</p>
 </section>;
}
