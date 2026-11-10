import {useState} from 'react';
import bank from '../../content/exercises/n5-m03-c04-l05-v1.json';
import {recordAttempt} from '../../lib/progress';
export const QUIZ_ID='n5-m03-c04-l05-journal-reading-v1';
export const questions=bank.items;
export function scoreJournalReading(answers:Record<string,string>){return questions.reduce((n,q)=>n+(answers[q.id]===q.answerKey.choiceId?1:0),0);}
export default function JournalReadingPractice(){
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false);
 const [saving,setSaving]=useState(false);
 const [error,setError]=useState('');
 const [draft,setDraft]=useState('');
 const [model,setModel]=useState(false);
 const answered=questions.filter(q=>answers[q.id]).length;
 async function submit(){if(saving||answered!==questions.length)return;setSaving(true);setError('');
 try{await recordAttempt(QUIZ_ID,'n5',scoreJournalReading(answers),questions.length);setSubmitted(true);}
 catch(e){setError(e instanceof Error?e.message:'Browser storage unavailable');}finally{setSaving(false);}}
 return <section className="foundation-practice" aria-labelledby="journal-heading">
 <div className="foundation-practice__header"><span className="eyebrow">JOURNAL READING CHECK</span><h2 id="journal-heading">Find the evidence in Yui's journal</h2><p>Use Tab, arrow keys and Space to select answers.</p><p aria-live="polite">{answered} of {questions.length} answered</p><div className="foundation-progress" role="progressbar" aria-label="Questions answered" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={answered}><span style={{width:(answered/questions.length*100)+'%'}}/></div></div>
 {questions.map((q,i)=><fieldset className="foundation-question" key={q.id} disabled={submitted||saving}><legend><span className="foundation-question__number">{String(i+1).padStart(2,'0')}</span>{q.prompt}</legend><div className="foundation-options">{q.choices.map(c=><label key={c.id} className={'foundation-option '+(answers[q.id]===c.id?'foundation-option--selected':'')}><input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span>{c.text}</span></label>)}</div>{submitted&&<div className="foundation-feedback" role="note"><strong>{answers[q.id]===q.answerKey.choiceId?'✓ Correct':'Review this answer'}</strong><p>{q.explanation}</p>{answers[q.id]!==q.answerKey.choiceId&&<p>{q.choices.find(c=>c.id===answers[q.id])?.rationale}</p>}</div>}</fieldset>)}
 {error&&<p role="alert" className="inline-error">{error}. Choices are retained; retry saving.</p>}
 {!submitted?<button type="button" className="btn btn-primary" disabled={saving||answered!==questions.length} onClick={submit}>{saving?'Saving…':'Check answers and save score'}</button>:<div className="foundation-result" role="status"><h3>{scoreJournalReading(answers)} / {questions.length} correct</h3><p>Attempt saved locally in this browser.</p><button type="button" className="btn btn-outline" onClick={()=>{setAnswers({});setSubmitted(false);setError('');}}>Retry journal reading</button></div>}
 <div className="foundation-teachback"><h3>Optional writing transfer</h3><label htmlFor="journal-draft">Write three short sentences about a fictional student's habits.</label><textarea id="journal-draft" rows={4} value={draft} onChange={e=>setDraft(e.target.value)} placeholder="毎朝、パンを食べます。"/><button type="button" className="btn btn-outline" aria-expanded={model} onClick={()=>setModel(v=>!v)}>{model?'Hide model':'Compare with model'}</button>{model&&<div className="foundation-feedback"><p lang="ja">毎朝、パンを食べます。学校でよく勉強します。日曜日は、あまりテレビを見ません。</p><p>Self-check: frequency, verb polarity and particles. Other natural answers are possible.</p></div>}</div><p className="foundation-storage-note">Writing remains in page memory, is not graded or uploaded. Quiz attempts are stored in this browser.</p>
 </section>;
}