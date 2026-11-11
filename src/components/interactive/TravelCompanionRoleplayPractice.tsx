import { useState } from 'react';
import bank from '../../content/exercises/n5-m05-c02-l08-v1.json';
import { recordAttempt } from '../../lib/progress';
export const TRAVEL_COMPANION_ROLEPLAY_QUIZ_ID = 'n5-m05-c02-l08-v1';
export const travelCompanionRoleplayQuestions = bank.items;
export function scoreTravelCompanionRoleplay(answers: Record<string,string>) { return travelCompanionRoleplayQuestions.filter(q => answers[q.id] === q.answerKey.choiceId).length; }
const rubric = ['I used a destination with に or へ.', 'I used a vehicle with で, or 歩いて for walking.', 'I used a companion with と, or 一人で for alone.', 'I asked relevant questions and switched speaker roles.'];
export default function TravelCompanionRoleplayPractice() {
 const [draft,setDraft]=useState(''); const [model,setModel]=useState(false); const [checks,setChecks]=useState<Record<string,boolean>>({});
 const [answers,setAnswers]=useState<Record<string,string>>({}); const [submitted,setSubmitted]=useState(false); const [notice,setNotice]=useState('');
 const score=scoreTravelCompanionRoleplay(answers);
 async function submit() { if(travelCompanionRoleplayQuestions.some(q=>!answers[q.id])) {setNotice('Answer all written questions first.');return;} setSubmitted(true);try{await recordAttempt(TRAVEL_COMPANION_ROLEPLAY_QUIZ_ID,'n5',score,travelCompanionRoleplayQuestions.length);setNotice('Written attempt saved on this device.');}catch{setNotice('Answers checked; local progress storage is unavailable.');} }
 return <section className="foundation-practice" aria-label="Optional travel companion role play">
 <h2>Optional role-switch rehearsal</h2><p>Type a fictional exchange or practise aloud. Text stays in this page's memory, is not uploaded or graded, and is lost on refresh.</p>
 <label htmlFor="travel-companion-draft"><strong>My travel conversation</strong></label>
 <textarea id="travel-companion-draft" lang="ja" rows={6} value={draft} onChange={e=>setDraft(e.target.value)} style={{width:'100%',maxWidth:'100%',minWidth:0,boxSizing:'border-box'}} placeholder="何で行きますか。\n電車で行きます。\nだれと行きますか。\n友達と行きます。" />
 <div style={{display:'flex',gap:'.75rem',flexWrap:'wrap',marginBlock:'1rem'}}><button type="button" aria-expanded={model} onClick={()=>setModel(v=>!v)}>{model?'Hide model exchange':'Compare with model exchange'}</button><button type="button" onClick={()=>{setDraft('');setChecks({});setModel(false);}}>Clear rehearsal</button></div>
 {model&&<div className="course-notice"><h3>Model exchange</h3><p lang="ja">A：日曜日、どこへ行きますか。<br/>B：博物館に行きます。<br/>A：どうやって行きますか。<br/>B：電車で行きます。<br/>A：だれと行きますか。<br/>B：友達と行きます。</p><p>On Sunday: Where will you go? To the museum. How? By train. With whom? With a friend. Switch roles and substitute your own fictional details.</p></div>}
 <fieldset style={{minWidth:0}}><legend><strong>Ungraded self-review</strong></legend>{rubric.map(c=><label key={c} style={{display:'flex',alignItems:'center',gap:'.75rem',minHeight:44}}><input type="checkbox" checked={!!checks[c]} onChange={e=>setChecks(v=>({...v,[c]:e.target.checked}))}/><span>{c}</span></label>)}</fieldset>
 <p aria-live="polite">Self-check: {rubric.filter(c=>checks[c]).length} of 4 marked. This is not a speaking grade.</p>
 <h2>Written knowledge check</h2><p>These {travelCompanionRoleplayQuestions.length} questions assess written understanding, not pronunciation or hearing.</p>
 {travelCompanionRoleplayQuestions.map((q,i)=><fieldset key={q.id} disabled={submitted} className="foundation-question" style={{minWidth:0,marginBlock:'1rem',padding:'1rem',border:'1px solid var(--border,#888)',borderRadius:'.75rem'}}><legend><strong>{i+1}. {q.prompt}</strong></legend>{q.choices.map(c=><label key={c.id} style={{display:'flex',alignItems:'center',gap:'.75rem',minHeight:44,overflowWrap:'anywhere'}}><input type="radio" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(v=>({...v,[q.id]:c.id}))}/><span>{c.text}</span></label>)}{submitted&&<p role="status" className="foundation-feedback"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct.':'Review.'}</strong> {q.choices.find(c=>c.id===answers[q.id])?.rationale} Answer: {q.choices.find(c=>c.id===q.answerKey.choiceId)?.text}</p>}</fieldset>)}
 <p aria-live="polite">{notice}</p>
 {submitted?<><p role="status">Written score: {score} / {travelCompanionRoleplayQuestions.length}</p><button type="button" onClick={()=>{setAnswers({});setSubmitted(false);setNotice('Ready to retry.');}}>Retry written questions</button></>:<button type="button" onClick={submit} disabled={Object.keys(answers).length!==travelCompanionRoleplayQuestions.length}>Check written answers</button>}
 <p>No microphone is accessed. Optional speaking and open writing are not recorded or graded.</p>
 </section>;
}
