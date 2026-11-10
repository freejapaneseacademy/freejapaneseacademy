import {useState} from 'react';
import bank from '../../content/exercises/n5-m04-c01-l04-v1.json';
import {recordAttempt} from '../../lib/progress';
export const QUIZ_ID='n5-m04-c01-l04-food-kanji-v1';
export const questions=bank.items;
export function scoreFoodKanji(answers:Record<string,string>){return questions.reduce((n,q)=>n+(answers[q.id]===q.answerKey.choiceId?1:0),0);}
export default function FoodKanjiPractice(){
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false);
 const [saving,setSaving]=useState(false);
 const [error,setError]=useState('');
 const [writing,setWriting]=useState('');
 const [showModel,setShowModel]=useState(false);
 const count=questions.filter(q=>answers[q.id]).length;
 async function submit(){if(saving||submitted||count!==questions.length)return;setSaving(true);setError('');
 try{await recordAttempt(QUIZ_ID,'n5',scoreFoodKanji(answers),questions.length);setSubmitted(true);}
 catch(e){setError(e instanceof Error?e.message:'Browser storage unavailable');}
 finally{setSaving(false);}}
 return <section className="foundation-practice" aria-labelledby="food-kanji-heading">
 <div className="foundation-practice__header"><span className="eyebrow">KANJI IN CONTEXT</span><h2 id="food-kanji-heading">Read words from the café</h2><p>Choose one answer per question. Tab to a radio group, use arrow keys to change the selection, then submit for explanations.</p><p aria-live="polite">{count} of {questions.length} answered</p><div className="foundation-progress" role="progressbar" aria-label="Questions answered" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={count}><span style={{width:(count/questions.length*100)+'%'}}/></div></div>
 {questions.map((q,i)=><fieldset key={q.id} className="foundation-question" disabled={saving||submitted}><legend><span className="foundation-question__number">{String(i+1).padStart(2,'0')}</span>{q.prompt}</legend><div className="foundation-options">{q.choices.map(c=><label key={c.id} className={'foundation-option '+(answers[q.id]===c.id?'foundation-option--selected':'')}><input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span>{c.text}</span></label>)}</div>{submitted&&<div className="foundation-feedback" role="note"><strong>{answers[q.id]===q.answerKey.choiceId?'✓ Correct':'Review this answer'}</strong><p>{q.explanation}</p>{answers[q.id]!==q.answerKey.choiceId&&<p>{q.choices.find(c=>c.id===answers[q.id])?.rationale}</p>}</div>}</fieldset>)}
 {error&&<p className="inline-error" role="alert">{error}. Your selections are preserved; retry saving.</p>}
 {!submitted?<button type="button" className="btn btn-primary" disabled={saving||count!==questions.length} onClick={submit}>{saving?'Saving…':'Check answers and save score'}</button>:<div className="foundation-result" role="status"><h3>{scoreFoodKanji(answers)} / {questions.length} correct</h3><p>Attempt saved in this browser.</p><button type="button" className="btn btn-outline" onClick={()=>{setAnswers({});setSubmitted(false);setError('');}}>Try again</button></div>}
 <div className="foundation-teachback"><h3>Optional kanji writing transfer</h3><label htmlFor="food-kanji-writing">Write one sentence about eating and one about liking a drink. Use the taught words and kana endings.</label><textarea id="food-kanji-writing" rows={4} value={writing} onChange={e=>setWriting(e.target.value)} placeholder="ご飯を食べます。水が好きです。"/><button type="button" className="btn btn-outline" aria-expanded={showModel} onClick={()=>setShowModel(v=>!v)}>{showModel?'Hide model':'Compare with model'}</button>{showModel&&<div className="foundation-feedback"><p lang="ja">ご飯を食べます。水が好きです。</p><p>Use を for eating and が for liking. Other correct sentences are possible.</p></div>}</div><p className="foundation-storage-note">Writing is not scored or uploaded. Quiz attempts are saved locally using browser storage.</p>
 </section>;
}
