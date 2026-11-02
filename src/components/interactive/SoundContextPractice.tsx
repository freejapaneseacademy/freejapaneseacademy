import { useEffect, useState } from 'react';
import { recordAttempt } from '../../lib/progress';
import { scoreSoundContext, soundContextQuestions, soundContextQuizId } from '../../lib/soundContextPractice';

export default function SoundContextPractice() {
  const [ready, setReady] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [draft, setDraft] = useState('');
  const [showModel, setShowModel] = useState(false);
  useEffect(() => setReady(true), []);

  const answered = soundContextQuestions.filter(q => !!answers[q.id]).length;
  const score = scoreSoundContext(answers);

  async function submit() {
    if (!ready || saving || submitted || answered !== soundContextQuestions.length) return;
    setSaving(true);
    setError('');
    try {
      await recordAttempt(soundContextQuizId, 'l0', score, soundContextQuestions.length);
      setSubmitted(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Browser storage is unavailable.');
    } finally {
      setSaving(false);
    }
  }

  return <section className="foundation-practice sound-context-practice" aria-labelledby="sound-context-check">
    <div className="foundation-practice__header">
      <span className="eyebrow">WRITTEN CONTEXT AND TIMING CHECK</span>
      <h2 id="sound-context-check">What do the vowel cards tell you?</h2>
      <p>These ten questions check written vowel recognition, the classroom setting and mora counting. They do <strong>not</strong> test your hearing or pronunciation. Choose every answer, then review the explanations.</p>
      <div className="foundation-progress-label" aria-live="polite">{answered} of {soundContextQuestions.length} answered</div>
      <div className="foundation-progress" role="progressbar" aria-label="Questions answered" aria-valuemin={0} aria-valuemax={soundContextQuestions.length} aria-valuenow={answered}>
        <span style={{ width: String(100 * answered / soundContextQuestions.length) + '%' }} />
      </div>
    </div>
    {soundContextQuestions.map((q, index) => <fieldset key={q.id} className="foundation-question" disabled={!ready || saving || submitted}>
      <legend><span className="foundation-question__number">{String(index + 1).padStart(2, '0')}</span>{q.prompt}</legend>
      {q.example && <div className="foundation-prompt-jp" lang="ja">{q.example}</div>}
      <div className="foundation-options">
        {q.choices.map(choice => <label key={choice.id} className={'foundation-option ' + (answers[q.id] === choice.id ? 'foundation-option--selected' : '')}>
          <input type="radio" name={q.id} value={choice.id} checked={answers[q.id] === choice.id}
            onChange={() => setAnswers(prev => ({ ...prev, [q.id]: choice.id }))} />
          <span>{choice.text}</span>
        </label>)}
      </div>
      {submitted && <div className="foundation-feedback" role="note">
        <strong>{answers[q.id] === q.answerKey.choiceId ? '✓ Correct' : 'Review this answer'}</strong>
        <p>{q.explanation}</p>
        {answers[q.id] !== q.answerKey.choiceId && <p className="foundation-feedback__why">
          Your choice: {q.choices.find(c => c.id === answers[q.id])?.rationale}
        </p>}
      </div>}
    </fieldset>)}
    {error && <p role="alert" className="inline-error">{error} Your selections have been kept; try saving again.</p>}
    {!submitted ? <div className="foundation-practice__actions">
      <span className="muted">Answer all ten questions to submit.</span>
      <button className="btn btn-primary" type="button" disabled={!ready || saving || answered !== soundContextQuestions.length} onClick={submit}>
        {saving ? 'Saving…' : 'Check answers & save score'}
      </button>
    </div> : <div className="foundation-result" role="status" aria-live="polite">
      <span className="eyebrow">WRITTEN PRACTICE RESULT</span>
      <h3>{score} / {soundContextQuestions.length} correct</h3>
      <p>Your written practice score was saved on this browser. It does not certify auditory discrimination, pronunciation or overall mastery.</p>
      <button className="btn btn-outline" type="button" onClick={() => { setAnswers({}); setSubmitted(false); setError(''); }}>
        Try the written check again
      </button>
    </div>}
    <div className="foundation-teachback">
      <h3>Optional: explain the rhythm to a new learner</h3>
      <p>Imagine a classmate sees <span lang="ja">いえ</span> and <span lang="ja">あおい</span>. Write one or two sentences explaining why they have two and three morae. You can use English and Japanese kana. This is private self-review, not an automatically graded composition.</p>
      <label htmlFor="sound-context-draft">Your explanation (not uploaded or saved)</label>
      <textarea id="sound-context-draft" rows={4} value={draft} disabled={!ready}
        onChange={e => setDraft(e.target.value)} placeholder="いえ has two timing units because…" />
      <button className="btn btn-outline" type="button" disabled={!ready} aria-expanded={showModel}
        onClick={() => setShowModel(value => !value)}>
        {showModel ? 'Hide model and checklist' : 'Compare with model and checklist'}
      </button>
      {showModel && <div className="foundation-feedback">
        <strong>Model explanation</strong>
        <p><span lang="ja">いえ</span> (“house”) is <span lang="ja">い・え</span>, two morae. <span lang="ja">あおい</span> (“blue”) is <span lang="ja">あ・お・い</span>, three morae. Each written vowel in these examples has its own timing unit; English spelling habits can hide that distinction.</p>
        <ul>
          <li>Did you count the separate written vowel units?</li>
          <li>Did you avoid treating <span lang="ja">いえ</span> as the English word “eye”?</li>
          <li>Did you distinguish reading/timing awareness from tested pronunciation?</li>
        </ul>
      </div>}
    </div>
    <p className="foundation-storage-note">Only submitted multiple-choice scores are stored in this browser's existing Dexie progress database. The optional text stays in this page until you navigate away. No microphone, audio upload or external scoring is used.</p>
  </section>;
}
