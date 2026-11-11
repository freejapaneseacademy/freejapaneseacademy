import { useState } from 'react';
import bank from '../../content/exercises/n5-m04-c04-l07-v1.json';
import { recordAttempt } from '../../lib/progress';
export const WRITING_QUIZ_ID = 'n5-m04-c04-l07-v1';
export const writingQuestions = bank.items;
export function scoreInvitationWriting(answers: Record<string,string>) { return writingQuestions.filter(q=>answers[q.id]===q.answerKey.choiceId).length; }
export default function InvitationWritingPractice() {
 const [invitation,setInvitation]=useState('');
 const [reply,setReply]=useState('');
 const [review,setReview]=useState(false);
 const [checks,setChecks]=useState([false,false,false,false]);
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false);
 const [notice,setNotice]=useState('');
 const score=scoreInvitationWriting(answers);
 async function submit(){if(writingQuestions.some(q=>!answers[q.id])){setNotice('Answer all ten fixed-choice questions before checking.');return;}
 setSubmitted(true);setNotice('Check each explanation below. Your open writing is not scored.');
 try {await recordAttempt(WRITING_QUIZ_ID,'n5',score,writingQuestions.length);}
 catch {setNotice('Answers checked; browser progress storage is unavailable. Your writing was not uploaded.');}}
 return <section className="foundation-practice" aria-label="Invitation writing and review">
 <h2>Type your invitation and reply</h2><p>Your drafts remain in this page's memory while it is open; they are not uploaded or automatically graded. Copy them elsewhere before closing the page.</p>
 <label htmlFor="invite-draft"><strong>Invitation (2–5 Japanese sentences)</strong></label>
 <textarea id="invite-draft" lang="ja" value={invitation} onChange={e=>setInvitation(e.target.value)} rows={5} style={{width:'100%',maxWidth:'100%',minWidth:0,boxSizing:'border-box'}} placeholder="土曜日にいっしょに…" />
 <label htmlFor="reply-draft"><strong>Reply (1–3 Japanese sentences)</strong></label>
 <textarea id="reply-draft" lang="ja" value={reply} onChange={e=>setReply(e.target.value)} rows={3} style={{width:'100%',maxWidth:'100%',minWidth:0,boxSizing:'border-box'}} placeholder="いいですね。／すみません…" />
 <div style={{display:'flex',gap:'.75rem',flexWrap:'wrap',marginBlock:'1rem'}}><button type="button" onClick={()=>setReview(v=>!v)} aria-expanded={review}>{review?'Hide':'Show'} model and self-review</button><button type="button" onClick={()=>{setInvitation('');setReply('');setChecks([false,false,false,false]);setReview(false);}}>Clear both drafts</button></div>
 {review&&<div className="course-notice"><h3>Compare with a model (not a grade)</h3><p lang="ja">土曜日にいっしょに昼ご飯を食べませんか。十二時に駅で会いましょう。</p><p lang="ja">いいですね。土曜日の十二時に駅で会いましょう。</p><p>Saturday lunch invitation, noon at the station; the reply accepts and confirms the plan. Other natural wording is valid.</p>
 {['My invitation is polite and recognizable.','My day and time are clear and consistent.','I checked meeting-place で and destination に.','My reply accepts or politely declines with an alternative.'].map((c,i)=><label key={c} style={{display:'flex',gap:'.6rem',alignItems:'center',minHeight:44}}><input type="checkbox" checked={checks[i]} onChange={e=>setChecks(v=>v.map((x,j)=>i===j?e.target.checked:x))}/>{c}</label>)}
 <p aria-live="polite">Self-review: {checks.filter(Boolean).length} of 4 criteria checked. This is not a teacher assessment.</p></div>}
 <h2>Fixed-answer language check</h2><p>Ten questions review the forms you need for writing. This score does not evaluate your composition.</p>
 {writingQuestions.map((q,i)=><fieldset key={q.id} className="foundation-question" style={{minWidth:0,marginBlock:'1rem',padding:'1rem',border:'1px solid var(--border,#888)',borderRadius:'.75rem'}}><legend><strong>{i+1}. {q.prompt}</strong></legend>
 {q.choices.map(c=><label key={c.id} style={{display:'flex',gap:'.75rem',alignItems:'center',minHeight:44,overflowWrap:'anywhere'}}><input type="radio" name={q.id} checked={answers[q.id]===c.id} disabled={submitted} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span>{c.text}</span></label>)}
 {submitted&&<p className="foundation-feedback" role="status"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct.':'Review.'}</strong> {q.choices.find(c=>c.id===answers[q.id])?.rationale}</p>}</fieldset>)}
 <p aria-live="polite">{notice}</p>
 {submitted?<><p role="status">Fixed-answer check: {score} of {writingQuestions.length} correct.</p><button type="button" onClick={()=>{setAnswers({});setSubmitted(false);setNotice('Ready to retry.');}}>Retry language check</button></>:<button type="button" onClick={submit}>Check answers and save score</button>}
 </section>;
}
