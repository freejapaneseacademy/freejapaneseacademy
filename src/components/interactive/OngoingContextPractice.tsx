import { useState } from 'react';
import bank from '../../content/exercises/n5-m06-c04-l01-v1.json';
import { recordAttempt } from '../../lib/progress';

export const ONGOING_CONTEXT_QUIZ_ID = 'n5-m06-c04-l01-v1';
export const ongoingContextQuestions = bank.items;
export function scoreOngoingContext(answers: Record<string,string>) {
  return ongoingContextQuestions.filter(q => answers[q.id] === q.answerKey.choiceId).length;
}
export default function OngoingContextPractice() {
  const [answers,setAnswers] = useState<Record<string,string>>({});
  const [submitted,setSubmitted] = useState(false);
  const [notice,setNotice] = useState('');
  const [draft,setDraft] = useState('');
  const [showModel,setShowModel] = useState(false);
  const score = scoreOngoingContext(answers);
  async function submit() {
    if(ongoingContextQuestions.some(q => !answers[q.id])) { setNotice('Choose an answer for each question.'); return; }
    setSubmitted(true);
    try { await recordAttempt(ONGOING_CONTEXT_QUIZ_ID,'n5',score,ongoingContextQuestions.length); setNotice('Recognition attempt saved on this device.'); }
    catch { setNotice('Answers checked; local progress storage is unavailable.'); }
  }
  return <section className="foundation-practice" aria-label="Ongoing activities context practice">
    <h2>Write a short exchange (ungraded)</h2>
    <label htmlFor="ongoing-context-draft"><strong>Two to four lines: ask and describe an action now</strong></label>
    <textarea id="ongoing-context-draft" lang="ja" rows={5} value={draft} onChange={e=>setDraft(e.target.value)} style={{width:'100%',maxWidth:'100%',minWidth:0,boxSizing:'border-box'}} placeholder="今、何をしていますか。" />
    <p>This draft stays in this page until you leave or refresh. It is not uploaded, saved or graded. Use your Japanese IME freely.</p>
    <button type="button" aria-expanded={showModel} onClick={()=>setShowModel(v=>!v)}>{showModel?'Hide model':'Show model and self-check'}</button>
    {showModel && <div className="course-notice"><p lang="ja">A：今、何をしていますか。 B：図書室で本を読んでいます。</p><p>Check that your question asks about an activity, the answer has て-form + います, and a place of action takes で. Other natural answers are possible.</p></div>}
    <h2>Recognition questions</h2>
    {ongoingContextQuestions.map((q,i)=><fieldset className="foundation-question" key={q.id} disabled={submitted} style={{minWidth:0,marginBlock:'1rem',padding:'1rem',border:'1px solid var(--border,#888)',borderRadius:'.75rem'}}>
      <legend><strong>{i+1}. {q.prompt}</strong></legend>
      {q.choices.map(c=><label key={c.id} style={{display:'flex',alignItems:'center',gap:'.75rem',minHeight:44,overflowWrap:'anywhere'}}><input type="radio" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(v=>({...v,[q.id]:c.id}))}/><span>{c.text}</span></label>)}
      {submitted && <p role="status" className="foundation-feedback"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct.':'Review.'}</strong> {q.choices.find(c=>c.id===answers[q.id])?.rationale} Answer: {q.choices.find(c=>c.id===q.answerKey.choiceId)?.text}</p>}
    </fieldset>)}
    <p aria-live="polite">{notice}</p>
    {submitted ? <><p role="status">Recognition score: {score} / {ongoingContextQuestions.length}</p><button type="button" onClick={()=>{setAnswers({});setSubmitted(false);setNotice('Ready to retry.');}}>Retry questions</button></> : <button type="button" disabled={Object.keys(answers).length!==ongoingContextQuestions.length} onClick={submit}>Check answers</button>}
  </section>;
