import { useState } from 'react';
import bank from '../../content/exercises/n5-m03-c02-l07-v1.json';
import { recordAttempt } from '../../lib/progress';
const draftKey = 'n5-m03-c02-l07-draft-v1';
export function gradeRoutineWriting(answers: Record<string,string>) {
 return bank.items.reduce((n,q)=>n+(answers[q.id]===q.answerKey.choiceId?1:0),0);
}
export default function RoutineWritingWorkshop(){
 const [draft,setDraft]=useState('');
 const [message,setMessage]=useState('');
 const [showModel,setShowModel]=useState(false);
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [score,setScore]=useState<number|null>(null);
 const [storageError,setStorageError]=useState('');
 const save=()=>{try{localStorage.setItem(draftKey,draft);setMessage('Draft saved on this device.');}catch{setMessage('Local storage unavailable; keep a copy of your text.');}};
 const load=()=>{try{setDraft(localStorage.getItem(draftKey)||'');setMessage('Local draft loaded.');}catch{setMessage('Local storage unavailable.');}};
 const clear=()=>{setDraft('');try{localStorage.removeItem(draftKey);}catch{}setMessage('Draft cleared from this editor and local storage where available.');};
 const check=async()=>{
  const total=gradeRoutineWriting(answers);setScore(total);
  try{await recordAttempt('n5-m03-c02-l07-recognition-v1','n5',total,bank.items.length);setStorageError('');}
  catch{setStorageError('Progress storage unavailable. Your result is still shown here.');}
 };
 return <section aria-labelledby="routine-writing-title" className="foundation-practice">
 <h2 id="routine-writing-title">Write, compare and check</h2>
 <label htmlFor="routine-draft"><strong>Your fictional routine (2–5 sentences)</strong></label>
 <textarea id="routine-draft" lang="ja" rows={6} value={draft} onChange={e=>setDraft(e.target.value)} style={{display:'block',width:'100%',maxWidth:'100%',minHeight:150,marginBlock:'0.75rem',padding:'0.75rem',color:'inherit',background:'transparent',border:'1px solid currentColor',borderRadius:8}} />
 <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap'}}>
 <button className="btn btn-primary" type="button" onClick={save}>Save draft locally</button>
 <button className="btn btn-outline" type="button" onClick={load}>Load saved draft</button>
 <button className="btn btn-outline" type="button" onClick={clear}>Clear draft</button>
 <button className="btn btn-outline" type="button" onClick={()=>setShowModel(v=>!v)} aria-expanded={showModel}>{showModel?'Hide comparison model':'Show comparison model'}</button>
 </div><p role="status" aria-live="polite">{message}</p>
 {showModel&&<div><h3>Comparison model (not a writing grade)</h3><p lang="ja">毎朝七時に起きます。八時にパンを食べます。九時に学校へ行きます。夜はテレビを見ません。</p><p>Check your time + に, object + を, ます/ません endings and coherent sequence. Different natural sentences are welcome.</p></div>}
 <h3>Four-point self-review (no automatic grade)</h3>
 <ol><li>2–5 connected sentences about a usual day</li><li>Clock time + に and object + を</li><li>Polite ます and negative ません</li><li>Meaning clear and internally consistent</li></ol>
 <h3>Recognition practice — {bank.items.length} questions</h3>
 {bank.items.map((q,i)=><fieldset key={q.id} data-question-id={q.id} style={{minWidth:0,marginBlock:'1rem',padding:'1rem',border:'1px solid currentColor',borderRadius:8}}>
 <legend><strong>{i+1}. {q.prompt}</strong></legend>
 {q.choices.map(c=><label key={c.id} style={{display:'flex',alignItems:'center',gap:8,minHeight:44,overflowWrap:'anywhere'}}><input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} disabled={score!==null} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span>{c.text}</span></label>)}
 {score!==null&&<p role="status">{answers[q.id]===q.answerKey.choiceId?'Correct. ':'Review: '}{q.choices.find(c=>c.id===answers[q.id])?.rationale||'No answer selected. '}{answers[q.id]!==q.answerKey.choiceId&&' '+q.explanation}</p>}
 </fieldset>)}
 <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
 <button className="btn btn-primary" type="button" disabled={score!==null||Object.keys(answers).length!==bank.items.length} onClick={check}>Check all 8 answers</button>
 <button className="btn btn-outline" type="button" onClick={()=>{setAnswers({});setScore(null);setStorageError('');}}>Retry questions</button>
 </div>
 {score!==null&&<p role="status" aria-live="polite">Written recognition score: {score} / {bank.items.length}. This is not a grade for your free writing.</p>}
 {storageError&&<p role="alert">{storageError}</p>}
 </section>;
}
