import {useState} from 'react';
import bank from '../../content/exercises/n5-m05-c03-l03-v1.json';
import {recordAttempt} from '../../lib/progress';
export function scoreDirectionGrammar(answers:Record<string,string>){return bank.items.filter(q=>answers[q.id]===q.answerKey.choiceId).length;}
export default function DirectionGrammarPractice(){
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false);
 const [notice,setNotice]=useState('');
 const score=scoreDirectionGrammar(answers);
 async function check(){
  if(bank.items.some(q=>!answers[q.id])){setNotice('Answer all ten questions before checking.');return;}
  setSubmitted(true);setNotice('Answers checked. Read the explanation for each question.');
  try{await recordAttempt('n5-m05-c03-l03-v1','n5',score,bank.items.length);}
  catch{setNotice('Answers checked, but browser progress storage was unavailable.');}
 }
 return <section className="foundation-practice" aria-label="Direction grammar quiz" style={{minWidth:0}}>
 <h2>Check your direction grammar</h2><p>Choose one answer in each group. Keyboard users can Tab to a choice and use arrow keys or Space.</p>
 {bank.items.map((q,i)=><fieldset key={q.id} style={{minWidth:0,marginBlock:'1rem',padding:'1rem',border:'1px solid var(--border, #888)',borderRadius:'.75rem'}}>
 <legend><strong>{i+1}. {q.prompt}</strong></legend>
 {q.choices.map(c=><label key={c.id} style={{display:'flex',alignItems:'center',gap:'.75rem',minHeight:44,padding:'.4rem',overflowWrap:'anywhere'}}>
 <input type="radio" name={q.id} checked={answers[q.id]===c.id} disabled={submitted} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span lang={/[ぁ-んァ-ン一-龯]/.test(c.text)?'ja':undefined}>{c.text}</span></label>)}
 {submitted&&<p role="status"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct.':'Review:'}</strong> {q.choices.find(c=>c.id===answers[q.id])?.rationale}</p>}
 </fieldset>)}
 <p aria-live="polite">{notice}</p>
 {submitted?<><p role="status">Recognition score: {score} of {bank.items.length}. This is not a speaking or writing grade.</p><button type="button" onClick={()=>{setAnswers({});setSubmitted(false);setNotice('Ready to retry.');}}>Retry questions</button></>:<button type="button" onClick={check}>Check answers</button>}
 </section>;
}
