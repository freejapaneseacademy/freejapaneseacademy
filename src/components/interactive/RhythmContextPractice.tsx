import { useState } from 'react';
import { recordAttempt } from '../../lib/progress';
import { rhythmContextQuestions as questions, rhythmContextQuizId, scoreRhythmContext } from '../../lib/rhythmContextPractice';

export default function RhythmContextPractice() {
  const [answers,setAnswers]=useState<Record<string,string>>({});
  const [submitted,setSubmitted]=useState(false);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  const [draft,setDraft]=useState('');
  const [model,setModel]=useState(false);
  const answered=questions.filter(q=>Boolean(answers[q.id])).length;
  const score=scoreRhythmContext(answers);
  async function submit(){
    if(submitted||busy||answered!==questions.length)return;
    setBusy(true);setError('');
    try { await recordAttempt(rhythmContextQuizId,'l0',score,questions.length);setSubmitted(true); }
    catch(e){setError(e instanceof Error?e.message:'Browser storage unavailable');}
    finally{setBusy(false);}
  }
  return <section className="foundation-practice" aria-labelledby="rhythm-context-heading">
    <div className="foundation-practice__header">
      <span className="eyebrow">WRITTEN CONTEXT CHECK</span>
      <h2 id="rhythm-context-heading">Can you explain the card mix-up?</h2>
      <p>Answer all twelve questions. This is a written recognition assessment, not a listening or pronunciation test.</p>
      <p aria-live="polite">{answered} of {questions.length} answered</p>
      <div className="foundation-progress" role="progressbar" aria-label="Questions answered" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={answered}><span style={{width:(100*answered/questions.length)+'%'}}/></div>
    </div>
    {questions.map((q,i)=><fieldset className="foundation-question" key={q.id} disabled={submitted||busy}>
      <legend><span className="foundation-question__number">{String(i+1).padStart(2,'0')}</span>{q.prompt}</legend>
      <div className="foundation-options">{q.choices.map(c=><label key={c.id} className={'foundation-option '+(answers[q.id]===c.id?'foundation-option--selected':'')}>
        <input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/>
        <span>{c.text}</span>
      </label>)}</div>
      {submitted&&<div className="foundation-feedback" role="note"><strong>{answers[q.id]===q.answerKey.choiceId?'✓ Correct':'Review this answer'}</strong>
        <p>{q.explanation}</p>{answers[q.id]!==q.answerKey.choiceId&&<p>Your choice: {q.choices.find(c=>c.id===answers[q.id])?.rationale}</p>}</div>}
    </fieldset>)}
    {error&&<p role="alert" className="inline-error">{error}. Your answers are retained; retry saving.</p>}
    {!submitted?<button className="btn btn-primary" type="button" disabled={busy||answered!==questions.length} onClick={submit}>{busy?'Saving…':'Check answers and save score'}</button>:
      <div className="foundation-result" role="status"><h3>{score} / {questions.length} correct</h3><p>Saved locally in your existing learning-progress database. No sound perception was graded.</p><button type="button" className="btn btn-outline" onClick={()=>{setAnswers({});setSubmitted(false);}}>Retry written check</button></div>}
    <div className="foundation-teachback"><h3>Optional written explanation</h3>
      <label htmlFor="rhythm-teachback">Why would さっか and さか point to different picture cards?</label>
      <textarea id="rhythm-teachback" rows={3} value={draft} onChange={e=>setDraft(e.target.value)} placeholder="The small っ changes…"/>
      <button type="button" className="btn btn-outline" aria-expanded={model} onClick={()=>setModel(v=>!v)}>{model?'Hide model':'Compare with model answer'}</button>
      {model&&<p className="foundation-feedback">さっか means writer and has a small っ before か; さか means slope. The extra mora changes the word. This is written evidence, not proof of hearing the contrast.</p>}
    </div><p className="foundation-storage-note">Only quiz attempts are saved locally. Your optional writing is not uploaded, scored or saved.</p>
  </section>;
}
