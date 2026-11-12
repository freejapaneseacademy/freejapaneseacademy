import { useState } from 'react';
import bank from '../../content/exercises/n5-m06-c03-l08-v1.json';
import { recordAttempt } from '../../lib/progress';

export const QUIZ_ID = 'n5-m06-c03-l08-speaking-prep-v1';
export const questions = bank.items;
export function scoreRequestRoleplay(answers: Record<string,string>) {
  return questions.filter(q => answers[q.id] === q.answerKey.choiceId).length;
}
const scenes = [
 {title:'Classroom display',ask:'すみません。このペンを使ってもいいですか。',reply:'はい、使ってもいいですよ。',note:'Ask permission, then grant it.'},
 {title:'Community hall',ask:'ここで写真を撮ってもいいですか。',reply:'すみません。ここで写真を撮ってはいけません。',note:'Ask permission, then state the prohibition.'}
] as const;
export default function RequestPermissionRoleplay() {
 const [scene,setScene]=useState(0);
 const [role,setRole]=useState<'ask'|'reply'>('ask');
 const [checks,setChecks]=useState<boolean[]>([false,false,false,false,false]);
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [done,setDone]=useState(false),[saving,setSaving]=useState(false),[error,setError]=useState('');
 const count=questions.filter(q=>answers[q.id]).length;
 async function submit(){
  if(done||saving||count!==questions.length)return;
  setSaving(true);setError('');
  try{await recordAttempt(QUIZ_ID,'n5',scoreRequestRoleplay(answers),questions.length);setDone(true);}
  catch(e){setError(e instanceof Error?e.message:'Browser storage unavailable');}
  finally{setSaving(false);}
 }
 return <section className="foundation-practice" aria-labelledby="request-roleplay-heading">
  <div className="foundation-practice__header"><span className="eyebrow">OPTIONAL SPEAKING</span><h2 id="request-roleplay-heading">Ask, respond and switch roles</h2><p>Choose a scene and a role. Read aloud if you wish, or rehearse silently. No microphone or pronunciation score.</p></div>
  <div className="foundation-teachback">
   <div role="group" aria-label="Choose scene">{scenes.map((s,i)=><button key={s.title} type="button" className="btn btn-outline" aria-pressed={scene===i} onClick={()=>setScene(i)}>{s.title}</button>)}</div>
   <div role="group" aria-label="Choose role"><button type="button" className="btn btn-outline" aria-pressed={role==='ask'} onClick={()=>setRole('ask')}>Visitor</button><button type="button" className="btn btn-outline" aria-pressed={role==='reply'} onClick={()=>setRole('reply')}>Helper</button></div>
   <p lang="ja" aria-live="polite">{scenes[scene][role]}</p><p>{scenes[scene].note}</p>
   <h3>Ungraded speaking self-review</h3>
   {['I formed the て-form correctly.','I distinguished requests and permission questions.','My response matches the rule.','I switched roles politely.','I noticed where the rule applies.'].map((s,i)=><label key={s} style={{display:'block',padding:'0.65rem 0'}}><input type="checkbox" checked={checks[i]} onChange={e=>setChecks(a=>a.map((x,j)=>i===j?e.target.checked:x))}/> {s}</label>)}
   <p role="status">{checks.filter(Boolean).length} of 5 self-review criteria checked. This is not a speaking grade.</p>
  </div>
  <h3>Written preparation check</h3><p>{count} of {questions.length} answered</p>
  <div className="foundation-progress" role="progressbar" aria-label="Questions answered" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={count}><span style={{width:100*count/questions.length+'%'}}/></div>
  {questions.map((q,i)=><fieldset className="foundation-question" key={q.id} disabled={done||saving}><legend><span className="foundation-question__number">{String(i+1).padStart(2,'0')}</span>{q.prompt}</legend>
    <div className="foundation-options">{q.choices.map(c=><label key={c.id} className={'foundation-option '+(answers[q.id]===c.id?'foundation-option--selected':'')}><input type="radio" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span>{c.text}</span></label>)}</div>
    {done&&<div className="foundation-feedback" role="note"><strong>{answers[q.id]===q.answerKey.choiceId?'✓ Correct':'Review'}</strong><p>{q.explanation}</p>{answers[q.id]!==q.answerKey.choiceId&&<p>{q.choices.find(c=>c.id===answers[q.id])?.rationale}</p>}</div>}
  </fieldset>)}
  {error&&<p role="alert">{error}. Your answers remain selected; retry saving.</p>}
  {!done?<button type="button" className="btn btn-primary" disabled={saving||count!==questions.length} onClick={submit}>{saving?'Saving…':'Check answers and save score'}</button>:<div className="foundation-result" role="status"><h3>{scoreRequestRoleplay(answers)} / {questions.length} correct</h3><p>Written recognition only; no speaking grade. Attempts are saved in this browser.</p><button type="button" className="btn btn-outline" onClick={()=>{setAnswers({});setDone(false);setError('');}}>Retry written check</button></div>}
  <p className="foundation-storage-note">Self-review stays in page memory. Written-check attempts are stored locally; browser storage may be cleared.</p>
 </section>;
}
