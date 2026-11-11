import { useState } from 'react';
import bank from '../../content/exercises/n5-m02-c03-l05-v1.json';
import { recordAttempt } from '../../lib/progress';
export const QUIZ_ID = 'n5-m02-c03-l05-room-reading-v1';
export const questions = bank.items;
export function scoreRoomReading(answers: Record<string,string>) { return questions.filter(q=>answers[q.id]===q.answerKey.choiceId).length; }
export default function RoomDiagramReading() {
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false);
 const [saving,setSaving]=useState(false);
 const [error,setError]=useState('');
 const [draft,setDraft]=useState('');
 const [showModel,setShowModel]=useState(false);
 const count=questions.filter(q=>Boolean(answers[q.id])).length;
 async function submit(){
  if(saving||submitted||count!==questions.length)return;
  setSaving(true);setError('');
  try {await recordAttempt(QUIZ_ID,'n5',scoreRoomReading(answers),questions.length);setSubmitted(true);}
  catch(e){setError(e instanceof Error?e.message:'Progress storage unavailable');}
  finally{setSaving(false);}
 }
 return <section className="foundation-practice" aria-labelledby="room-diagram-heading">
  <div className="foundation-practice__header"><span className="eyebrow">READING CHECK</span><h2 id="room-diagram-heading">Find and cite evidence</h2>
   <p>Use the classroom diagram and notice above. Choose the answer that is actually supported.</p>
   <p aria-live="polite">{count} of {questions.length} answered</p>
   <div className="foundation-progress" role="progressbar" aria-label="Questions answered" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={count}><span style={{width:count/questions.length*100+'%'}}/></div>
  </div>
  {questions.map((q,i)=><fieldset className="foundation-question" key={q.id} disabled={submitted||saving}>
   <legend><span className="foundation-question__number">{String(i+1).padStart(2,'0')}</span>{q.prompt}</legend>
   <div className="foundation-options">{q.choices.map(c=><label key={c.id} className={'foundation-option '+(answers[q.id]===c.id?'foundation-option--selected':'')}>
    <input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span>{c.text}</span>
   </label>)}</div>
   {submitted&&<div className="foundation-feedback" role="note"><strong>{answers[q.id]===q.answerKey.choiceId?'✓ Correct':'Review this answer'}</strong><p>{q.explanation}</p>{answers[q.id]!==q.answerKey.choiceId&&<p>{q.choices.find(c=>c.id===answers[q.id])?.rationale}</p>}</div>}
  </fieldset>)}
  {error&&<p role="alert" className="inline-error">{error}. Your answers remain selected; try saving again.</p>}
  {!submitted?<button className="btn btn-primary" type="button" disabled={saving||count!==questions.length} onClick={submit}>{saving?'Saving…':'Check answers and save score'}</button>:
   <div className="foundation-result" role="status"><h3>{scoreRoomReading(answers)} / {questions.length} correct</h3><p>Saved to your local learning progress.</p><button type="button" className="btn btn-outline" onClick={()=>{setAnswers({});setSubmitted(false);setError('');}}>Retry reading check</button></div>}
  <div className="foundation-teachback"><h3>Optional evidence writing</h3><label htmlFor="room-diagram-draft">Write one true Japanese existence sentence and cite the notice.</label>
   <textarea id="room-diagram-draft" rows={3} value={draft} onChange={e=>setDraft(e.target.value)} placeholder="教室の 前に…"/>
   <button type="button" className="btn btn-outline" aria-expanded={showModel} onClick={()=>setShowModel(v=>!v)}>{showModel?'Hide model':'Compare with model'}</button>
   {showModel&&<p className="foundation-feedback" lang="ja">教室の 前に 先生が います。</p>}
  </div><p className="foundation-storage-note">Free writing is not saved or graded. Scored quiz attempts are stored locally in your browser.</p>
 </section>;
}
