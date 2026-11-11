import { useState } from 'react';
import bank from '../../content/exercises/n5-m06-c02-l01-v1.json';
import { recordAttempt } from '../../lib/progress';
export const TE_CONTEXT_QUIZ_ID = 'n5-m06-c02-l01-v1';
export const teContextQuestions = bank.items;
export function scoreTeContext(answers: Record<string,string>) {
  return teContextQuestions.filter(q => answers[q.id] === q.answerKey.choiceId).length;
}
export default function TeFormContextPractice() {
  const [answers,setAnswers]=useState<Record<string,string>>({});
  const [submitted,setSubmitted]=useState(false);
  const [notice,setNotice]=useState('');
  const [draft,setDraft]=useState('');
  const [model,setModel]=useState(false);
  const score=scoreTeContext(answers);
  async function submit() {
    if(teContextQuestions.some(q=>!answers[q.id])) {setNotice('Choose an answer for every question.');return;}
    setSubmitted(true);
    try {await recordAttempt(TE_CONTEXT_QUIZ_ID,'n5',score,teContextQuestions.length);setNotice('Recognition attempt saved on this device.');}
    catch {setNotice('Answers checked; local progress storage is unavailable.');}
  }
  return <section className="foundation-practice" aria-label="Te-form first-exposure practice">
    <h2>Try your own two-step routine</h2>
    <label htmlFor="te-context-draft"><strong>My two or three Japanese sentences (ungraded)</strong></label>
    <textarea id="te-context-draft" lang="ja" rows={5} value={draft} onChange={e=>setDraft(e.target.value)} style={{width:'100%',maxWidth:'100%',minWidth:0,boxSizing:'border-box'}} placeholder="顔を洗って、朝ごはんを食べます。" />
    <p>Writing is not automatically graded or uploaded. Compare your draft with the printed model.</p>
    <button type="button" aria-expanded={model} onClick={()=>setModel(v=>!v)}>{model?'Hide model':'Show model and self-check'}</button>
    {model && <div className="course-notice"><p lang="ja">朝、顔を洗って、朝ごはんを食べます。朝ごはんを食べてから、本を読みます。</p><p>Check action order, the linking form, polite sentence ending, and the meaning of 〜てから. These are self-review criteria, not a score.</p></div>}
    <h2>Recognition questions</h2>
    {teContextQuestions.map((q,i)=><fieldset className="foundation-question" key={q.id} disabled={submitted} style={{minWidth:0,marginBlock:'1rem',padding:'1rem',border:'1px solid var(--border,#888)',borderRadius:'.75rem'}}>
      <legend><strong>{i+1}. {q.prompt}</strong></legend>
      {q.choices.map(c=><label key={c.id} style={{display:'flex',alignItems:'center',gap:'.75rem',minHeight:44,overflowWrap:'anywhere'}}><input type="radio" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(v=>({...v,[q.id]:c.id}))}/><span>{c.text}</span></label>)}
      {submitted && <p role="status" className="foundation-feedback"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct.':'Review.'}</strong> {q.choices.find(c=>c.id===answers[q.id])?.rationale} Answer: {q.choices.find(c=>c.id===q.answerKey.choiceId)?.text}</p>}
    </fieldset>)}
    <p aria-live="polite">{notice}</p>
    {submitted ? <><p role="status">Recognition score: {score} / {teContextQuestions.length}</p><button type="button" onClick={()=>{setAnswers({});setSubmitted(false);setNotice('Ready to retry.');}}>Retry questions</button></> : <button type="button" disabled={Object.keys(answers).length!==teContextQuestions.length} onClick={submit}>Check answers</button>}
  </section>;
