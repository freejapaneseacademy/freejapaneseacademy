import { useState } from 'react';
import bank from '../../content/exercises/n5-m01-c02-l07-v1.json';
import { recordAttempt } from '../../lib/progress';

const draftKey = 'n5-m01-c02-l07-draft-v1';
export function gradeClassroomWriting(answers: Record<string,string>) {
  return bank.items.filter(q => answers[q.id] === q.answerKey.choiceId).length;
}
export default function ClassroomQuestionWriting() {
  const [draft,setDraft] = useState('');
  const [saved,setSaved] = useState('');
  const [checks,setChecks] = useState<boolean[]>([false,false,false,false]);
  const [answers,setAnswers] = useState<Record<string,string>>({});
  const [submitted,setSubmitted] = useState(false);
  const [notice,setNotice] = useState('');
  const ready = bank.items.every(q => Boolean(answers[q.id]));
  function saveDraft() {try {localStorage.setItem(draftKey,draft);setSaved('Draft saved only on this device.');} catch {setSaved('Storage unavailable. Copy your draft before leaving.');}}
  function restoreDraft() {try {setDraft(localStorage.getItem(draftKey) ?? '');setSaved('Local draft loaded.');} catch {setSaved('Storage unavailable.');}}
  function clearDraft() {try {localStorage.removeItem(draftKey);} catch {} setDraft('');setChecks([false,false,false,false]);setSaved('Draft cleared from this editor.');}
  async function submit() {
    if(!ready || submitted) return;
    setSubmitted(true);
    try {await recordAttempt('n5-m01-c02-l07-written-v1','n5',gradeClassroomWriting(answers),bank.items.length);setNotice('Recognition attempt saved on this device.');}
    catch {setNotice('Storage unavailable; your result remains visible.');}
  }
  return <section className="min-w-0 space-y-6" aria-label="Classroom question writing practice">
    <div className="space-y-3">
      <h2 className="text-2xl font-semibold">Your fictional classroom dialogue</h2>
      <label htmlFor="n5-classroom-writing-draft" className="block font-semibold">Write two to five connected Japanese sentences</label>
      <textarea id="n5-classroom-writing-draft" lang="ja" rows={6} value={draft} onChange={e=>setDraft(e.target.value)} className="block w-full min-w-0 rounded-lg border border-current/40 bg-transparent p-3" placeholder="あの人はだれですか。田中先生です。" />
      <p>Japanese IME and mobile keyboards are supported. Nothing is sent to a server. Free composition is not automatically graded.</p>
      <div className="flex flex-wrap gap-2"><button type="button" onClick={saveDraft} className="rounded-lg border border-current px-4 py-3">Save draft locally</button><button type="button" onClick={restoreDraft} className="rounded-lg border border-current px-4 py-3">Load saved draft</button><button type="button" onClick={clearDraft} className="rounded-lg border border-current px-4 py-3">Clear draft</button></div>
      <p role="status" aria-live="polite">{saved}</p>
      <h3 className="text-xl font-semibold">Model for comparison</h3>
      <details className="rounded-lg border border-current/30 p-3"><summary className="cursor-pointer font-semibold">Reveal model and meaning</summary><p lang="ja">あの人はだれですか。田中先生です。教室はどこですか。あそこです。</p><p>Who is that person? Teacher Tanaka. Where is the classroom? Over there.</p><p>Other coherent fictional classroom dialogues are valid.</p></details>
      <fieldset className="space-y-2"><legend className="font-semibold">Learner self-review — not teacher grading</legend>
      {['I wrote two to five connected sentences in a clear fictional situation.','Each question word fits person, thing, place or choice.','Each answer responds to the question.','I used です, か and any も deliberately.'].map((label,i)=><label key={label} className="flex min-h-11 items-center gap-3"><input type="checkbox" checked={checks[i]} onChange={e=>setChecks(c=>c.map((v,j)=>i===j?e.target.checked:v))}/><span>{label}</span></label>)}</fieldset>
    </div>
    <h2 className="text-2xl font-semibold">Ten written recognition checks</h2>
    {bank.items.map((q,i)=><fieldset key={q.id} data-question-id={q.id} disabled={submitted} className="min-w-0 rounded-xl border border-current/20 p-4">
      <legend className="font-semibold">{i+1}. {q.prompt}</legend>
      {q.choices.map(c=><label key={c.id} className="flex min-h-11 items-center gap-3 rounded-lg p-2 focus-within:outline focus-within:outline-2"><input type="radio" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span className="break-words">{c.text}</span></label>)}
      {submitted && <div role="status"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct. ':'Review. '}</strong>{q.explanation}<p>{q.choices.find(c=>c.id===answers[q.id])?.rationale}</p></div>}
    </fieldset>)}
    {!submitted?<button type="button" disabled={!ready} onClick={submit} className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50">Check 10 answers</button>:<div role="status"><p>Written recognition score: {gradeClassroomWriting(answers)}/{bank.items.length}. Not an official JLPT score; your free writing is ungraded.</p><button type="button" className="rounded-lg border border-current px-4 py-3" onClick={()=>{setAnswers({});setSubmitted(false);setNotice('');}}>Retry questions</button></div>}
    <p role="status" aria-live="polite">{notice}</p>
  </section>;
}
