import { useEffect, useState } from 'react';
import { recordAttempt } from '../../lib/progress';
import { soundReadingRows, soundReadingQuestions, soundReadingQuizId, scoreSoundReading, isSoundReadingCorrect } from '../../lib/soundReadingPractice';

export default function SoundReadingPractice() {
  const [ready,setReady] = useState(false);
  const [answers,setAnswers] = useState<Record<string,string>>({});
  const [submitted,setSubmitted] = useState(false);
  const [saving,setSaving] = useState(false);
  const [error,setError] = useState('');
  const [draft,setDraft] = useState('');
  const [showModel,setShowModel] = useState(false);
  useEffect(()=>setReady(true),[]);
  const answered = soundReadingQuestions.filter(q=>Boolean(answers[q.id])).length;
  const score = scoreSoundReading(answers);
  async function submit() {
    if (!ready || submitted || saving || answered !== soundReadingQuestions.length) return;
    setSaving(true); setError('');
    try {
      await recordAttempt(soundReadingQuizId,'l0',score,soundReadingQuestions.length);
      setSubmitted(true);
    } catch(e) { setError(e instanceof Error?e.message:'Unable to save this attempt in browser storage.'); }
    finally { setSaving(false); }
  }
  return <section className="foundation-practice sound-reading-practice" aria-labelledby="sound-reading-title">
    <span className="eyebrow">ORIGINAL PRONUNCIATION MAP · WRITTEN READING</span>
    <h2 id="sound-reading-title">Read Emi's eleven-row pronunciation map</h2>
    <p>Use the written map as your source. Every question has an explicit answer in a labeled row; you may look back. No audio or pronunciation ability is assessed here.</p>
    <div className="reading-chart-scroll" role="region" aria-label="Eleven-row pronunciation map; scroll inside on small screens" tabIndex={0}>
      <table className="reading-chart">
        <caption>Original classroom pronunciation map: vowel symbols, syllables, meanings and mora counts</caption>
        <thead><tr><th scope="col">Row</th><th scope="col">Japanese example</th><th scope="col">Category or use</th><th scope="col">Teacher's written note</th></tr></thead>
        <tbody>{soundReadingRows.map(r=><tr key={r.id} data-map-row={r.id}>
          <th scope="row">{r.id}</th>
          <td className="reading-chart__jp" lang="ja">{r.printed}</td>
          <td>{r.category}</td>
          <td>{r.note}</td>
        </tr>)}</tbody>
      </table>
    </div>
    <p className="foundation-storage-note">A–E show written vowel pairs. F is a sequence of five separate k-row kana. G–K show picture-card labels, replies and written timing. Latin letters in the notes are temporary reading cues, not English translations or recorded pronunciation.</p>
    <div className="foundation-practice__header">
      <h2>Locate the detail and cite the evidence</h2>
      <p>Choose one row for each prompt. The exact row evidence and an explanation for every answer appear after submission. The map remains available throughout.</p>
      <div className="foundation-progress-label" aria-live="polite">{answered} of {soundReadingQuestions.length} answered</div>
      <div className="foundation-progress" role="progressbar" aria-label="Pronunciation-map reading questions answered" aria-valuemin={0} aria-valuemax={soundReadingQuestions.length} aria-valuenow={answered}><span style={{width:(100*answered/soundReadingQuestions.length)+'%'}} /></div>
    </div>
    {soundReadingQuestions.map((q,i)=><fieldset className="foundation-question" key={q.id} data-question-id={q.id} disabled={!ready||submitted||saving}>
      <legend><span className="foundation-question__number">{String(i+1).padStart(2,'0')}</span>{q.prompt}</legend>
      <div className="foundation-options">{q.choices.map(c=><label key={c.id} className={'foundation-option'+(answers[q.id]===c.id?' foundation-option--selected':'')}>
        <input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))} />
        <span>{c.text}</span>
      </label>)}</div>
      {submitted && <div className="foundation-feedback" role="note">
        <strong>{isSoundReadingCorrect(q,answers[q.id]??'')?'Correct':'Review this answer'}</strong>
        <p>{q.explanation}</p>
        <p><strong>Map evidence:</strong> {q.evidence}</p>
        {!isSoundReadingCorrect(q,answers[q.id]??'') && <p className="foundation-feedback__why">Your selection: {q.choices.find(c=>c.id===answers[q.id])?.rationale ?? 'No answer selected'}</p>}
      </div>}
    </fieldset>)}
    {error && <p role="alert" className="inline-error">{error} Your answers are still selected; retry saving when storage is available.</p>}
    {!submitted ? <div className="foundation-practice__actions">
      <span className="muted">Select a row for all twelve questions before saving.</span>
      <button type="button" className="btn btn-primary" disabled={!ready||saving||answered!==soundReadingQuestions.length} onClick={submit}>{saving?'Saving…':'Check answers & save score'}</button>
    </div> : <div className="foundation-result" role="status" aria-live="polite">
      <h3>{score} / {soundReadingQuestions.length} correct</h3>
      <p>Your written reading score is saved locally. This does not measure hearing, pronunciation or long-term mastery.</p>
      <button type="button" className="btn btn-outline" onClick={()=>{setAnswers({});setSubmitted(false);setError('');}}>Practice again</button>
    </div>}
    <div className="foundation-teachback">
      <h3>Optional: write an evidence note</h3>
      <p>A classmate thinks <span lang="ja">いえ</span> and <span lang="ja">いいえ</span> are interchangeable. Cite both map rows and quote the written difference. Explain their meanings in English or Japanese.</p>
      <label htmlFor="sound-reading-draft">Your row labels, Japanese quotation and explanation</label>
      <textarea id="sound-reading-draft" rows={4} disabled={!ready} value={draft} onChange={e=>{setDraft(e.target.value);setShowModel(false);}} placeholder="Row H shows __, meaning __. Row I shows __, meaning __. The extra __ matters." />
      <button type="button" className="btn btn-outline" disabled={!ready} aria-expanded={showModel} onClick={()=>setShowModel(v=>!v)}>{showModel?'Hide model and checklist':'Compare with model and checklist'}</button>
      {showModel && <div className="foundation-feedback" role="note"><strong>Model evidence note and self-review</strong>
        <p>Row H prints <span lang="ja">いえ</span> (<span lang="ja">い・え</span>, two morae) for “house.” Row I prints <span lang="ja">いいえ</span> (<span lang="ja">い・い・え</span>, three morae) for “no.” The additional <span lang="ja">い</span> changes the written timing and the word's meaning in this scene.</p>
        <ul><li>Did you name both H and I?</li><li>Did you quote both Japanese spellings correctly?</li><li>Did you explain the two meanings and the extra い?</li><li>Did you distinguish written evidence from untested spoken pronunciation?</li></ul>
        <p>Revise freely. This is self-review, not an automated writing grade.</p>
      </div>}
    </div>
    <p className="foundation-storage-note">Only the scored quiz attempt, optional bookmark and separately chosen lesson completion use existing browser-local Dexie v1. This draft stays in the tab and is lost on refresh; it is not uploaded. No microphone, synthetic audio, new dependencies or database migration are used.</p>
  </section>;
}
