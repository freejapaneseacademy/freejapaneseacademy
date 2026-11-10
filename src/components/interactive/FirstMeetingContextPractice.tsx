import { useState } from 'react';
import { recordAttempt } from '../../lib/progress';

type Choice = { id: string; text: string; rationale: string };
type Question = { id: string; prompt: string; choices: Choice[]; answerKey: { choiceId: string }; explanation: string };
export default function FirstMeetingContextPractice({ lessonId, questions }: { lessonId: string; questions: Question[] }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const score = questions.filter(q => answers[q.id] === q.answerKey.choiceId).length;
  const check = async () => {
    setSubmitted(true); setSaving(true); setMessage('');
    try {
      await recordAttempt('quiz-' + lessonId + '-v1', 'n5', score, questions.length);
      setMessage('Your attempt was saved locally on this device.');
    } catch {
      setMessage('Your feedback is available, but local progress could not be saved.');
    } finally { setSaving(false); }
  };
  return <section aria-labelledby="first-meeting-check-title" className="my-8 min-w-0 rounded-xl border border-slate-300 p-4 dark:border-slate-700 sm:p-6">
    <h2 id="first-meeting-check-title" className="text-2xl font-semibold">First-meeting context check</h2>
    <p className="my-3">Select the purpose supported by the words in each fictional scene. Use Tab and arrow keys to navigate radio choices.</p>
    {questions.map((q, index) => <fieldset key={q.id} data-question-id={q.id} disabled={submitted} className="min-w-0 border-t border-slate-300 py-5 dark:border-slate-700">
      <legend className="pt-3 font-semibold">Question {index + 1}</legend>
      <p className="my-2 break-words">{q.prompt}</p>
      <div className="grid gap-2">{q.choices.map(c => <label key={c.id} className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-300 p-3 focus-within:ring-2 focus-within:ring-sky-500 dark:border-slate-600">
        <input type="radio" name={q.id} value={c.id} checked={answers[q.id] === c.id} onChange={() => setAnswers(previous => ({ ...previous, [q.id]: c.id }))} className="mt-1 shrink-0" />
        <span className="break-words">{c.text}</span>
      </label>)}</div>
      {submitted && <p role="status" className="mt-3">{answers[q.id] === q.answerKey.choiceId ? 'Correct. ' : 'Review. '}{q.explanation} {q.choices.find(c => c.id === answers[q.id])?.rationale}</p>}
    </fieldset>)}
    {submitted ? <div role="status"><p className="font-semibold">Practice score: {score} of {questions.length}. Not an official JLPT score.</p><p>{message}</p>
      <button type="button" className="btn btn-outline my-3" onClick={() => { setAnswers({}); setSubmitted(false); setMessage(''); }}>Start a new attempt</button></div>
      : <button type="button" className="btn btn-primary my-3" disabled={Object.keys(answers).length !== questions.length || saving} onClick={check}>Check answers</button>}
  </section>;
}
