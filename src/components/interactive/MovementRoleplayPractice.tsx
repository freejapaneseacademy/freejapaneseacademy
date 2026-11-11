import { useState } from 'react';
import bank from '../../content/exercises/n5-m05-c01-l08-v1.json';
import { recordAttempt } from '../../lib/progress';

export const MOVEMENT_ROLEPLAY_QUIZ_ID = 'n5-m05-c01-l08-v1';
export const movementRoleplayQuestions = bank.items;
export function scoreMovementRoleplay(answers: Record<string,string>) {
  return movementRoleplayQuestions.filter(q => answers[q.id] === q.answerKey.choiceId).length;
}
const rubric = ['My destination uses に or へ.','My transport uses で, or I say 歩いて.','My movement verb fits the speaker viewpoint.','I tried both speaker roles and gave relevant answers.'];
export default function MovementRoleplayPractice() {
 const [draft,setDraft]=useState('');
 const [model,setModel]=useState(false);
 const [checks,setChecks]=useState<Record<string,boolean>>({});
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false);
 const [notice,setNotice]=useState('');
 const score=scoreMovementRoleplay(answers);
 async function submit(){
  if(movementRoleplayQuestions.some(q=>!answers[q.id])){setNotice('Answer all written questions before checking.');return;}
  setSubmitted(true);
  try {await recordAttempt(MOVEMENT_ROLEPLAY_QUIZ_ID,'n5',score,movementRoleplayQuestions.length);setNotice('Written quiz attempt saved on this device.');}
  catch {setNotice('Answers checked; local progress storage is unavailable.');}
 }
 return <section className="foundation-practice" aria-label="Optional movement conversation practice">
  <h2>Optional role-switch rehearsal</h2>
  <p>Type a fictional Japanese exchange or practise aloud without recording. Your text remains in page memory only; it is not uploaded or graded. Copy it elsewhere if you want to keep it.</p>
  <label htmlFor="movement-roleplay-draft"><strong>My travel conversation</strong></label>
  <textarea id="movement-roleplay-draft" lang="ja" rows={6} value={draft} onChange={e=>setDraft(e.target.value)} style={{width:'100%',maxWidth:'100%',minWidth:0,boxSizing:'border-box'}} placeholder="どこへ行きますか。\n図書館に行きます。" />
  <div style={{display:'flex',gap:'.75rem',flexWrap:'wrap',marginBlock:'1rem'}}>
   <button type="button" aria-expanded={model} onClick={()=>setModel(v=>!v)}>{model?'Hide model exchange':'Compare with model exchange'}</button>
   <button type="button" onClick={()=>{setDraft('');setChecks({});setModel(false);}}>Clear rehearsal</button>
  </div>
  {model&&<div className="course-notice"><h3>Model for self-comparison</h3><p lang="ja">A：土曜日、どこへ行きますか。<br/>B：図書館に行きます。<br/>A：どうやって行きますか。<br/>B：バスで行きます。<br/>A：いつ帰りますか。<br/>B：午後四時ごろ、家に帰ります。</p><p>Saturday: Where are you going? To the library. How? By bus. When will you return? Home around 4 p.m. Change roles and places for your own version.</p></div>}
  <fieldset style={{minWidth:0}}><legend><strong>Ungraded self-review</strong></legend>{rubric.map(c=><label key={c} style={{display:'flex',alignItems:'center',gap:'.75rem',minHeight:44}}><input type="checkbox" checked={!!checks[c]} onChange={e=>setChecks(v=>({...v,[c]:e.target.checked}))}/><span>{c}</span></label>)}</fieldset>
  <p aria-live="polite">Self-check: {rubric.filter(c=>checks[c]).length} of 4 criteria marked. This is not a speaking grade.</p>
  <h2>Written knowledge check</h2><p>These {movementRoleplayQuestions.length} questions assess written language recognition, not pronunciation or listening.</p>
  {movementRoleplayQuestions.map((q,i)=><fieldset key={q.id} disabled={submitted} className="foundation-question" style={{minWidth:0,marginBlock:'1rem',padding:'1rem',border:'1px solid var(--border,#888)',borderRadius:'.75rem'}}>
   <legend><strong>{i+1}. {q.prompt}</strong></legend>
   {q.choices.map(c=><label key={c.id} style={{display:'flex',alignItems:'center',gap:'.75rem',minHeight:44,overflowWrap:'anywhere'}}><input type="radio" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(v=>({...v,[q.id]:c.id}))}/><span>{c.text}</span></label>)}
   {submitted&&<p role="status" className="foundation-feedback"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct.':'Review.'}</strong> {q.choices.find(c=>c.id===answers[q.id])?.rationale} Answer: {q.choices.find(c=>c.id===q.answerKey.choiceId)?.text}</p>}
  </fieldset>)}
  <p aria-live="polite">{notice}</p>
  {submitted?<><p role="status">Written score: {score} / {movementRoleplayQuestions.length}</p><button type="button" onClick={()=>{setAnswers({});setSubmitted(false);setNotice('Ready to retry.');}}>Retry written questions</button></>:<button type="button" onClick={submit} disabled={Object.keys(answers).length!==movementRoleplayQuestions.length}>Check written answers</button>}
  <p>No microphone is accessed. The optional rehearsal is not graded or recorded.</p>
 </section>;
}
