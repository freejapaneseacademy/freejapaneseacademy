import { useState } from 'react';
import bank from '../../content/exercises/n5-m05-c02-l05-v1.json';
import { recordAttempt } from '../../lib/progress';

export const QUIZ_ID = 'n5-m05-c02-l05-reading-v1';
export const questions = bank.items;
export function scoreCompanionsReading(answers: Record<string, string>) {
  return questions.filter(q => answers[q.id] === q.answerKey.choiceId).length;
}
export default function CompanionsItineraryReading() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [draft, setDraft] = useState('');
  const [showModel, setShowModel] = useState(false);
  const count = questions.filter(q => Boolean(answers[q.id])).length;
  async function submit() {
    if (saving || submitted || count !== questions.length) return;
    setSaving(true); setError('');
    try {
      await recordAttempt(QUIZ_ID, 'n5', scoreCompanionsReading(answers), questions.length);
      setSubmitted(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Progress storage unavailable');
    } finally { setSaving(false); }
  }
  return <section className="foundation-practice" aria-labelledby="companions-reading-heading">
    <div className="foundation-practice__header">
      <span className="eyebrow">READING COMPREHENSION</span>
      <h2 id="companions-reading-heading">Find the companion and transport evidence</h2>
      <p>Use the Japanese itinerary, not a guess. Tab to an option; arrow keys or Space select it.</p>
      <p aria-live="polite">{count} of {questions.length} answered</p>
      <div className="foundation-progress" role="progressbar" aria-label="Questions answered" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={count}><span style={{ width: count / questions.length * 100 + '%' }} /></div>
    </div>
    {questions.map((q, i) => <fieldset className="foundation-question" key={q.id} disabled={saving || submitted}>
      <legend><span className="foundation-question__number">{String(i + 1).padStart(2, '0')}</span>{q.prompt}</legend>
      <div className="foundation-options">{q.choices.map(c => <label key={c.id} className={'foundation-option ' + (answers[q.id] === c.id ? 'foundation-option--selected' : '')}>
        <input type="radio" name={q.id} value={c.id} checked={answers[q.id] === c.id} onChange={() => setAnswers(a => ({ ...a, [q.id]: c.id }))} /><span>{c.text}</span>
      </label>)}</div>
      {submitted && <div className="foundation-feedback" role="note">
        <strong>{answers[q.id] === q.answerKey.choiceId ? '✓ Correct' : 'Review the evidence'}</strong>
        <p>{q.explanation}</p>
        {answers[q.id] !== q.answerKey.choiceId && <p>{q.choices.find(c => c.id === answers[q.id])?.rationale}</p>}
      </div>}
    </fieldset>)}
    {error && <p role="alert">{error}. Your selections are retained; try again.</p>}
    {!submitted ? <button type="button" className="btn btn-primary" disabled={saving || count !== questions.length} onClick={submit}>{saving ? 'Saving…' : 'Check answers and save score'}</button> :
      <div className="foundation-result" role="status"><h3>{scoreCompanionsReading(answers)} / {questions.length} correct</h3>
        <p>Quiz attempt stored locally on this device.</p>
        <button type="button" className="btn btn-outline" onClick={() => { setAnswers({}); setSubmitted(false); setError(''); }}>Retry reading check</button>
      </div>}
    <div className="foundation-teachback"><h3>Optional itinerary writing</h3>
      <label htmlFor="companions-reading-draft">Write three Japanese sentences about a destination, a vehicle and a companion or solo return.</label>
      <textarea id="companions-reading-draft" rows={4} value={draft} onChange={e => setDraft(e.target.value)} placeholder="日曜日に友達と公園へ行きます。" />
      <button type="button" className="btn btn-outline" aria-expanded={showModel} onClick={() => setShowModel(v => !v)}>{showModel ? 'Hide model' : 'Compare with model'}</button>
      {showModel && <p className="foundation-feedback" lang="ja">日曜日に友達と公園へ行きます。バスで行きます。午後四時に一人で家に帰ります。</p>}
    </div>
    <p className="foundation-storage-note">Writing is ungraded and not saved. Quiz attempts are stored locally.</p>
  </section>;
}
