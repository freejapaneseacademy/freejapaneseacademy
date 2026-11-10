import { useState } from 'react';
import bank from '../../content/exercises/n5-m03-c04-l07-v1.json';
import { recordAttempt } from '../../lib/progress';

const DRAFT_KEY = 'n5-m03-c04-l07-draft-v1';
export function gradeFrequencyHabitWriting(answers: Record<string,string>) {
  return bank.items.filter(q => answers[q.id] === q.answerKey.choiceId).length;
}
export default function FrequencyHabitWritingWorkshop() {
  const [draft,setDraft]=useState('');
  const [saved,setSaved]=useState('');
  const [model,setModel]=useState(false);
  const [answers,setAnswers]=useState<Record<string,string>>({});
  const [submitted,setSubmitted]=useState(false);
  const [notice,setNotice]=useState('');
  const ready=bank.items.every(q=>Boolean(answers[q.id]));
  function saveDraft() { try { localStorage.setItem(DRAFT_KEY,draft);setSaved('Draft saved on this device.'); } catch {setSaved('Browser storage unavailable; copy your draft elsewhere.');} }
  function loadDraft() { try {setDraft(localStorage.getItem(DRAFT_KEY)??'');setSaved('Saved draft loaded.');}catch{setSaved('Browser storage unavailable.');} }
  function clearDraft() {try{localStorage.removeItem(DRAFT_KEY);}catch{} setDraft('');setSaved('Draft cleared on this device.');}
  async function submit() {
    if(!ready||submitted)return;
    setSubmitted(true);
    try{await recordAttempt('n5-m03-c04-l07-written-v1','n5',gradeFrequencyHabitWriting(answers),bank.items.length);setNotice('Recognition attempt saved on this device.');}
    catch{setNotice('Progress storage unavailable; you can still review answers.');}
  }
  return <section aria-label="Habit journal writing workshop" className="min-w-0 space-y-6">
    <div className="space-y-3">
      <h2 className="text-2xl font-semibold">Write your habit journal</h2>
      <label htmlFor="habit-journal-draft" className="block font-semibold">Your Japanese journal (two to five sentences)</label>
      <textarea id="habit-journal-draft" lang="ja" value={draft} onChange={e=>{setDraft(e.target.value);setSaved('');}} rows={6} className="block w-full min-w-0 rounded-lg border border-current/40 bg-transparent p-3 text-base" placeholder="毎朝、本を読みます。…" />
      <p>Writing is private to this browser. It is not submitted to a server or automatically scored.</p>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={saveDraft} className="min-h-11 rounded-lg border border-current px-4">Save draft</button>
        <button type="button" onClick={loadDraft} className="min-h-11 rounded-lg border border-current px-4">Load saved draft</button>
        <button type="button" onClick={clearDraft} className="min-h-11 rounded-lg border border-current px-4">Clear saved draft</button>
        <button type="button" aria-expanded={model} onClick={()=>setModel(v=>!v)} className="min-h-11 rounded-lg border border-current px-4">{model?'Hide model':'Show model'}</button>
      </div>
      <p role="status" aria-live="polite">{saved}</p>
      {model && <div className="rounded-xl border border-current/30 p-4"><h3 className="font-semibold">Compare with a model</h3><p lang="ja">毎朝、本を読みます。ときどき図書館へ行きます。テレビはあまり見ません。</p><p>I read a book every morning. I sometimes go to the library. I do not watch much television.</p><p>Check meaning, negative verbs, particles and connection. This model is not the only correct answer.</p></div>}
    </div>
    <h2 className="text-2xl font-semibold">Pattern recognition check</h2>
    {bank.items.map((q,i)=><fieldset key={q.id} data-question-id={q.id} disabled={submitted} className="min-w-0 rounded-xl border border-current/30 p-4">
      <legend className="font-semibold">{i+1}. {q.prompt}</legend>
      <div className="space-y-1">{q.choices.map(c=><label key={c.id} className="flex min-h-11 items-center gap-3 rounded-lg p-2 focus-within:outline focus-within:outline-2"><input type="radio" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span className="min-w-0 break-words">{c.text}</span></label>)}</div>
      {submitted && <p role="status" className="mt-2"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct. ':'Review. '}</strong>{q.explanation}</p>}
    </fieldset>)}
    {!submitted?<button type="button" disabled={!ready} onClick={submit} className="min-h-11 rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50">Check all {bank.items.length} answers</button>:<div role="status"><p>Recognition score: {gradeFrequencyHabitWriting(answers)}/{bank.items.length}. Your original writing was not graded.</p><button type="button" className="min-h-11 rounded-lg border border-current px-4 py-3" onClick={()=>{setAnswers({});setSubmitted(false);setNotice('');}}>Retry questions</button></div>}
    <p role="status" aria-live="polite">{notice}</p>
  </section>;
}