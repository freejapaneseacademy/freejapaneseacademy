import {useState} from 'react';
import bank from '../../content/exercises/n5-m04-c03-l04-v1.json';
import {recordAttempt} from '../../lib/progress';
export const QUIZ_ID='n5-m04-c03-l04-kanji-v1';
export const questions=bank.items;
export function scoreAdjectiveKanji(answers:Record<string,string>){return questions.reduce((sum,q)=>sum+(answers[q.id]===q.answerKey.choiceId?1:0),0);}
export default function AdjectiveKanjiPractice(){
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false);
 const [saving,setSaving]=useState(false);
 const [error,setError]=useState('');
 const [draft,setDraft]=useState('');
 const [showModel,setShowModel]=useState(false);
 const count=questions.filter(q=>answers[q.id]).length;
 async function submit(){if(saving||count!==questions.length)return;setSaving(true);setError('');try{await recordAttempt(QUIZ_ID,'n5',scoreAdjectiveKanji(answers),questions.length);setSubmitted(true);}catch(e){setError(e instanceof Error?e.message:'Storage unavailable');}finally{setSaving(false);}}
 return <section className="foundation-practice" aria-labelledby="adjective-kanji-check">
  <div className="foundation-practice__header"><span className="eyebrow">KANJI IN CONTEXT</span><h2 id="adjective-kanji-check">Read and decide</h2><p>Choose one answer per question. Use Tab, arrow keys and Space.</p><p aria-live="polite">{count} of {questions.length} answered</p><div className="foundation-progress" role="progressbar" aria-label="Questions answered" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={count}><span style={{width:(count/questions.length*100)+'%'}}/></div></div>
  {questions.map((q,i)=><fieldset className="foundation-question" key={q.id} disabled={submitted||saving}><legend><span className="foundation-question__number">{String(i+1).padStart(2,'0')}</span>{q.prompt}</legend><div className="foundation-options">{q.choices.map(c=><label className={'foundation-option '+(answers[q.id]===c.id?'foundation-option--selected':'')} key={c.id}><input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span>{c.text}</span></label>)}</div>{submitted&&<div className="foundation-feedback" role="note"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct':'Review'}</strong><p>{q.explanation}</p><p>{q.choices.find(c=>c.id===answers[q.id])?.rationale}</p></div>}</fieldset>)}
  {error&&<p role="alert">{error}. Your answers remain selected; try again.</p>}
  {!submitted?<button type="button" className="btn btn-primary" disabled={saving||count!==questions.length} onClick={submit}>{saving?'Saving…':'Check answers and save score'}</button>:<div className="foundation-result" role="status"><h3>{scoreAdjectiveKanji(answers)} / {questions.length} correct</h3><p>Saved locally in this browser.</p><button type="button" className="btn btn-outline" onClick={()=>{setAnswers({});setSubmitted(false);setError('');}}>Retry kanji check</button></div>}
  <div className="foundation-teachback"><h3>Independent writing (self-reviewed)</h3><label htmlFor="adjective-kanji-writing">Describe a fictional object or place in three short Japanese sentences.</label><textarea id="adjective-kanji-writing" rows={4} value={draft} onChange={e=>setDraft(e.target.value)} placeholder="これは新しいかばんです。"/><button type="button" className="btn btn-outline" aria-expanded={showModel} onClick={()=>setShowModel(v=>!v)}>{showModel?'Hide model':'Compare with model'}</button>{showModel&&<div className="foundation-feedback"><p lang="ja">これは新しいかばんです。大きいです。でも、高いです。</p><p>Check the adjective readings, endings, and connection to the object. Many other answers are valid.</p></div>}</div>
  <p className="foundation-storage-note">Writing remains in page memory and is not scored or uploaded. Quiz scores are stored locally.</p>
 </section>;
}