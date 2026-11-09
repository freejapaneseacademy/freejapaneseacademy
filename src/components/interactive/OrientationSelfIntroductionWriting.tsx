import { useState } from 'react';
import { recordAttempt } from '../../lib/progress';
import bank from '../../content/exercises/n5-m01-c04-l07-v1.json';
export const questions = bank.items;
export const scoreAnswers = (answers: Record<string,string>) => questions.filter(q => answers[q.id] === q.answerKey.choiceId).length;
const draftKey = 'fja:n5-m01-c04-l07:draft:v1';
export default function OrientationSelfIntroductionWriting() {
 const [answers,setAnswers] = useState<Record<string,string>>({});
 const [submitted,setSubmitted] = useState(false);
 const [saving,setSaving] = useState(false);
 const [error,setError] = useState('');
 const [draft,setDraft] = useState('');
 const [message,setMessage] = useState('');
 const [model,setModel] = useState(false);
 const [checks,setChecks] = useState([false,false,false,false]);
 const submit = async () => {
  if(saving || submitted || !questions.every(q=>answers[q.id])) return;
  setSaving(true);setError('');
  try { await recordAttempt('n5-m01-c04-l07-writing-v1','n5',scoreAnswers(answers),questions.length);setSubmitted(true); }
  catch {setError('Could not save this attempt. Your answers are retained; retry when storage is available.');}
  finally {setSaving(false);}
 };
 const save = () => {try{localStorage.setItem(draftKey,draft);setMessage('Draft saved on this device only.');}catch{setMessage('Storage unavailable. Copy your writing before leaving.');}};
 const load = () => {try{const value=localStorage.getItem(draftKey);setDraft(value??'');setMessage(value===null?'No saved draft on this device.':'Saved draft loaded.');}catch{setMessage('Storage unavailable.');}};
 const clear = () => {if(!window.confirm('Clear your draft and saved copy?'))return;setDraft('');setChecks([false,false,false,false]);setModel(false);try{localStorage.removeItem(draftKey);setMessage('Draft and saved copy cleared.');}catch{setMessage('Editor cleared, but saved copy could not be cleared.');}};
 return <section className="foundation-practice" aria-labelledby="orientation-writing-title">
 <h2 id="orientation-writing-title">Orientation writing workshop</h2>
 <p>First check eight written facts. Then compose and self-review a fictional introduction. Recognition is scored; open writing is not graded.</p>
 <p aria-live="polite">{Object.keys(answers).length} of {questions.length} questions answered</p>
 {questions.map((q,i)=><fieldset key={q.id} className="foundation-question" disabled={submitted||saving}>
 <legend>{i+1}. {q.prompt}</legend>
 {q.choices.map(c=><label key={c.id} style={{display:'block',padding:'0.7rem 0',minHeight:44}}><input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/> <span lang="ja">{c.text}</span></label>)}
 {submitted&&<div className="foundation-feedback" role="note"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct':'Review this answer'}</strong><p>{q.explanation}</p><p>{q.choices.find(c=>c.id===answers[q.id])?.rationale}</p></div>}
 </fieldset>)}
 {error&&<p role="alert">{error}</p>}
 {!submitted?<button className="btn btn-primary" type="button" disabled={saving||!questions.every(q=>answers[q.id])} onClick={submit}>{saving?'Saving…':'Check answers and save attempt'}</button>:<div className="foundation-result" role="status"><p>{scoreAnswers(answers)} / {questions.length} correct. Browser-local recognition score, not a composition grade.</p><button type="button" className="btn btn-outline" onClick={()=>{setAnswers({});setSubmitted(false);setError('');}}>Retry questions</button></div>}
 <div className="writing-stage"><h3>Write your fictional introduction</h3><p>Write two to five connected Japanese sentences. Do not enter your real personal information.</p>
 <label htmlFor="orientation-writing-draft">Your Japanese introduction</label>
 <textarea id="orientation-writing-draft" lang="ja" rows={7} maxLength={1200} value={draft} onChange={e=>{setDraft(e.target.value);setMessage('');}} style={{width:'100%',maxWidth:'100%'}}/>
 <div className="foundation-practice__actions">
 <button type="button" className="btn btn-outline" onClick={save}>Save on this device</button>
 <button type="button" className="btn btn-outline" onClick={load}>Load saved draft</button>
 <button type="button" className="btn btn-outline" onClick={clear}>Clear draft</button>
 <button type="button" className="btn btn-outline" aria-expanded={model} onClick={()=>setModel(v=>!v)}>{model?'Hide model and rubric':'Compare with model and rubric'}</button>
 </div>
 {message&&<p role="status">{message}</p>}
 {model&&<div className="foundation-feedback" role="region" aria-label="Writing model and rubric"><h4>One possible model, not the only valid answer</h4><p lang="ja">はじめまして。わたしは山本みおです。二十一歳です。奈良出身です。大学生です。</p><p>Nice to meet you. I'm Mio Yamamoto. I'm twenty-one. I'm from Nara. I'm a university student.</p>
 {['The fictional speaker is clear.','Age, origin and work/school facts are consistent.','は, の when used, and です have appropriate roles.','Spelling and punctuation are readable; origin is not confused with residence.'].map((c,i)=><label key={c} style={{display:'block',padding:'0.6rem 0'}}><input type="checkbox" checked={checks[i]} onChange={e=>setChecks(old=>old.map((v,j)=>j===i?e.target.checked:v))}/> {c}</label>)}
 <p>{checks.filter(Boolean).length} of 4 criteria checked by you. Self-review is not teacher evaluation.</p></div>}
 <p className="foundation-storage-note">Drafts are stored only on this device when you select Save; no draft is transmitted. Clearing browser storage may erase them. Recognition attempts and lesson completion are separate browser-local records.</p>
 </div></section>;
}
