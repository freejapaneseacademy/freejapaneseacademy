import { useState } from 'react';
import bank from '../../content/exercises/n5-m02-c04-l08-v1.json';
import { recordAttempt } from '../../lib/progress';
export const QUIZ_ID = 'n5-m02-c04-l08-speaking-prep-v1';
export const questions = bank.items;
export function scoreRoomTour(answers: Record<string,string>) { return questions.filter(q => answers[q.id] === q.answerKey.choiceId).length; }
const scenes = [
 { name:'Bag and bookshelf', ask:'すみません。かばんは どこに ありますか。', reply:'机の 下に あります。', note:'Bag: an object, so あります. 下 means under.' },
 { name:'Book and cat', ask:'猫は 椅子の 前に いますか。', reply:'はい、います。机の 上に 本が あります。', note:'Cat: います; book: あります.' }
];
const criteria = ['I used の between a reference object and its position.','I placed に after the whole location phrase.','I distinguished あります for things from います for living beings.','I switched roles and kept the exchange polite.'];
export default function RoomTourRoleplay() {
 const [scene,setScene] = useState(0), [role,setRole] = useState<'ask'|'reply'>('ask');
 const [checks,setChecks] = useState<boolean[]>([false,false,false,false]);
 const [answers,setAnswers] = useState<Record<string,string>>({}), [done,setDone] = useState(false), [saving,setSaving] = useState(false), [error,setError] = useState('');
 const count = questions.filter(q => answers[q.id]).length;
 async function submit() { if(done || saving || count !== questions.length) return; setSaving(true);setError('');
  try { await recordAttempt(QUIZ_ID,'n5',scoreRoomTour(answers),questions.length);setDone(true); }
  catch(e) { setError(e instanceof Error ? e.message : 'Browser storage unavailable'); }
  finally { setSaving(false); }
 }
 return <section className="foundation-practice" aria-labelledby="room-tour-heading">
  <div className="foundation-practice__header"><span className="eyebrow">OPTIONAL SPEAKING</span><h2 id="room-tour-heading">Guide a guest around a room</h2><p>Choose a scene and a role. Read aloud only if you want; no microphone or automated pronunciation evaluation.</p></div>
  <div className="foundation-teachback">
   <div role="group" aria-label="Choose room scene">{scenes.map((s,i)=><button type="button" className="btn btn-outline" key={s.name} aria-pressed={scene===i} onClick={()=>setScene(i)}>{s.name}</button>)}</div>
   <div role="group" aria-label="Choose speaking role"><button type="button" className="btn btn-outline" aria-pressed={role==='ask'} onClick={()=>setRole('ask')}>Guest</button> <button type="button" className="btn btn-outline" aria-pressed={role==='reply'} onClick={()=>setRole('reply')}>Host</button></div>
   <p lang="ja" aria-live="polite">{scenes[scene][role]}</p><p>{scenes[scene].note}</p>
   <h3>Ungraded self-review</h3>{criteria.map((c,i)=><label key={c} style={{display:'block',padding:'0.65rem 0'}}><input type="checkbox" checked={checks[i]} onChange={e=>setChecks(a=>a.map((v,j)=>i===j?e.target.checked:v))}/> {c}</label>)}<p role="status">{checks.filter(Boolean).length} of 4 self-review criteria checked. No speaking score is assigned.</p>
  </div>
  <h3>Written preparation check</h3><p>{count} of {questions.length} answered</p>
  <div className="foundation-progress" role="progressbar" aria-label="Questions answered" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={count}><span style={{width:(100*count/questions.length)+'%'}}/></div>
  {questions.map((q,i)=><fieldset className="foundation-question" key={q.id} disabled={done||saving}><legend><span className="foundation-question__number">{String(i+1).padStart(2,'0')}</span>{q.prompt}</legend><div className="foundation-options">{q.choices.map(c=><label key={c.id} className={'foundation-option '+(answers[q.id]===c.id?'foundation-option--selected':'')}><input type="radio" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span>{c.text}</span></label>)}</div>{done&&<div className="foundation-feedback" role="note"><strong>{answers[q.id]===q.answerKey.choiceId?'✓ Correct':'Review'}</strong><p>{q.explanation}</p>{answers[q.id]!==q.answerKey.choiceId&&<p>{q.choices.find(c=>c.id===answers[q.id])?.rationale}</p>}</div>}</fieldset>)}
  {error&&<p role="alert">{error}. Your answers are retained; try saving again.</p>}
  {!done?<button type="button" className="btn btn-primary" disabled={saving||count!==questions.length} onClick={submit}>{saving?'Saving…':'Check answers and save score'}</button>:<div className="foundation-result" role="status"><h3>{scoreRoomTour(answers)} / {questions.length} correct</h3><p>Written recognition only; not a speaking grade. Attempt stored in this browser.</p><button type="button" className="btn btn-outline" onClick={()=>{setAnswers({});setDone(false);setError('');}}>Retry written check</button></div>}
  <p className="foundation-storage-note">Role and self-review choices remain in page memory; quiz attempts are saved in browser-local progress storage.</p>
 </section>;
}
