import { useState } from 'react';
import bank from '../../content/exercises/n5-m02-c04-l01-v1.json';
import { recordAttempt } from '../../lib/progress';

export const QUIZ_ID = 'n5-m02-c04-l01-context-v1';
export const questions = bank.items;
export function scoreRoomTour(answers: Record<string,string>) {
  return questions.filter(q => answers[q.id] === q.answerKey.choiceId).length;
}
export default function RoomTourPractice() {
  const [answers,setAnswers] = useState<Record<string,string>>({});
  const [submitted,setSubmitted] = useState(false);
  const [saving,setSaving] = useState(false);
  const [error,setError] = useState('');
  const [draft,setDraft] = useState('');
  const [model,setModel] = useState(false);
  const answered = questions.filter(q => !!answers[q.id]).length;
  async function submit() {
    if(saving || submitted || answered !== questions.length)return;
    setSaving(true);setError('');
    try {await recordAttempt(QUIZ_ID,'n5',scoreRoomTour(answers),questions.length);setSubmitted(true);}
    catch(e){setError(e instanceof Error?e.message:'Browser storage is unavailable');}
    finally{setSaving(false);}
  }
  return <section className="foundation-practice" aria-labelledby="room-tour-practice">
    <div className="foundation-practice__header"><span className="eyebrow">WRITTEN ROOM TOUR CHECK</span><h2 id="room-tour-practice">Find the room details</h2>
      <p>Use the written dialogue, not an imagined recording.</p><p aria-live="polite">{answered} of {questions.length} answered</p>
      <div className="foundation-progress" role="progressbar" aria-label="Questions answered" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={answered}><span style={{width:(answered/questions.length*100)+'%'}}/></div>
    </div>
    {questions.map((q,i)=><fieldset className="foundation-question" key={q.id} disabled={submitted||saving}>
      <legend><span className="foundation-question__number">{String(i+1).padStart(2,'0')}</span>{q.prompt}</legend>
      <div className="foundation-options">{q.choices.map(c=><label key={c.id} className={'foundation-option '+(answers[q.id]===c.id?'foundation-option--selected':'')}>
        <input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span>{c.text}</span>
      </label>)}</div>
      {submitted&&<div className="foundation-feedback" role="note"><strong>{answers[q.id]===q.answerKey.choiceId?'✓ Correct':'Review this answer'}</strong><p>{q.explanation}</p>{answers[q.id]!==q.answerKey.choiceId&&<p>{q.choices.find(c=>c.id===answers[q.id])?.rationale}</p>}</div>}
    </fieldset>)}
    {error&&<p role="alert" className="inline-error">{error}. Your choices remain; retry saving.</p>}
    {!submitted?<button className="btn btn-primary" type="button" disabled={saving||answered!==questions.length} onClick={submit}>{saving?'Saving…':'Check answers and save score'}</button>:
      <div className="foundation-result" role="status"><h3>{scoreRoomTour(answers)} / {questions.length} correct</h3><p>Attempt saved in local browser progress.</p><button type="button" className="btn btn-outline" onClick={()=>{setAnswers({});setSubmitted(false);setError('');}}>Retry room tour check</button></div>}
    <div className="foundation-teachback"><h3>Optional independent writing (ungraded)</h3><label htmlFor="room-tour-draft">Describe a book under a chair, a bag on a desk and a dog beside a window.</label>
      <textarea id="room-tour-draft" rows={4} value={draft} onChange={e=>setDraft(e.target.value)} placeholder="いすの したに ほんが あります。"/>
      <button type="button" className="btn btn-outline" aria-expanded={model} onClick={()=>setModel(v=>!v)}>{model?'Hide model':'Compare with model'}</button>
      {model&&<p className="foundation-feedback" lang="ja">いすの したに ほんが あります。つくえの うえに かばんが あります。まどの となりに いぬが います。</p>}
    </div><p className="foundation-storage-note">Writing is not uploaded, saved or automatically graded. Quiz attempts use browser-local progress storage.</p>
  </section>;
}
