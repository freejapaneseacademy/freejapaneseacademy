import { useState } from 'react';
import bank from '../../content/exercises/n5-m06-c04-l08-v1.json';
import { recordAttempt } from '../../lib/progress';
export const QUIZ_ID = 'n5-m06-c04-l08-speaking-prep-v1';
export const questions = bank.items;
export function scoreActivityRoleplay(answers: Record<string,string>) {
 return questions.filter(q => answers[q.id] === q.answerKey.choiceId).length;
}
const scenes = [
 {title:'Library',question:'今、何をしていますか。',reply:'図書館で日本語の本を読んでいます。',note:'What are you doing? — Reading a Japanese book at the library.'},
 {title:'Community kitchen',question:'田中さんは今、何をしていますか。',reply:'台所で野菜を切っています。',note:'What is Tanaka doing? — Cutting vegetables in the kitchen.'}
] as const;
export default function ActivityRoleplay() {
 const [scene,setScene]=useState(0),[role,setRole]=useState<'question'|'reply'>('question');
 const [checks,setChecks]=useState<boolean[]>([false,false,false,false,false]);
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [done,setDone]=useState(false),[saving,setSaving]=useState(false),[error,setError]=useState('');
 const count=questions.filter(q=>answers[q.id]).length;
 async function submit(){
  if(done||saving||count!==questions.length)return;
  setSaving(true);setError('');
  try{await recordAttempt(QUIZ_ID,'n5',scoreActivityRoleplay(answers),questions.length);setDone(true);}
  catch(e){setError(e instanceof Error?e.message:'Browser storage unavailable');}
  finally{setSaving(false);}
 }
 return <section className="foundation-practice" aria-labelledby="activity-roleplay-heading">
  <div className="foundation-practice__header"><span className="eyebrow">OPTIONAL SPEAKING</span><h2 id="activity-roleplay-heading">Ask and answer about ongoing activities</h2><p>Choose a scene and switch roles. Rehearse aloud or silently. No microphone or pronunciation score.</p></div>
  <div className="foundation-teachback">
   <div role="group" aria-label="Choose scene">{scenes.map((s,i)=><button key={s.title} type="button" className="btn btn-outline" aria-pressed={scene===i} onClick={()=>setScene(i)}>{s.title}</button>)}</div>
   <div role="group" aria-label="Choose role"><button type="button" className="btn btn-outline" aria-pressed={role==='question'} onClick={()=>setRole('question')}>Questioner</button><button type="button" className="btn btn-outline" aria-pressed={role==='reply'} onClick={()=>setRole('reply')}>Responder</button></div>
   <p lang="ja" aria-live="polite">{scenes[scene][role]}</p><p>{scenes[scene].note}</p>
   <h3>Ungraded speaking self-review</h3>
   {['My て-form plus います is correct.','I answered the actual question.','I used で for the action location.','I used を or と where appropriate.','I switched roles politely.'].map((s,i)=><label key={s} style={{display:'block',padding:'0.65rem 0'}}><input type="checkbox" checked={checks[i]} onChange={e=>setChecks(a=>a.map((x,j)=>i===j?e.target.checked:x))}/> {s}</label>)}
   <p role="status">{checks.filter(Boolean).length} of 5 self-review criteria checked. This is not a speaking grade.</p>
  </div>
  <h3>Written preparation check</h3><p>{count} of {questions.length} answered</p>
  <div className="foundation-progress" role="progressbar" aria-label="Questions answered" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={count}><span style={{width:100*count/questions.length+'%'}}/></div>
  {questions.map((q,i)=><fieldset className="foundation-question" key={q.id} disabled={done||saving} data-question-id={q.id}><legend><span className="foundation-question__number">{String(i+1).padStart(2,'0')}</span>{q.prompt}</legend>
   <div className="foundation-options">{q.choices.map(c=><label key={c.id} className={'foundation-option '+(answers[q.id]===c.id?'foundation-option--selected':'')}><input type="radio" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span>{c.text}</span></label>)}</div>
   {done&&<div className="foundation-feedback" role="note"><strong>{answers[q.id]===q.answerKey.choiceId?'✓ Correct':'Review'}</strong><p>{q.explanation}</p>{answers[q.id]!==q.answerKey.choiceId&&<p>{q.choices.find(c=>c.id===answers[q.id])?.rationale}</p>}</div>}
  </fieldset>)}
  {error&&<p role="alert">{error}. Answers remain selected; retry saving.</p>}
  {!done?<button type="button" className="btn btn-primary" disabled={saving||count!==questions.length} onClick={submit}>{saving?'Saving…':`Check ${questions.length} answers`}</button>:<div className="foundation-result" role="status"><h3>Written recognition score: {scoreActivityRoleplay(answers)}/{questions.length}</h3><p>Not a speaking grade. Attempts are stored locally.</p><button type="button" className="btn btn-outline" onClick={()=>{setAnswers({});setDone(false);setError('');}}>Retry questions</button></div>}
  <p className="foundation-storage-note">Self-review stays in page memory. Written attempts are saved in this browser; clearing browser data may remove them.</p>
 </section>;
}
