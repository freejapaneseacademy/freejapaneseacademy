import {useState} from 'react';
import bank from '../../content/exercises/n5-m02-c04-l02-v1.json';
import {recordAttempt} from '../../lib/progress';
export const QUIZ_ID='n5-m02-c04-l02-vocabulary-v1';
export const questions=bank.items;
export function scoreRoomVocabulary(answers:Record<string,string>){return questions.reduce((sum,q)=>sum+(answers[q.id]===q.answerKey.choiceId?1:0),0);}
export default function RoomVocabularyPractice(){
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false);
 const [saving,setSaving]=useState(false);
 const [error,setError]=useState('');
 const [draft,setDraft]=useState('');
 const [model,setModel]=useState(false);
 const answered=questions.filter(q=>answers[q.id]).length;
 async function submit(){if(answered!==questions.length||saving)return;setSaving(true);setError('');
  try{await recordAttempt(QUIZ_ID,'n5',scoreRoomVocabulary(answers),questions.length);setSubmitted(true);}
  catch(e){setError(e instanceof Error?e.message:'Local progress storage unavailable');}
  finally{setSaving(false);}
 }
 return <section className="foundation-practice" aria-labelledby="room-vocab-heading">
  <div className="foundation-practice__header"><span className="eyebrow">ROOM VOCABULARY CHECK</span><h2 id="room-vocab-heading">Furniture and positions</h2><p>Choose one answer per question. Radio buttons work with Tab, arrows and Space.</p><p aria-live="polite">{answered} of {questions.length} answered</p><div className="foundation-progress" role="progressbar" aria-label="Questions answered" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={answered}><span style={{width:(answered/questions.length*100)+'%'}}/></div></div>
  {questions.map((q,i)=><fieldset className="foundation-question" key={q.id} disabled={submitted||saving}><legend><span className="foundation-question__number">{String(i+1).padStart(2,'0')}</span>{q.prompt}</legend><div className="foundation-options">{q.choices.map(c=><label className={'foundation-option '+(answers[q.id]===c.id?'foundation-option--selected':'')} key={c.id}><input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span lang="ja">{c.text}</span></label>)}</div>{submitted&&<div className="foundation-feedback" role="note"><strong>{answers[q.id]===q.answerKey.choiceId?'✓ Correct':'Review this answer'}</strong><p>{q.explanation}</p>{answers[q.id]!==q.answerKey.choiceId&&<p>{q.choices.find(c=>c.id===answers[q.id])?.rationale}</p>}</div>}</fieldset>)}
  {error&&<p role="alert" className="inline-error">{error}. Your selections remain available; retry saving.</p>}
  {!submitted?<button type="button" className="btn btn-primary" disabled={saving||answered!==questions.length} onClick={submit}>{saving?'Saving…':'Check answers and save score'}</button>:<div className="foundation-result" role="status"><h3>{scoreRoomVocabulary(answers)} / {questions.length} correct</h3><p>Attempt saved locally in this browser.</p><button type="button" className="btn btn-outline" onClick={()=>{setAnswers({});setSubmitted(false);setError('');}}>Retry room vocabulary</button></div>}
  <div className="foundation-teachback"><h3>Optional written transfer</h3><label htmlFor="room-vocab-draft">Write three sentences describing a fictional room.</label><textarea id="room-vocab-draft" rows={4} value={draft} onChange={e=>setDraft(e.target.value)} placeholder="本は机の上にあります。"/><button type="button" className="btn btn-outline" aria-expanded={model} onClick={()=>setModel(v=>!v)}>{model?'Hide model':'Compare with model'}</button>{model&&<div className="foundation-feedback"><p lang="ja">本は机の下にあります。ベッドは本棚の隣にあります。猫はいすの前にいます。</p><p>Check landmark の, location に, and the choice of あります or います. Different natural answers are possible.</p></div>}</div><p className="foundation-storage-note">Writing stays in this page's memory and is not graded or uploaded. Quiz scores use browser-local progress storage.</p>
 </section>;
}
