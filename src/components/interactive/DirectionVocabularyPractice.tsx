import { useState } from 'react';
import bank from '../../content/exercises/n5-m05-c03-l02-v1.json';
import { recordAttempt } from '../../lib/progress';
export const QUIZ_ID='n5-m05-c03-l02-vocab-v1';
export const questions=bank.items;
export function scoreDirectionVocabulary(answers:Record<string,string>){return questions.filter(q=>answers[q.id]===q.answerKey.choiceId).length;}
export default function DirectionVocabularyPractice(){
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false);
 const [saving,setSaving]=useState(false);
 const [error,setError]=useState('');
 const [draft,setDraft]=useState('');
 const [showModel,setShowModel]=useState(false);
 const count=questions.filter(q=>Boolean(answers[q.id])).length;
 async function submit(){if(saving||submitted||count!==questions.length)return;setSaving(true);setError('');try{await recordAttempt(QUIZ_ID,'n5',scoreDirectionVocabulary(answers),questions.length);setSubmitted(true);}catch(e){setError(e instanceof Error?e.message:'Progress storage unavailable');}finally{setSaving(false);}}
 return <section className="foundation-practice" aria-labelledby="direction-vocab-heading">
 <div className="foundation-practice__header"><span className="eyebrow">VOCABULARY CHECK</span><h2 id="direction-vocab-heading">Read the directions and landmarks</h2><p>Choose one answer for each of twelve written questions.</p><p aria-live="polite">{count} of {questions.length} answered</p><div className="foundation-progress" role="progressbar" aria-label="Questions answered" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={count}><span style={{width:count/questions.length*100+'%'}}/></div></div>
 {questions.map((q,i)=><fieldset className="foundation-question" key={q.id} disabled={submitted||saving}><legend><span className="foundation-question__number">{String(i+1).padStart(2,'0')}</span>{q.prompt}</legend><div className="foundation-options">{q.choices.map(c=><label key={c.id} className={'foundation-option '+(answers[q.id]===c.id?'foundation-option--selected':'')}><input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span>{c.text}</span></label>)}</div>{submitted&&<div className="foundation-feedback" role="note"><strong>{answers[q.id]===q.answerKey.choiceId?'✓ Correct':'Review this answer'}</strong><p>{q.explanation}</p>{answers[q.id]!==q.answerKey.choiceId&&<p>{q.choices.find(c=>c.id===answers[q.id])?.rationale}</p>}</div>}</fieldset>)}
 {error&&<p role="alert" className="inline-error">{error}. Your answers remain selected; retry saving.</p>}
 {!submitted?<button className="btn btn-primary" type="button" disabled={saving||count!==questions.length} onClick={submit}>{saving?'Saving…':'Check answers and save score'}</button>:<div className="foundation-result" role="status"><h3>{scoreDirectionVocabulary(answers)} / {questions.length} correct</h3><p>Saved to your local learning progress.</p><button className="btn btn-outline" type="button" onClick={()=>{setAnswers({});setSubmitted(false);setError('');}}>Retry vocabulary check</button></div>}
 <div className="foundation-teachback"><h3>Optional writing</h3><label htmlFor="direction-vocab-draft">Write one sentence locating the post office next to the bank.</label><textarea id="direction-vocab-draft" rows={3} value={draft} onChange={e=>setDraft(e.target.value)} placeholder="郵便局は…"/><button type="button" className="btn btn-outline" aria-expanded={showModel} onClick={()=>setShowModel(v=>!v)}>{showModel?'Hide model':'Compare with model'}</button>{showModel&&<p className="foundation-feedback" lang="ja">郵便局は銀行の隣にあります。</p>}</div><p className="foundation-storage-note">Free writing is not saved or automatically graded. Quiz attempts are stored locally.</p></section>;
