import { useState } from 'react';
import bank from '../../content/exercises/n5-m05-c03-l08-v1.json';
import { recordAttempt } from '../../lib/progress';
export const DIRECTIONS_ROLEPLAY_QUIZ_ID = 'n5-m05-c03-l08-v1';
export const directionsRoleplayQuestions = bank.items;
export function scoreDirectionsRoleplay(answers: Record<string,string>) { return directionsRoleplayQuestions.filter(q => answers[q.id] === q.answerKey.choiceId).length; }
const rubric = ['I asked where the destination is.', 'I gave a straight-ahead instruction.', 'I used right or left with 曲がってください.', 'I located a landmark with にあります.', 'I closed politely or corrected a misunderstanding.'];
export default function DirectionsRoleplayPractice() {
 const [draft,setDraft]=useState(''); const [model,setModel]=useState(false); const [checks,setChecks]=useState<Record<string,boolean>>({});
 const [answers,setAnswers]=useState<Record<string,string>>({}); const [submitted,setSubmitted]=useState(false); const [notice,setNotice]=useState('');
 const score=scoreDirectionsRoleplay(answers);
 async function submit() {if(directionsRoleplayQuestions.some(q=>!answers[q.id])){setNotice('Answer all written questions first.');return;}setSubmitted(true);try{await recordAttempt(DIRECTIONS_ROLEPLAY_QUIZ_ID,'n5',score,directionsRoleplayQuestions.length);setNotice('Written attempt saved on this device.');}catch{setNotice('Answers checked; local progress storage is unavailable.');}}
 return <section className="foundation-practice" aria-label="Optional directions role play">
 <h2>Try your own street-corner exchange</h2><p>Type or rehearse aloud without recording. Your typed text remains in page memory only and disappears on refresh.</p>
 <label htmlFor="directions-roleplay-draft"><strong>My six-line exchange</strong></label>
 <textarea id="directions-roleplay-draft" lang="ja" rows={7} value={draft} onChange={e=>setDraft(e.target.value)} style={{width:'100%',maxWidth:'100%',minWidth:0,boxSizing:'border-box'}} placeholder="すみません。図書館はどこですか。" />
 <div style={{display:'flex',gap:'.75rem',flexWrap:'wrap',marginBlock:'1rem'}}><button type="button" aria-expanded={model} onClick={()=>setModel(v=>!v)}>{model?'Hide model':'Compare with model'}</button><button type="button" onClick={()=>{setDraft('');setChecks({});setModel(false);}}>Clear rehearsal</button></div>
 {model&&<div className="course-notice"><h3>Model exchange</h3><p lang="ja">A：すみません。図書館はどこですか。<br/>B：この道をまっすぐ行ってください。<br/>A：信号で曲がりますか。<br/>B：はい、右に曲がってください。<br/>B：図書館は銀行の隣にあります。<br/>A：ありがとうございます。</p><p>Switch roles, then change the destination and landmark. This is written guidance, not recorded speech.</p></div>}
 <fieldset style={{minWidth:0}}><legend><strong>Ungraded self-review</strong></legend>{rubric.map(c=><label key={c} style={{display:'flex',alignItems:'center',gap:'.75rem',minHeight:44}}><input type="checkbox" checked={!!checks[c]} onChange={e=>setChecks(v=>({...v,[c]:e.target.checked}))}/><span>{c}</span></label>)}</fieldset><p aria-live="polite">Self-check: {rubric.filter(c=>checks[c]).length} of 5 marked. This is not a speaking grade.</p>
 <h2>Written knowledge check</h2><p>These {directionsRoleplayQuestions.length} questions assess written meaning, not pronunciation or listening.</p>
 {directionsRoleplayQuestions.map((q,i)=><fieldset key={q.id} disabled={submitted} className="foundation-question" style={{minWidth:0,marginBlock:'1rem',padding:'1rem',border:'1px solid var(--border,#888)',borderRadius:'.75rem'}}><legend><strong>{i+1}. {q.prompt}</strong></legend>{q.choices.map(c=><label key={c.id} style={{display:'flex',alignItems:'center',gap:'.75rem',minHeight:44,overflowWrap:'anywhere'}}><input type="radio" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(v=>({...v,[q.id]:c.id}))}/><span>{c.text}</span></label>)}{submitted&&<p role="status" className="foundation-feedback"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct.':'Review.'}</strong> {q.choices.find(c=>c.id===answers[q.id])?.rationale} Answer: {q.choices.find(c=>c.id===q.answerKey.choiceId)?.text}</p>}</fieldset>)}
 <p aria-live="polite">{notice}</p>
 {submitted?<><p role="status">Written score: {score} / {directionsRoleplayQuestions.length}</p><button type="button" onClick={()=>{setAnswers({});setSubmitted(false);setNotice('Ready to retry.');}}>Retry written questions</button></>:<button type="button" onClick={submit} disabled={Object.keys(answers).length!==directionsRoleplayQuestions.length}>Check written answers</button>}
 <p>No microphone is accessed. Speaking and open writing are never machine graded.</p></section>;
}
