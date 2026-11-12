import { useState } from 'react';
import bank from '../../content/exercises/n5-m07-c01-l03-v1.json';
import { recordAttempt } from '../../lib/progress';
export const LIKES_GRAMMAR_QUIZ_ID = 'n5-m07-c01-l03-v1';
export const likesGrammarQuestions = bank.items;
export function scoreLikesGrammar(answers: Record<string,string>) { return likesGrammarQuestions.filter(q=>answers[q.id]===q.answerKey.choiceId).length; }
export default function LikesGrammarPractice() {
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false);
 const [notice,setNotice]=useState('');
 const [draft,setDraft]=useState('');
 const [model,setModel]=useState(false);
 const score=scoreLikesGrammar(answers);
 async function submit(){
  if(likesGrammarQuestions.some(q=>!answers[q.id])){setNotice('Answer all questions before checking.');return;}
  setSubmitted(true);
  try { await recordAttempt(LIKES_GRAMMAR_QUIZ_ID,'n5',score,likesGrammarQuestions.length);setNotice('Recognition attempt saved on this device.'); }
  catch {setNotice('Answers checked; browser progress storage is unavailable.');}
 }
 return <section className="foundation-practice" aria-label="Likes and strengths grammar practice">
  <h2>Write your introduction (ungraded)</h2>
  <label htmlFor="likes-grammar-draft"><strong>Write three or four sentences about a hobby, ability and skill</strong></label>
  <textarea id="likes-grammar-draft" lang="ja" rows={5} value={draft} onChange={e=>setDraft(e.target.value)} style={{width:'100%',maxWidth:'100%',minWidth:0,boxSizing:'border-box'}} placeholder="私は音楽が好きです。" />
  <p>Your draft remains in this page only until refresh or navigation; it is not sent, stored or automatically graded.</p>
  <button type="button" aria-expanded={model} onClick={()=>setModel(v=>!v)}>{model?'Hide model and self-check':'Show model and self-check'}</button>
  {model&&<div className="course-notice"><p lang="ja">私は音楽が好きです。ピアノが少しできます。でも、まだあまり上手ではありません。</p><p>Self-check: が after the liked item; できます for ability; 上手ではありません for limited skill; consistent polite endings. Different natural answers are welcome.</p></div>}
  <h2>Grammar recognition check</h2>
  {likesGrammarQuestions.map((q,i)=><fieldset key={q.id} className="foundation-question" disabled={submitted} style={{minWidth:0,marginBlock:'1rem',padding:'1rem',border:'1px solid var(--border,#888)',borderRadius:'.75rem'}}>
   <legend><strong>{i+1}. {q.prompt}</strong></legend>
   {q.choices.map(c=><label key={c.id} style={{display:'flex',alignItems:'center',gap:'.75rem',minHeight:44,overflowWrap:'anywhere'}}><input type="radio" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span>{c.text}</span></label>)}
   {submitted&&<p role="status" className="foundation-feedback"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct.':'Review.'}</strong> {q.choices.find(c=>c.id===answers[q.id])?.rationale} Answer: {q.choices.find(c=>c.id===q.answerKey.choiceId)?.text}. Evidence: <span lang="ja">{q.evidence}</span></p>}
  </fieldset>)}
  <p aria-live="polite">{notice}</p>
  {submitted?<><p role="status">Recognition score: {score} / {likesGrammarQuestions.length}</p><button type="button" onClick={()=>{setAnswers({});setSubmitted(false);setNotice('Ready to retry.');}}>Retry questions</button></>:<button type="button" disabled={Object.keys(answers).length!==likesGrammarQuestions.length} onClick={submit}>Check answers</button>}
 </section>;
}
