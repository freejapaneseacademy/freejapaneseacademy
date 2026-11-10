import {useState} from 'react';
import bank from '../../content/exercises/n5-m04-c02-l03-v1.json';
import {recordAttempt} from '../../lib/progress';
export const QUIZ_ID='n5-m04-c02-l03-shopping-grammar-v1';
export const questions=bank.items;
export function scoreShoppingGrammar(answers:Record<string,string>){return questions.reduce((n,q)=>n+(answers[q.id]===q.answerKey.choiceId?1:0),0);}
export default function ShoppingGrammarPractice(){
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false);
 const [saving,setSaving]=useState(false);
 const [error,setError]=useState('');
 const [draft,setDraft]=useState('');
 const [showModel,setShowModel]=useState(false);
 const answered=questions.filter(q=>answers[q.id]).length;
 async function submit(){if(saving||answered!==questions.length)return;setSaving(true);setError('');
 try{await recordAttempt(QUIZ_ID,'n5',scoreShoppingGrammar(answers),questions.length);setSubmitted(true);}
 catch(e){setError(e instanceof Error?e.message:'Browser storage unavailable');}finally{setSaving(false);}}
 return <section className="foundation-practice" aria-labelledby="shopping-grammar-heading">
 <div className="foundation-practice__header"><span className="eyebrow">SHOPPING GRAMMAR CHECK</span><h2 id="shopping-grammar-heading">Ask a price or make a request</h2><p>Use Tab to reach the radio groups and arrow keys to change your choice.</p><p aria-live="polite">{answered} of {questions.length} answered</p><div className="foundation-progress" role="progressbar" aria-label="Questions answered" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={answered}><span style={{width:(answered/questions.length*100)+'%'}}/></div></div>
 {questions.map((q,i)=><fieldset className="foundation-question" key={q.id} disabled={submitted||saving}><legend><span className="foundation-question__number">{String(i+1).padStart(2,'0')}</span>{q.prompt}</legend><div className="foundation-options">{q.choices.map(c=><label key={c.id} className={'foundation-option '+(answers[q.id]===c.id?'foundation-option--selected':'')}><input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span>{c.text}</span></label>)}</div>{submitted&&<div className="foundation-feedback" role="note"><strong>{answers[q.id]===q.answerKey.choiceId?'✓ Correct':'Review this answer'}</strong><p>{q.explanation}</p><p>{q.choices.find(c=>c.id===answers[q.id])?.rationale}</p></div>}</fieldset>)}
 {error&&<p role="alert" className="inline-error">{error}. Your choices are still selected; retry saving.</p>}
 {!submitted?<button type="button" className="btn btn-primary" disabled={saving||answered!==questions.length} onClick={submit}>{saving?'Saving…':'Check answers and save score'}</button>:<div className="foundation-result" role="status"><h3>{scoreShoppingGrammar(answers)} / {questions.length} correct</h3><p>Attempt saved in this browser.</p><button type="button" className="btn btn-outline" onClick={()=>{setAnswers({});setSubmitted(false);setError('');}}>Retry shopping grammar</button></div>}
 <div className="foundation-teachback"><h3>Independent writing transfer (ungraded)</h3><label htmlFor="shopping-grammar-draft">Write a price question and two polite requests for fictional stationery.</label><textarea id="shopping-grammar-draft" rows={4} value={draft} onChange={e=>setDraft(e.target.value)} placeholder="この赤いノートはいくらですか。"/><button type="button" className="btn btn-outline" aria-expanded={showModel} onClick={()=>setShowModel(v=>!v)}>{showModel?'Hide model':'Compare with model'}</button>{showModel&&<div className="foundation-feedback"><p lang="ja">この赤いノートはいくらですか。ノートを一冊ください。紙を二枚お願いします。</p><p>Self-check: いくらですか asks price; を + counter + ください／お願いします requests goods. Other natural answers are possible.</p></div>}</div><p className="foundation-storage-note">Writing stays in page memory and is not graded or uploaded. Quiz attempts use browser-local storage.</p>
 </section>;
}