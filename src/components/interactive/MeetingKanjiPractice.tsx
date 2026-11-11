import React, { useState } from 'react';
import bank from '../../content/exercises/n5-m04-c04-l04-v1.json';
import { recordAttempt } from '../../lib/progress';

export const meetingKanjiQuestions = bank.items;
export function scoreMeetingKanji(answers: Record<string, string>) {
  return meetingKanjiQuestions.reduce((score, q) => score + (answers[q.id] === q.answerKey.choiceId ? 1 : 0), 0);
}

export default function MeetingKanjiPractice() {
  const [answers, setAnswers] = useState<Record<string,string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [draft, setDraft] = useState('');
  const [showModel, setShowModel] = useState(false);
  const score = scoreMeetingKanji(answers);
  async function submit() {
    if (submitted || Object.keys(answers).length !== meetingKanjiQuestions.length) return;
    setSubmitted(true);
    try {
      await recordAttempt('n5-m04-c04-l04-v1', 'n5', score, meetingKanjiQuestions.length);
      setSaveMessage('Attempt saved in this browser.');
    } catch {
      setSaveMessage('Score shown, but browser storage is unavailable.');
    }
  }
  return <section aria-label="Meeting kanji practice" className="my-8 min-w-0 rounded-xl border border-slate-300 p-4 dark:border-slate-600">
    <h2 className="text-2xl font-semibold">Check your meeting-plan kanji</h2>
    <p>Choose the best answer for all twelve questions. Feedback appears after you submit.</p>
    {meetingKanjiQuestions.map((q,i)=><fieldset key={q.id} disabled={submitted} className="my-5 min-w-0 border-t border-slate-300 pt-4 dark:border-slate-600">
      <legend className="pt-2 font-semibold">{i+1}. {q.prompt}</legend>
      <div className="mt-3 grid gap-2">{q.choices.map(c=><label key={c.id} className="flex min-h-11 cursor-pointer items-start gap-3 break-words rounded-lg border border-slate-300 p-3 dark:border-slate-600">
        <input type="radio" className="mt-1" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/>
        <span>{c.text}</span>
      </label>)}</div>
      {submitted && <div role="status" className="mt-3"><p>{answers[q.id]===q.answerKey.choiceId?'Correct.':'Review this one.'} {q.explanation}</p>
        <p>{q.choices.find(c=>c.id===answers[q.id])?.rationale ?? 'No selection.'}</p>
        <p>Answer: {q.choices.find(c=>c.id===q.answerKey.choiceId)?.text}</p></div>}
    </fieldset>)}
    {!submitted ? <button type="button" className="btn btn-primary" disabled={Object.keys(answers).length!==meetingKanjiQuestions.length} onClick={submit}>Check my answers</button> :
      <div aria-live="polite"><p className="font-semibold">Score: {score} / {meetingKanjiQuestions.length}</p><p>{saveMessage}</p>
        <button type="button" className="btn btn-outline" onClick={()=>{setAnswers({});setSubmitted(false);setSaveMessage('');}}>Retry questions</button></div>}
    <div className="mt-8 border-t border-slate-300 pt-4 dark:border-slate-600">
      <h3 className="font-semibold">Write your meeting plan (ungraded)</h3>
      <label htmlFor="meeting-kanji-draft">Write two to four Japanese lines with a day, time and meeting place.</label>
      <textarea id="meeting-kanji-draft" rows={5} value={draft} onChange={e=>setDraft(e.target.value)} className="mt-2 w-full max-w-full rounded-lg border border-slate-400 bg-white p-3 text-slate-950 dark:bg-slate-900 dark:text-white"/>
      <button type="button" className="btn btn-outline mt-3" onClick={()=>setShowModel(v=>!v)}>{showModel?'Hide model':'Compare with model'}</button>
      {showModel&&<p lang="ja" className="mt-3">土曜日に会いませんか。いいですね。二時に学校の前で会いましょう。</p>}
      <p>This writing is self-reviewed, not graded or uploaded. Your draft stays in this page until you leave.</p>
    </div>
  </section>;
}
