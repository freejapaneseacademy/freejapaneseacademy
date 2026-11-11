import { useEffect, useState } from 'react';
import bank from '../../content/exercises/n5-m06-c01-l07-v1.json';
import { recordAttempt } from '../../lib/progress';

export const scoreVerbWriting = (answers: Record<string,string>) => bank.items.filter(q => answers[q.id] === q.answerKey.choiceId).length;
const storageKey = 'n5-m06-c01-l07-draft-v1';
const rubric = [
  'I wrote two to five connected sentences about one fictional plan.',
  'I used three action verbs with consistent polite endings.',
  'I checked particles for objects, times and places.',
  'I identified Group 1 and Group 2 dictionary-form pairs.',
  'I checked the irregular 来る → 来ます and Group 2 食べる → 食べます.'
];
export default function VerbWritingWorkshop() {
  const [ready,setReady] = useState(false);
  const [draft,setDraft] = useState('');
  const [showModel,setShowModel] = useState(false);
  const [checks,setChecks] = useState<boolean[]>(rubric.map(()=>false));
  const [answers,setAnswers] = useState<Record<string,string>>({});
  const [submitted,setSubmitted] = useState(false);
  const [notice,setNotice] = useState('');
  useEffect(()=>setReady(true),[]);
  function save(){try{localStorage.setItem(storageKey,draft);setNotice('Draft saved on this device.');}catch{setNotice('Storage unavailable. Copy your draft to keep it.');}}
  function load(){try{setDraft(localStorage.getItem(storageKey)||'');setNotice('Draft loaded.');}catch{setNotice('Storage unavailable.');}}
  function clear(){try{localStorage.removeItem(storageKey);}catch{}setDraft('');setChecks(rubric.map(()=>false));setNotice('Draft cleared.');}
  async function submit(){if(!ready||submitted||bank.items.some(q=>!answers[q.id]))return;setSubmitted(true);try{await recordAttempt('n5-m06-c01-l07-written-v1','n5',scoreVerbWriting(answers),bank.items.length);setNotice('Recognition attempt saved locally.');}catch{setNotice('Progress storage unavailable; result remains visible.');}}
  return <section aria-label="Action verb writing workshop" className="min-w-0 space-y-6">
    <div className="space-y-3"><h2 className="text-2xl font-semibold">Write your action plan</h2><p>Compose two to five connected Japanese sentences. Free writing is self-reviewed, not automatically graded.</p>
      <label htmlFor="verb-writing-draft" className="block font-semibold">Your Japanese draft</label>
      <textarea id="verb-writing-draft" lang="ja" rows={6} disabled={!ready} value={draft} onChange={e=>setDraft(e.target.value)} placeholder="月曜日に本を読みます。" className="w-full min-w-0 rounded-lg border border-current/30 bg-transparent p-3"/>
      <div className="flex flex-wrap gap-2">
        <button type="button" disabled={!ready} onClick={save} className="min-h-11 rounded-lg border border-current px-3 py-2">Save draft</button>
        <button type="button" disabled={!ready} onClick={load} className="min-h-11 rounded-lg border border-current px-3 py-2">Load draft</button>
        <button type="button" disabled={!ready} onClick={clear} className="min-h-11 rounded-lg border border-current px-3 py-2">Clear draft</button>
        <button type="button" disabled={!ready} aria-expanded={showModel} onClick={()=>setShowModel(v=>!v)} className="min-h-11 rounded-lg border border-current px-3 py-2">{showModel?'Hide model':'Compare model'}</button>
      </div>
      {showModel&&<div className="rounded-lg border border-current/30 p-3"><h3 className="font-semibold">One possible model</h3><p lang="ja">月曜日の午後四時に家に帰ります。家で本を読みます。五時に日本語を書きます。夜に音楽を聞きます。</p><p>A coherent polite plan; other correct sentences are possible.</p></div>}
      <fieldset className="rounded-lg border border-current/30 p-3"><legend className="font-semibold">Five-criterion self-review (ungraded)</legend>{rubric.map((criterion,i)=><label key={criterion} className="flex min-h-11 items-start gap-3 py-2"><input type="checkbox" disabled={!ready} checked={checks[i]} onChange={e=>setChecks(v=>v.map((x,j)=>i===j?e.target.checked:x))}/><span>{criterion}</span></label>)}<p role="status">{checks.filter(Boolean).length}/5 criteria checked by you.</p></fieldset>
    </div>
    <div className="space-y-4"><h2 className="text-2xl font-semibold">Written recognition check</h2><p>Use Tab, arrow keys and Space to select answers. Only these recognition items receive a score.</p>
      {bank.items.map((q,i)=><fieldset key={q.id} data-question-id={q.id} disabled={!ready||submitted} className="min-w-0 rounded-xl border border-current/20 p-4"><legend className="font-semibold">{i+1}. {q.prompt}</legend>{q.choices.map(c=><label key={c.id} className="flex min-h-11 items-start gap-3 rounded-lg p-2 focus-within:outline focus-within:outline-2"><input type="radio" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(v=>({...v,[q.id]:c.id}))}/><span lang="ja" className="break-words">{c.text}</span></label>)}{submitted&&<p role="status"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct. ':'Review. '}</strong>{q.choices.find(c=>c.id===answers[q.id])?.rationale}</p>}</fieldset>)}
      {!submitted?<button type="button" disabled={!ready||bank.items.some(q=>!answers[q.id])} onClick={submit} className="min-h-11 rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50">Check 8 answers</button>:<div role="status"><p>Written recognition score: {scoreVerbWriting(answers)}/8. Not an official JLPT score.</p><button type="button" onClick={()=>{setSubmitted(false);setAnswers({});}} className="min-h-11 rounded-lg border border-current px-4 py-2">Retry questions</button></div>}
      <p role="status" aria-live="polite">{notice}</p>
    </div>
  </section>;
}
