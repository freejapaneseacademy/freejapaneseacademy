import { useState } from 'react';
import bank from '../../content/exercises/n5-m05-c04-l08-v1.json';
import { recordAttempt } from '../../lib/progress';
export const OUTING_ROLEPLAY_QUIZ_ID = 'n5-m05-c04-l08-v1';
export const outingRoleplayQuestions = bank.items;
export function scoreOutingRoleplay(answers: Record<string,string>) { return outingRoleplayQuestions.filter(q => answers[q.id] === q.answerKey.choiceId).length; }
const criteria = ['I made an invitation with a destination.','I marked the meeting time with に and place with で.','I marked the destination with に and vehicle with で.','I labelled any stated fare as one way or round trip.','I confirmed the final agreed plan or repaired a misunderstanding.'];
export default function OutingRoleplayPractice() {
 const [draft,setDraft]=useState(''); const [showModel,setShowModel]=useState(false);
 const [checks,setChecks]=useState<Record<string,boolean>>({}); const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false); const [notice,setNotice]=useState('');
 const score=scoreOutingRoleplay(answers);
 async function submit(){if(outingRoleplayQuestions.some(q=>!answers[q.id])){setNotice('Answer every written question first.');return;}setSubmitted(true);try{await recordAttempt(OUTING_ROLEPLAY_QUIZ_ID,'n5',score,outingRoleplayQuestions.length);setNotice('Written attempt saved on this device.');}catch{setNotice('Answers checked; local storage is unavailable.');}}
 return <section className="foundation-practice" aria-label="Optional outing role play">
 <h2>Build your outing conversation</h2><p>Type or rehearse silently or aloud. No microphone is used; the draft stays in page memory and disappears on refresh.</p>
 <label htmlFor="outing-roleplay-draft"><strong>My six-to-eight-line exchange</strong></label>
 <textarea id="outing-roleplay-draft" lang="ja" rows={8} value={draft} onChange={e=>setDraft(e.target.value)} style={{width:'100%',maxWidth:'100%',minWidth:0,boxSizing:'border-box'}} placeholder="土曜日に、いっしょに博物館に行きませんか。" />
 <div style={{display:'flex',flexWrap:'wrap',gap:'.75rem',marginBlock:'1rem'}}><button type="button" aria-expanded={showModel} onClick={()=>setShowModel(v=>!v)}>{showModel?'Hide model':'Compare with model'}</button><button type="button" onClick={()=>{setDraft('');setChecks({});setShowModel(false);}}>Clear rehearsal</button></div>
 {showModel&&<div className="course-notice"><h3>Model exchange (printed, not recorded)</h3><p lang="ja" style={{whiteSpace:'pre-line'}}>{'A：土曜日に、いっしょに博物館に行きませんか。\nB：いいですね。何時に会いますか。\nA：九時半に駅で会いましょう。\nB：どうやって行きますか。\nA：電車で行きます。片道は三百円です。\nB：十時でもいいですか。\nA：はい、十時に駅で会いましょう。\nB：ありがとうございます。'}</p><p>The final agreed time is ten, not nine-thirty. Try another destination and vehicle.</p></div>}
 <fieldset style={{minWidth:0}}><legend><strong>Ungraded self-review</strong></legend>{criteria.map(c=><label key={c} style={{display:'flex',alignItems:'center',gap:'.75rem',minHeight:44}}><input type="checkbox" checked={!!checks[c]} onChange={e=>setChecks(v=>({...v,[c]:e.target.checked}))}/><span>{c}</span></label>)}</fieldset><p aria-live="polite">Self-check: {criteria.filter(c=>checks[c]).length} of 5 marked. This is not a speaking score.</p>
 <h2>Written recognition check</h2><p>These ten questions assess written meaning and particles, not pronunciation or listening.</p>
 {outingRoleplayQuestions.map((q,i)=><fieldset key={q.id} disabled={submitted} className="foundation-question" style={{minWidth:0,marginBlock:'1rem',padding:'1rem',border:'1px solid var(--border,#888)',borderRadius:'.75rem'}}><legend><strong>{i+1}. {q.prompt}</strong></legend>{q.choices.map(c=><label key={c.id} style={{display:'flex',alignItems:'center',gap:'.75rem',minHeight:44,overflowWrap:'anywhere'}}><input type="radio" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(v=>({...v,[q.id]:c.id}))}/><span>{c.text}</span></label>)}{submitted&&<p role="status" className="foundation-feedback"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct.':'Review.'}</strong> {q.choices.find(c=>c.id===answers[q.id])?.rationale} Answer: {q.choices.find(c=>c.id===q.answerKey.choiceId)?.text}</p>}</fieldset>)}
 <p aria-live="polite">{notice}</p>
 {submitted?<><p role="status">Written score: {score} / {outingRoleplayQuestions.length}</p><button type="button" onClick={()=>{setAnswers({});setSubmitted(false);setNotice('Ready to retry.');}}>Retry written questions</button></>:<button type="button" onClick={submit} disabled={Object.keys(answers).length!==outingRoleplayQuestions.length}>Check written answers</button>}
 <p>Optional oral rehearsal and open writing are never automatically graded. No microphone, recording, upload or speech recognition is used.</p></section>;
}
