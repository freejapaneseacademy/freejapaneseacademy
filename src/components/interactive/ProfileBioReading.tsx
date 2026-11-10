import { useState } from 'react';
import bank from '../../content/exercises/n5-m01-c04-l05-v1.json';
import { recordAttempt } from '../../lib/progress';

export const profileReadingItems = bank.items;
export function scoreProfileReading(answers: Record<string,string>) {
  return profileReadingItems.filter(q => answers[q.id] === q.answerKey.choiceId).length;
}
export default function ProfileBioReading() {
  const [answers,setAnswers] = useState<Record<string,string>>({});
  const [submitted,setSubmitted] = useState(false);
  const [saving,setSaving] = useState(false);
  const [error,setError] = useState('');
  const [draft,setDraft] = useState('');
  const [model,setModel] = useState(false);
  const count = profileReadingItems.filter(q => Boolean(answers[q.id])).length;
  const score = scoreProfileReading(answers);
  async function submit() {
    if (submitted || saving || count !== profileReadingItems.length) return;
    setSaving(true); setError('');
    try {
      await recordAttempt('n5-m01-c04-l05-v1','n5',score,profileReadingItems.length);
      setSubmitted(true);
    } catch(e) { setError(e instanceof Error ? e.message : 'Browser storage unavailable'); }
    finally { setSaving(false); }
  }
  return <section className="foundation-practice" aria-labelledby="profile-bio-reading-title">
    <h2 id="profile-bio-reading-title">Find the evidence in the three bios</h2>
    <p>Refer to Profiles A, B and C above. Select one answer per question. Your score is formative practice, not an official JLPT result.</p>
    <p aria-live="polite">{count} of {profileReadingItems.length} answered</p>
    <div className="foundation-progress" role="progressbar" aria-label="Questions answered" aria-valuemin={0} aria-valuemax={profileReadingItems.length} aria-valuenow={count}><span style={{width:`${count*100/profileReadingItems.length}%`}}/></div>
    {profileReadingItems.map((q,i)=><div className="foundation-question" data-question-id={q.id} key={q.id}>
      <fieldset disabled={submitted || saving}>
        <legend><span className="foundation-question__number">{i+1}</span> {q.prompt}</legend>
        <div className="foundation-options">{q.choices.map(c=><label key={c.id} className={'foundation-option'+(answers[q.id]===c.id?' foundation-option--selected':'')}>
          <input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span>{c.text}</span>
        </label>)}</div>
      </fieldset>
      {submitted && <div className="foundation-feedback" role="note"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct':'Review the evidence'}</strong><p>{q.explanation}</p>{answers[q.id]!==q.answerKey.choiceId && <p>{q.choices.find(c=>c.id===answers[q.id])?.rationale}</p>}</div>}
    </div>)}
    {error && <p role="alert">{error}. Your answers are still selected; try saving again.</p>}
    {!submitted ? <button className="btn btn-primary" type="button" disabled={saving||count!==profileReadingItems.length} onClick={submit}>{saving?'Saving…':'Check answers and save attempt'}</button>
    : <div className="foundation-result" role="status" aria-live="polite"><h3>{score} / {profileReadingItems.length} correct</h3><p>Your quiz attempt was saved locally in this browser.</p><button className="btn btn-outline" type="button" onClick={()=>{setAnswers({});setSubmitted(false);setError('')}}>Try again</button></div>}
    <div className="foundation-teachback"><h3>Optional written evidence check</h3>
      <label htmlFor="profile-bio-draft">Write two Japanese sentences about a fictional person from the bios.</label>
      <textarea id="profile-bio-draft" rows={4} value={draft} onChange={e=>setDraft(e.target.value)} placeholder="みおさんは 京都出身です。今は 大阪に 住んでいます。"/>
      <button type="button" className="btn btn-outline" aria-expanded={model} onClick={()=>setModel(v=>!v)}>{model?'Hide model':'Compare with model'}</button>
      {model && <div className="foundation-feedback"><p>みおさんは 京都出身です。今は 大阪に 住んでいます。</p><p>Self-check: Did you use 出身 for hometown and 今は…に住んでいます for current residence? Did both sentences describe the same person? Other accurate answers are possible.</p></div>}
    </div>
    <p className="foundation-storage-note">Quiz attempts are stored locally in IndexedDB. The optional writing draft stays only in page memory and is not uploaded, graded or saved after reload.</p>
  </section>;
}
