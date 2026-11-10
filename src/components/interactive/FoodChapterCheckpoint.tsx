import {useState} from 'react';
import bank from '../../content/exercises/n5-m04-c01-chk-v1.json';
import {recordAttempt} from '../../lib/progress';
export const QUIZ_ID='n5-m04-c01-chk-mixed-v1';
export const scoredQuestions=bank.items.filter(q=>q.status!=='drafted');
export const listeningQuestions=bank.items.filter(q=>q.status==='drafted');
export function scoreCheckpoint(answers:Record<string,string>){return scoredQuestions.reduce((n,q)=>n+(answers[q.id]===q.answerKey.choiceId?1:0),0);}
export default function FoodChapterCheckpoint(){
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false);
 const [saving,setSaving]=useState(false);
 const [error,setError]=useState('');
 const [writing,setWriting]=useState('');
 const [showModel,setShowModel]=useState(false);
 const answered=scoredQuestions.filter(q=>answers[q.id]).length;
 async function submit(){if(saving||answered!==scoredQuestions.length)return;setSaving(true);setError('');
 try{await recordAttempt(QUIZ_ID,'n5',scoreCheckpoint(answers),scoredQuestions.length);setSubmitted(true);}
 catch(e){setError(e instanceof Error?e.message:'Local storage unavailable');}finally{setSaving(false);}}
 return <section className="foundation-practice" aria-labelledby="food-chk-heading">
 <div className="foundation-practice__header"><span className="eyebrow">CHAPTER CHECKPOINT</span><h2 id="food-chk-heading">Food and drink knowledge check</h2><p>Choose with Tab, arrow keys and Space. Submit only after all ten scored questions are answered.</p><p aria-live="polite">{answered} of {scoredQuestions.length} answered</p><div className="foundation-progress" role="progressbar" aria-label="Questions answered" aria-valuemin={0} aria-valuemax={scoredQuestions.length} aria-valuenow={answered}><span style={{width:(answered/scoredQuestions.length*100)+'%'}}/></div></div>
 {scoredQuestions.map((q,i)=><fieldset className="foundation-question" key={q.id} disabled={submitted||saving}><legend><span className="foundation-question__number">{String(i+1).padStart(2,'0')}</span>{q.prompt}</legend><div className="foundation-options">{q.choices.map(c=><label key={c.id} className={'foundation-option '+(answers[q.id]===c.id?'foundation-option--selected':'')}><input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span>{c.text}</span></label>)}</div>{submitted&&<div className="foundation-feedback" role="note"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct':'Review this item'}</strong><p>{q.explanation}</p><p>{q.choices.find(c=>c.id===answers[q.id])?.rationale}</p></div>}</fieldset>)}
 {error&&<p role="alert" className="inline-error">{error}. Your answers are retained; retry saving.</p>}
 {!submitted?<button className="btn btn-primary" type="button" disabled={saving||answered!==scoredQuestions.length} onClick={submit}>{saving?'Saving…':'Check answers and save attempt'}</button>:<div className="foundation-result" role="status"><h3>{scoreCheckpoint(answers)} / {scoredQuestions.length} correct</h3><p>Attempt saved locally in your browser.</p><button type="button" className="btn btn-outline" onClick={()=>{setAnswers({});setSubmitted(false);setError('');}}>Retry checkpoint</button></div>}
 <div className="foundation-teachback"><h3>Writing self-review (ungraded)</h3><label htmlFor="food-checkpoint-writing">Write 3–5 sentences about a fictional café visit.</label><textarea id="food-checkpoint-writing" rows={5} value={writing} onChange={e=>setWriting(e.target.value)} placeholder="私は卵が好きです。今日はパンセットを食べます。"/><button className="btn btn-outline" type="button" aria-expanded={showModel} onClick={()=>setShowModel(v=>!v)}>{showModel?'Hide model and rubric':'Compare with model and rubric'}</button>{showModel&&<div className="foundation-feedback"><p lang="ja">私は卵が好きです。魚も好きです。今日はパンセットを食べます。お茶を飲みます。</p><p>Self-check: preferences use が; eating/drinking uses を; nouns and actions match your intended meaning. Other natural answers are possible. No automatic writing grade.</p></div>}</div>
 <div className="course-notice"><h3>Listening questions are not scored yet</h3><p>{listeningQuestions.length} original L06-linked questions are drafted but unavailable for a listening grade until both real recordings, hashes, rights and playback are verified. Read the listening instructions above; do not count transcript reading as listening.</p></div>
 <p className="foundation-storage-note">Scores are saved in browser-local progress. Writing is not uploaded or scored. Completion is a separate action.</p>
 </section>;
