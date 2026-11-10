import { useState } from 'react';
import bank from '../../content/exercises/n5-m04-c03-l02-v1.json';
import { recordAttempt } from '../../lib/progress';
type Item = (typeof bank.items)[number];
export function scoreDescriptionAnswers(answers: Record<string,string>) {
  return bank.items.filter(q => answers[q.id] === q.answerKey.choiceId).length;
}
export default function DescriptionWordsPractice() {
  const [answers,setAnswers]=useState<Record<string,string>>({});
  const [submitted,setSubmitted]=useState(false);
  const [notice,setNotice]=useState('');
  const score=scoreDescriptionAnswers(answers);
  async function submit() {
    if (Object.keys(answers).length !== bank.items.length) { setNotice('Choose an answer for every question.'); return; }
    setSubmitted(true);
    setNotice('Answers checked. Review the explanations below.');
    try { await recordAttempt('n5-m04-c03-l02-v1','n5',score,bank.items.length); }
    catch { setNotice('Answers checked, but browser progress storage was unavailable.'); }
  }
  return <section className="foundation-practice" aria-label="Description word practice">
    <h2>Check your description words</h2><p>Choose one answer per question. Feedback appears after submission.</p>
    {bank.items.map((q:Item,i)=><fieldset key={q.id} style={{minWidth:0,marginBlock:'1rem',padding:'1rem',border:'1px solid var(--border, #888)',borderRadius:'.75rem'}}>
      <legend><strong>{i+1}. {q.prompt}</strong></legend>
      {q.choices.map(c=><label key={c.id} style={{display:'flex',alignItems:'center',gap:'.7rem',minHeight:44,padding:'.4rem',overflowWrap:'anywhere'}}>
        <input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} disabled={submitted} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span>{c.text}</span>
      </label>)}
      {submitted&&<p role="status"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct.':'Review:'}</strong> {q.explanation} {q.choices.find(c=>c.id===answers[q.id])?.rationale}</p>}
    </fieldset>)}
    <p aria-live="polite">{notice}</p>
    {submitted?<><p role="status">Written recognition: {score} of {bank.items.length} correct. Not a proficiency certification.</p><button type="button" onClick={()=>{setAnswers({});setSubmitted(false);setNotice('Ready for another attempt.');}}>Retry questions</button></>:<button type="button" onClick={submit}>Check answers</button>}
  </section>;
}
