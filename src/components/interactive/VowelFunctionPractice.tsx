import { useEffect, useState } from 'react';
import { recordAttempt } from '../../lib/progress';
import { isVowelFunctionCorrect, scoreVowelFunction, vowelFunctionQuestions, vowelFunctionQuizId } from '../../lib/vowelFunctionPractice';

export default function VowelFunctionPractice() {
  const [ready, setReady] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [draft, setDraft] = useState('');
  const [showModel, setShowModel] = useState(false);
  useEffect(() => setReady(true), []);

  const answered = vowelFunctionQuestions.filter(q => !!answers[q.id]?.trim()).length;
  const score = scoreVowelFunction(answers);

  async function submit() {
    if (!ready || saving || submitted || answered !== vowelFunctionQuestions.length) return;
    setSaving(true);
    setError('');
    try {
      await recordAttempt(vowelFunctionQuizId, 'l0', score, vowelFunctionQuestions.length);
      setSubmitted(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Browser storage is unavailable.');
    } finally {
      setSaving(false);
    }
  }

  return <section className="foundation-practice vowel-function-practice" aria-labelledby="vowel-function-title">
    <div className="foundation-practice__header">
      <span className="eyebrow">VOWEL LENGTH AND MEANING · WRITTEN CHECK</span>
      <h2 id="vowel-function-title">Keep the vowel and its meaning together</h2>
      <p>Answer twelve written questions on vowel articulation cues, mora counting, and words whose meaning changes with vowel length. The final two accept the exact kana or listed plain lowercase romaji. This check cannot assess hearing or pronunciation.</p>
      <div className="foundation-progress-label" aria-live="polite">{answered} of {vowelFunctionQuestions.length} answered</div>
      <div className="foundation-progress" role="progressbar" aria-label="Vowel length questions answered" aria-valuemin={0} aria-valuemax={vowelFunctionQuestions.length} aria-valuenow={answered}>
        <span style={{ width: (100 * answered / vowelFunctionQuestions.length) + '%' }} />
      </div>
    </div>

    {vowelFunctionQuestions.map((q, i) => <fieldset key={q.id} data-question-id={q.id} className="foundation-question" disabled={!ready || saving || submitted}>
      <legend><span className="foundation-question__number">{String(i + 1).padStart(2, '0')}</span>{q.prompt}</legend>
      {q.example && <div className="foundation-prompt-jp" lang="ja">{q.example}</div>}
      {q.type === 'single-choice' ? <div className="foundation-options">
        {q.choices.map(choice => <label key={choice.id} className={'foundation-option' + (answers[q.id] === choice.id ? ' foundation-option--selected' : '')}>
          <input type="radio" name={q.id} value={choice.id} checked={answers[q.id] === choice.id} onChange={() => setAnswers(prev => ({ ...prev, [q.id]: choice.id }))} />
          <span>{choice.text}</span>
        </label>)}
      </div> : <div className="vocabulary-input">
        <label htmlFor={'vowel-function-' + q.id}>Your answer (kana or plain lowercase romaji)</label>
        <input id={'vowel-function-' + q.id} type="text" name={q.id} autoComplete="off" spellCheck={false}
          value={answers[q.id] ?? ''} onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))} />
      </div>}
      {submitted && <div className="foundation-feedback" role="note">
        <strong>{isVowelFunctionCorrect(q, answers[q.id] ?? '') ? 'Correct' : 'Review this answer'}</strong>
        <p>{q.explanation}</p>
        {!isVowelFunctionCorrect(q, answers[q.id] ?? '') && <p className="foundation-feedback__why">
          {q.type === 'single-choice'
            ? 'Your choice: ' + (q.choices.find(c => c.id === answers[q.id])?.rationale ?? 'No choice selected')
            : 'Accepted example: ' + q.answerKey.accepted[0]}
        </p>}
      </div>}
    </fieldset>)}

    {error && <p role="alert" className="inline-error">{error} Your answers are still here; retry saving when browser storage is available.</p>}
    {!submitted ? <div className="foundation-practice__actions">
      <span className="muted">All twelve responses are required before saving a written score.</span>
      <button type="button" className="btn btn-primary" disabled={!ready || saving || answered !== vowelFunctionQuestions.length} onClick={submit}>
        {saving ? 'Saving…' : 'Check answers & save score'}
      </button>
    </div> : <div className="foundation-result" role="status" aria-live="polite">
      <h3>{score} / {vowelFunctionQuestions.length} correct</h3>
      <p>Your written vowel-function score was saved in this browser. It is not an audio, pronunciation, or mastery grade.</p>
      <button type="button" className="btn btn-outline" onClick={() => { setAnswers({}); setSubmitted(false); setError(''); }}>
        Practice again
      </button>
    </div>}

    <div className="foundation-teachback">
      <h3>Optional: explain a label mix-up</h3>
      <p>Emi is preparing a fictional display. Explain why a house label needs <span lang="ja">いえ</span> but a polite negative reply needs <span lang="ja">いいえ</span>. Add the mora counts, and explain why simply speaking louder does not make a long vowel. This writing is private self-review, not machine graded.</p>
      <label htmlFor="vowel-function-draft">Your explanation (not saved or uploaded)</label>
      <textarea id="vowel-function-draft" rows={4} disabled={!ready} value={draft} onChange={e => { setDraft(e.target.value); setShowModel(false); }} />
      <button type="button" className="btn btn-outline" disabled={!ready} aria-expanded={showModel} onClick={() => setShowModel(v => !v)}>
        {showModel ? 'Hide model and checklist' : 'Compare with model and checklist'}
      </button>
      {showModel && <div className="foundation-feedback" role="note">
        <h4>Model explanation</h4>
        <p><span lang="ja">いえ</span> (い・え, two morae) means house. <span lang="ja">いいえ</span> (い・い・え, three morae) is a negative reply meaning no. The additional <span lang="ja">い</span> changes the word and its function. A long vowel occupies an extra timing unit; it is not made by raising volume.</p>
        <h4>Self-review checklist</h4>
        <ul>
          <li>Did you give both words and their different meanings?</li>
          <li>Did you count two versus three morae correctly?</li>
          <li>Did you describe length as timing rather than stress or loudness?</li>
          <li>Did you avoid claiming that written practice proves pronunciation?</li>
        </ul>
        <p>Revise your own explanation if needed. This text stays in this tab and is lost when you leave or refresh; no teacher or server receives it.</p>
      </div>}
    </div>
  </section>;
}
