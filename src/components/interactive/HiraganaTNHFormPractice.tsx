import {useState} from 'react';
import {recordAttempt} from '../../lib/progress';
import bank from '../../content/exercises/l0-m02-c02-l04-v1.json';
export default function HiraganaTNHFormPractice(){
 const items=bank.items;
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false);
 const [saving,setSaving]=useState<'idle'|'saving'|'saved'|'error'>('idle');
 const correct=(q:typeof items[number])=>q.type==='short-input'?(answers[q.id]??'').normalize('NFC').trim()===('answer' in q?q.answer:''):answers[q.id]===String('correctIndex' in q?q.correctIndex:-1);
 const complete=items.every(q=>(answers[q.id]??'').trim().length>0);
 const score=items.filter(correct).length;
 async function submit(){if(!complete||submitted)return;setSubmitted(true);setSaving('saving');try{await recordAttempt('l0-m02-c02-l04-script-v1','l0',score,items.length);setSaving('saved')}catch{setSaving('error')}}
 return <section aria-labelledby="tnh-form-title" className="space-y-5 min-w-0">
 <h2 id="tnh-form-title" className="text-2xl font-semibold">T/N/H kana typing and form workshop</h2>
 <p>Fifteen Japanese kana typing prompts and five visual comparisons. Use a Japanese IME; handwriting is optional and ungraded.</p>
 {items.map((q,i)=><fieldset key={q.id} disabled={submitted} className="min-w-0 rounded-xl border border-current/20 p-4">
 <legend className="px-1 font-semibold">{i+1}. {q.prompt}</legend>
 {q.type==='short-input'?<label className="mt-3 block"><span className="block text-sm">Japanese hiragana answer</span><input lang="ja" autoComplete="off" spellCheck={false} className="mt-2 block w-full min-w-0 rounded-lg border border-current/40 bg-transparent p-3 text-xl" value={answers[q.id]??''} onChange={e=>setAnswers(a=>({...a,[q.id]:e.target.value}))}/></label>:<div className="mt-3 space-y-2">{('options' in q?(q.options??[]):[]).map((option,j)=><label key={j} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg p-3 focus-within:outline focus-within:outline-2"><input type="radio" name={q.id} checked={answers[q.id]===String(j)} onChange={()=>setAnswers(a=>({...a,[q.id]:String(j)}))}/><span lang="ja" className="text-xl">{option}</span></label>)}</div>}
 {submitted&&<p role="status" className="mt-3"><strong>{correct(q)?'Correct.':'Review this form.'}</strong> {q.explanation} {!correct(q)&&q.type==='short-input'&&<span> Model: <span lang="ja">{'answer' in q?q.answer:''}</span>.</span>}</p>}
 </fieldset>)}
 {!submitted?<button type="button" disabled={!complete} onClick={submit} className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50">Check all 20 answers</button>:<div role="status" aria-live="polite" className="space-y-3"><p><strong>Written score: {score}/{items.length}.</strong> No pronunciation, listening or handwriting grade.</p>{saving==='saving'&&<p>Saving locally…</p>}{saving==='saved'&&<p>Attempt saved on this device.</p>}{saving==='error'&&<p>Local storage unavailable; your result remains visible.</p>}<button type="button" className="rounded-lg border border-current px-4 py-3" onClick={()=>{setAnswers({});setSubmitted(false);setSaving('idle')}}>Retry all questions</button></div>}
 </section>;
}