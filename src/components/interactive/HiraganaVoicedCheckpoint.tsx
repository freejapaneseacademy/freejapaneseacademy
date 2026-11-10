import { useEffect, useState } from 'react';
import { recordAttempt, toggleBookmark, getSnapshot } from '../../lib/progress';

export type CheckQuestion = { id: string; area: string; prompt: string; choices: { id: string; text: string; rationale: string }[]; answerKey: { choiceId: string }; explanation: string; evidence: string; trackId?: string };
export type CheckTrack = { id: string; label: string; url: string; transcript: string; english: string };
export function scoreCheckpoint(questions: CheckQuestion[], answers: Record<string, string>) {
  return questions.reduce((n, q) => n + Number(answers[q.id] === q.answerKey.choiceId), 0);
}
export default function HiraganaVoicedCheckpoint({ questions, tracks }: { questions: CheckQuestion[]; tracks: CheckTrack[] }) {
  const [answers, setAnswers] = useState<Record<string,string>>({});
  const [played, setPlayed] = useState<Record<string,boolean>>({});
  const [revealed, setRevealed] = useState<Record<string,boolean>>({});
  const [assisted, setAssisted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [audioError, setAudioError] = useState<Record<string,boolean>>({});
  const [weakSaved, setWeakSaved] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const valid = questions.length === 12 && new Set(questions.map(q => q.id)).size === 12 && tracks.length === 2;
  const answered = questions.filter(q => answers[q.id]).length;
  const score = scoreCheckpoint(questions, answers);
  const heard = tracks.every(t => played[t.id]);
  const canSubmit = valid && ready && !busy && !submitted && answered === questions.length && (heard || assisted);
  async function submit() {
    if (!canSubmit) return;
    setBusy(true); setError('');
    try {
      await recordAttempt(assisted ? 'l0-m03-c01-chk-assisted-v1' : 'l0-m03-c01-chk-v1', 'l0', score, questions.length);
      setSaved(true); setSubmitted(true);
    } catch { setError('Could not save this attempt locally. Please retry.'); }
    finally { setBusy(false); }
  }
  function restart() {
    setAnswers({}); setPlayed({}); setRevealed({}); setAssisted(false); setSubmitted(false); setSaved(false); setError(''); setAudioError({}); setWeakSaved(false);
  }
  return <section className="foundation-practice" aria-labelledby="checkpoint-heading">
    <h2 id="checkpoint-heading">Chapter 01 voiced-kana checkpoint</h2>
    <p>Answer 12 questions. Listen to both licensed Japanese recordings before the listening questions, or use the explicitly labelled assisted transcript path.</p>
    {!valid && <p role="alert">Checkpoint data is incomplete. Scoring is unavailable.</p>}
    {tracks.map(track => <section className="listening-track" key={track.id}>
      <h3>{track.label}</h3>
      <audio controls preload="metadata" src={track.url} aria-label={track.label + ' Japanese recording'} onPlay={() => setPlayed(p => ({...p,[track.id]:true}))} onError={() => setAudioError(p => ({...p,[track.id]:true}))} onCanPlay={() => setAudioError(p => ({...p,[track.id]:false}))}>Audio playback is not supported.</audio>
      {audioError[track.id] && <p role="alert">Recording unavailable. You can use assisted transcript review, but not claim unaided listening.</p>}
      <button type="button" className="btn btn-outline" aria-expanded={Boolean(revealed[track.id])} onClick={() => { setRevealed(p => ({...p,[track.id]:!p[track.id]})); if (!submitted) setAssisted(true); }}>{revealed[track.id] ? 'Hide' : 'Reveal'} {track.label} transcript (assisted)</button>
      {revealed[track.id] && <div><p lang="ja" style={{whiteSpace:'pre-line'}}>{track.transcript}</p><p style={{whiteSpace:'pre-line'}}>{track.english}</p></div>}
    </section>)}
    <p aria-live="polite">{answered} of {questions.length} answered. {assisted ? 'Assisted transcript mode: score is not a blind listening result.' : 'Unaided listening mode.'}</p>
    {questions.map((q, index) => <fieldset key={q.id} data-question-id={q.id} disabled={submitted} style={{marginBlock:'1.5rem',minWidth:0}}>
      <legend><strong>{index + 1}. {q.prompt}</strong> <span>({q.area})</span></legend>
      {q.choices.map(c => <label key={c.id} style={{display:'flex',alignItems:'flex-start',gap:'.75rem',padding:'.65rem 0',minHeight:44}}>
        <input type="radio" name={q.id} value={c.id} checked={answers[q.id] === c.id} onChange={() => setAnswers(p => ({...p,[q.id]:c.id}))}/>
        <span>{c.text}</span>
      </label>)}
      {submitted && <div role="status">
        <strong>{answers[q.id] === q.answerKey.choiceId ? 'Correct' : 'Review this item'}</strong>
        <p>{q.explanation} Evidence: <span lang="ja">{q.evidence}</span></p>
        <p>{q.choices.find(c => c.id === answers[q.id])?.rationale}</p>
      </div>}
    </fieldset>)}
    {!submitted ? <button type="button" className="btn btn-primary" disabled={!canSubmit} onClick={submit}>{busy ? 'Saving…' : 'Check answers and save checkpoint score'}</button> : <>
      <h3 role="status">{score} / {questions.length} correct — {assisted ? 'assisted transcript review' : 'unaided listening attempt'}</h3>
      <p>{saved ? 'Attempt saved in this browser.' : 'Attempt was not saved.'} Review explanations above and practise any missed areas.</p>
      <button type="button" className="btn btn-outline" onClick={restart}>Try checkpoint again</button>
      <button type="button" className="btn btn-outline" disabled={weakSaved || score === questions.length} onClick={async () => {
        try {
          const existing = new Set((await getSnapshot()).bookmarks.map(b => b.id));
          for (const q of questions.filter(q => answers[q.id] !== q.answerKey.choiceId)) {
            const key = 'review-' + q.id;
            if (!existing.has(key)) await toggleBookmark(key);
          }
          setWeakSaved(true); setError('');
        } catch { setError('Unable to save missed-item review bookmarks.'); }
      }}>{weakSaved ? 'Missed items saved for review' : 'Save missed items to review bookmarks'}</button>
      <p><a href="/learn/start/module-03/chapter-01/lesson-03/">Review sound function</a> · <a href="/learn/start/module-03/chapter-01/lesson-05/">Review reading</a> · <a href="/learn/start/module-03/chapter-01/lesson-06/">Review listening</a> · <a href="/learn/start/module-03/chapter-01/lesson-07/">Review writing</a></p>
    </>}
    {error && <p role="alert">{error}</p>}
  </section>;
}
