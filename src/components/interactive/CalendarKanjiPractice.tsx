import { useState } from 'react';
import bank from '../../content/exercises/n5-m03-c01-l04-v1.json';
import { recordAttempt } from '../../lib/progress';
export const QUIZ_ID='n5-m03-c01-l04-kanji-v1';
export const questions=bank.items;
export const scoreCalendarKanji=(answers:Record<string,string>)=>questions.filter(q=>answers[q.id]===q.answerKey.choiceId).length;
export default function CalendarKanjiPractice(){
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false);
 const [saving,setSaving]=useState(false);
 const [error,setError]=useState('');
 const [draft,setDraft]=useState('');
 const [showModel,setShowModel]=useState(false);
 const answered=questions.filter(q=>answers[q.id]).length;
 async function submit(){
  if(submitted||saving||answered!==questions.length)return;
  setSaving(true);setError('');
  try{await recordAttempt(QUIZ_ID,'n5',scoreCalendarKanji(answers),questions.length);setSubmitted(true);}
  catch(e){setError(e instanceof Error?e.message:'Local progress storage unavailable');}
  finally{setSaving(false);}
 }
 return <section className="foundation-practice" aria-labelledby="calendar-kanji-title">
  <div className="foundation-practice__header"><span className="eyebrow">KANJI READING CHECK</span><h2 id="calendar-kanji-title">Read the calendar signs</h2>
   <p>Choose one answer for each written-form question.</p><p aria-live="polite">{answered} of {questions.length} answered</p>
   <div className="foundation-progress" role="progressbar" aria-label="Questions answered" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={answered}><span style={{width:(answered/questions.length*100)+'%'}}/></div>
  </div>
  {questions.map((q,i)=><fieldset key={q.id} className="foundation-question" disabled={submitted||saving}>
   <legend><span className="foundation-question__number">{String(i+1).padStart(2,'0')}</span>{q.prompt}</legend>
   <div className="foundation-options">{q.choices.map(c=><label key={c.id} className={'foundation-option '+(answers[q.id]===c.id?'foundation-option--selected':'')}>
    <input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span>{c.text}</span>
   </label>)}</div>
   {submitted&&<div className="foundation-feedback" role="note"><strong>{answers[q.id]===q.answerKey.choiceId?'✓ Correct':'Review this answer'}</strong><p>{q.explanation}</p>{answers[q.id]!==q.answerKey.choiceId&&<p>{q.choices.find(c=>c.id===answers[q.id])?.rationale}</p>}</div>}
  </fieldset>)}
  {error&&<p role="alert" className="inline-error">{error}. Your answers remain selected; try saving again.</p>}
  {!submitted?<button type="button" className="btn btn-primary" disabled={saving||answered!==questions.length} onClick={submit}>{saving?'Saving…':'Check answers and save score'}</button>:
  <div className="foundation-result" role="status"><h3>{scoreCalendarKanji(answers)} / {questions.length} correct</h3><p>Saved in local browser progress.</p><button type="button" className="btn btn-outline" onClick={()=>{setAnswers({});setSubmitted(false);setError('');}}>Retry kanji check</button></div>}
  <div className="foundation-teachback"><h3>Optional written notice (ungraded)</h3><label htmlFor="calendar-kanji-draft">Write a weekday, date, time and a counter phrase.</label>
   <textarea id="calendar-kanji-draft" rows={4} value={draft} onChange={e=>setDraft(e.target.value)} placeholder="金曜日、12月4日。午前10時から。2人です。"/>
   <button type="button" className="btn btn-outline" aria-expanded={showModel} onClick={()=>setShowModel(v=>!v)}>{showModel?'Hide model':'Compare with model'}</button>
   {showModel&&<p className="foundation-feedback" lang="ja">金曜日、12月4日。午前10時からです。参加は2人です。</p>}
  </div><p className="foundation-storage-note">Free writing is not saved, uploaded or graded. Quiz scores are stored locally and can be erased by clearing browser data.</p>
 </section>;
}