import { useState } from 'react';
import bank from '../../content/exercises/n5-m01-c01-l07-v1.json';
import { recordAttempt } from '../../lib/progress';

const draftKey = 'n5-m01-c01-l07-draft-v1';
export function gradeFirstMeetingWriting(answers: Record<string,string>) {
  return bank.items.filter(q => answers[q.id] === q.answerKey.choiceId).length;
}
export default function FirstMeetingWritingPractice() {
  const [draft,setDraft] = useState('');
  const [saved,setSaved] = useState('');
  const [checks,setChecks] = useState<boolean[]>([false,false,false,false]);
  const [answers,setAnswers] = useState<Record<string,string>>({});
  const [submitted,setSubmitted] = useState(false);
  const [notice,setNotice] = useState('');
  const ready = bank.items.every(q => Boolean(answers[q.id]));
  function saveDraft() {
    try { localStorage.setItem(draftKey,draft);setSaved('Draft saved only on this device.'); }
    catch { setSaved('Storage unavailable. Copy your draft before leaving.'); }
  }
  function restoreDraft() {
    try { setDraft(localStorage.getItem(draftKey) ?? '');setSaved('Local draft loaded.'); }
    catch { setSaved('Storage unavailable.'); }
  }
  function clearDraft() {
    try { localStorage.removeItem(draftKey); } catch {}
    setDraft('');setChecks([false,false,false,false]);setSaved('Draft cleared from this editor.');
  }
  async function submit() {
    if(!ready || submitted) return;
    setSubmitted(true);
    try { await recordAttempt('n5-m01-c01-l07-written-v1','n5',gradeFirstMeetingWriting(answers),bank.items.length);setNotice('Recognition attempt saved on this device.'); }
    catch {setNotice('Storage unavailable; your result remains visible.');}
  }
  return <section className="min-w-0 space-y-6" aria-label="First meeting writing practice">
    <div className="space-y-3">
      <h2 className="text-2xl font-semibold">Your fictional first-meeting draft</h2>
      <label htmlFor="n5-first-meeting-draft" className="block font-semibold">Write two to five connected Japanese sentences</label>
      <textarea id="n5-first-meeting-draft" lang="ja" rows={6} value={draft} onChange={e=>setDraft(e.target.value)} className="block w-full min-w-0 rounded-lg border border-current/40 bg-transparent p-3" placeholder="私はエマです。学生です。" />
      <p>Japanese IME and mobile keyboards are supported. Nothing is sent to a server. Save and load are explicit; the text is not automatically graded.</p>
      <div className="flex flex-wrap gap-2"><button type="button" onClick={saveDraft} className="rounded-lg border border-current px-4 py-3">Save draft locally</button><button type="button" onClick={restoreDraft} className="rounded-lg border border-current px-4 py-3">Load saved draft</button><button type="button" onClick={clearDraft} className="rounded-lg border border-current px-4 py-3">Clear draft</button></div>
      <p role="status" aria-live="polite">{saved}</p>
      <h3 className="text-xl font-semibold">Model to compare after writing</h3>
      <details className="rounded-lg border border-current/30 p-3"><summary className="cursor-pointer font-semibold">Reveal model and meaning</summary><p lang="ja">私はエマです。学生です。田中さんは先生ですか。</p><p>I'm Emma. I'm a student. Is Tanaka a teacher?</p><p>Other coherent fictional introductions are possible.</p></details>
      <fieldset className="space-y-2"><legend className="font-semibold">Self-review (not teacher grading)</legend>
      {['My fictional name and one other basic detail are clear.','I used は and polite noun endings intentionally.','I used か only for a question.','My two to five sentences connect logically and are readable.'].map((label,i)=><label key={label} className="flex min-h-11 items-center gap-3"><input type="checkbox" checked={checks[i]} onChange={e=>setChecks(c=>c.map((v,j)=>i===j?e.target.checked:v))}/><span>{label}</span></label>)}</fieldset>
    </div>
    <h2 className="text-2xl font-semibold">Eight written recognition checks</h2>
    {bank.items.map((q,i)=><fieldset key={q.id} data-question-id={q.id} disabled={submitted} className="min-w-0 rounded-xl border border-current/20 p-4">
      <legend className="font-semibold">{i+1}. {q.prompt}</legend>
      {q.choices.map(c=><label key={c.id} className="flex min-h-11 items-center gap-3 rounded-lg p-2 focus-within:outline focus-within:outline-2"><input type="radio" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span className="break-words">{c.text}</span></label>)}
      {submitted && <p role="status"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct. ':'Review. '}</strong>{q.explanation}</p>}
    </fieldset>)}
    {!submitted?<button type="button" disabled={!ready} onClick={submit} className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50">Check 8 answers</button>:<div role="status"><p>Written recognition score: {gradeFirstMeetingWriting(answers)}/{bank.items.length}. Not an official JLPT score; your free writing is ungraded.</p><button type="button" className="rounded-lg border border-current px-4 py-3" onClick={()=>{setAnswers({});setSubmitted(false);setNotice('');}}>Retry questions</button></div>}
    <p role="status" aria-live="polite">{notice}</p>
  </section>;
}
