import { useState } from 'react';
import bank from '../../content/exercises/n5-m04-c02-l08-v1.json';
import { recordAttempt } from '../../lib/progress';

export const shoppingSpeakingItems = bank.items;
export function scoreShoppingSpeaking(answers: Record<string,string>) {
  return shoppingSpeakingItems.filter(q => answers[q.id] === q.answerKey.choiceId).length;
}
export default function ShoppingSpeakingRehearsal() {
  const [answers,setAnswers] = useState<Record<string,string>>({});
  const [submitted,setSubmitted] = useState(false);
  const [saving,setSaving] = useState(false);
  const [error,setError] = useState('');
  const [draft,setDraft] = useState('');
  const [showModel,setShowModel] = useState(false);
  const [criteria,setCriteria] = useState<Record<string,boolean>>({});
  const count=shoppingSpeakingItems.filter(q=>Boolean(answers[q.id])).length;
  const score=scoreShoppingSpeaking(answers);
  async function submit() {
    if(submitted||saving||count!==shoppingSpeakingItems.length)return;
    setSaving(true);setError('');
    try {await recordAttempt('n5-m04-c02-l08-v1','n5',score,shoppingSpeakingItems.length);setSubmitted(true);}
    catch(e){setError(e instanceof Error?e.message:'Browser storage unavailable');}
    finally{setSaving(false);}
  }
  return <section className="foundation-practice" aria-labelledby="shopping-speaking-title">
    <h2 id="shopping-speaking-title">Prepare your optional shop conversation</h2>
    <p>These questions check written language. They do not score speaking or pronunciation.</p>
    <p aria-live="polite">{count} of {shoppingSpeakingItems.length} answered</p>
    <div className="foundation-progress" role="progressbar" aria-label="Questions answered" aria-valuemin={0} aria-valuemax={shoppingSpeakingItems.length} aria-valuenow={count}><span style={{width:`${count*100/shoppingSpeakingItems.length}%`}}/></div>
    {shoppingSpeakingItems.map((q,i)=><div className="foundation-question" data-question-id={q.id} key={q.id}>
      <fieldset disabled={submitted||saving}><legend><span className="foundation-question__number">{i+1}</span> {q.prompt}</legend>
        <div className="foundation-options">{q.choices.map(c=><label className={'foundation-option'+(answers[q.id]===c.id?' foundation-option--selected':'')} key={c.id}>
          <input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span>{c.text}</span>
        </label>)}</div>
      </fieldset>
      {submitted&&<div className="foundation-feedback" role="note"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct':'Review the form'}</strong><p>{q.explanation}</p><p>{q.choices.find(c=>c.id===answers[q.id])?.rationale}</p></div>}
    </div>)}
    {error&&<p role="alert">{error}. Your choices remain selected so you can retry saving.</p>}
    {!submitted?<button className="btn btn-primary" type="button" disabled={saving||count!==shoppingSpeakingItems.length} onClick={submit}>{saving?'Saving…':'Check answers and save attempt'}</button>:<div className="foundation-result" role="status" aria-live="polite"><h3>{score} / {shoppingSpeakingItems.length} correct</h3><p>Written practice attempt saved in this browser.</p><button className="btn btn-outline" type="button" onClick={()=>{setAnswers({});setSubmitted(false);setError('');}}>Try again</button></div>}
    <div className="foundation-teachback"><h3>Optional conversation planner</h3>
      <label htmlFor="shopping-speaking-draft">Write a short customer–clerk exchange, or use this field as silent rehearsal notes.</label>
      <textarea id="shopping-speaking-draft" rows={5} value={draft} onChange={e=>setDraft(e.target.value)} placeholder="客：これはいくらですか。&#10;店員：一冊150円です。&#10;客：では、青いノートを一冊ください。"/>
      <button className="btn btn-outline" type="button" aria-expanded={showModel} onClick={()=>setShowModel(v=>!v)}>{showModel?'Hide model':'Compare with model'}</button>
      {showModel&&<div className="foundation-feedback"><p>客：赤いノートは、いくらですか。<br/>店員：一冊180円です。<br/>客：では、赤いノートを一冊お願いします。</p><p>Other correct exchanges are possible. Your free response is not automatically graded.</p></div>}
      <fieldset><legend>Optional self-review (not a score)</legend>
        {['The item and quantity are clear','The price question uses いくらですか','The request uses を and a suitable counter','The exchange is polite and understandable'].map((c,i)=><label key={c} style={{display:'block',padding:'0.5rem 0'}}><input type="checkbox" checked={Boolean(criteria[c])} onChange={e=>setCriteria(s=>({...s,[c]:e.target.checked}))}/> {c}</label>)}
      </fieldset>
    </div>
    <p className="foundation-storage-note">Quiz attempts use browser-local IndexedDB. The optional draft and checklist remain only in page memory; no microphone is requested, and nothing is uploaded.</p>
  </section>;
}
