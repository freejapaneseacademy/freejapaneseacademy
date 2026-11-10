import { useState } from 'react';
import bank from '../../content/exercises/n5-m02-c04-l04-v1.json';
import { recordAttempt } from '../../lib/progress';
export const QUIZ_ID='n5-m02-c04-l04-kanji-v1';
export const questions=bank.items;
export function scoreRoomKanji(answers:Record<string,string>){return questions.filter(q=>answers[q.id]===q.answerKey.choiceId).length;}
export default function RoomKanjiPractice(){
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false);
 const [saving,setSaving]=useState(false);
 const [storageWarning,setStorageWarning]=useState('');
 const answered=questions.filter(q=>answers[q.id]).length;
 async function submit(){
  if(saving||submitted||answered!==questions.length)return;
  setSaving(true);setStorageWarning('');
  try{await recordAttempt(QUIZ_ID,'n5',scoreRoomKanji(answers),questions.length);}
  catch{setStorageWarning('Browser storage was unavailable; you can still review your answers, but this attempt was not saved.');}
  finally{setSubmitted(true);setSaving(false);}
 }
 return <section className="foundation-practice" aria-labelledby="room-kanji-practice">
 <div className="foundation-practice__header"><span className="eyebrow">ROOM KANJI CHECK</span><h2 id="room-kanji-practice">Read the room signs</h2><p>Choose one answer for each written question.</p><p aria-live="polite">{answered} of {questions.length} answered</p><div className="foundation-progress" role="progressbar" aria-label="Questions answered" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={answered}><span style={{width:(answered/questions.length*100)+'%'}}/></div></div>
 {questions.map((q,i)=><fieldset className="foundation-question" key={q.id} disabled={submitted||saving}><legend><span className="foundation-question__number">{String(i+1).padStart(2,'0')}</span>{q.prompt}</legend><div className="foundation-options">{q.choices.map(c=><label key={c.id} className={'foundation-option '+(answers[q.id]===c.id?'foundation-option--selected':'')}><input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(prev=>({...prev,[q.id]:c.id}))}/><span>{c.text}</span></label>)}</div>{submitted&&<div className="foundation-feedback" role="note"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct':'Review this answer'}</strong><p>{q.explanation}</p>{answers[q.id]!==q.answerKey.choiceId&&<p>{q.choices.find(c=>c.id===answers[q.id])?.rationale}</p>}</div>}</fieldset>)}
 {storageWarning&&<p role="alert">{storageWarning}</p>}
 {!submitted?<button type="button" className="btn btn-primary" disabled={saving||answered!==questions.length} onClick={submit}>{saving?'Checking…':'Check answers'}</button>:<div className="foundation-result" role="status"><h3>{scoreRoomKanji(answers)} / {questions.length} correct</h3><p>Formative practice only; not a Japanese-language certification.</p><button type="button" className="btn btn-outline" onClick={()=>{setAnswers({});setSubmitted(false);setStorageWarning('');}}>Retry kanji check</button></div>}
 </section>;
}
