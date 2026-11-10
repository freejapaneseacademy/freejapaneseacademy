import {useState} from 'react';
import bank from '../../content/exercises/n5-m04-c02-l02-v1.json';
import {recordAttempt} from '../../lib/progress';
export const QUIZ_ID='n5-m04-c02-l02-shopping-words-v1';
export const questions=bank.items;
export function scoreShoppingWords(answers:Record<string,string>){return questions.reduce((n,q)=>n+(answers[q.id]===q.answerKey.choiceId?1:0),0);}
export default function ShoppingWordsPractice(){
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false);
 const [saving,setSaving]=useState(false);
 const [error,setError]=useState('');
 const [draft,setDraft]=useState('');
 const [showModel,setShowModel]=useState(false);
 const answered=questions.filter(q=>answers[q.id]).length;
 async function submit(){if(saving||answered!==questions.length)return;setSaving(true);setError('');
 try{await recordAttempt(QUIZ_ID,'n5',scoreShoppingWords(answers),questions.length);setSubmitted(true);}
 catch(e){setError(e instanceof Error?e.message:'Browser storage unavailable');}finally{setSaving(false);}}
 return <section className="foundation-practice" aria-labelledby="shopping-words-heading">
 <div className="foundation-practice__header"><span className="eyebrow">SHOPPING VOCABULARY CHECK</span><h2 id="shopping-words-heading">Read the price tags and choose</h2><p>Use Tab to reach an answer group; arrow keys change radio choices.</p><p aria-live="polite">{answered} of {questions.length} answered</p><div className="foundation-progress" role="progressbar" aria-label="Questions answered" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={answered}><span style={{width:(answered/questions.length*100)+'%'}}/></div></div>
 {questions.map((q,i)=><fieldset className="foundation-question" key={q.id} disabled={submitted||saving}><legend><span className="foundation-question__number">{String(i+1).padStart(2,'0')}</span>{q.prompt}</legend><div className="foundation-options">{q.choices.map(c=><label key={c.id} className={'foundation-option '+(answers[q.id]===c.id?'foundation-option--selected':'')}><input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span>{c.text}</span></label>)}</div>{submitted&&<div className="foundation-feedback" role="note"><strong>{answers[q.id]===q.answerKey.choiceId?'✓ Correct':'Review this answer'}</strong><p>{q.explanation}</p><p>{q.choices.find(c=>c.id===answers[q.id])?.rationale}</p></div>}</fieldset>)}
 {error&&<p role="alert" className="inline-error">{error}. Your answers remain selected; retry saving.</p>}
 {!submitted?<button type="button" className="btn btn-primary" disabled={saving||answered!==questions.length} onClick={submit}>{saving?'Saving…':'Check answers and save score'}</button>:<div className="foundation-result" role="status"><h3>{scoreShoppingWords(answers)} / {questions.length} correct</h3><p>Attempt saved locally in this browser.</p><button type="button" className="btn btn-outline" onClick={()=>{setAnswers({});setSubmitted(false);setError('');}}>Retry shopping vocabulary</button></div>}
 <div className="foundation-teachback"><h3>Optional writing transfer</h3><label htmlFor="shopping-words-draft">Write a price question and a polite item request for a fictional customer.</label><textarea id="shopping-words-draft" rows={4} value={draft} onChange={e=>setDraft(e.target.value)} placeholder="これはいくらですか。青いノートを一冊ください。"/><button type="button" className="btn btn-outline" aria-expanded={showModel} onClick={()=>setShowModel(v=>!v)}>{showModel?'Hide model':'Compare with model'}</button>{showModel&&<div className="foundation-feedback"><p lang="ja">この青いノートはいくらですか。青いノートを一冊ください。</p><p>Self-check: いくら for price, 青い before ノート, 一冊 for a bound notebook. Other answers are possible.</p></div>}</div><p className="foundation-storage-note">Writing stays in page memory, is not graded or uploaded. Quiz attempts are saved in browser-local storage.</p>
 </section>;
}
