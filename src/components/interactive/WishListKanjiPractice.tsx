import { useState } from 'react';
import bank from '../../content/exercises/n5-m07-c02-l04-v1.json';
import { recordAttempt } from '../../lib/progress';
type Answers=Record<string,string>;
export function gradeWishKanji(answers:Answers):number { return bank.items.filter(q=>answers[q.id]===q.answerKey.choiceId).length; }
export default function WishListKanjiPractice(){
 const [answers,setAnswers]=useState<Answers>({});
 const [submitted,setSubmitted]=useState(false);
 const [storage,setStorage]=useState('');
 const score=gradeWishKanji(answers);
 async function check(){setSubmitted(true);try{await recordAttempt('quiz-n5-m07-c02-l04-v1','n5',score,bank.items.length);setStorage('Attempt saved in this browser.');}catch{setStorage('Storage unavailable; your answers are still shown.');}}
 function retry(){setAnswers({});setSubmitted(false);setStorage('');}
 return <section className="foundation-practice" aria-labelledby="wish-kanji-heading">
 <h2 id="wish-kanji-heading">Wish-list kanji recognition practice</h2><p>Choose one answer per question. Unanswered questions count as incorrect. Use Tab, arrow keys or touch.</p>
 {bank.items.map((q,i)=><fieldset key={q.id} data-question-id={q.id} style={{marginBlock:'1rem',padding:'1rem',minWidth:0,border:'1px solid currentColor',borderRadius:'0.5rem'}}>
 <legend><strong>{i+1}. {q.prompt}</strong></legend><div style={{display:'grid',gap:'0.5rem'}}>{q.choices.map(c=><label key={c.id} style={{display:'flex',alignItems:'center',gap:'0.7rem',minHeight:44,overflowWrap:'anywhere'}}><input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} disabled={submitted} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span>{c.text}</span></label>)}</div>
 {submitted&&<div role="status" style={{marginTop:'0.6rem'}}><strong>{answers[q.id]===q.answerKey.choiceId?'Correct.':'Review this item.'}</strong> {q.explanation}{answers[q.id]&&<p>{q.choices.find(c=>c.id===answers[q.id])?.rationale}</p>}</div>}</fieldset>)}
 {!submitted?<button type="button" className="btn btn-primary" onClick={check}>Check 8 answers</button>:<><p role="status">Written practice score: {score} / 8. {storage}</p><button type="button" className="btn btn-outline" onClick={retry}>Retry questions</button></>}
 </section>;
}