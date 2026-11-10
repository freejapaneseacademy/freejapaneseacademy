import {useState} from 'react';
import bank from '../../content/exercises/n5-m04-c01-l01-v1.json';
import {recordAttempt} from '../../lib/progress';
export const QUIZ_ID='n5-m04-c01-l01-cafe-context-v1';
export const questions=bank.items;
export function scoreCafeContext(answers:Record<string,string>){return questions.reduce((sum,q)=>sum+(answers[q.id]===q.answerKey.choiceId?1:0),0);}
export default function CafeContextPractice(){
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false);
 const [saving,setSaving]=useState(false);
 const [error,setError]=useState('');
 const [draft,setDraft]=useState('');
 const [showModel,setShowModel]=useState(false);
 const answered=questions.filter(q=>answers[q.id]).length;
 async function submit(){if(saving||submitted||answered!==questions.length)return;setSaving(true);setError('');
 try{await recordAttempt(QUIZ_ID,'n5',scoreCafeContext(answers),questions.length);setSubmitted(true);}
 catch(e){setError(e instanceof Error?e.message:'Local progress unavailable');}
 finally{setSaving(false);}}
 return <section className="foundation-practice" aria-labelledby="cafe-context-heading">
 <div className="foundation-practice__header"><span className="eyebrow">CAFÉ CONTEXT CHECK</span><h2 id="cafe-context-heading">Who orders what?</h2><p>Choose one answer per question. Use Tab and arrow keys to navigate radio groups, and Space to select.</p><p aria-live="polite">{answered} of {questions.length} answered</p><div className="foundation-progress" role="progressbar" aria-label="Questions answered" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={answered}><span style={{width:(answered/questions.length*100)+'%'}}/></div></div>
 {questions.map((q,i)=><fieldset className="foundation-question" key={q.id} disabled={submitted||saving}><legend><span className="foundation-question__number">{String(i+1).padStart(2,'0')}</span>{q.prompt}</legend><div className="foundation-options">{q.choices.map(c=><label key={c.id} className={'foundation-option '+(answers[q.id]===c.id?'foundation-option--selected':'')}><input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span>{c.text}</span></label>)}</div>{submitted&&<div className="foundation-feedback" role="note"><strong>{answers[q.id]===q.answerKey.choiceId?'✓ Correct':'Review this answer'}</strong><p>{q.explanation}</p>{answers[q.id]!==q.answerKey.choiceId&&<p>{q.choices.find(c=>c.id===answers[q.id])?.rationale}</p>}</div>}</fieldset>)}
 {error&&<p role="alert" className="inline-error">{error}. Answers remain selected; try again.</p>}
 {!submitted?<button type="button" className="btn btn-primary" disabled={saving||answered!==questions.length} onClick={submit}>{saving?'Saving…':'Check answers and save score'}</button>:<div className="foundation-result" role="status"><h3>{scoreCafeContext(answers)} / {questions.length} correct</h3><p>Attempt saved locally in this browser.</p><button type="button" className="btn btn-outline" onClick={()=>{setAnswers({});setSubmitted(false);setError('');}}>Retry café context</button></div>}
 <div className="foundation-teachback"><h3>Optional writing transfer</h3><label htmlFor="cafe-context-draft">Write one food preference and one drink request for an imaginary customer.</label><textarea id="cafe-context-draft" rows={4} value={draft} onChange={e=>setDraft(e.target.value)} placeholder="パンが好きです。お茶をお願いします。"/><button type="button" className="btn btn-outline" aria-expanded={showModel} onClick={()=>setShowModel(v=>!v)}>{showModel?'Hide model':'Compare with model'}</button>{showModel&&<div className="foundation-feedback"><p lang="ja">パンが好きです。お茶をお願いします。</p><p>Check が with 好き and を with お願いします. Other appropriate answers are possible.</p></div>}</div><p className="foundation-storage-note">Writing stays in page memory, is not graded, and is not uploaded. Quiz attempts are stored locally in your browser.</p>
 </section>;
}
