import { useState } from 'react';
import bank from '../../content/exercises/n5-m06-c03-l01-v1.json';
import { recordAttempt } from '../../lib/progress';

export const REQUEST_CONTEXT_QUIZ_ID = 'n5-m06-c03-l01-v1';
export const requestContextQuestions = bank.items;
export function scoreRequestContext(answers: Record<string,string>) {
  return requestContextQuestions.filter(q => answers[q.id] === q.answerKey.choiceId).length;
}
export default function RequestContextPractice() {
  const [answers,setAnswers] = useState<Record<string,string>>({});
  const [submitted,setSubmitted] = useState(false);
  const [notice,setNotice] = useState('');
  const [draft,setDraft] = useState('');
  const [showModel,setShowModel] = useState(false);
  const score = scoreRequestContext(answers);
  async function submit() {
    if(requestContextQuestions.some(q => !answers[q.id])) { setNotice('Choose an answer for each question.'); return; }
    setSubmitted(true);
    try { await recordAttempt(REQUEST_CONTEXT_QUIZ_ID,'n5',score,requestContextQuestions.length); setNotice('Recognition attempt saved on this device.'); }
    catch { setNotice('Answers checked; local progress storage is unavailable.'); }
  }
  return <section className="foundation-practice" aria-label="Requests and permission context practice">
    <h2>Write a short exchange (ungraded)</h2>
    <label htmlFor="request-context-draft"><strong>Three lines: permission, response, request</strong></label>
    <textarea id="request-context-draft" lang="ja" rows={5} value={draft} onChange={e=>setDraft(e.target.value)} style={{width:'100%',maxWidth:'100%',minWidth:0,boxSizing:'border-box'}} placeholder="ここに座ってもいいですか。" />
    <p>Your writing is not uploaded or automatically graded. Compare it with the model.</p>
    <button type="button" aria-expanded={showModel} onClick={()=>setShowModel(v=>!v)}>{showModel?'Hide model':'Show model and self-check'}</button>
    {showModel && <div className="course-notice"><p lang="ja">A: ここに座ってもいいですか。 B: はい、いいですよ。 B: 名前を書いてください。</p><p>Check the permission question, an appropriate response, and a polite request. These criteria are ungraded.</p></div>}
    <h2>Recognition questions</h2>
    {requestContextQuestions.map((q,i)=><fieldset className="foundation-question" key={q.id} disabled={submitted} style={{minWidth:0,marginBlock:'1rem',padding:'1rem',border:'1px solid var(--border,#888)',borderRadius:'.75rem'}}>
      <legend><strong>{i+1}. {q.prompt}</strong></legend>
      {q.choices.map(c=><label key={c.id} style={{display:'flex',alignItems:'center',gap:'.75rem',minHeight:44,overflowWrap:'anywhere'}}><input type="radio" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(v=>({...v,[q.id]:c.id}))}/><span>{c.text}</span></label>)}
      {submitted && <p role="status" className="foundation-feedback"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct.':'Review.'}</strong> {q.choices.find(c=>c.id===answers[q.id])?.rationale} Answer: {q.choices.find(c=>c.id===q.answerKey.choiceId)?.text}</p>}
    </fieldset>)}
    <p aria-live="polite">{notice}</p>
    {submitted ? <><p role="status">Recognition score: {score} / {requestContextQuestions.length}</p><button type="button" onClick={()=>{setAnswers({});setSubmitted(false);setNotice('Ready to retry.');}}>Retry questions</button></> : <button type="button" disabled={Object.keys(answers).length!==requestContextQuestions.length} onClick={submit}>Check answers</button>}
  </section>;
