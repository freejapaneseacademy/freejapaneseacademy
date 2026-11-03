import { useEffect, useState } from 'react';
import { recordAttempt } from '../../lib/progress';
import { rhythmSentenceQuestions, rhythmSentenceQuizId, scoreRhythmSentence } from '../../lib/rhythmSentencePractice';

export default function RhythmSentencePractice() {
  const [ready, setReady] = useState(false);
  const [answers, setAnswers] = useState<Record<string,string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => setReady(true), []);
  const answered = rhythmSentenceQuestions.filter(q => !!answers[q.id]).length;
  const score = scoreRhythmSentence(answers);
  async function submit() {
    if (!ready || saving || submitted || answered !== rhythmSentenceQuestions.length) return;
    setSaving(true); setError('');
    try {
      await recordAttempt(rhythmSentenceQuizId, 'l0', score, rhythmSentenceQuestions.length);
      setSubmitted(true);
    } catch(e) {
      setError(e instanceof Error ? e.message : 'Local browser storage is unavailable.');
    } finally { setSaving(false); }
  }
  return <section className="foundation-practice" aria-labelledby="rhythm-sentence-title">
    <div className="foundation-practice__header">
      <span className="eyebrow">CHAPTER 03 · WRITTEN SENTENCE CHECK</span>
      <h2 id="rhythm-sentence-title">Choose the word that fits the meaning</h2>
      <p>Eight original written-context questions on long vowels, small っ, nasal ん and sentence meaning. This exercise does not test listening or pronunciation.</p>
      <p className="foundation-progress-label" aria-live="polite">{answered} of {rhythmSentenceQuestions.length} answered</p>
      <div className="foundation-progress" role="progressbar" aria-label="Written questions answered" aria-valuemin={0} aria-valuemax={rhythmSentenceQuestions.length} aria-valuenow={answered}>
        <span style={{width: (100 * answered / rhythmSentenceQuestions.length) + '%'}} />
      </div>
    </div>
    {rhythmSentenceQuestions.map((q,i)=><fieldset key={q.id} className="foundation-question" data-question-id={q.id} disabled={!ready || saving || submitted}>
      <legend><span className="foundation-question__number">{String(i+1).padStart(2,'0')}</span>{q.prompt}</legend>
      <p className="foundation-prompt-jp" lang="ja">{q.example}</p>
      <div className="foundation-options">{q.choices.map(c=><label key={c.id} className={'foundation-option'+(answers[q.id]===c.id?' foundation-option--selected':'')}>
        <input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(prev=>({...prev,[q.id]:c.id}))} />
        <span>{c.text}</span>
      </label>)}</div>
      {submitted && <div className="foundation-feedback" role="note">
        <strong>{answers[q.id]===q.correct?'Correct':'Review this answer'}</strong>
        <p>{q.explanation}</p>
        {answers[q.id]!==q.correct && <p>Correct answer: <span lang="ja">{q.choices.find(c=>c.id===q.correct)?.text}</span></p>}
      </div>}
    </fieldset>)}
    {error && <p className="inline-error" role="alert">{error} Your selections remain here; try saving again.</p>}
    {!submitted ? <div className="foundation-practice__actions">
      <p>Answer every question before checking your work.</p>
      <button className="btn btn-primary" type="button" disabled={!ready || saving || answered!==rhythmSentenceQuestions.length} onClick={submit}>{saving?'Saving…':'Check answers and save written score'}</button>
    </div> : <div className="foundation-result" role="status" aria-live="polite">
      <h3>{score} / {rhythmSentenceQuestions.length} correct</h3>
      <p>Your written score is saved locally in this browser. It is not evidence of listening or spoken proficiency.</p>
      <button className="btn btn-outline" type="button" onClick={()=>{setAnswers({});setSubmitted(false);setError('');}}>Try again</button>
    </div>}
  </section>;
}
