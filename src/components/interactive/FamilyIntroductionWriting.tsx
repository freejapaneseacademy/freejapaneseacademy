import { useState } from 'react';
import bank from '../../content/exercises/n5-m01-c03-l07-v1.json';
import { recordAttempt } from '../../lib/progress';
const draftKey = 'n5-m01-c03-l07-composition-v1';
export function gradeFamilyWriting(answers: Record<string,string>) { return bank.items.filter(q=>answers[q.id]===q.answerKey.choiceId).length; }
export default function FamilyIntroductionWriting() {
 const [draft,setDraft]=useState('');
 const [saveNotice,setSaveNotice]=useState('');
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false);
 const [notice,setNotice]=useState('');
 const ready=bank.items.every(q=>Boolean(answers[q.id]));
 const score=gradeFamilyWriting(answers);
 function save(){try{localStorage.setItem(draftKey,draft);setSaveNotice('Draft saved on this device.');}catch{setSaveNotice('Local storage unavailable; copy your text before leaving.');}}
 function load(){try{setDraft(localStorage.getItem(draftKey)||'');setSaveNotice('Local draft loaded.');}catch{setSaveNotice('Local storage unavailable.');}}
 function clear(){setDraft('');try{localStorage.removeItem(draftKey);setSaveNotice('Local draft cleared.');}catch{setSaveNotice('Editor cleared; storage unavailable.');}}
 async function submit(){if(!ready||submitted)return;setSubmitted(true);try{await recordAttempt('n5-m01-c03-l07-recognition-v1','n5',score,bank.items.length);setNotice('Recognition attempt saved on this device.');}catch{setNotice('Attempt not saved; browser storage unavailable.');}}
 return <section className="min-w-0 space-y-6" aria-label="Family introduction writing practice">
 <div className="space-y-3 rounded-xl border border-current/20 p-4">
 <h2 className="text-2xl font-semibold">Your private family introduction</h2>
 <label htmlFor="family-writing-draft" className="block font-medium">Write 2–5 Japanese sentences about a fictional family</label>
 <textarea id="family-writing-draft" value={draft} onChange={e=>setDraft(e.target.value)} rows={7} lang="ja" className="w-full min-w-0 rounded-lg border border-current/40 bg-transparent p-3" placeholder="こちらは私の母です。\n母の名前はえみです。" />
 <p>Open-ended writing is self-reviewed, not automatically scored. Saving uses this browser only.</p>
 <div className="flex flex-wrap gap-3">
 <button type="button" onClick={save} className="rounded-lg bg-blue-700 px-4 py-3 text-white">Save draft locally</button>
 <button type="button" onClick={load} className="rounded-lg border border-current px-4 py-3">Load saved draft</button>
 <button type="button" onClick={clear} className="rounded-lg border border-current px-4 py-3">Clear draft</button>
 </div><p role="status" aria-live="polite">{saveNotice}</p></div>
 <h2 className="text-2xl font-semibold">Eight writing-language checks</h2>
 <p>Choose one answer per question. Tab to the radio buttons; arrow keys change the selection.</p>
 {bank.items.map((q,i)=><fieldset key={q.id} data-question-id={q.id} disabled={submitted} className="min-w-0 rounded-xl border border-current/20 p-4">
 <legend className="font-semibold">{i+1}. {q.prompt}</legend>
 {q.choices.map(c=><label key={c.id} className="flex min-h-11 items-start gap-3 rounded-lg p-2 focus-within:outline focus-within:outline-2">
 <input type="radio" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span className="break-words">{c.text}</span></label>)}
 {submitted&&<p role="status"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct. ':'Review. '}</strong>{q.explanation}</p>}
 </fieldset>)}
 {!submitted?<button type="button" disabled={!ready} onClick={submit} className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50">Check eight answers</button>
 :<div role="status"><p>Recognition score: {score}/8. This is not a free-writing or official JLPT score.</p><button type="button" className="rounded-lg border border-current px-4 py-3" onClick={()=>{setAnswers({});setSubmitted(false);setNotice('');}}>Retry questions</button></div>}
 <p role="status" aria-live="polite">{notice}</p></section>;
}
