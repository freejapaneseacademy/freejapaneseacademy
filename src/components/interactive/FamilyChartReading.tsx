import { useState } from 'react';
import bank from '../../content/exercises/n5-m01-c03-l05-v1.json';
import { recordAttempt } from '../../lib/progress';
export const familyReadingItems = bank.items;
export function scoreFamilyReading(answers: Record<string,string>) { return familyReadingItems.filter(q=>answers[q.id]===q.answerKey.choiceId).length; }
export default function FamilyChartReading() {
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false),[saving,setSaving]=useState(false),[error,setError]=useState('');
 const [draft,setDraft]=useState(''),[model,setModel]=useState(false);
 const count=familyReadingItems.filter(q=>Boolean(answers[q.id])).length,score=scoreFamilyReading(answers);
 const submit=async()=>{if(submitted||saving||count!==familyReadingItems.length)return;setSaving(true);setError('');
 try{await recordAttempt('n5-m01-c03-l05-v1','n5',score,familyReadingItems.length);setSubmitted(true)}
 catch(e){setError(e instanceof Error?e.message:'Storage unavailable')}finally{setSaving(false)}};
 return <section className="foundation-practice" aria-labelledby="family-reading-title">
 <h2 id="family-reading-title">Find family relationships in the text</h2>
 <p>Refer to Charts A and B above. Select the best answer. Explanations appear only after submission.</p>
 <p aria-live="polite">{count} of {familyReadingItems.length} answered</p>
 <div className="foundation-progress" role="progressbar" aria-label="Questions answered" aria-valuemin={0} aria-valuemax={familyReadingItems.length} aria-valuenow={count}><span style={{width:`${count*100/familyReadingItems.length}%`}}/></div>
 {familyReadingItems.map((q,i)=><div className="foundation-question" data-question-id={q.id} key={q.id}>
 <fieldset disabled={submitted||saving}><legend><span className="foundation-question__number">{i+1}</span> {q.prompt}</legend>
 <div className="foundation-options">{q.choices.map(c=><label key={c.id} className={'foundation-option'+(answers[q.id]===c.id?' foundation-option--selected':'')}><input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span>{c.text}</span></label>)}</div></fieldset>
 {submitted&&<div className="foundation-feedback" role="note"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct':'Review'}</strong><p>{q.explanation}</p>{answers[q.id]!==q.answerKey.choiceId&&<p>{q.choices.find(c=>c.id===answers[q.id])?.rationale}</p>}</div>}
 </div>)}
 {error&&<p role="alert">{error}. Your selections remain available; retry saving.</p>}
 {!submitted?<button type="button" className="btn btn-primary" disabled={saving||count!==familyReadingItems.length} onClick={submit}>{saving?'Saving…':'Check answers and save attempt'}</button>:<div className="foundation-result" role="status" aria-live="polite"><h3>{score} / {familyReadingItems.length} correct</h3><p>Formative quiz result stored locally, not a proficiency certification.</p><button className="btn btn-outline" type="button" onClick={()=>{setAnswers({});setSubmitted(false);setError('')}}>Try again</button></div>}
 <div className="foundation-teachback"><h3>Optional writing self-review</h3><label htmlFor="family-reading-draft">Write two short family introductions about fictional people.</label><textarea id="family-reading-draft" rows={4} value={draft} onChange={e=>setDraft(e.target.value)} placeholder="みきは はるの あねです。"/>
 <button type="button" className="btn btn-outline" aria-expanded={model} onClick={()=>setModel(v=>!v)}>{model?'Hide model':'Compare with model'}</button>
 {model&&<div className="foundation-feedback"><p>みきは はるの あねです。こちらは りなの おかあさんです。</p><p>Self-check: Are the names and relationships consistent? Does の connect the right people? Is こちら used to introduce a person politely? Other natural answers are possible.</p></div>}</div>
 <p className="foundation-storage-note">Only the quiz attempt is saved to browser IndexedDB. This writing draft stays in page memory and is not uploaded, graded or saved after reload.</p>
 </section>;
}