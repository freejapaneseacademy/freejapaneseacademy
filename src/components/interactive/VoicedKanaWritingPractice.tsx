import { useState } from 'react';
import { recordAttempt } from '../../lib/progress';
import bank from '../../content/exercises/l0-m03-c01-l07-v1.json';

export default function VoicedKanaWritingPractice(){
 const questions=bank.items;
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false);
 const [saving,setSaving]=useState<'idle'|'saving'|'saved'|'error'>('idle');
 const [draft,setDraft]=useState('');
 const [review,setReview]=useState<boolean[]>([false,false,false,false]);
 const complete=questions.every(q=>(answers[q.id]??'').trim().length>0);
 const correct=(q:typeof questions[number])=>(answers[q.id]??'').trim().normalize('NFC')===q.answer.normalize('NFC');
 const score=questions.filter(correct).length;
 async function check(){if(!complete||submitted)return;setSubmitted(true);setSaving('saving');try{await recordAttempt('l0-m03-c01-l07-written-v1','l0',score,questions.length);setSaving('saved');}catch{setSaving('error');}}
 function retry(){setAnswers({});setSubmitted(false);setSaving('idle');}
 return <section aria-labelledby="voiced-writing" className="space-y-6 min-w-0">
 <h2 id="voiced-writing" className="text-2xl font-semibold">Independent marked-kana writing</h2>
 <p>Ten written prompts. Use a Japanese keyboard. Models and explanations appear after you submit.</p>
 {questions.map((q,i)=><div key={q.id} className="rounded-xl border border-current/20 p-4 min-w-0">
 <label htmlFor={q.id} className="mb-2 block font-semibold">{i+1}. {q.prompt}</label>
 <input id={q.id} lang="ja" type="text" autoComplete="off" spellCheck={false} disabled={submitted} value={answers[q.id]??''} onChange={e=>setAnswers(prev=>({...prev,[q.id]:e.target.value}))} className="block w-full min-w-0 rounded-lg border border-current/40 bg-transparent p-3 text-xl"/>
 {submitted&&<p role="status" className="mt-2"><strong>{correct(q)?'Correct.':'Not quite.'}</strong> <span lang="ja">Model: {q.answer}</span> {q.explanation}</p>}
 </div>)}
 {!submitted?<button type="button" disabled={!complete} onClick={check} className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50">Check ten marked-kana answers</button>:<div role="status" aria-live="polite" className="space-y-2"><p><strong>Written score: {score}/{questions.length}.</strong> Exact kana spelling only; not a pronunciation or handwriting grade.</p>{saving==='saving'&&<p>Saving locally…</p>}{saving==='saved'&&<p>Attempt saved on this device.</p>}{saving==='error'&&<p>Local storage unavailable; your result remains visible.</p>}<button type="button" onClick={retry} className="rounded-lg border border-current px-4 py-2">Try the written answers again</button></div>}
 <div className="rounded-xl border border-current/20 p-4 space-y-3"><h3 className="text-xl font-semibold">Optional two-line classroom message</h3><p>Use a fictional picture card. Compare with the model in the lesson. Your draft is not scored or uploaded.</p><label htmlFor="voiced-composition" className="block font-medium">Your two-line message</label><textarea id="voiced-composition" lang="ja" rows={3} value={draft} onChange={e=>setDraft(e.target.value)} className="block w-full min-w-0 rounded-lg border border-current/40 bg-transparent p-3 text-xl"/><h4 className="font-semibold">Self-review rubric — not a machine grade</h4>{['Voiced or p-series marks match my intended words.','Each written word is complete.','The particles は and を have the intended functions.','The polite request ends in みてください。'].map((label,i)=><label key={i} className="flex items-start gap-3 rounded-lg p-2 min-h-11"><input type="checkbox" checked={review[i]} onChange={e=>setReview(prev=>prev.map((x,j)=>i===j?e.target.checked:x))} className="mt-1"/><span>{label}</span></label>)}<p role="status">{review.filter(Boolean).length}/4 self-review criteria checked. You decide whether your writing meets them.</p></div>
 </section>;
}
