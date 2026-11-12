import { useState } from 'react';
import bank from '../../content/exercises/n5-m07-c03-l04-v1.json';
import { recordAttempt } from '../../lib/progress';
type Answers = Record<string,string>;
export function gradeChoiceKanji(answers:Answers):number {return bank.items.filter(q=>answers[q.id]===q.answerKey.choiceId).length;}
export default function ChoiceBoardKanjiPractice(){
 const [answers,setAnswers]=useState<Answers>({});
 const [submitted,setSubmitted]=useState(false);
 const [storage,setStorage]=useState('');
 const score=gradeChoiceKanji(answers);
 async function check(){setSubmitted(true);try{await recordAttempt('quiz-n5-m07-c03-l04-v1','n5',score,bank.items.length);setStorage('Attempt saved in this browser.');}catch{setStorage('Storage unavailable; answers remain visible.');}}
 function retry(){setAnswers({});setSubmitted(false);setStorage('');}
 return <section className="foundation-practice" aria-labelledby="choice-kanji-quiz"><h2 id="choice-kanji-quiz">Choice-board kanji: written check</h2><p>Select one answer per question using touch, Tab, or arrow keys. Unanswered items count as incorrect.</p>
 {bank.items.map((q,i)=><fieldset key={q.id} data-question-id={q.id} style={{minWidth:0,marginBlock:'1rem',padding:'1rem',border:'1px solid currentColor',borderRadius:'0.5rem'}}><legend><strong>{i+1}. {q.prompt}</strong></legend><div style={{display:'grid',gap:'0.5rem'}}>{q.choices.map(c=><label key={c.id} style={{display:'flex',gap:'0.75rem',alignItems:'center',minHeight:44,overflowWrap:'anywhere'}}><input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} disabled={submitted} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span>{c.text}</span></label>)}</div>{submitted&&<div role="status"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct.':'Review this item.'}</strong> {q.explanation}{answers[q.id]&&<p>{q.choices.find(c=>c.id===answers[q.id])?.rationale}</p>}</div>}</fieldset>)}
 {!submitted?<button type="button" className="btn btn-primary" onClick={check}>Check 8 answers</button>:<><p role="status">Written practice score: {score} / 8. {storage}</p><button type="button" className="btn btn-outline" onClick={retry}>Retry questions</button></>}</section>;
}