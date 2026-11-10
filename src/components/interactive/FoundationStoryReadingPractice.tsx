import { useState } from 'react';
import { recordAttempt } from '../../lib/progress';
import bank from '../../content/exercises/l0-m05-c04-l05-v1.json';

export function scoreFoundationStory(answers: Record<string,string>) {
  return bank.items.reduce((sum,q)=>sum+(answers[q.id]===q.answerKey.choiceId?1:0),0);
}
export default function FoundationStoryReadingPractice() {
  const [answers,setAnswers]=useState<Record<string,string>>({});
  const [submitted,setSubmitted]=useState(false);
  const [saving,setSaving]=useState(false);
  const [error,setError]=useState('');
  const [note,setNote]=useState('');
  const [showModel,setShowModel]=useState(false);
  const answered=bank.items.filter(q=>answers[q.id]).length;
  const submit=async()=>{
    if(submitted||saving||answered!==bank.items.length)return;
    setSaving(true);setError('');
    try {await recordAttempt('l0-m05-c04-l05-reading-v1','l0',scoreFoundationStory(answers),bank.items.length);setSubmitted(true);}
    catch(e){setError(e instanceof Error?e.message:'Browser storage unavailable');}
    finally{setSaving(false);}
  };
  return <section className="foundation-practice" aria-labelledby="foundation-story-title">
    <span className="eyebrow">EVIDENCE-BASED READING · L05</span>
    <h2 id="foundation-story-title">Find the story evidence</h2>
    <p>Refer to the original Japanese story above. Select one answer per question, then inspect the evidence after submission.</p>
    <p role="status" aria-live="polite">{answered} of {bank.items.length} answered</p>
    {bank.items.map((q,i)=><fieldset className="foundation-question" key={q.id} disabled={submitted||saving}>
      <legend><span className="foundation-question__number">{i+1}</span> {q.prompt}</legend>
      <div className="foundation-options">{q.choices.map(c=><label className="foundation-option" key={c.id}>
        <input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/>
        <span>{c.text}</span>
      </label>)}</div>
      {submitted&&<div className="foundation-feedback" role="note">
        <strong>{answers[q.id]===q.answerKey.choiceId?'Correct':'Review this answer'}</strong>
        <p>{q.explanation}</p>
        <p><strong>Japanese evidence:</strong> <span lang="ja">{q.evidence}</span></p>
        {answers[q.id]!==q.answerKey.choiceId&&<p>Your choice: {q.choices.find(c=>c.id===answers[q.id])?.rationale}</p>}
      </div>}
    </fieldset>)}
    {error&&<p role="alert">{error} Your choices are retained. You can retry saving.</p>}
    {!submitted?<button type="button" className="btn btn-primary" disabled={saving||answered!==bank.items.length} onClick={submit}>{saving?'Saving…':'Check all ten answers'}</button>:<div className="foundation-result" role="status">
      <h3>Reading score: {scoreFoundationStory(answers)} / {bank.items.length}</h3>
      <p>Saved as a browser-local practice attempt. This is not a reading proficiency certification.</p>
      <button className="btn btn-outline" type="button" onClick={()=>{setAnswers({});setSubmitted(false);setError('');}}>Try again</button>
    </div>}
    <div className="foundation-teachback">
      <h3>Optional correction note</h3>
      <label htmlFor="foundation-story-note">Which word will you review and why?</label>
      <textarea id="foundation-story-note" rows={3} value={note} onChange={e=>setNote(e.target.value)} placeholder="I will review コーヒー because…"/>
      <button className="btn btn-outline" type="button" aria-expanded={showModel} onClick={()=>setShowModel(v=>!v)}>{showModel?'Hide example':'Show example and self-check'}</button>
      {showModel&&<div className="foundation-feedback" role="note"><p>Example: I missed one ー in コーヒー. I will check both length marks, type the word again, and revisit it tomorrow.</p><p>Self-check: name the exact error, give the correct spelling, and choose a realistic next review time. Your note is not graded or transmitted.</p></div>}
    </div>
  </section>;
}
