import { useState } from 'react';
import bank from '../../content/exercises/n5-m03-c01-l01-v1.json';
import { recordAttempt } from '../../lib/progress';

export const QUIZ_ID = 'n5-m03-c01-l01-context-v1';
export const questions = bank.items;
export const scoreTimetable = (answers: Record<string,string>) => questions.filter(q => answers[q.id] === q.answerKey.choiceId).length;

export default function TimetableContextPractice() {
  const [answers,setAnswers] = useState<Record<string,string>>({});
  const [submitted,setSubmitted] = useState(false);
  const [saving,setSaving] = useState(false);
  const [error,setError] = useState('');
  const [draft,setDraft] = useState('');
  const [model,setModel] = useState(false);
  const answered=questions.filter(q=>Boolean(answers[q.id])).length;
  async function submit(){
    if(saving||submitted||answered!==questions.length)return;
    setSaving(true);setError('');
    try { await recordAttempt(QUIZ_ID,'n5',scoreTimetable(answers),questions.length);setSubmitted(true); }
    catch(e){setError(e instanceof Error?e.message:'Browser storage is unavailable');}
    finally{setSaving(false);}
  }
  return <section className="foundation-practice" aria-labelledby="timetable-practice">
    <div className="foundation-practice__header"><span className="eyebrow">WRITTEN TIMETABLE CHECK</span><h2 id="timetable-practice">Read the notice closely</h2>
      <p>Use the written notice, not imagined audio.</p><p aria-live="polite">{answered} of {questions.length} answered</p>
      <div className="foundation-progress" role="progressbar" aria-label="Questions answered" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={answered}><span style={{width:(answered/questions.length*100)+'%'}}/></div>
    </div>
    {questions.map((q,i)=><fieldset className="foundation-question" key={q.id} disabled={submitted||saving}>
      <legend><span className="foundation-question__number">{String(i+1).padStart(2,'0')}</span>{q.prompt}</legend>
      <div className="foundation-options">{q.choices.map(c=><label key={c.id} className={'foundation-option '+(answers[q.id]===c.id?'foundation-option--selected':'')}>
        <input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span>{c.text}</span>
      </label>)}</div>
      {submitted&&<div className="foundation-feedback" role="note"><strong>{answers[q.id]===q.answerKey.choiceId?'✓ Correct':'Review this answer'}</strong><p>{q.explanation}</p>{answers[q.id]!==q.answerKey.choiceId&&<p>{q.choices.find(c=>c.id===answers[q.id])?.rationale}</p>}</div>}
    </fieldset>)}
    {error&&<p role="alert" className="inline-error">{error}. Your selections remain available; retry saving.</p>}
    {!submitted?<button className="btn btn-primary" type="button" disabled={saving||answered!==questions.length} onClick={submit}>{saving?'Saving…':'Check answers and save score'}</button>:
      <div className="foundation-result" role="status"><h3>{scoreTimetable(answers)} / {questions.length} correct</h3><p>Attempt saved in this browser's local progress.</p><button type="button" className="btn btn-outline" onClick={()=>{setAnswers({});setSubmitted(false);setError('');}}>Retry timetable check</button></div>}
    <div className="foundation-teachback"><h3>Optional mini-notice (ungraded)</h3><label htmlFor="timetable-draft">Write a date, start time and number of people for a different study group.</label>
      <textarea id="timetable-draft" rows={4} value={draft} onChange={e=>setDraft(e.target.value)} placeholder="12月5日。午後2時から。2人です。"/>
      <button type="button" className="btn btn-outline" aria-expanded={model} onClick={()=>setModel(v=>!v)}>{model?'Hide model':'Compare with model'}</button>
      {model&&<p className="foundation-feedback" lang="ja">日にち：12月5日。時間：午後2時から。参加：2人。</p>}
    </div><p className="foundation-storage-note">Writing is not uploaded, saved or graded. Quiz attempts are stored locally in your browser and may be lost if browser data is cleared.</p>
  </section>;
}