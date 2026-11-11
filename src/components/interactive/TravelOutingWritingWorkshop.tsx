import { useEffect, useState } from 'react';
import bank from '../../content/exercises/n5-m05-c04-l07-v1.json';
import { recordAttempt } from '../../lib/progress';

export const scoreTravelWriting = (answers: Record<string,string>) => bank.items.filter(q => answers[q.id] === q.answerKey.choiceId).length;
const storageKey = 'n5-m05-c04-l07-writing-v1';
const rubric = [
  'I wrote two to five connected Japanese sentences.',
  'My meeting time and location are clear, with で for 集合します.',
  'I marked transport with で and destination with に or へ.',
  'My meeting, departure and arrival times make sense.',
  'My Japanese spelling and polite endings are readable.'
];

export default function TravelOutingWritingWorkshop() {
  const [ready, setReady] = useState(false);
  const [draft, setDraft] = useState('');
  const [model, setModel] = useState(false);
  const [checks, setChecks] = useState<boolean[]>(rubric.map(() => false));
  const [answers, setAnswers] = useState<Record<string,string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [notice, setNotice] = useState('');
  useEffect(() => { setReady(true); }, []);
  function save() { try { localStorage.setItem(storageKey,draft); setNotice('Draft saved on this device.'); } catch { setNotice('Browser storage unavailable. Copy your draft to keep it.'); } }
  function load() { try { setDraft(localStorage.getItem(storageKey) || ''); setNotice('Draft loaded.'); } catch { setNotice('Browser storage unavailable.'); } }
  function clear() { try { localStorage.removeItem(storageKey); } catch {} setDraft(''); setChecks(rubric.map(() => false)); setNotice('Draft cleared.'); }
  async function submit() {
    if (!ready || submitted || bank.items.some(q => !answers[q.id])) return;
    setSubmitted(true);
    try { await recordAttempt('n5-m05-c04-l07-written-v1','n5',scoreTravelWriting(answers),bank.items.length); setNotice('Written recognition attempt saved locally.'); }
    catch { setNotice('Progress storage unavailable; your result is still visible.'); }
  }
  return <section aria-label="Travel outing writing workshop" className="min-w-0 space-y-6">
    <div className="space-y-3">
      <h2 className="text-2xl font-semibold">Write your fictional outing plan</h2>
      <p>Compose two to five Japanese sentences. Your free composition is self-reviewed, not automatically graded.</p>
      <label htmlFor="outing-draft" className="block font-semibold">Your Japanese draft</label>
      <textarea id="outing-draft" lang="ja" rows={6} disabled={!ready} value={draft} onChange={e=>setDraft(e.target.value)} placeholder="土曜日の午前八時に駅の前で集合します。" className="w-full min-w-0 rounded-lg border border-current/30 bg-transparent p-3"/>
      <div className="flex flex-wrap gap-2">
        <button type="button" disabled={!ready} onClick={save} className="min-h-11 rounded-lg border border-current px-3 py-2">Save draft</button>
        <button type="button" disabled={!ready} onClick={load} className="min-h-11 rounded-lg border border-current px-3 py-2">Load draft</button>
        <button type="button" disabled={!ready} onClick={clear} className="min-h-11 rounded-lg border border-current px-3 py-2">Clear draft</button>
        <button type="button" disabled={!ready} aria-expanded={model} onClick={()=>setModel(v=>!v)} className="min-h-11 rounded-lg border border-current px-3 py-2">{model?'Hide model':'Compare model'}</button>
      </div>
      {model && <div className="rounded-lg border border-current/30 p-3"><h3 className="font-semibold">One possible model</h3><p lang="ja">土曜日の午前八時に駅の前で集合します。午前八時半に電車で動物園に行きます。午前九時に動物園に着きます。</p><p>Meet at 8:00 a.m.; travel by train at 8:30; arrive at 9:00. Other correct plans are possible.</p></div>}
      <fieldset className="rounded-lg border border-current/30 p-3"><legend className="font-semibold">Five-point self-review — ungraded</legend>
        {rubric.map((criterion,i)=><label key={criterion} className="flex min-h-11 items-start gap-3 py-2"><input type="checkbox" disabled={!ready} checked={checks[i]} onChange={e=>setChecks(v=>v.map((x,j)=>i===j?e.target.checked:x))}/><span>{criterion}</span></label>)}
        <p role="status">{checks.filter(Boolean).length}/5 criteria checked by you.</p>
      </fieldset>
    </div>
    <div className="space-y-4"><h2 className="text-2xl font-semibold">Written recognition check</h2><p>Use Tab, arrow keys and Space to select answers. Free writing is not included in the score.</p>
      {bank.items.map((q,i)=><fieldset key={q.id} data-question-id={q.id} disabled={!ready || submitted} className="min-w-0 rounded-xl border border-current/20 p-4">
        <legend className="font-semibold">{i+1}. {q.prompt}</legend>
        {q.choices.map(c=><label key={c.id} className="flex min-h-11 items-start gap-3 rounded-lg p-2 focus-within:outline focus-within:outline-2"><input type="radio" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(v=>({...v,[q.id]:c.id}))}/><span lang="ja" className="break-words">{c.text}</span></label>)}
        {submitted && <p role="status"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct. ':'Review. '}</strong>{q.choices.find(c=>c.id===answers[q.id])?.rationale}</p>}
      </fieldset>)}
      {!submitted?<button type="button" disabled={!ready || bank.items.some(q=>!answers[q.id])} onClick={submit} className="min-h-11 rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50">Check 8 answers</button>
      :<div role="status"><p>Written recognition score: {scoreTravelWriting(answers)}/8. Not an official JLPT score.</p><button type="button" onClick={()=>{setSubmitted(false);setAnswers({});}} className="min-h-11 rounded-lg border border-current px-4 py-2">Retry questions</button></div>}
      <p role="status" aria-live="polite">{notice}</p>
    </div>
  </section>;
}