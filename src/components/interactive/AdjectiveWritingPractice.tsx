import {useState} from 'react';
import bank from '../../content/exercises/n5-m04-c03-l07-v1.json';
import {recordAttempt} from '../../lib/progress';

export const QUIZ_ID='n5-m04-c03-l07-adjective-writing-v1';
export const questions=bank.items;
export function scoreAdjectiveWriting(answers:Record<string,string>){
 return questions.reduce((total,q)=>total+(answers[q.id]===q.answerKey.choiceId?1:0),0);
}
const MODEL='このカフェはしずかです。\nケーキはおいしいです。\nでも、ケーキは大きくないです。\nあの新しいかばんは高いです。';
const RUBRIC=[
 'My draft has 2–5 connected Japanese sentences.',
 'I used an い-adjective correctly before a noun or with です.',
 'I used a な-adjective correctly (な before a noun, no な before です).',
 'I wrote at least one understandable polite negative.',
 'I described food and a place or object clearly.'
];
export default function AdjectiveWritingPractice(){
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false);
 const [saving,setSaving]=useState(false);
 const [error,setError]=useState('');
 const [draft,setDraft]=useState('');
 const [model,setModel]=useState(false);
 const [checks,setChecks]=useState<boolean[]>(RUBRIC.map(()=>false));
 const answered=questions.filter(q=>answers[q.id]).length;
 async function submit(){
  if(saving||submitted||answered!==questions.length)return;
  setSaving(true);setError('');
  try{await recordAttempt(QUIZ_ID,'n5',scoreAdjectiveWriting(answers),questions.length);setSubmitted(true);}
  catch(e){setError(e instanceof Error?e.message:'Progress storage unavailable');}
  finally{setSaving(false);}
 }
 return <section className="foundation-practice" aria-labelledby="adjective-writing-heading">
  <div className="foundation-practice__header">
   <span className="eyebrow">CONTROLLED SENTENCE CHECK</span>
   <h2 id="adjective-writing-heading">Choose natural Japanese descriptions</h2>
   <p>Use Tab and arrow keys to choose. Only these controlled choices receive a score; your free writing is self-reviewed.</p>
   <p aria-live="polite">{answered} of {questions.length} answered</p>
   <div className="foundation-progress" role="progressbar" aria-label="Questions answered" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={answered}><span style={{width:(100*answered/questions.length)+'%'}}/></div>
  </div>
  {questions.map((q,i)=><fieldset className="foundation-question" key={q.id} disabled={submitted||saving}>
   <legend><span className="foundation-question__number">{String(i+1).padStart(2,'0')}</span>{q.prompt}</legend>
   <div className="foundation-options">{q.choices.map(c=><label key={c.id} className={'foundation-option '+(answers[q.id]===c.id?'foundation-option--selected':'')}>
    <input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(v=>({...v,[q.id]:c.id}))}/><span lang="ja">{c.text}</span>
   </label>)}</div>
   {submitted&&<div className="foundation-feedback" role="note"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct':'Review this answer'}</strong>
    <p>{q.choices.find(c=>c.id===answers[q.id])?.rationale}</p><p>{q.explanation}</p></div>}
  </fieldset>)}
  {error&&<p role="alert" className="inline-error">{error}. Your choices remain available; try again.</p>}
  {!submitted?<button className="btn btn-primary" type="button" disabled={saving||answered!==questions.length} onClick={submit}>{saving?'Saving…':'Check answers and save score'}</button>:
   <div className="foundation-result" role="status"><h3>{scoreAdjectiveWriting(answers)} / {questions.length} correct</h3>
    <p>Controlled quiz attempt saved to this browser.</p><button className="btn btn-outline" type="button" onClick={()=>{setAnswers({});setSubmitted(false);setError('');}}>Retry sentence check</button></div>}
  <div className="foundation-teachback">
   <h3>Your own mini review</h3>
   <label htmlFor="adjective-writing-draft">Write 2–5 connected Japanese sentences about the fictional café and gift corner.</label>
   <textarea id="adjective-writing-draft" lang="ja" rows={7} value={draft} onChange={e=>setDraft(e.target.value)} placeholder="このカフェはしずかです。"/>
   <p>Your draft is kept in page memory only. Copy it elsewhere if you want to keep it after leaving this page.</p>
   <button type="button" className="btn btn-outline" aria-expanded={model} onClick={()=>setModel(v=>!v)}>{model?'Hide model and self-review':'Show model and self-review'}</button>
   {model&&<div className="foundation-feedback"><h4>One possible model</h4><p lang="ja" style={{whiteSpace:'pre-wrap'}}>{MODEL}</p>
    <p>Different natural sentences are welcome. Tick criteria after checking your own writing; no automatic grade is given.</p>
    {RUBRIC.map((s,i)=><label key={s} style={{display:'block',padding:'0.45rem 0'}}><input type="checkbox" checked={checks[i]} onChange={e=>setChecks(v=>v.map((x,j)=>i===j?e.target.checked:x))}/> {s}</label>)}
    <p>{checks.filter(Boolean).length} of 5 self-review criteria checked. Revise at least one sentence above.</p>
   </div>}
   <button type="button" className="btn btn-outline" onClick={()=>{setDraft('');setChecks(RUBRIC.map(()=>false));setModel(false);}}>Clear my draft</button>
  </div>
  <p className="foundation-storage-note">Only controlled quiz attempts are stored locally in progress storage. Free writing is neither uploaded nor scored.</p>
 </section>;
