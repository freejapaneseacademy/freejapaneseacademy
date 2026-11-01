import { useState } from 'react';
import { recordAttempt } from '../../lib/progress';
import { firstLessonId, firstLessonQuizId, scoreScriptQuestions, scriptQuestions } from '../../lib/foundationsPractice';

export default function FoundationsPractice() {
  const [answers, setAnswers] = useState<Record<string,string>>({});
  const [submitted,setSubmitted] = useState(false);
  const [saving,setSaving] = useState(false);
  const [error,setError] = useState('');
  const [explanation,setExplanation] = useState('');
  const [showModel,setShowModel] = useState(false);
  const score=scoreScriptQuestions(scriptQuestions,answers);
  const answered=scriptQuestions.filter(q=>!!answers[q.id]).length;
  const submit=async()=>{
    if (submitted||saving||answered!==scriptQuestions.length) return;
    setSaving(true);setError('');
    try {
      await recordAttempt(firstLessonQuizId, 'l0', score, scriptQuestions.length);
      setSubmitted(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save quiz results.');
    } finally {setSaving(false);}
  };
  return <section className="foundation-practice" aria-labelledby="foundation-check-title">
    <div className="foundation-practice__header">
      <span className="eyebrow">INTERACTIVE LEARNING CHECK</span>
      <h2 id="foundation-check-title">Can you recognize the four systems?</h2>
      <p>Choose an answer for each question. You will see explanations and your score after submitting. This is original academy practice, not an official JLPT assessment.</p>
      <div className="foundation-progress-label" aria-live="polite">{answered} of {scriptQuestions.length} answered</div>
      <div className="foundation-progress" role="progressbar" aria-label="Questions answered" aria-valuemin={0} aria-valuemax={scriptQuestions.length} aria-valuenow={answered}><span style={{width:`${100*answered/scriptQuestions.length}%`}} /></div>
    </div>
    {scriptQuestions.map((question,index)=><fieldset className="foundation-question" key={question.id} disabled={submitted||saving}>
      <legend><span className="foundation-question__number">{String(index+1).padStart(2,'0')}</span>{question.prompt}</legend>
      {question.example&&<div className="foundation-prompt-jp" lang={/^[A-Za-z ]+$/.test(question.example)?'en':'ja'}>{question.example}</div>}
      <div className="foundation-options">{question.choices.map(option=>{
        const selected=answers[question.id]===option.id;
        return <label key={option.id} className={`foundation-option ${selected?'foundation-option--selected':''}`}>
          <input type="radio" name={question.id} value={option.id} checked={selected} onChange={()=>setAnswers(prev=>({...prev,[question.id]:option.id}))}/>
          <span>{option.text}</span>
        </label>
      })}</div>
      {submitted&&<div className="foundation-feedback" role="note">
        <strong>{answers[question.id]===question.answerKey.choiceId?'✓ Correct':'Review this question'}</strong>
        <p>{question.explanation}</p>
        {answers[question.id]!==question.answerKey.choiceId&&<p className="foundation-feedback__why">Why your choice doesn't fit: {question.choices.find(c=>c.id===answers[question.id])?.rationale}</p>}
      </div>}
    </fieldset>)}
    {error&&<p role="alert" className="inline-error">{error} Your answers are still here; please try again.</p>}
    {!submitted?<div className="foundation-practice__actions">
      <span className="muted">All questions must be answered before scoring.</span>
      <button type="button" className="btn btn-primary" onClick={submit} disabled={answered!==scriptQuestions.length||saving}>{saving?'Saving…':'Check answers & save score'}</button>
    </div>:<div className="foundation-result" role="status" aria-live="polite">
      <span className="eyebrow">PRACTICE RESULT</span>
      <h3>{score} / {scriptQuestions.length} correct</h3>
      <p>{score===scriptQuestions.length?'Great work recognizing the writing systems.':'Review the explanations above and try again when ready.'} Your attempt was saved on this browser.</p>
      <button className="btn btn-outline" type="button" onClick={()=>{setAnswers({});setSubmitted(false);setError('');}}>Practice again</button>
    </div>}
    <div className="foundation-teachback">
      <h3>Explain it in your own words</h3>
      <p>Imagine a friend asks, “Why do Japanese words look so different on a sign?” Write a short explanation that mentions hiragana, katakana, kanji, and romaji. This is a self-check, not an automatically graded writing test.</p>
      <label htmlFor="script-explanation">Your explanation (optional)</label>
      <textarea id="script-explanation" rows={4} value={explanation} onChange={e=>setExplanation(e.target.value)} placeholder="Hiragana is used for…" />
      <button type="button" className="btn btn-outline" aria-expanded={showModel} onClick={()=>setShowModel(x=>!x)}>{showModel?'Hide example explanation':'Compare with an example explanation'}</button>
      {showModel&&<div className="foundation-feedback">
        <strong>Example of a clear explanation</strong>
        <p>Japanese commonly uses three writing systems. Hiragana is a sound-based script used for many native words and grammar parts. Katakana is also sound-based and is often used for loanwords. Kanji are characters used in many words and can have different readings. Romaji represents Japanese using Latin letters, but most Japanese text is not written only in romaji.</p>
        <ul><li>Did you distinguish the two kana scripts?</li><li>Did you explain that kanji can have multiple readings?</li><li>Did you say that romaji uses Latin letters?</li><li>Did you mention that Japanese scripts often appear together?</li></ul>
      </div>}
    </div>
    <p className="foundation-storage-note">Practice attempts are saved locally in your browser. There is no account sync. The optional explanation is not uploaded or saved; copy it elsewhere if you want to keep it.</p>
  </section>;
}
