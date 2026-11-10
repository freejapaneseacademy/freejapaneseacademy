import { useState } from 'react';
import { demoQuestions, scoreQuiz } from '../../lib/quiz';
import { recordAttempt } from '../../lib/progress';

export default function QuizDemo() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const score = scoreQuiz(demoQuestions, answers);
  const complete = demoQuestions.every((q) => answers[q.id]);
  const submit = async () => {
    if (!complete || saving || submitted) return;
    setSaving(true);
    setError('');
    try {
      await recordAttempt('hiragana-demo-v1', 'n5', score, demoQuestions.length);
      setSubmitted(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to save your result.');
    } finally { setSaving(false); }
  };
  return (
    <div className="quiz-container">
      <div className="quiz-meta"><span>DEMONSTRATION QUIZ</span><span>{Object.keys(answers).length} / {demoQuestions.length} answered</span></div>
      <div className="quiz-progress"><div style={{ width: `${Object.keys(answers).length / demoQuestions.length * 100}%` }} /></div>
      {demoQuestions.map((question, index) => (
        <fieldset className="quiz-question" key={question.id} disabled={submitted || saving}>
          <legend><span className="quiz-number">{String(index + 1).padStart(2, '0')}</span>{question.prompt}</legend>
          <div className="answer-options">
            {question.options.map((option) => {
              const selected = answers[question.id] === option.id;
              const isCorrect = submitted && option.id === question.answer;
              const isWrong = submitted && selected && option.id !== question.answer;
              return (
                <label key={option.id} className={`answer-option ${selected ? 'selected' : ''} ${isCorrect ? 'correct' : ''} ${isWrong ? 'incorrect' : ''}`}>
                  <input type="radio" name={question.id} value={option.id} checked={selected}
                    onChange={() => setAnswers((prev) => ({ ...prev, [question.id]: option.id }))} />
                  <span>{option.text}</span><span className="option-marker" aria-hidden="true">{isCorrect ? '✓' : isWrong ? '×' : ''}</span>
                </label>
              );
            })}
          </div>
          {submitted && <p className="answer-explanation">{question.explanation}</p>}
        </fieldset>
      ))}
      {error && <p role="alert" className="inline-error">{error}</p>}
      {submitted ? (
        <div className="quiz-result" role="status">
          <span className="eyebrow">YOUR RESULTS</span>
          <h2>{score} <span>/ {demoQuestions.length}</span></h2>
          <p>{score === demoQuestions.length ? 'Beautiful work! You recognized all three characters.' : 'Nice effort. Review the explanations and give it another go.'}</p>
          <p className="muted">This result was saved on this device.</p>
          <div className="button-row"><button className="btn btn-primary" type="button" onClick={() => { setAnswers({}); setSubmitted(false); }}>Try again <span aria-hidden="true">↗</span></button><a className="btn btn-outline" href="/dashboard/">View dashboard</a></div>
        </div>
      ) : (
        <div className="quiz-footer"><p className="muted">Choose an answer for every question.</p><button className="btn btn-primary" type="button" disabled={!complete || saving} onClick={submit}>{saving ? 'Saving…' : 'Check my answers'} <span aria-hidden="true">↗</span></button></div>
      )}
    </div>
  );
}
