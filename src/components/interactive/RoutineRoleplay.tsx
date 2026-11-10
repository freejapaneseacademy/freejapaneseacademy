import { useState } from 'react';
import bank from '../../content/exercises/n5-m03-c02-l08-v1.json';
import { recordAttempt } from '../../lib/progress';
export const QUIZ_ID='n5-m03-c02-l08-roleplay-v1';
export const questions=bank.items;
export function scoreRoleplay(answers:Record<string,string>){return questions.filter(q=>answers[q.id]===q.answerKey.choiceId).length;}
const lines=[["朝は何時に起きますか。","七時に起きます。"],["朝ごはんを食べますか。","はい、食べます。"],["学校に行きますか。","はい、八時に行きます。"],["学校で日本語を勉強しますか。","はい、勉強します。"],["夜はテレビを見ますか。","いいえ、見ません。"],["何時に寝ますか。","十一時に寝ます。"]];
export default function RoutineRoleplay(){
 const [role,setRole]=useState<'A'|'B'>('A');
 const [reveal,setReveal]=useState(false);
 const [checks,setChecks]=useState([false,false,false,false]);
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false);
 const [saving,setSaving]=useState(false);
 const [error,setError]=useState('');
 const [draft,setDraft]=useState('');
 const [model,setModel]=useState(false);
 const count=questions.filter(q=>answers[q.id]).length;
 async function submit(){if(saving||submitted||count!==questions.length)return;setSaving(true);setError('');try{await recordAttempt(QUIZ_ID,'n5',scoreRoleplay(answers),questions.length);setSubmitted(true);}catch(e){setError(e instanceof Error?e.message:'Progress storage unavailable');}finally{setSaving(false);}}
 return <section className="foundation-practice" aria-labelledby="routine-roleplay-heading">
 <div className="foundation-practice__header"><span className="eyebrow">OPTIONAL SPEAKING</span><h2 id="routine-roleplay-heading">Ask, answer, switch roles</h2><p>Rehearse the displayed lines aloud if you wish. The opposite role remains hidden until you reveal it. No microphone is used.</p><div role="group" aria-label="Choose speaking role"><button type="button" className="btn btn-outline" aria-pressed={role==='A'} onClick={()=>{setRole('A');setReveal(false);}}>Speak A</button> <button type="button" className="btn btn-outline" aria-pressed={role==='B'} onClick={()=>{setRole('B');setReveal(false);}}>Speak B</button></div></div>
 <div className="foundation-teachback"><h3>Rehearsal cards</h3><ol>{lines.map((line,i)=><li key={i}><strong>Role {role}:</strong> <span lang="ja">{line[role==='A'?0:1]}</span>{reveal&&<p lang="ja">Other role: {line[role==='A'?1:0]}</p>}</li>)}</ol><button className="btn btn-outline" type="button" aria-expanded={reveal} onClick={()=>setReveal(v=>!v)}>{reveal?'Hide other role':'Reveal other role'}</button></div>
 <div className="foundation-teachback"><h3>Ungraded speaking self-check</h3>{['My times were understandable.','I used を, に and で appropriately.','My affirmative and negative endings matched my meaning.','I used polite questions and answers.'].map((x,i)=><label key={x} style={{display:'block',marginBlock:'0.75rem'}}><input type="checkbox" checked={checks[i]} onChange={e=>setChecks(a=>a.map((v,j)=>i===j?e.target.checked:v))}/> {x}</label>)}<p aria-live="polite">{checks.filter(Boolean).length} of 4 reflections selected. This is not a speech grade.</p></div>
 <div className="foundation-practice__header"><h2>Written preparation: eight questions</h2><p>Use evidence from the printed dialogue and explanations.</p><p aria-live="polite">{count} of {questions.length} answered</p><div className="foundation-progress" role="progressbar" aria-label="Questions answered" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={count}><span style={{width:count/questions.length*100+'%'}}/></div></div>
 {questions.map((q,i)=><fieldset key={q.id} className="foundation-question" disabled={submitted||saving}><legend><span className="foundation-question__number">{String(i+1).padStart(2,'0')}</span>{q.prompt}</legend><div className="foundation-options">{q.choices.map(c=><label key={c.id} className={'foundation-option '+(answers[q.id]===c.id?'foundation-option--selected':'')}><input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span>{c.text}</span></label>)}</div>{submitted&&<div className="foundation-feedback" role="note"><strong>{answers[q.id]===q.answerKey.choiceId?'✓ Correct':'Review this answer'}</strong><p>{q.explanation}</p>{answers[q.id]!==q.answerKey.choiceId&&<p>{q.choices.find(c=>c.id===answers[q.id])?.rationale}</p>}</div>}</fieldset>)}
 {error&&<p role="alert" className="inline-error">{error}. Your choices remain selected; retry saving.</p>}
 {!submitted?<button type="button" className="btn btn-primary" disabled={saving||count!==questions.length} onClick={submit}>{saving?'Saving…':'Check answers and save score'}</button>:<div className="foundation-result" role="status"><h3>{scoreRoleplay(answers)} / {questions.length} correct</h3><p>Written recognition score saved in your browser.</p><button className="btn btn-outline" type="button" onClick={()=>{setAnswers({});setSubmitted(false);setError('');}}>Retry written check</button></div>}
 <div className="foundation-teachback"><h3>Optional typed exchange</h3><label htmlFor="routine-roleplay-draft">Write a new polite question and answer about your invented day.</label><textarea id="routine-roleplay-draft" rows={4} value={draft} onChange={e=>setDraft(e.target.value)} placeholder="朝は何時に起きますか。…" /><button type="button" className="btn btn-outline" aria-expanded={model} onClick={()=>setModel(v=>!v)}>{model?'Hide model':'Compare with model'}</button>{model&&<p className="foundation-feedback" lang="ja">朝は何時に起きますか。六時半に起きます。朝ごはんを食べますか。はい、食べます。</p>}</div><p className="foundation-storage-note">Typing and speaking self-checks are not graded or saved. Written quiz attempts use browser-local progress only.</p>
 </section>;
}
