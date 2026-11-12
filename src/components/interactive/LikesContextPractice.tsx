import { useState } from 'react';
import bank from '../../content/exercises/n5-m07-c01-l01-v1.json';
import { recordAttempt } from '../../lib/progress';
export const LIKES_CONTEXT_QUIZ_ID = 'n5-m07-c01-l01-v1';
export const likesContextQuestions = bank.items;
export function scoreLikesContext(answers: Record<string,string>) { return likesContextQuestions.filter(q=>answers[q.id]===q.answerKey.choiceId).length; }
export default function LikesContextPractice() {
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false);
 const [notice,setNotice]=useState('');
 const [draft,setDraft]=useState('');
 const [model,setModel]=useState(false);
 const score=scoreLikesContext(answers);
 async function submit(){
  if(likesContextQuestions.some(q=>!answers[q.id])){setNotice('Answer all questions before checking.');return;}
  setSubmitted(true);
  try{await recordAttempt(LIKES_CONTEXT_QUIZ_ID,'n5',score,likesContextQuestions.length);setNotice('Recognition attempt saved on this device.');}
  catch{setNotice('Answers checked, but local progress storage is unavailable.');}
 }
 return <section className="foundation-practice" aria-label="Hobby-club context practice">
  <h2>Introduce yourself (ungraded)</h2>
  <label htmlFor="likes-context-draft"><strong>Write two to four lines about likes and an optional ability</strong></label>
  <textarea id="likes-context-draft" lang="ja" rows={5} value={draft} onChange={e=>setDraft(e.target.value)} style={{width:'100%',maxWidth:'100%',minWidth:0,boxSizing:'border-box'}} placeholder="私は音楽が好きです。" />
  <p>This writing stays in this page until you leave or refresh; it is not uploaded, saved, or graded.</p>
  <button type="button" aria-expanded={model} onClick={()=>setModel(v=>!v)}>{model?'Hide writing model':'Show writing model'}</button>
  {model&&<div className="course-notice"><p lang="ja">私はユキです。音楽が好きです。サッカーはあまり好きではありません。ピアノが少しできます。</p><p>Check が好きです for preference, あまり with a negative, and できます for ability. Other natural answers are welcome.</p></div>}
  <h2>Check your understanding</h2>
  {likesContextQuestions.map((q,i)=><fieldset key={q.id} className="foundation-question" disabled={submitted} style={{minWidth:0,marginBlock:'1rem',padding:'1rem',border:'1px solid var(--border,#888)',borderRadius:'.75rem'}}>
   <legend><strong>{i+1}. {q.prompt}</strong></legend>
   {q.choices.map(c=><label key={c.id} style={{display:'flex',alignItems:'center',gap:'.75rem',minHeight:44,overflowWrap:'anywhere'}}><input type="radio" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span>{c.text}</span></label>)}
   {submitted&&<p role="status" className="foundation-feedback"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct.':'Review.'}</strong> {q.choices.find(c=>c.id===answers[q.id])?.rationale} Answer: {q.choices.find(c=>c.id===q.answerKey.choiceId)?.text}. Evidence: <span lang="ja">{q.evidence}</span></p>}
  </fieldset>)}
  <p aria-live="polite">{notice}</p>
  {submitted?<><p role="status">Recognition score: {score} / {likesContextQuestions.length}</p><button type="button" onClick={()=>{setAnswers({});setSubmitted(false);setNotice('Ready to retry.');}}>Retry questions</button></>:<button type="button" disabled={Object.keys(answers).length!==likesContextQuestions.length} onClick={submit}>Check answers</button>}
 </section>;
}