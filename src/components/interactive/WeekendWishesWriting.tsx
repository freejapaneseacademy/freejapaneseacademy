import { useState } from 'react';
import bank from '../../content/exercises/n5-m07-c02-l07-v1.json';
import { recordAttempt } from '../../lib/progress';
type Answers = Record<string,string>;
export function gradeWeekendWishes(answers: Answers) { return bank.items.filter(q => answers[q.id] === q.answerKey.choiceId).length; }
const model = '土曜日に本屋に行きます。新しい本がほしいです。本屋で日本語の本を見たいです。';
export default function WeekendWishesWriting() {
 const [draft,setDraft]=useState(''); const [answers,setAnswers]=useState<Answers>({}); const [submitted,setSubmitted]=useState(false); const [notice,setNotice]=useState(''); const [showModel,setShowModel]=useState(false); const [checks,setChecks]=useState<boolean[]>([false,false,false,false,false]);
 const score=gradeWeekendWishes(answers);
 function save(){try{localStorage.setItem('draft-n5-m07-c02-l07-v1',draft);setNotice('Draft saved in this browser only.');}catch{setNotice('Browser storage unavailable. Copy your draft to keep it.');}}
 function restore(){try{setDraft(localStorage.getItem('draft-n5-m07-c02-l07-v1')??'');setNotice('Saved draft loaded, if one existed.');}catch{setNotice('Browser storage unavailable.');}}
 async function submit(){setSubmitted(true);try{await recordAttempt('quiz-n5-m07-c02-l07-v1','n5',score,bank.items.length);setNotice('Recognition attempt saved in this browser.');}catch{setNotice('Storage unavailable; answers remain visible.');}}
 return <section className="foundation-practice" aria-labelledby="weekend-writing-heading">
 <h2 id="weekend-writing-heading">Write and review your weekend wishes</h2>
 <label htmlFor="weekend-draft">Your original Japanese wish list (2–5 sentences)</label>
 <textarea id="weekend-draft" rows={6} value={draft} onChange={e=>setDraft(e.target.value)} style={{display:'block',width:'100%',maxWidth:'100%',boxSizing:'border-box',marginBlock:'0.75rem',padding:'0.75rem',border:'1px solid currentColor',borderRadius:8,background:'transparent',color:'inherit'}} />
 <div style={{display:'flex',flexWrap:'wrap',gap:'0.5rem'}}><button className="btn btn-outline" type="button" onClick={save}>Save draft locally</button><button className="btn btn-outline" type="button" onClick={restore}>Load saved draft</button><button className="btn btn-outline" type="button" onClick={()=>setShowModel(v=>!v)} aria-expanded={showModel}>{showModel?'Hide model':'Compare with model'}</button></div>
 {showModel&&<p lang="ja">{model}</p>}
 <h3>Ungraded self-review</h3><p>Check each criterion only after reviewing your own writing. This is not an automated writing score.</p>
 {['Desired item uses がほしい / はほしくない','Desired action uses the ます-stem + たい','Destination takes に','Activity location takes で when needed','Two to five connected understandable sentences'].map((t,i)=><label key={i} style={{display:'flex',alignItems:'start',gap:8,marginBlock:'0.5rem'}}><input type="checkbox" checked={checks[i]} onChange={e=>setChecks(v=>v.map((x,j)=>j===i?e.target.checked:x))}/>{t}</label>)}
 <h2>Written recognition practice</h2><p>Choose one answer per question. Use Tab and arrow keys with the native radio controls. Unanswered items count as incorrect.</p>
 {bank.items.map((q,i)=><fieldset key={q.id} data-question-id={q.id} style={{marginBlock:'1rem',padding:'1rem',minWidth:0,border:'1px solid currentColor',borderRadius:8}}><legend><strong>{i+1}. {q.prompt}</strong></legend><div style={{display:'grid',gap:'0.5rem'}}>{q.choices.map(c=><label key={c.id} style={{display:'flex',gap:10,alignItems:'center',minHeight:44,overflowWrap:'anywhere'}}><input type="radio" name={q.id} checked={answers[q.id]===c.id} disabled={submitted} onChange={()=>setAnswers(v=>({...v,[q.id]:c.id}))}/><span>{c.text}</span></label>)}</div>{submitted&&<p role="status"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct.':'Review.'}</strong> {q.explanation} {answers[q.id]&&q.choices.find(c=>c.id===answers[q.id])?.rationale}</p>}</fieldset>)}
 {!submitted?<button className="btn btn-primary" type="button" onClick={submit}>Check 8 answers</button>:<><p role="status">Recognition score: {score} / {bank.items.length}. {notice}</p><button className="btn btn-outline" type="button" onClick={()=>{setAnswers({});setSubmitted(false);setNotice('');}}>Retry questions</button></>}
 {!submitted&&notice&&<p role="status">{notice}</p>}
 </section>;
}