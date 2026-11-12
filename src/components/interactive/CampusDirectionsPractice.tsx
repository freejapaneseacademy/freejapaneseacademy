import { useState } from 'react';
import bank from '../../content/exercises/n5-m02-c02-l01-v1.json';
import { recordAttempt } from '../../lib/progress';
export const QUIZ_ID = 'n5-m02-c02-l01-context-v1';
export const questions = bank.items;
export function scoreCampusDirections(answers: Record<string,string>): number {
  return questions.filter(q => answers[q.id] === q.answerKey.choiceId).length;
}
export default function CampusDirectionsPractice() {
  const [answers,setAnswers] = useState<Record<string,string>>({});
  const [submitted,setSubmitted] = useState(false);
  const [saving,setSaving] = useState(false);
  const [error,setError] = useState('');
  const [draft,setDraft] = useState('');
  const [showModel,setShowModel] = useState(false);
  const answered = questions.filter(q=>!!answers[q.id]).length;
  async function submit() {
    if (saving || submitted || answered !== questions.length) return;
    setSaving(true);setError('');
    try { await recordAttempt(QUIZ_ID,'n5',scoreCampusDirections(answers),questions.length); setSubmitted(true); }
    catch(e) { setError(e instanceof Error ? e.message : 'Progress storage unavailable'); }
    finally { setSaving(false); }
  }
  return <section className="foundation-practice" aria-labelledby="campus-directions-heading">
    <div className="foundation-practice__header"><span className="eyebrow">WRITTEN LOCATION CHECK</span>
      <h2 id="campus-directions-heading">Find the right place</h2>
      <p>Choose one answer per question. This checks the written dialogue, not listening or pronunciation.</p>
      <p aria-live="polite">{answered} of {questions.length} answered</p>
      <div className="foundation-progress" role="progressbar" aria-label="Questions answered" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={answered}><span style={{width:(answered/questions.length*100)+'%'}}/></div>
    </div>
    {questions.map((q,i)=><fieldset key={q.id} className="foundation-question" disabled={submitted||saving}>
      <legend><span className="foundation-question__number">{String(i+1).padStart(2,'0')}</span>{q.prompt}</legend>
      <div className="foundation-options">{q.choices.map(c=><label key={c.id} className={'foundation-option '+(answers[q.id]===c.id?'foundation-option--selected':'')}>
        <input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/>
        <span>{c.text}</span>
      </label>)}</div>
      {submitted&&<div className="foundation-feedback" role="note"><strong>{answers[q.id]===q.answerKey.choiceId?'✓ Correct':'Review this answer'}</strong><p>{q.explanation}</p>{answers[q.id]!==q.answerKey.choiceId&&<p>{q.choices.find(c=>c.id===answers[q.id])?.rationale}</p>}</div>}
    </fieldset>)}
    {error&&<p role="alert" className="inline-error">{error}. Your selections remain; try saving again.</p>}
    {!submitted?<button type="button" className="btn btn-primary" disabled={saving||answered!==questions.length} onClick={submit}>{saving?'Saving…':'Check answers and save score'}</button>:
      <div className="foundation-result" role="status"><h3>{scoreCampusDirections(answers)} / {questions.length} correct</h3><p>Attempt saved in local browser progress.</p><button type="button" className="btn btn-outline" onClick={()=>{setAnswers({});setSubmitted(false);setError('');}}>Retry written check</button></div>}
    <div className="foundation-teachback"><h3>Optional ungraded writing</h3><label htmlFor="campus-directions-draft">Write a three-line exchange asking where a room is.</label>
      <textarea id="campus-directions-draft" rows={4} value={draft} onChange={e=>setDraft(e.target.value)} placeholder="じむしつは どこですか。"/>
      <button type="button" className="btn btn-outline" aria-expanded={showModel} onClick={()=>setShowModel(v=>!v)}>{showModel?'Hide model':'Compare with model'}</button>
      {showModel&&<p className="foundation-feedback" lang="ja">すみません。じむしつは どこですか。じむしつは あそこです。ありがとうございます。</p>}
    </div><p className="foundation-storage-note">Writing is not uploaded, saved or automatically graded. Quiz attempts use local progress storage.</p>
  </section>;
}
