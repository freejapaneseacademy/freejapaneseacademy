import { useState } from 'react';
import bank from '../../content/exercises/n5-m04-c02-l05-v1.json';
import { recordAttempt } from '../../lib/progress';

export const priceReadingItems = bank.items;
export function scorePriceReading(answers: Record<string,string>) {
  return priceReadingItems.filter(q => answers[q.id] === q.answerKey.choiceId).length;
}
export default function PriceLabelReading() {
  const [answers,setAnswers] = useState<Record<string,string>>({});
  const [submitted,setSubmitted] = useState(false);
  const [saving,setSaving] = useState(false);
  const [error,setError] = useState('');
  const [draft,setDraft] = useState('');
  const [model,setModel] = useState(false);
  const count = priceReadingItems.filter(q => Boolean(answers[q.id])).length;
  const score = scorePriceReading(answers);
  async function submit() {
    if (submitted || saving || count !== priceReadingItems.length) return;
    setSaving(true); setError('');
    try {
      await recordAttempt('n5-m04-c02-l05-v1','n5',score,priceReadingItems.length);
      setSubmitted(true);
    } catch(e) { setError(e instanceof Error ? e.message : 'Browser storage unavailable'); }
    finally { setSaving(false); }
  }
  return <section className="foundation-practice" aria-labelledby="price-reading-title">
    <h2 id="price-reading-title">Read the four shop signs</h2>
    <p>Choose one answer for each question. Check the Japanese signs above for evidence before you submit.</p>
    <p aria-live="polite">{count} of {priceReadingItems.length} answered</p>
    <div className="foundation-progress" role="progressbar" aria-label="Questions answered" aria-valuemin={0} aria-valuemax={priceReadingItems.length} aria-valuenow={count}><span style={{width:`${count*100/priceReadingItems.length}%`}}/></div>
    {priceReadingItems.map((q,i)=><div className="foundation-question" data-question-id={q.id} key={q.id}>
      <fieldset disabled={submitted || saving}>
        <legend><span className="foundation-question__number">{i+1}</span> {q.prompt}</legend>
        <div className="foundation-options">{q.choices.map(c=><label key={c.id} className={'foundation-option'+(answers[q.id]===c.id?' foundation-option--selected':'')}>
          <input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span>{c.text}</span>
        </label>)}</div>
      </fieldset>
      {submitted && <div className="foundation-feedback" role="note"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct':'Review the sign'}</strong><p>{q.explanation}</p>{answers[q.id]!==q.answerKey.choiceId && <p>{q.choices.find(c=>c.id===answers[q.id])?.rationale}</p>}</div>}
    </div>)}
    {error && <p role="alert">{error}. Your answers remain selected; you can retry saving.</p>}
    {!submitted ? <button className="btn btn-primary" type="button" disabled={saving||count!==priceReadingItems.length} onClick={submit}>{saving?'Saving…':'Check answers and save attempt'}</button>
    : <div className="foundation-result" role="status" aria-live="polite"><h3>{score} / {priceReadingItems.length} correct</h3><p>Your quiz attempt was saved locally in this browser.</p><button className="btn btn-outline" type="button" onClick={()=>{setAnswers({});setSubmitted(false);setError('')}}>Try again</button></div>}
    <div className="foundation-teachback"><h3>Optional shopping request</h3>
      <label htmlFor="price-reading-draft">Write two short Japanese sentences about items from the signs.</label>
      <textarea id="price-reading-draft" rows={4} value={draft} onChange={e=>setDraft(e.target.value)} placeholder="これは いくらですか。青いノートを一冊ください。"/>
      <button type="button" className="btn btn-outline" aria-expanded={model} onClick={()=>setModel(v=>!v)}>{model?'Hide model':'Compare with model'}</button>
      {model && <div className="foundation-feedback"><p>これは いくらですか。青いノートを一冊ください。</p><p>Self-check: Did you ask a clear price question and request an item with を and a suitable counter? Does your request match a sign? Other accurate answers are possible. Writing is not automatically scored.</p></div>}
    </div>
    <p className="foundation-storage-note">Quiz attempts are stored locally in IndexedDB. The optional writing draft stays in page memory and is not uploaded or saved after reload.</p>
  </section>;
}
