import {useState} from 'react';
import bank from '../../content/exercises/n5-m06-c02-l08-v1.json';
import {recordAttempt} from '../../lib/progress';
export const QUIZ_ID='n5-m06-c02-l08-speaking-prep-v1';
export const questions=bank.items;
export function scoreTeFormRoleplay(answers:Record<string,string>){return questions.filter(q=>answers[q.id]===q.answerKey.choiceId).length;}
const scenes=[
[{a:'まず、手を洗ってください。',b:'はい。次に、何をしますか。'},{a:'野菜を洗ってから、切ってください。',b:'わかりました。'}],
[{a:'切った野菜をボウルに入れてください。',b:'はい。それから、混ぜますか。'},{a:'はい、混ぜてください。最後に、皿を並べましょう。',b:'はい、そうしましょう。'}]
];
export default function TeFormRoleplay(){
 const [scene,setScene]=useState(0),[turn,setTurn]=useState(0),[role,setRole]=useState<'a'|'b'>('a');
 const [checks,setChecks]=useState([false,false,false,false]),[answers,setAnswers]=useState<Record<string,string>>({}),[done,setDone]=useState(false),[saving,setSaving]=useState(false),[error,setError]=useState('');
 const count=questions.filter(q=>answers[q.id]).length;
 async function submit(){if(done||saving||count!==questions.length)return;setSaving(true);setError('');try{await recordAttempt(QUIZ_ID,'n5',scoreTeFormRoleplay(answers),questions.length);setDone(true);}catch(e){setError(e instanceof Error?e.message:'Local storage unavailable');}finally{setSaving(false);}}
 return <section className="foundation-practice" aria-labelledby="te-role-heading"><div className="foundation-practice__header"><span className="eyebrow">OPTIONAL SPEAKING</span><h2 id="te-role-heading">Cooking-class role rehearsal</h2><p>Original written models only. Read aloud if you wish; no microphone, audio playback or speech grade.</p></div>
 <div className="foundation-teachback"><div role="group" aria-label="Choose scene">{['Ingredients scene','Finishing scene'].map((t,i)=><button type="button" key={t} className="btn btn-outline" aria-pressed={scene===i} onClick={()=>{setScene(i);setTurn(0)}}>{t}</button>)}</div>
 <div role="group" aria-label="Choose exchange">{[0,1].map(i=><button type="button" key={i} className="btn btn-outline" aria-pressed={turn===i} onClick={()=>setTurn(i)}>Exchange {i+1}</button>)}</div>
 <div role="group" aria-label="Choose role"><button type="button" className="btn btn-outline" aria-pressed={role==='a'} onClick={()=>setRole('a')}>Leader A</button><button type="button" className="btn btn-outline" aria-pressed={role==='b'} onClick={()=>setRole('b')}>Partner B</button></div>
 <p lang="ja" aria-live="polite">{scenes[scene][turn][role]}</p>
 <h3>Ungraded self-review</h3>{['I used at least two correct te-forms.','I made a polite 〜てください request.','I used 〜てから to express the intended order.','I switched roles and kept the meaning.'].map((v,i)=><label key={v} style={{display:'block',padding:'0.5rem 0'}}><input type="checkbox" checked={checks[i]} onChange={e=>setChecks(c=>c.map((x,j)=>j===i?e.target.checked:x))}/> {v}</label>)}<p role="status">{checks.filter(Boolean).length} of 4 self-review criteria checked; not a speaking grade.</p></div>
 <h3>Written preparation check</h3><p>{count} of {questions.length} answered</p><div className="foundation-progress" role="progressbar" aria-label="Questions answered" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={count}><span style={{width:(100*count/questions.length)+'%'}}/></div>
 {questions.map((q,i)=><fieldset className="foundation-question" key={q.id} disabled={done||saving}><legend><span className="foundation-question__number">{String(i+1).padStart(2,'0')}</span>{q.prompt}</legend><div className="foundation-options">{q.choices.map(c=><label className={'foundation-option '+(answers[q.id]===c.id?'foundation-option--selected':'')} key={c.id}><input type="radio" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span>{c.text}</span></label>)}</div>{done&&<div className="foundation-feedback" role="note"><strong>{answers[q.id]===q.answerKey.choiceId?'✓ Correct':'Review'}</strong><p>{q.explanation}</p>{answers[q.id]!==q.answerKey.choiceId&&<p>{q.choices.find(c=>c.id===answers[q.id])?.rationale}</p>}</div>}</fieldset>)}
 {error&&<p role="alert">{error}. Your answers remain selected; retry saving.</p>}
 {!done?<button type="button" className="btn btn-primary" disabled={saving||count!==questions.length} onClick={submit}>{saving?'Saving…':'Check answers and save score'}</button>:<div className="foundation-result" role="status"><h3>{scoreTeFormRoleplay(answers)} / {questions.length} correct</h3><p>Written recognition only; attempts are stored locally.</p><button type="button" className="btn btn-outline" onClick={()=>{setAnswers({});setDone(false);setError('')}}>Retry written check</button></div>}
 <p className="foundation-storage-note">Role and checklist choices stay in page memory. Written quiz attempts use local browser storage.</p></section>;
}