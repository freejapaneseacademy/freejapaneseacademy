import { useState } from 'react';
import bank from '../../content/exercises/n5-m02-c03-l04-v1.json';
import { recordAttempt } from '../../lib/progress';

export const quizId = 'n5-m02-c03-l04-kanji-v1';
export function scoreClassroomKanji(answers: Record<string,string>) {
  return bank.items.filter(q => answers[q.id] === q.answerKey.choiceId).length;
}
export default function ClassroomKanjiPractice() {
  const [answers,setAnswers] = useState<Record<string,string>>({});
  const [submitted,setSubmitted] = useState(false);
  const [saving,setSaving] = useState(false);
  const [notice,setNotice] = useState('');
  const answered = bank.items.filter(q=>Boolean(answers[q.id])).length;
  async function submit() {
    if (saving || submitted || answered !== bank.items.length) return;
    setSaving(true);
    setSubmitted(true);
    try { await recordAttempt(quizId,'n5',scoreClassroomKanji(answers),bank.items.length); setNotice('Attempt saved in this browser.'); }
    catch { setNotice('Browser progress storage unavailable. Your feedback is still shown.'); }
    finally { setSaving(false); }
  }
  return <section className="foundation-practice" aria-label="Classroom kanji practice">
    <h2>Check classroom kanji</h2>
    <p>Choose one answer per question. Tab to a radio group and use arrow keys or Space to select.</p>
    <p aria-live="polite">{answered} of {bank.items.length} answered</p>
    {bank.items.map((q,i)=><fieldset key={q.id} className="foundation-question" disabled={submitted||saving}>
      <legend>{i+1}. {q.prompt}</legend>
      <div className="foundation-options">{q.choices.map(c=><label key={c.id} className="foundation-option" style={{minHeight:44}}>
        <input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/>
        <span lang={/[\u3040-\u30ff\u3400-\u9fff]/.test(c.text)?'ja':undefined}>{c.text}</span>
      </label>)}</div>
      {submitted&&<div className="foundation-feedback" role="note"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct':'Review'}</strong><p>{q.explanation}</p>{answers[q.id]!==q.answerKey.choiceId&&<p>{q.choices.find(c=>c.id===answers[q.id])?.rationale}</p>}</div>}
    </fieldset>)}
    {!submitted?<button type="button" className="btn btn-primary" disabled={saving||answered!==bank.items.length} onClick={submit}>Check answers</button>:<div role="status"><p>Written check: {scoreClassroomKanji(answers)} / {bank.items.length} correct.</p><button type="button" className="btn btn-outline" onClick={()=>{setAnswers({});setSubmitted(false);setNotice('');}}>Retry questions</button></div>}
    <p role="status" aria-live="polite">{notice}</p>
  </section>;
}
