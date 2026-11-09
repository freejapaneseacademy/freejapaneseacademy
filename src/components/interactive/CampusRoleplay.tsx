import { useState } from 'react';
import bank from '../../content/exercises/n5-m02-c02-l08-v1.json';
import { recordAttempt } from '../../lib/progress';
export const QUIZ_ID = 'n5-m02-c02-l08-speaking-prep-v1';
export const questions = bank.items;
export function scoreCampusRoleplay(answers: Record<string,string>) { return questions.filter(q=>answers[q.id]===q.answerKey.choiceId).length; }
const cues = [
 {visitor:'すみません。図書室は どこですか。',attendant:'図書室は あそこです。',note:'The library is away from both speakers.'},
 {visitor:'すみません。保健室は どこですか。',attendant:'そこです。あなたの となりです。',note:'The room is beside the visitor, not the attendant.'}
];
export default function CampusRoleplay() {
 const [scene,setScene]=useState(0),[role,setRole]=useState<'visitor'|'attendant'>('visitor');
 const [checks,setChecks]=useState([false,false,false,false]);
 const [answers,setAnswers]=useState<Record<string,string>>({}),[done,setDone]=useState(false),[saving,setSaving]=useState(false),[error,setError]=useState('');
 const count=questions.filter(q=>answers[q.id]).length;
 async function submit(){if(done||saving||count!==questions.length)return;setSaving(true);setError('');try{await recordAttempt(QUIZ_ID,'n5',scoreCampusRoleplay(answers),questions.length);setDone(true);}catch(e){setError(e instanceof Error?e.message:'Storage unavailable');}finally{setSaving(false);}}
 return <section className="foundation-practice" aria-labelledby="campus-roleplay-heading">
 <div className="foundation-practice__header"><span className="eyebrow">OPTIONAL SPEAKING</span><h2 id="campus-roleplay-heading">Switch roles: where is it?</h2><p>No microphone, speech recognition or pronunciation score. Read the original models aloud at your own pace.</p></div>
 <div className="foundation-teachback">
 <div role="group" aria-label="Choose dialogue"><button type="button" className="btn btn-outline" aria-pressed={scene===0} onClick={()=>setScene(0)}>Library scene</button>{' '}<button type="button" className="btn btn-outline" aria-pressed={scene===1} onClick={()=>setScene(1)}>Health room scene</button></div>
 <div role="group" aria-label="Choose speaking role"><button type="button" className="btn btn-outline" aria-pressed={role==='visitor'} onClick={()=>setRole('visitor')}>Visitor</button>{' '}<button type="button" className="btn btn-outline" aria-pressed={role==='attendant'} onClick={()=>setRole('attendant')}>Attendant</button></div>
 <p lang="ja" aria-live="polite">{cues[scene][role]}</p><p>{cues[scene].note}</p>
 <h3>Ungraded speaking self-review</h3>{['I asked どこですか clearly.','I chose the location word for the speaker’s viewpoint.','I switched roles and adjusted my response.','I used a polite opening or closing.'].map((v,i)=><label key={v} style={{display:'block',padding:'0.6rem 0'}}><input type="checkbox" checked={checks[i]} onChange={e=>setChecks(c=>c.map((x,j)=>j===i?e.target.checked:x))}/> {v}</label>)}<p role="status">{checks.filter(Boolean).length} of 4 self-review criteria checked. No speaking grade is assigned.</p></div>
 <h3>Written preparation check</h3><p>{count} of {questions.length} answered</p><div className="foundation-progress" role="progressbar" aria-label="Questions answered" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={count}><span style={{width:(100*count/questions.length)+'%'}}/></div>
 {questions.map((q,i)=><fieldset className="foundation-question" key={q.id} disabled={done||saving}><legend><span className="foundation-question__number">{String(i+1).padStart(2,'0')}</span>{q.prompt}</legend><div className="foundation-options">{q.choices.map(c=><label className={'foundation-option '+(answers[q.id]===c.id?'foundation-option--selected':'')} key={c.id}><input type="radio" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span>{c.text}</span></label>)}</div>{done&&<div className="foundation-feedback" role="note"><strong>{answers[q.id]===q.answerKey.choiceId?'✓ Correct':'Review'}</strong><p>{q.explanation}</p>{answers[q.id]!==q.answerKey.choiceId&&<p>{q.choices.find(c=>c.id===answers[q.id])?.rationale}</p>}</div>}</fieldset>)}
 {error&&<p role="alert">{error}. Your selections are retained; retry saving.</p>}
 {!done?<button type="button" className="btn btn-primary" disabled={saving||count!==questions.length} onClick={submit}>{saving?'Saving…':'Check answers and save score'}</button>:<div className="foundation-result" role="status"><h3>{scoreCampusRoleplay(answers)} / {questions.length} correct</h3><p>This is written recognition only, not a speaking grade. Attempts are stored locally.</p><button type="button" className="btn btn-outline" onClick={()=>{setAnswers({});setDone(false);setError('');}}>Retry written check</button></div>}
 <p className="foundation-storage-note">Role and self-check choices remain in page memory; scored quiz attempts are saved in local browser storage.</p></section>;
