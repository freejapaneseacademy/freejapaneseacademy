import { useState } from 'react';
import { recordAttempt } from '../../lib/progress';
import bank from '../../content/exercises/l0-m02-c04-l04-v1.json';
export default function HiraganaFluencyTypingPractice(){
 const questions=bank.items;
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false);
 const [saving,setSaving]=useState<'idle'|'saving'|'saved'|'error'>('idle');
 const complete=questions.every(q=>(answers[q.id]??'').trim().length>0);
 const correct=(q:typeof questions[number])=>(answers[q.id]??'').trim()===q.answer;
 const score=questions.filter(correct).length;
 async function check(){if(!complete||submitted)return;setSubmitted(true);setSaving('saving');try{await recordAttempt('l0-m02-c04-l04-written-v1','l0',score,questions.length);setSaving('saved');}catch{setSaving('error');}}
 function retry(){setAnswers({});setSubmitted(false);setSaving('idle');}
 return <section aria-labelledby="hiragana-fluency-typing-practice" className="space-y-5 min-w-0">
 <h2 id="hiragana-fluency-typing-practice" className="text-2xl font-semibold">Type the picture-card labels</h2>
 <p>Ten independent kana answers. Use a Japanese IME; the model is revealed after you submit. Spaces at the beginning or end are ignored.</p>
 {questions.map((q,i)=><div key={q.id} className="rounded-xl border border-current/20 p-4 min-w-0">
 <label htmlFor={q.id} className="block font-semibold mb-2">{i+1}. {q.prompt}</label>
 <input id={q.id} lang="ja" type="text" autoComplete="off" spellCheck={false} disabled={submitted} value={answers[q.id]??''} onChange={e=>setAnswers(prev=>({...prev,[q.id]:e.target.value}))} className="block w-full min-w-0 rounded-lg border border-current/40 bg-transparent p-3 text-xl" />
 {submitted&&<p role="status" className="mt-2"><strong>{correct(q)?'Correct.':'Not quite.'}</strong> {q.explanation}</p>}</div>)}
 {!submitted?<button type="button" disabled={!complete} onClick={check} className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50">Check ten labels</button>:
 <div role="status" aria-live="polite"><p><strong>Written score: {score}/{questions.length}.</strong> This is an exact-kana label check, not a handwriting or pronunciation assessment.</p>
 {saving==='saving'&&<p>Saving locally…</p>}{saving==='saved'&&<p>Attempt saved on this device.</p>}{saving==='error'&&<p>Local storage is unavailable; your result remains visible.</p>}
 <button type="button" onClick={retry} className="rounded-lg border border-current px-4 py-2">Try the labels again</button></div>}</section>;
}