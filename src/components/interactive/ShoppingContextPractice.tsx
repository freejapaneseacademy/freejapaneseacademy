import {useState} from 'react';
import bank from '../../content/exercises/n5-m04-c02-l01-v1.json';
import {recordAttempt} from '../../lib/progress';
export default function ShoppingContextPractice(){
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false);
 const [message,setMessage]=useState('');
 const questions=bank.items;
 const score=questions.filter(q=>answers[q.id]===q.answerKey.choiceId).length;
 async function submit(){setSubmitted(true);setMessage('');try{await recordAttempt('n5-m04-c02-l01-context-v1','n5',score,questions.length)}catch{setMessage('Score shown, but browser progress storage is unavailable.');}}
 function reset(){setAnswers({});setSubmitted(false);setMessage('');}
 return <section aria-labelledby="shop-quiz-title" className="foundation-practice">
 <h2 id="shop-quiz-title">Check the shopping conversation</h2><p>Choose one answer for each question. All feedback is shown after submission.</p>
 {questions.map((q,i)=><fieldset key={q.id} style={{marginBlock:'1.25rem',padding:'1rem',border:'1px solid var(--border-color, #888)',borderRadius:'.75rem',minWidth:0}}>
 <legend><strong>{i+1}. {q.prompt}</strong></legend>
 {q.choices.map(c=><label key={c.id} style={{display:'flex',alignItems:'center',gap:'.75rem',minHeight:44,padding:'.4rem 0',cursor:submitted?'default':'pointer'}}>
 <input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} disabled={submitted} onChange={()=>setAnswers(v=>({...v,[q.id]:c.id}))}/><span>{c.text}</span></label>)}
 {submitted&&<p role="status"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct.':'Review this answer.'}</strong> {q.choices.find(c=>c.id===answers[q.id])?.rationale??'No answer selected.'} {answers[q.id]!==q.answerKey.choiceId&&<>Correct answer: {q.choices.find(c=>c.id===q.answerKey.choiceId)?.text}. {q.explanation}</>}</p>}
 </fieldset>)}
 <div style={{display:'flex',flexWrap:'wrap',gap:'.75rem'}}>
 {!submitted?<button type="button" onClick={submit} disabled={Object.keys(answers).length!==questions.length}>Check answers</button>:<button type="button" onClick={reset}>Try again</button>}
 </div>{submitted&&<p role="status">Your practice result: {score} of {questions.length} correct. Review the original dialogue for evidence.</p>}{message&&<p role="alert">{message}</p>}
 </section>;
}
