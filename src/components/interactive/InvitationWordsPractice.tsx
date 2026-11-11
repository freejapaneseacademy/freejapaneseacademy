import { useState } from 'react';
import bank from '../../content/exercises/n5-m04-c04-l02-v1.json';
import { recordAttempt } from '../../lib/progress';

export function scoreInvitationWords(answers: Record<string,string>): number {
 return bank.items.filter(q => answers[q.id] === q.answerKey.choiceId).length;
}
export default function InvitationWordsPractice() {
 const [answers,setAnswers] = useState<Record<string,string>>({});
 const [submitted,setSubmitted] = useState(false);
 const [notice,setNotice] = useState('');
 const score = scoreInvitationWords(answers);
 async function check() {
  if (bank.items.some(q => !answers[q.id])) {setNotice('Choose an answer for all twelve questions first.');return;}
  setSubmitted(true);setNotice('Answers checked. Review the feedback for each question.');
  try {await recordAttempt('n5-m04-c04-l02-v1','n5',score,bank.items.length);}
  catch {setNotice('Answers checked, but this browser could not save the attempt.');}
 }
 return <section className="foundation-practice" aria-label="Invitation and meeting vocabulary practice">
 <h2>Practise planning words</h2><p>Choose one answer for each question. Your written score is separate from completion.</p>
 {bank.items.map((q,i)=><fieldset key={q.id} style={{minWidth:0,padding:'1rem',marginBlock:'1rem',border:'1px solid var(--border, #888)',borderRadius:'.75rem'}}>
 <legend><strong>{i+1}. {q.prompt}</strong></legend>
 {q.choices.map(c=><label key={c.id} style={{display:'flex',alignItems:'center',gap:'.75rem',minHeight:44,padding:'.4rem',overflowWrap:'anywhere'}}>
 <input type="radio" name={q.id} checked={answers[q.id]===c.id} disabled={submitted} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span>{c.text}</span></label>)}
 {submitted&&<p role="status"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct.':'Review:'}</strong> {q.explanation} {q.choices.find(c=>c.id===answers[q.id])?.rationale}</p>}
 </fieldset>)}
 <p aria-live="polite">{notice}</p>
 {submitted?<><p role="status">Written practice: {score} of {bank.items.length} correct. This is not a proficiency certification.</p><button type="button" onClick={()=>{setAnswers({});setSubmitted(false);setNotice('Ready to retry.');}}>Retry questions</button></>:<button type="button" onClick={check}>Check answers</button>}
 </section>;
}
