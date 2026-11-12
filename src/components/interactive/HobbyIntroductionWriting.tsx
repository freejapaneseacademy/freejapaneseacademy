import { useEffect, useState } from 'react';
import bank from '../../content/exercises/n5-m07-c01-l07-v1.json';
import { recordAttempt } from '../../lib/progress';

const draftKey = 'fja-n5-m07-c01-l07-writing-v1';
export function gradeHobbyWriting(answers: Record<string, string>): number {
  return bank.items.filter(question => answers[question.id] === question.answerKey.choiceId).length;
}
export default function HobbyIntroductionWriting() {
  const [draft, setDraft] = useState('');
  const [storageNotice, setStorageNotice] = useState('');
  const [ready, setReady] = useState(false);
  const [modelVisible, setModelVisible] = useState(false);
  const [answers, setAnswers] = useState<Record<string,string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [scoreNotice, setScoreNotice] = useState('');
  useEffect(() => {
    try { setDraft(localStorage.getItem(draftKey) || ''); } catch { setStorageNotice('Local storage unavailable.'); }
    setReady(true);
  }, []);
  function saveDraft() {
    try { localStorage.setItem(draftKey, draft); setStorageNotice('Draft saved on this device.'); }
    catch { setStorageNotice('Local storage unavailable; copy your writing before leaving.'); }
  }
  function clearDraft() {
    setDraft('');
    try { localStorage.removeItem(draftKey); } catch {}
    setStorageNotice('Draft cleared.');
  }
  async function submit() {
    if (!ready || submitted || !bank.items.every(q => answers[q.id])) return;
    setSubmitted(true);
    try {
      await recordAttempt('n5-m07-c01-l07-recognition-v1','n5',gradeHobbyWriting(answers),bank.items.length);
      setScoreNotice('Recognition attempt saved on this device.');
    } catch { setScoreNotice('Progress storage unavailable; score remains visible.'); }
  }
  return <section aria-label="Hobby introduction writing and recognition" className="min-w-0 space-y-6">
    <div className="space-y-3">
      <h2 className="text-2xl font-semibold">Write and revise your introduction</h2>
      <label htmlFor="hobby-writing-draft" className="block font-semibold">Your 2–5 connected Japanese sentences (ungraded)</label>
      <textarea id="hobby-writing-draft" lang="ja" rows={7} value={draft} onChange={event => { setDraft(event.target.value); setStorageNotice('Unsaved changes.'); }} className="block w-full min-w-0 rounded-lg border border-current/40 bg-transparent p-3" placeholder="私はユウです。本を読むのが好きです。" />
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={saveDraft} className="min-h-11 rounded-lg bg-blue-700 px-4 text-white">Save draft on this device</button>
        <button type="button" onClick={clearDraft} className="min-h-11 rounded-lg border border-current px-4">Clear draft</button>
        <button type="button" aria-expanded={modelVisible} onClick={() => setModelVisible(v => !v)} className="min-h-11 rounded-lg border border-current px-4">{modelVisible ? 'Hide model' : 'Compare with model'}</button>
      </div>
      <p role="status" aria-live="polite">{storageNotice}</p>
      {modelVisible && <div className="rounded-lg border border-current/30 p-4"><h3 className="font-semibold">One possible model, not a graded answer</h3><p lang="ja">私はユウです。本を読むのが好きです。でも、ダンスはあまり好きではありません。日本語で短い文を書くことができます。</p><p>Check meaning, particles, activity phrasing, tone and sentence connections.</p></div>}
      <fieldset className="rounded-lg border border-current/30 p-4"><legend className="font-semibold">Five-criterion self-review (ungraded)</legend>
        {['My introduction contains 2–5 connected Japanese sentences.','My preference uses が好き or a correct contrasting negative.','I used verb + のが for an activity I like.','My ability or skill statement means what I intended.','My writing is polite, tactful and clear.'].map((criterion,i) => <label key={i} className="flex min-h-11 items-center gap-3"><input type="checkbox" /><span>{criterion}</span></label>)}
      </fieldset>
    </div>
    <div className="space-y-4"><h2 className="text-2xl font-semibold">Hobby grammar recognition check</h2><p>Eight written questions check the models and patterns. They do not grade your creative writing.</p>
      {bank.items.map((q,i) => <fieldset key={q.id} data-question-id={q.id} disabled={!ready || submitted} className="min-w-0 rounded-xl border border-current/20 p-4">
        <legend className="font-semibold">{i+1}. {q.prompt}</legend>
        {q.choices.map(choice => <label key={choice.id} className="flex min-h-11 items-start gap-3 rounded-lg p-2 focus-within:outline focus-within:outline-2"><input type="radio" name={q.id} checked={answers[q.id] === choice.id} onChange={() => setAnswers(previous => ({...previous,[q.id]:choice.id}))} /><span className="break-words">{choice.text}</span></label>)}
        {submitted && <div role="status" className="mt-2"><p><strong>{answers[q.id] === q.answerKey.choiceId ? 'Correct.' : 'Review.'}</strong> {q.explanation}</p><p>{q.choices.find(choice => choice.id === answers[q.id])?.rationale}</p></div>}
      </fieldset>)}
      {!submitted ? <button type="button" disabled={!ready || !bank.items.every(q => answers[q.id])} onClick={submit} className="min-h-11 rounded-lg bg-blue-700 px-5 font-semibold text-white disabled:opacity-50">Check 8 answers</button> : <div role="status"><p>Recognition score: {gradeHobbyWriting(answers)}/8. This is not a writing grade or official JLPT score.</p><button type="button" onClick={() => {setAnswers({});setSubmitted(false);setScoreNotice('Ready to retry.');}} className="min-h-11 rounded-lg border border-current px-4">Retry questions</button></div>}
      <p role="status" aria-live="polite">{scoreNotice}</p>
    </div>
  </section>;
}
