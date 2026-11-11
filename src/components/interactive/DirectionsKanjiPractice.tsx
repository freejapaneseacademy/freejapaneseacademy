import { useState } from 'react';
import bank from '../../content/exercises/n5-m05-c03-l04-v1.json';
import { recordAttempt } from '../../lib/progress';
export const QUIZ_ID = 'n5-m05-c03-l04-kanji-v1';
export const questions = bank.items;
export function scoreDirectionsKanji(answers: Record<string,string>) { return questions.filter(q => answers[q.id] === q.answerKey.choiceId).length; }
export default function DirectionsKanjiPractice() {
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false);
 const [saving,setSaving]=useState(false);
 const [error,setError]=useState('');
 const [draft,setDraft]=useState('');
 const [showModel,setShowModel]=useState(false);
 const count=questions.filter(q=>Boolean(answers[q.id])).length;
 async function submit(){
  if(saving||submitted||count!==questions.length)return;
  setSaving(true);setError('');
  try{await recordAttempt(QUIZ_ID,'n5',scoreDirectionsKanji(answers),questions.length);setSubmitted(true);}
  catch(e){setError(e instanceof Error?e.message:'Progress storage unavailable');}
  finally{setSaving(false);}
 }
 return <section className="foundation-practice" aria-labelledby="directions-kanji-heading">
 <div className="foundation-practice__header"><span className="eyebrow">SCRIPT CHECK</span><h2 id="directions-kanji-heading">Read the signs and words</h2><p>Choose the written word supported by the lesson.</p><p aria-live="polite">{count} of {questions.length} answered</p><div className="foundation-progress" role="progressbar" aria-label="Questions answered" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={count}><span style={{width:(count/questions.length*100)+'%'}} /></div></div>
 {questions.map((q,i)=><fieldset key={q.id} className="foundation-question" disabled={saving||submitted}><legend><span className="foundation-question__number">{String(i+1).padStart(2,'0')}</span>{q.prompt}</legend><div className="foundation-options">{q.choices.map(c=><label key={c.id} className={'foundation-option '+(answers[q.id]===c.id?'foundation-option--selected':'')}><input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span lang="ja">{c.text}</span></label>)}</div>{submitted&&<div className="foundation-feedback" role="note"><strong>{answers[q.id]===q.answerKey.choiceId?'✓ Correct':'Review this answer'}</strong><p>{q.explanation}</p>{answers[q.id]!==q.answerKey.choiceId&&<p>{q.choices.find(c=>c.id===answers[q.id])?.rationale}</p>}</div>}</fieldset>)}
 {error&&<p role="alert" className="inline-error">{error}. Your selections are preserved; retry saving.</p>}
 {!submitted?<button type="button" className="btn btn-primary" disabled={saving||count!==questions.length} onClick={submit}>{saving?'Saving…':'Check answers and save score'}</button>:<div className="foundation-result" role="status"><h3>{scoreDirectionsKanji(answers)} / {questions.length} correct</h3><p>Attempt saved locally.</p><button type="button" className="btn btn-outline" onClick={()=>{setAnswers({});setSubmitted(false);setError('');}}>Retry script check</button></div>}
 <div className="foundation-teachback"><h3>Optional typing and writing</h3><label htmlFor="directions-kanji-draft">Write a Japanese sentence locating the library to the right of the station.</label><textarea id="directions-kanji-draft" rows={3} value={draft} onChange={e=>setDraft(e.target.value)} placeholder="図書館は…"/><button type="button" className="btn btn-outline" aria-expanded={showModel} onClick={()=>setShowModel(v=>!v)}>{showModel?'Hide model':'Compare with model'}</button>{showModel&&<p className="foundation-feedback" lang="ja">図書館は駅の右にあります。</p>}</div>
 <p className="foundation-storage-note">Written responses are ungraded and not stored; quiz attempts are saved in local learning progress.</p>
 </section>;
}