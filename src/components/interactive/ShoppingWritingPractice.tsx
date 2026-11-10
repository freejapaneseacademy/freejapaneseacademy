import {useState} from 'react';
import bank from '../../content/exercises/n5-m04-c02-l07-v1.json';
import {recordAttempt} from '../../lib/progress';
export const QUIZ_ID='n5-m04-c02-l07-writing-frames-v1';
export const questions=bank.items;
export function scoreShoppingWriting(answers:Record<string,string>){return questions.reduce((n,q)=>n+(answers[q.id]===q.answerKey.choiceId?1:0),0);}
const MODEL='客：この小さい白いノートはいくらですか。\n店員：300円です。\n客：では、そのノートをお願いします。';
export default function ShoppingWritingPractice(){
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false),[saving,setSaving]=useState(false),[error,setError]=useState('');
 const [draft,setDraft]=useState(''),[showModel,setShowModel]=useState(false);
 const [checks,setChecks]=useState<boolean[]>([false,false,false,false,false]);
 const answered=questions.filter(q=>answers[q.id]).length;
 async function submit(){if(saving||answered!==questions.length)return;setSaving(true);setError('');
 try{await recordAttempt(QUIZ_ID,'n5',scoreShoppingWriting(answers),questions.length);setSubmitted(true);}
 catch(e){setError(e instanceof Error?e.message:'Local progress unavailable');}finally{setSaving(false);}}
 return <section className="foundation-practice" aria-labelledby="shopping-writing-heading">
 <div className="foundation-practice__header"><span className="eyebrow">CONTROLLED WRITING CHECK</span><h2 id="shopping-writing-heading">Choose the correct sentence frame</h2><p>Use Tab, arrow keys and Space. Your free writing below is not automatically graded.</p><p aria-live="polite">{answered} of {questions.length} answered</p><div className="foundation-progress" role="progressbar" aria-label="Questions answered" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={answered}><span style={{width:(answered/questions.length*100)+'%'}}/></div></div>
 {questions.map((q,i)=><fieldset className="foundation-question" key={q.id} disabled={submitted||saving}><legend><span className="foundation-question__number">{String(i+1).padStart(2,'0')}</span>{q.prompt}</legend><div className="foundation-options">{q.choices.map(c=><label key={c.id} className={'foundation-option '+(answers[q.id]===c.id?'foundation-option--selected':'')}><input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span lang="ja">{c.text}</span></label>)}</div>{submitted&&<div className="foundation-feedback" role="note"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct':'Review this answer'}</strong><p>{q.choices.find(c=>c.id===answers[q.id])?.rationale}</p></div>}</fieldset>)}
 {error&&<p role="alert" className="inline-error">{error}. Choices are retained; retry saving.</p>}
 {!submitted?<button type="button" className="btn btn-primary" disabled={saving||answered!==questions.length} onClick={submit}>{saving?'Saving…':'Check answers and save score'}</button>:<div className="foundation-result" role="status"><h3>{scoreShoppingWriting(answers)} / {questions.length} correct</h3><p>Controlled-question attempt saved locally in this browser.</p><button type="button" className="btn btn-outline" onClick={()=>{setAnswers({});setSubmitted(false);setError('');}}>Retry sentence frames</button></div>}
 <div className="foundation-teachback"><h3>Your original shop dialogue</h3><label htmlFor="shopping-writing-draft">Write 2–5 connected Japanese sentences for a fictional customer and clerk.</label><textarea id="shopping-writing-draft" lang="ja" rows={6} value={draft} onChange={e=>setDraft(e.target.value)} placeholder="客：この青いペンはいくらですか。"/>
 <p>Draft remains on this page only. Copy it elsewhere before leaving if you wish to keep it.</p><button type="button" className="btn btn-outline" aria-expanded={showModel} onClick={()=>setShowModel(v=>!v)}>{showModel?'Hide model and rubric':'Show model and self-review rubric'}</button>
 {showModel&&<div className="foundation-feedback"><h4>Model (one possible answer)</h4><p lang="ja" style={{whiteSpace:'pre-wrap'}}>{MODEL}</p><p>Different correct items and wordings are welcome. Use this checklist to review your own work; it is not a proficiency grade.</p>{['I named an item with a color or size.','I asked いくらですか with a clear topic.','My answer matches the fictional price sign.','I requested the item politely with を.','My turns are connected and use readable punctuation.'].map((s,i)=><label key={s} style={{display:'block',padding:'0.45rem 0'}}><input type="checkbox" checked={checks[i]} onChange={e=>setChecks(v=>v.map((x,j)=>j===i?e.target.checked:x))}/> {s}</label>)}<p>{checks.filter(Boolean).length} of 5 self-review criteria checked. Revise your text above if needed.</p></div>}
 <button type="button" className="btn btn-outline" onClick={()=>{setDraft('');setChecks([false,false,false,false,false]);setShowModel(false);}}>Clear my draft</button></div>
 <p className="foundation-storage-note">No writing is uploaded or scored. Only your controlled quiz attempt is stored in this browser via local progress storage.</p>
 </section>;
