import { useState } from 'react';
import bank from '../../content/exercises/n5-m01-c02-l05-v1.json';
import { recordAttempt } from '../../lib/progress';
export const readingItems = bank.items;
export function scoreClassroomCards(answers: Record<string,string>) {
  return readingItems.filter(q=>answers[q.id]===q.answerKey.choiceId).length;
}
export default function ClassroomQuestionCards() {
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false);
 const [saving,setSaving]=useState(false);
 const [error,setError]=useState('');
 const [draft,setDraft]=useState('');
 const [showModel,setShowModel]=useState(false);
 const count=readingItems.filter(q=>Boolean(answers[q.id])).length;
 const score=scoreClassroomCards(answers);
 const submit=async()=>{if(saving||submitted||count!==readingItems.length)return;setSaving(true);setError('');
 try{await recordAttempt('n5-m01-c02-l05-v1','n5',score,readingItems.length);setSubmitted(true)}
 catch(e){setError(e instanceof Error?e.message:'Storage unavailable')}
 finally{setSaving(false)}};
 return <section className="foundation-practice" aria-labelledby="cards-practice-title">
  <h2 id="cards-practice-title">Find the exact evidence</h2>
  <p>Refer to Cards A–D above. Select one answer for each question. Feedback is revealed after submitting.</p>
  <p aria-live="polite">{count} of {readingItems.length} answered</p>
  <div className="foundation-progress" role="progressbar" aria-label="Questions answered" aria-valuemin={0} aria-valuemax={readingItems.length} aria-valuenow={count}><span style={{width:`${count*100/readingItems.length}%`}}/></div>
  {readingItems.map((q,i)=><div key={q.id} className="foundation-question" data-question-id={q.id}>
    <fieldset disabled={submitted||saving}><legend><span className="foundation-question__number">{i+1}</span> {q.prompt}</legend>
    <div className="foundation-options">{q.choices.map(c=><label className={'foundation-option'+(answers[q.id]===c.id?' foundation-option--selected':'')} key={c.id}><input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span>{c.text}</span></label>)}</div></fieldset>
    {submitted&&<div className="foundation-feedback" role="note"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct':'Review'}</strong><p>{q.explanation}</p>{answers[q.id]!==q.answerKey.choiceId&&<p>{q.choices.find(c=>c.id===answers[q.id])?.rationale}</p>}</div>}
  </div>)}
  {error&&<p role="alert">{error}. Answers remain selected; retry saving.</p>}
  {!submitted?<button type="button" className="btn btn-primary" disabled={saving||count!==readingItems.length} onClick={submit}>{saving?'Saving…':'Check answers and save attempt'}</button>:<div role="status" aria-live="polite" className="foundation-result"><h3>{score} / {readingItems.length} correct</h3><p>Formative score stored on this device. No external grade is issued.</p><button type="button" className="btn btn-outline" onClick={()=>{setAnswers({});setSubmitted(false);setError('')}}>Try again</button></div>}
  <div className="foundation-teachback"><h3>Optional self-reviewed writing</h3><label htmlFor="cards-draft">Write one だれ question and one どこ question, with answers.</label><textarea id="cards-draft" rows={4} value={draft} onChange={e=>setDraft(e.target.value)} placeholder="あの人はだれですか。…"/><button className="btn btn-outline" type="button" aria-expanded={showModel} onClick={()=>setShowModel(v=>!v)}>{showModel?'Hide model':'Compare with model'}</button>{showModel&&<div className="foundation-feedback"><p>あの人はだれですか。さとうさんです。</p><p>たなか先生はどこですか。きょうしつにいます。</p><p>Checklist: Does だれ ask about a person? Does どこ ask about a location? Does each answer fit its question? Alternative natural answers are possible.</p></div>}</div>
  <p className="foundation-storage-note">Only the aggregate quiz attempt is stored in IndexedDB. Your writing draft is kept in page memory and is not automatically graded, uploaded or saved.</p>
 </section>
}