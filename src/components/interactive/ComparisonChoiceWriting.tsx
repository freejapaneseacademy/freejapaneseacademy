import { useState } from 'react';
import bank from '../../content/exercises/n5-m07-c03-l07-v1.json';
import { recordAttempt } from '../../lib/progress';
type Answers=Record<string,string>;
const draftKey='fja-n5-m07-c03-l07-draft-v1';
export function gradeComparisonWriting(answers:Answers){return bank.items.filter(q=>answers[q.id]===q.answerKey.choiceId).length;}
export default function ComparisonChoiceWriting(){
 const [draft,setDraft]=useState('');const [draftNotice,setDraftNotice]=useState('');
 const [answers,setAnswers]=useState<Answers>({});const [submitted,setSubmitted]=useState(false);const [storage,setStorage]=useState('');
 const [showModel,setShowModel]=useState(false);const [checks,setChecks]=useState<boolean[]>([false,false,false,false,false]);
 const score=gradeComparisonWriting(answers);
 const rubric=['I wrote 2–5 connected polite sentences.','My より reference and のほうが subject are in the right order.','My price/size facts match the fictional table.','I used 一番 only with a clear group of three, or made a second accurate comparison.','I clearly stated my own choice with を選びます.'];
 function save(){try{localStorage.setItem(draftKey,draft);setDraftNotice('Draft saved on this device.');}catch{setDraftNotice('Browser storage unavailable. Copy your draft to keep it.');}}
 function load(){try{setDraft(localStorage.getItem(draftKey)||'');setDraftNotice('Saved draft loaded, if available.');}catch{setDraftNotice('Browser storage unavailable.');}}
 function clear(){setDraft('');try{localStorage.removeItem(draftKey);}catch{}setDraftNotice('Editor cleared and local saved draft removed, if available.');}
 async function submit(){setSubmitted(true);try{await recordAttempt('quiz-n5-m07-c03-l07-v1','n5',score,bank.items.length);setStorage('Written attempt saved in this browser.');}catch{setStorage('Storage unavailable; feedback remains visible.');}}
 return <div>
 <section className="foundation-practice" aria-labelledby="comparison-editor"><h2 id="comparison-editor">Write your recommendation</h2><p>Your draft stays in this browser unless you choose to copy it. No automatic grade or transmission.</p>
 <label htmlFor="comparison-draft">Your 2–5 Japanese sentences</label><textarea id="comparison-draft" lang="ja" rows={7} value={draft} onChange={e=>setDraft(e.target.value)} style={{display:'block',width:'100%',maxWidth:'100%',boxSizing:'border-box',fontSize:'1rem',padding:'0.75rem',border:'1px solid currentColor',borderRadius:'0.5rem',background:'transparent',color:'inherit'}} placeholder="料理のクラスより、絵のクラスのほうが安いです。…" />
 <div style={{display:'flex',flexWrap:'wrap',gap:'0.6rem',marginBlock:'1rem'}}><button className="btn btn-primary" type="button" onClick={save}>Save draft locally</button><button className="btn btn-outline" type="button" onClick={load}>Load saved draft</button><button className="btn btn-outline" type="button" onClick={clear}>Clear draft</button><button className="btn btn-outline" type="button" onClick={()=>setShowModel(v=>!v)} aria-expanded={showModel}> {showModel?'Hide':'Show'} model</button></div>
 <p role="status">{draftNotice}</p>{showModel&&<div><h3>Compare with a model (not a grade)</h3><p lang="ja">絵のクラスより、料理のクラスのほうが高いです。三つのクラスの中で、絵のクラスが一番安いです。でも、わたしは料理のクラスが好きです。わたしは料理のクラスを選びます。</p><p>Cooking is more expensive than art. Art is cheapest. But I like cooking, so I choose cooking.</p></div>}
 <fieldset style={{minWidth:0}}><legend><strong>Five self-review checks (not automatic scoring)</strong></legend>{rubric.map((s,i)=><label key={s} style={{display:'flex',gap:'0.75rem',alignItems:'center',minHeight:44}}><input type="checkbox" checked={checks[i]} onChange={e=>setChecks(a=>a.map((v,j)=>j===i?e.target.checked:v))}/>{s}</label>)}</fieldset>
 </section><section className="foundation-practice" aria-labelledby="comparison-written-check"><h2 id="comparison-written-check">Written recognition check</h2><p>Choose one answer per question. Use Tab and Space or arrow keys. Unanswered questions count as incorrect.</p>
 {bank.items.map((q,i)=><fieldset key={q.id} data-question-id={q.id} style={{minWidth:0,marginBlock:'1rem',padding:'1rem',border:'1px solid currentColor',borderRadius:'0.5rem'}}><legend><strong>{i+1}. {q.prompt}</strong></legend><div style={{display:'grid',gap:'0.5rem'}}>{q.choices.map(c=><label key={c.id} style={{display:'flex',gap:'0.75rem',alignItems:'center',minHeight:44,overflowWrap:'anywhere'}}><input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} disabled={submitted} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span>{c.text}</span></label>)}</div>{submitted&&<div role="status"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct.':'Review this item.'}</strong> {q.explanation}<p>{q.choices.find(c=>c.id===answers[q.id])?.rationale||'No answer selected.'}</p></div>}</fieldset>)}
 {!submitted?<button type="button" className="btn btn-primary" onClick={submit}>Check 8 answers</button>:<><p role="status">Written practice score: {score} / 8. {storage}</p><button type="button" className="btn btn-outline" onClick={()=>{setAnswers({});setSubmitted(false);setStorage('');}}>Retry questions</button></>}</section></div>;
}
