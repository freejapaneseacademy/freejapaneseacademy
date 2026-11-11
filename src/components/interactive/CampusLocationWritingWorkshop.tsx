import { useState } from 'react';
import bank from '../../content/exercises/n5-m02-c02-l07-v1.json';
import { recordAttempt } from '../../lib/progress';
const draftKey='fja:n5-m02-c02-l07:writing:v1';
export function scoreCampusLocationRecognition(answers:Record<string,string>){return bank.items.filter(q=>answers[q.id]===q.answerKey.choiceId).length;}
export default function CampusLocationWritingWorkshop(){
 const [draft,setDraft]=useState('');const [saved,setSaved]=useState('');const [answers,setAnswers]=useState<Record<string,string>>({});const [submitted,setSubmitted]=useState(false);const [notice,setNotice]=useState('');
 function save(){try{localStorage.setItem(draftKey,draft);setSaved('Draft saved in this browser only.');}catch{setSaved('Browser storage unavailable. Copy your text before leaving.');}}
 function load(){try{const v=localStorage.getItem(draftKey);if(v===null){setSaved('No saved draft in this browser.');return;}setDraft(v);setSaved('Saved draft loaded.');}catch{setSaved('Browser storage unavailable.');}}
 function clear(){try{localStorage.removeItem(draftKey);setDraft('');setSaved('Local draft cleared.');}catch{setSaved('Could not clear browser storage.');}}
 async function check(){if(Object.keys(answers).length!==bank.items.length){setNotice('Answer all eight questions before checking.');return;}setSubmitted(true);setNotice('Recognition answers checked. Free writing is self-reviewed, not graded.');try{await recordAttempt('n5-m02-c02-l07-v1','n5',scoreCampusLocationRecognition(answers),bank.items.length);}catch{setNotice('Answers checked, but browser progress storage was unavailable.');}}
 return <section className="foundation-practice" aria-label="Campus location writing workshop">
 <h2>Your campus writing workshop</h2><label htmlFor="campus-location-draft"><strong>Write 2–5 connected Japanese sentences about campus locations</strong></label>
 <textarea id="campus-location-draft" lang="ja" value={draft} onChange={e=>setDraft(e.target.value)} rows={6} style={{display:'block',width:'100%',maxWidth:'100%',boxSizing:'border-box',marginBlock:'.75rem',padding:'.8rem',color:'inherit',background:'transparent',border:'1px solid currentColor',borderRadius:'.5rem'}} placeholder="図書館は どこですか。…" />
 <div style={{display:'flex',flexWrap:'wrap',gap:'.6rem'}}><button type="button" onClick={save}>Save draft locally</button><button type="button" onClick={load}>Load saved draft</button><button type="button" onClick={clear}>Clear local draft</button></div>
 <p role="status" aria-live="polite">{saved}</p>
 <details><summary>Compare with a model and self-review</summary><p lang="ja">図書館は どこですか。図書館は 二階です。受付は ここです。本は 図書館に あります。</p><p>Check: 2–5 connected sentences, location perspective, に with existence verbs, appropriate polite endings. Your free writing is not automatically graded.</p></details>
 <h2>Written-form recognition check</h2><p>Answer eight questions about the patterns taught above.</p>
 {bank.items.map((q,i)=><fieldset key={q.id} style={{minWidth:0,padding:'1rem',marginBlock:'1rem',border:'1px solid var(--border, #888)',borderRadius:'.75rem'}}><legend><strong>{i+1}. {q.prompt}</strong></legend>
 {q.choices.map(c=><label key={c.id} style={{display:'flex',alignItems:'center',gap:'.7rem',minHeight:44,padding:'.4rem',overflowWrap:'anywhere'}}><input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} disabled={submitted} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span>{c.text}</span></label>)}
 {submitted&&<p role="status"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct.':'Review:'}</strong> {q.explanation} {q.choices.find(c=>c.id===answers[q.id])?.rationale}</p>}</fieldset>)}
 <p aria-live="polite">{notice}</p>
 {submitted?<><p role="status">Written-form recognition: {scoreCampusLocationRecognition(answers)} of {bank.items.length} correct.</p><button type="button" onClick={()=>{setAnswers({});setSubmitted(false);setNotice('Ready to retry.');}}>Retry recognition questions</button></>:<button type="button" onClick={check}>Check recognition answers</button>}
 </section>;
}
