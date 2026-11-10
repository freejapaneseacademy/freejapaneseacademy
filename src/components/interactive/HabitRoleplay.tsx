import {useState} from 'react';
import bank from '../../content/exercises/n5-m03-c04-l08-v1.json';
import {recordAttempt} from '../../lib/progress';
export const QUIZ_ID='n5-m03-c04-l08-roleplay-v1';
export const questions=bank.items;
export const scoreRoleplay=(a:Record<string,string>)=>questions.reduce((n,q)=>n+(a[q.id]===q.answerKey.choiceId?1:0),0);
export default function HabitRoleplay(){
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false);
 const [saving,setSaving]=useState(false);
 const [error,setError]=useState('');
 const [role,setRole]=useState<'A'|'B'>('A');
 const [draft,setDraft]=useState('');
 const [showModel,setShowModel]=useState(false);
 const answered=questions.filter(q=>answers[q.id]).length;
 async function submit(){if(saving||answered!==questions.length)return;setSaving(true);setError('');try{await recordAttempt(QUIZ_ID,'n5',scoreRoleplay(answers),questions.length);setSubmitted(true);}catch(e){setError(e instanceof Error?e.message:'Storage unavailable');}finally{setSaving(false);}}
 return <section className="foundation-practice" aria-labelledby="habit-roleplay-heading">
 <div className="foundation-practice__header"><span className="eyebrow">OPTIONAL SPEAKING REHEARSAL</span><h2 id="habit-roleplay-heading">Switch roles and practise</h2><p>Choose a role, read its line aloud if you wish, then switch. No microphone or pronunciation score.</p>
 <button type="button" className="btn btn-outline" onClick={()=>setRole(r=>r==='A'?'B':'A')}>Switch role (currently {role})</button><p aria-live="polite" lang="ja">{role==='A'?'毎朝、何をしますか。':'いつも日本語を勉強します。'}</p>
 <h3>Check your understanding</h3><p>Use Tab, arrow keys and Space to choose answers.</p><p aria-live="polite">{answered} of {questions.length} answered</p><div className="foundation-progress" role="progressbar" aria-label="Questions answered" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={answered}><span style={{width:answered/questions.length*100+'%'}}/></div></div>
 {questions.map((q,i)=><fieldset className="foundation-question" key={q.id} disabled={submitted||saving}><legend><span className="foundation-question__number">{String(i+1).padStart(2,'0')}</span>{q.prompt}</legend><div className="foundation-options">{q.choices.map(c=><label key={c.id} className={'foundation-option '+(answers[q.id]===c.id?'foundation-option--selected':'')}><input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span>{c.text}</span></label>)}</div>{submitted&&<div className="foundation-feedback" role="note"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct':'Review this answer'}</strong><p>{q.explanation}</p>{answers[q.id]!==q.answerKey.choiceId&&<p>{q.choices.find(c=>c.id===answers[q.id])?.rationale}</p>}</div>}</fieldset>)}
 {error&&<p role="alert">{error}. Your choices are retained; retry saving.</p>}
 {!submitted?<button type="button" className="btn btn-primary" disabled={saving||answered!==questions.length} onClick={submit}>{saving?'Saving…':'Check answers and save score'}</button>:<div className="foundation-result" role="status"><h3>{scoreRoleplay(answers)} / {questions.length} correct</h3><p>Attempt saved in this browser.</p><button type="button" className="btn btn-outline" onClick={()=>{setAnswers({});setSubmitted(false);setError('');}}>Retry roleplay check</button></div>}
 <div className="foundation-teachback"><h3>Optional private script</h3><label htmlFor="habit-roleplay-draft">Write a short A/B exchange about habits.</label><textarea id="habit-roleplay-draft" rows={4} value={draft} onChange={e=>setDraft(e.target.value)} placeholder="A: 毎朝、何をしますか。"/><button type="button" className="btn btn-outline" aria-expanded={showModel} onClick={()=>setShowModel(v=>!v)}>{showModel?'Hide model':'Compare with model'}</button>{showModel&&<div className="foundation-feedback"><p lang="ja">A: 毎朝、何をしますか。 B: いつも日本語を勉強します。 A: コーヒーを飲みますか。 B: あまり飲みません。</p><p>Self-check question, frequency, negative polarity and natural particles. Other natural answers are possible.</p></div>}</div><p className="foundation-storage-note">Your script stays in page memory and is not graded or uploaded. Quiz attempts are stored in this browser.</p>
 </section>;
}