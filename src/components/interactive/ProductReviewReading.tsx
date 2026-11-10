import {useState} from 'react';
import bank from '../../content/exercises/n5-m04-c03-l05-v1.json';
import {recordAttempt} from '../../lib/progress';
export const reviewItems=bank.items;
export function scoreReviewReading(answers:Record<string,string>){return reviewItems.filter(q=>answers[q.id]===q.answerKey.choiceId).length;}
export default function ProductReviewReading(){
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false);
 const [saving,setSaving]=useState(false);
 const [error,setError]=useState('');
 const [draft,setDraft]=useState('');
 const [model,setModel]=useState(false);
 const count=reviewItems.filter(q=>Boolean(answers[q.id])).length;
 const score=scoreReviewReading(answers);
 async function submit(){if(submitted||saving||count!==reviewItems.length)return;setSaving(true);setError('');
 try{await recordAttempt('n5-m04-c03-l05-v1','n5',score,reviewItems.length);setSubmitted(true);}
 catch(e){setError(e instanceof Error?e.message:'Browser storage unavailable');}
 finally{setSaving(false);}}
 return <section className="foundation-practice" aria-labelledby="review-reading-title">
 <h2 id="review-reading-title">Read and support your answers</h2>
 <p>Choose one answer per question. Find its evidence in the four Japanese reviews above.</p>
 <p aria-live="polite">{count} of {reviewItems.length} answered</p>
 <div className="foundation-progress" role="progressbar" aria-label="Questions answered" aria-valuemin={0} aria-valuemax={reviewItems.length} aria-valuenow={count}><span style={{width:`${count*100/reviewItems.length}%`}}/></div>
 {reviewItems.map((q,i)=><div className="foundation-question" data-question-id={q.id} key={q.id}><fieldset disabled={submitted||saving}>
 <legend><span className="foundation-question__number">{i+1}</span> {q.prompt}</legend>
 <div className="foundation-options">{q.choices.map(c=><label key={c.id} className={'foundation-option'+(answers[q.id]===c.id?' foundation-option--selected':'')}>
 <input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span>{c.text}</span></label>)}</div>
 </fieldset>{submitted&&<div className="foundation-feedback" role="note"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct':'Review the text'}</strong><p>{q.explanation}</p>{answers[q.id]!==q.answerKey.choiceId&&<p>{q.choices.find(c=>c.id===answers[q.id])?.rationale}</p>}</div>}</div>)}
 {error&&<p role="alert">{error}. Your answers remain selected; retry saving.</p>}
 {!submitted?<button type="button" className="btn btn-primary" disabled={saving||count!==reviewItems.length} onClick={submit}>{saving?'Saving…':'Check answers and save attempt'}</button>:
 <div className="foundation-result" role="status" aria-live="polite"><h3>{score} / {reviewItems.length} correct</h3><p>Your attempt was saved locally.</p><button type="button" className="btn btn-outline" onClick={()=>{setAnswers({});setSubmitted(false);setError('');}}>Try again</button></div>}
 <div className="foundation-teachback"><h3>Optional evidence summary</h3><label htmlFor="review-reading-draft">Write two or three Japanese sentences about one review.</label>
 <textarea id="review-reading-draft" rows={4} value={draft} onChange={e=>setDraft(e.target.value)} placeholder="このカレーは からいです。あまくないです。"/>
 <button type="button" className="btn btn-outline" aria-expanded={model} onClick={()=>setModel(v=>!v)}>{model?'Hide model':'Compare with model'}</button>
 {model&&<div className="foundation-feedback"><p>このカレーは からいです。あまくないです。でも、おいしいです。</p><p>Self-check: Is the object correct? Are negatives accurate? Are all claims stated? Other supported summaries are valid. Writing is not auto-scored.</p></div>}</div>
 <p className="foundation-storage-note">Quiz attempts use browser-local IndexedDB. Optional draft text stays in page memory and is not uploaded or retained after reload.</p>
 </section>;
