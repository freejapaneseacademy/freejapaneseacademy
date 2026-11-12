import { useState } from 'react';
import bank from '../../content/exercises/n5-m06-c04-l03-v1.json';
import { recordAttempt } from '../../lib/progress';
export const ONGOING_GRAMMAR_QUIZ_ID = 'n5-m06-c04-l03-v1';
export const ongoingGrammarQuestions = bank.items;
export function scoreOngoingGrammar(answers: Record<string,string>) { return ongoingGrammarQuestions.filter(q=>answers[q.id]===q.answerKey.choiceId).length; }
export default function OngoingGrammarPractice() {
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false);
 const [notice,setNotice]=useState('');
 const [draft,setDraft]=useState('');
 const [model,setModel]=useState(false);
 const score=scoreOngoingGrammar(answers);
 async function submit() {
  if(ongoingGrammarQuestions.some(q=>!answers[q.id])) {setNotice('Answer every question before checking.');return;}
  setSubmitted(true);
  try {await recordAttempt(ONGOING_GRAMMAR_QUIZ_ID,'n5',score,ongoingGrammarQuestions.length);setNotice('Recognition attempt saved on this device.');}
  catch {setNotice('Answers checked, but browser progress storage is unavailable.');}
 }
 return <section className="foundation-practice" aria-label="Ongoing activities grammar practice">
  <h2>Write a short dialogue (ungraded)</h2>
  <label htmlFor="ongoing-grammar-draft"><strong>Two to four lines using 何をしていますか and 〜ています</strong></label>
  <textarea id="ongoing-grammar-draft" lang="ja" rows={5} value={draft} onChange={e=>setDraft(e.target.value)} style={{width:'100%',maxWidth:'100%',minWidth:0,boxSizing:'border-box'}} placeholder="今、何をしていますか。" />
  <p>This draft stays only in this page until refresh. It is not uploaded, automatically graded, or saved to progress.</p>
  <button type="button" aria-expanded={model} onClick={()=>setModel(v=>!v)}>{model?'Hide model':'Show model and self-check'}</button>
  {model&&<div className="course-notice"><p lang="ja">A：今、何をしていますか。 B：教室で日本語を勉強しています。</p><p>Check て-form + います, で for action location, を for a direct object, and a clear time context. Other natural wording is possible.</p></div>}
  <h2>Check your grammar recognition</h2>
  {ongoingGrammarQuestions.map((q,i)=><fieldset key={q.id} className="foundation-question" disabled={submitted} style={{minWidth:0,marginBlock:'1rem',padding:'1rem',border:'1px solid var(--border,#888)',borderRadius:'.75rem'}}>
   <legend><strong>{i+1}. {q.prompt}</strong></legend>
   {q.choices.map(c=><label key={c.id} style={{display:'flex',alignItems:'center',gap:'.75rem',minHeight:44,overflowWrap:'anywhere'}}><input type="radio" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(v=>({...v,[q.id]:c.id}))}/><span>{c.text}</span></label>)}
   {submitted&&<div className="foundation-feedback"><p><strong>{answers[q.id]===q.answerKey.choiceId?'Correct.':'Review.'}</strong> {q.choices.find(c=>c.id===answers[q.id])?.rationale}</p><p>Evidence: <span lang="ja">{q.evidence}</span></p><p>Answer: {q.choices.find(c=>c.id===q.answerKey.choiceId)?.text}</p></div>}
  </fieldset>)}
  <p aria-live="polite">{notice}</p>
  {submitted?<><p role="status">Recognition score: {score} / {ongoingGrammarQuestions.length}</p><button type="button" onClick={()=>{setAnswers({});setSubmitted(false);setNotice('Ready to retry.');}}>Retry questions</button></>:<button type="button" disabled={Object.keys(answers).length!==ongoingGrammarQuestions.length} onClick={submit}>Check answers</button>}
 </section>;
}
