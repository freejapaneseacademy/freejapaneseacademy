import { useState } from 'react';
import { recordAttempt } from '../../lib/progress';
import bank from '../../content/exercises/l0-m03-c04-l07-v1.json';

export default function HiraganaSentenceWriting() {
 const questions = bank.items;
 const [answers,setAnswers] = useState<Record<string,string>>({});
 const [submitted,setSubmitted] = useState(false);
 const [saving,setSaving] = useState<'idle'|'saving'|'saved'|'error'>('idle');
 const [draft,setDraft] = useState('');
 const [review,setReview] = useState([false,false,false,false]);
 const normalize=(s:string)=>s.trim().normalize('NFC');
 const correct=(q:typeof questions[number])=>normalize(answers[q.id]??'')===normalize(q.answer);
 const complete=questions.every(q=>normalize(answers[q.id]??'').length>0);
 const score=questions.filter(correct).length;
 async function check(){if(!complete||submitted)return;setSubmitted(true);setSaving('saving');try{await recordAttempt('l0-m03-c04-l07-writing-v1','l0',score,questions.length);setSaving('saved');}catch{setSaving('error');}}
 return <section aria-labelledby="hiragana-sentence-writing" className="space-y-6 min-w-0">
 <h2 id="hiragana-sentence-writing" className="text-2xl font-semibold">Write the library words and sentences</h2><p>Eight scored typing prompts. Enter converted hiragana, not romaji. Feedback appears after submission.</p>
 {questions.map((q,i)=><div key={q.id} className="rounded-xl border border-current/20 p-4 min-w-0">
 <label htmlFor={q.id} className="mb-2 block font-semibold">{i+1}. {q.prompt}</label>
 <input id={q.id} type="text" lang="ja" autoComplete="off" spellCheck={false} disabled={submitted} value={answers[q.id]??''} onChange={e=>setAnswers(a=>({...a,[q.id]:e.target.value}))} className="block w-full min-w-0 rounded-lg border border-current/40 bg-transparent p-3 text-xl"/>
 {submitted&&<p role="status" className="mt-2"><strong>{correct(q)?'Correct.':'Review the model.'}</strong> <span lang="ja">Model: {q.answer}</span> {q.explanation}</p>}
 </div>)}
 {!submitted?<button type="button" disabled={!complete} onClick={check} className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50">Check eight answers</button>:<div role="status" aria-live="polite" className="space-y-2"><p><strong>Writing score: {score}/{questions.length}.</strong> Constrained spelling only, not a teacher or handwriting grade.</p><p>{saving==='saved'?'Attempt saved on this device.':saving==='error'?'Local storage unavailable; score remains visible.':'Saving locally…'}</p><button type="button" onClick={()=>{setAnswers({});setSubmitted(false);setSaving('idle');}} className="rounded-lg border border-current px-4 py-2">Try again</button></div>}
 <div className="rounded-xl border border-current/20 p-4 space-y-3"><h3 className="text-xl font-semibold">Optional two-line library note</h3><p>Compare with the model above. This draft stays in the current tab; it is not scored or uploaded.</p><label htmlFor="hiragana-sentence-composition" className="block font-medium">Your fictional library note</label><textarea id="hiragana-sentence-composition" lang="ja" rows={3} value={draft} onChange={e=>setDraft(e.target.value)} className="block w-full min-w-0 rounded-lg border border-current/40 bg-transparent p-3 text-xl"/><button type="button" onClick={()=>{setDraft('');setReview([false,false,false,false]);}} className="rounded-lg border border-current px-4 py-2">Clear draft</button><h4 className="font-semibold">Learner self-review (not machine graded)</h4>{['My hiragana and small kana are recognizable.','I use の to connect nouns when needed.','I distinguish topic は and object を.','My sentences end with 。 and communicate the intended meaning.'].map((label,i)=><label key={i} className="flex min-h-11 items-start gap-3 rounded-lg p-2"><input type="checkbox" className="mt-1" checked={review[i]} onChange={e=>setReview(a=>a.map((v,j)=>i===j?e.target.checked:v))}/><span>{label}</span></label>)}<p role="status">{review.filter(Boolean).length}/4 self-review criteria checked. You decide whether your draft meets them.</p></div>
 </section>;
}