import { useState } from 'react';
import bank from '../../content/exercises/n5-m03-c03-l03-v1.json';
import { recordAttempt } from '../../lib/progress';
type Answers = Record<string, string>;
export function scorePastScheduleGrammar(answers: Answers): number {
  return bank.items.filter(q => answers[q.id] === q.answerKey.choiceId).length;
}
export default function PastScheduleGrammarPractice() {
  const [answers, setAnswers] = useState<Answers>({});
  const [submitted, setSubmitted] = useState(false);
  const [storageMessage, setStorageMessage] = useState('');
  const score = scorePastScheduleGrammar(answers);
  async function check() {
    if (submitted) return;
    setSubmitted(true);
    try { await recordAttempt('n5-m03-c03-l03-v1', 'n5', score, bank.items.length); setStorageMessage('Attempt saved to this browser.'); }
    catch { setStorageMessage('Score shown, but browser storage was unavailable.'); }
  }
  function retry() { setAnswers({}); setSubmitted(false); setStorageMessage(''); }
  return <section aria-labelledby="past-schedule-heading" className="foundation-practice">
    <h2 id="past-schedule-heading">Past and future: written practice</h2>
    <p>Choose one answer for each item. Unanswered items count as incorrect; you can retry.</p>
    {bank.items.map((q, index) => {
      const correct = answers[q.id] === q.answerKey.choiceId;
      const selected = q.choices.find(c => c.id === answers[q.id]);
      return <fieldset key={q.id} style={{ marginBlock: '1.25rem', minWidth: 0, maxWidth: '100%' }}>
        <legend><strong>{index + 1}. {q.prompt}</strong></legend>
        <div role="group" aria-label={`Choices for question ${index + 1}`}>
          {q.choices.map(c => <label key={c.id} style={{ display: 'flex', gap: '.6rem', alignItems: 'flex-start', padding: '.7rem .3rem', minHeight: 44, overflowWrap: 'anywhere' }}>
            <input type="radio" name={q.id} value={c.id} checked={answers[q.id] === c.id} disabled={submitted} onChange={() => setAnswers(prev => ({ ...prev, [q.id]: c.id }))} />
            <span lang={/[ぁ-んァ-ン一-龯]/.test(c.text) ? 'ja' : undefined}>{c.text}</span>
          </label>)}
        </div>
        {submitted && <div role="status" aria-live="polite"><strong>{correct ? 'Correct' : 'Review'}</strong>
          <p>{selected ? selected.rationale : 'No answer selected. ' + q.explanation}</p>
          {!correct && <p>Correct answer: {q.choices.find(c => c.id === q.answerKey.choiceId)?.text}</p>}
          <p>Evidence: <span lang="ja">{q.evidence}</span></p></div>}
      </fieldset>;
    })}
    {submitted ? <div role="status" aria-live="polite"><p><strong>Written practice: {score} of {bank.items.length} correct.</strong></p><p>{storageMessage}</p><button type="button" onClick={retry}>Retry questions</button></div> : <button type="button" onClick={check}>Check answers</button>}
  </section>;
}
