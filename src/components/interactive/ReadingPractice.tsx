import { useEffect, useState } from 'react';
import { recordAttempt } from '../../lib/progress';
import { readingRows, readingQuestions, readingQuizId, scoreReadingQuestions, isReadingAnswerCorrect } from '../../lib/readingPractice';

export default function ReadingPractice() {
  const [ready,setReady]=useState(false);
  const [answers,setAnswers]=useState<Record<string,string>>({});
  const [submitted,setSubmitted]=useState(false);
  const [saving,setSaving]=useState(false);
  const [error,setError]=useState('');
  const [draft,setDraft]=useState('');
  const [model,setModel]=useState(false);
  useEffect(()=>setReady(true),[]);
  const answered=readingQuestions.filter(q=>Boolean(answers[q.id])).length;
  const score=scoreReadingQuestions(readingQuestions,answers);
  const submit=async()=>{
    if(!ready||submitted||saving||answered!==readingQuestions.length)return;
    setSaving(true);setError('');
    try {await recordAttempt(readingQuizId,'l0',score,readingQuestions.length);setSubmitted(true);}
    catch(e){setError(e instanceof Error?e.message:'Could not save your reading result.');}
    finally{setSaving(false);}
  };
  return <section className="foundation-practice reading-practice" aria-labelledby="reading-title">
    <span className="eyebrow">EVIDENCE-BASED READING · L05</span>
    <h2 id="reading-title">The teacher's script-identification chart</h2>
    <p>Read across the row before answering. The letters A–I identify the source of each fact. You may refer back to the chart throughout the practice.</p>
    <div className="reading-chart-scroll" role="region" aria-label="Script-identification chart; scroll horizontally on small screens" tabIndex={0}>
      <table className="reading-chart">
        <caption>Original classroom handout: nine written Japanese examples</caption>
        <thead><tr><th scope="col">Row</th><th scope="col">Example</th><th scope="col">Writing</th><th scope="col">Teacher's note</th></tr></thead>
        <tbody>{readingRows.map(r=><tr key={r.id} data-chart-row={r.id}>
          <th scope="row">{r.id}</th>
          <td className="reading-chart__jp" lang={r.id==='G'?'ja-Latn':'ja'}>{r.furigana?<ruby>{r.printed}<rt>{r.furigana}</rt></ruby>:r.printed}</td>
          <td>{r.script}</td><td>{r.note}</td>
        </tr>)}</tbody>
      </table>
    </div>
    <p className="foundation-storage-note">The space in row I is a beginner's reading aid. Romaji is a Japanese reading written with Latin letters, not an English translation. The small kana above kanji in rows D and H are furigana.</p>
    <div className="foundation-practice__header">
      <h2>Find the detail and cite the row</h2>
      <p>Choose one answer per question. Your result and the exact evidence appear only after you submit. This is open-chart practice, not a listening test.</p>
      <div className="foundation-progress-label" aria-live="polite">{answered} of {readingQuestions.length} answered</div>
      <div className="foundation-progress" role="progressbar" aria-label="Reading questions answered" aria-valuemin={0} aria-valuemax={readingQuestions.length} aria-valuenow={answered}><span style={{width:(100*answered/readingQuestions.length)+'%'}} /></div>
    </div>
    {readingQuestions.map((q,i)=><fieldset className="foundation-question" key={q.id} data-question-id={q.id} disabled={!ready||submitted||saving}>
      <legend><span className="foundation-question__number">{String(i+1).padStart(2,'0')}</span>{q.prompt}</legend>
      <div className="foundation-options">{q.choices.map(c=><label key={c.id} className={'foundation-option'+(answers[q.id]===c.id?' foundation-option--selected':'')}>
        <input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))} />
        <span>{c.text}</span>
      </label>)}</div>
      {submitted && <div className="foundation-feedback" role="note">
        <strong>{isReadingAnswerCorrect(q,answers[q.id]??'')?'Correct':'Review this answer'}</strong>
        <p>{q.explanation}</p><p><strong>Chart evidence:</strong> {q.evidence}</p>
        {!isReadingAnswerCorrect(q,answers[q.id]??'') && <p className="foundation-feedback__why">Your selection: {q.choices.find(c=>c.id===answers[q.id])?.rationale ?? 'No answer selected'}</p>}
      </div>}
    </fieldset>)}
    {error && <p className="inline-error" role="alert">{error} Your selected answers remain so you can retry.</p>}
    {!submitted?<div className="foundation-practice__actions"><span className="muted">All questions must be answered before saving.</span>
      <button className="btn btn-primary" type="button" disabled={!ready||saving||answered!==readingQuestions.length} onClick={submit}>{saving?'Saving…':'Check answers & save score'}</button>
    </div>:<div className="foundation-result" role="status" aria-live="polite">
      <h3>{score} / {readingQuestions.length} correct</h3>
      <p>Your reading-practice score was saved locally in this browser. You can retry without replacing the earlier attempt.</p>
      <button className="btn btn-outline" type="button" onClick={()=>{setAnswers({});setSubmitted(false);setError('');}}>Practice again</button>
    </div>}
    <div className="foundation-teachback">
      <h3>Optional: write an evidence note</h3>
      <p>A classmate says “yama is the English translation of 山.” Use one chart row and a quoted Japanese reading to explain why that is incorrect. No Japanese keyboard is required for your English explanation.</p>
      <label htmlFor="reading-evidence-draft">Your row, quotation and explanation</label>
      <textarea id="reading-evidence-draft" rows={4} value={draft} onChange={e=>setDraft(e.target.value)} placeholder="Row __ shows __; this is the reading, while the English meaning is __." />
      <button className="btn btn-outline" type="button" aria-expanded={model} onClick={()=>setModel(v=>!v)}>{model?'Hide model':'Compare with model & checklist'}</button>
      {model && <div className="foundation-feedback" role="note"><strong>Model evidence note</strong>
        <p>Row D shows 山 with the small reading やま. The teacher's note says yama means mountain. So やま is the Japanese reading, while “mountain” is the English meaning.</p>
        <p>Self-review: Did you identify row D? Quote 山 or やま? Distinguish reading from English meaning? Explain the difference clearly? Other accurate wording is welcome. This writing is self-reviewed, not automatically graded.</p>
      </div>}
    </div>
    <p className="foundation-storage-note">The existing Dexie v1 database stores only aggregate quiz attempts, optional completion and bookmarks. This draft is neither saved nor sent to a server. No microphone, fake audio, new dependencies or data migrations are used.</p>
  </section>;
}
