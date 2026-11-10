import {useState} from 'react';
import bank from '../../content/exercises/n5-m03-c04-l02-v1.json';
import {recordAttempt} from '../../lib/progress';
export const QUIZ_ID='n5-m03-c04-l02-frequency-words-v1';
export const questions=bank.items;
export function scoreFrequencyWords(answers:Record<string,string>){return questions.reduce((n,q)=>n+(answers[q.id]===q.answerKey.choiceId?1:0),0);}
export default function FrequencyWordsPractice(){
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false);
 const [saving,setSaving]=useState(false);
 const [error,setError]=useState('');
 const [draft,setDraft]=useState('');
 const [model,setModel]=useState(false);
 const answered=questions.filter(q=>answers[q.id]).length;
 async function submit(){if(saving||answered!==questions.length)return;setSaving(true);setError('');
 try{await recordAttempt(QUIZ_ID,'n5',scoreFrequencyWords(answers),questions.length);setSubmitted(true);}
 catch(e){setError(e instanceof Error?e.message:'Local progress unavailable');}finally{setSaving(false);}}
 return <section className="foundation-practice" aria-labelledby="frequency-words-heading">
 <div className="foundation-practice__header"><span className="eyebrow">HABIT WORDS CHECK</span><h2 id="frequency-words-heading">Choose the habit expression</h2><p>Use Tab, arrow keys and Space to select an answer for each question.</p><p aria-live="polite">{answered} of {questions.length} answered</p><div className="foundation-progress" role="progressbar" aria-label="Questions answered" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={answered}><span style={{width:(answered/questions.length*100)+'%'}}/></div></div>
 {questions.map((q,i)=><fieldset className="foundation-question" key={q.id} disabled={submitted||saving}><legend><span className="foundation-question__number">{String(i+1).padStart(2,'0')}</span>{q.prompt}</legend><div className="foundation-options">{q.choices.map(c=><label key={c.id} className={'foundation-option '+(answers[q.id]===c.id?'foundation-option--selected':'')}><input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span lang="ja">{c.text}</span></label>)}</div>{submitted&&<div className="foundation-feedback" role="note"><strong>{answers[q.id]===q.answerKey.choiceId?'✓ Correct':'Review this answer'}</strong><p>{q.explanation}</p>{answers[q.id]!==q.answerKey.choiceId&&<p>{q.choices.find(c=>c.id===answers[q.id])?.rationale}</p>}</div>}</fieldset>)}
 {error&&<p role="alert" className="inline-error">{error}. Your answers remain selected; try saving again.</p>}
 {!submitted?<button type="button" className="btn btn-primary" disabled={saving||answered!==questions.length} onClick={submit}>{saving?'Saving…':'Check answers and save score'}</button>:<div className="foundation-result" role="status"><h3>{scoreFrequencyWords(answers)} / {questions.length} correct</h3><p>Attempt saved locally in this browser.</p><button type="button" className="btn btn-outline" onClick={()=>{setAnswers({});setSubmitted(false);setError('');}}>Retry habit words</button></div>}
 <div className="foundation-teachback"><h3>Optional writing transfer</h3><label htmlFor="frequency-words-draft">Write one frequent habit and one thing a fictional student does not do much.</label><textarea id="frequency-words-draft" rows={4} value={draft} onChange={e=>setDraft(e.target.value)} placeholder="よく本を読みます。"/><button type="button" className="btn btn-outline" aria-expanded={model} onClick={()=>setModel(v=>!v)}>{model?'Hide model':'Compare with model'}</button>{model&&<div className="foundation-feedback"><p lang="ja">よく本を読みます。テレビはあまり見ません。</p><p>Check the negative verb after あまり. Other natural answers are possible.</p></div>}</div><p className="foundation-storage-note">Writing stays in page memory and is not graded or uploaded. Quiz attempts are saved locally in your browser.</p>
 </section>;
}