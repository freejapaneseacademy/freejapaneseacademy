import { useState } from 'react';
import { recordAttempt } from '../../lib/progress';
import bank from '../../content/exercises/l0-m04-c04-l07-v1.json';

const DRAFT_KEY = 'fja-l0-m04-c04-l07-draft-v1';
type Context = 'cafe' | 'station';
export function gradeWord(input: string, accepted: readonly string[]) {
 const normalized = input.trim().normalize('NFC');
 return accepted.some(answer => normalized === answer.normalize('NFC'));
}
export default function LoanwordSignWriting() {
 const questions = bank.items;
 const [answers,setAnswers] = useState<Record<string,string>>({});
 const [submitted,setSubmitted] = useState(false);
 const [saving,setSaving] = useState<'idle'|'saved'|'error'>('idle');
 const [context,setContext] = useState<Context>('cafe');
 const [draft,setDraft] = useState('');
 const [showModel,setShowModel] = useState(false);
 const [checks,setChecks] = useState<boolean[]>([false,false,false,false]);
 const [draftNotice,setDraftNotice] = useState('');
 const complete = questions.every(q => (answers[q.id] ?? '').trim().length > 0);
 const score = questions.filter(q => gradeWord(answers[q.id] ?? '',q.answerKey.accepted)).length;
 async function submit() {
  if (!complete || submitted) return;
  setSubmitted(true);setSaving('idle');
  try { await recordAttempt('l0-m04-c04-l07-typing-v1','l0',score,questions.length);setSaving('saved'); }
  catch { setSaving('error'); }
 }
 function reset() {setAnswers({});setSubmitted(false);setSaving('idle');}
 function saveDraft() {
  try { localStorage.setItem(DRAFT_KEY,JSON.stringify({version:1,context,draft}));setDraftNotice('Draft saved in this browser.'); }
  catch {setDraftNotice('Local storage is unavailable; copy your draft before leaving.');}
 }
 function loadDraft() {
  try {
   const saved=localStorage.getItem(DRAFT_KEY);
   if (!saved) {setDraftNotice('No saved draft in this browser.');return;}
   const value=JSON.parse(saved) as {context?:string;draft?:string};
   if (value.context==='cafe'||value.context==='station') setContext(value.context);
   if (typeof value.draft==='string')setDraft(value.draft.slice(0,400));
   setDraftNotice('Saved draft loaded.');
  } catch {setDraftNotice('Could not load the saved draft.');}
 }
 function clearDraft() {
  try {localStorage.removeItem(DRAFT_KEY);}catch {}
  setDraft('');setChecks([false,false,false,false]);setDraftNotice('Draft cleared from this page and local storage.');
 }
 const rubrics=['At least three context-appropriate target words','Long-vowel marks ー are accurate','Small kana ィ・ァ・ェ or ッ are accurate where used','Two clear lines suit the fictional setting'];
 return <section className="space-y-8 min-w-0" aria-labelledby="loanword-writing-title">
  <div><h2 id="loanword-writing-title" className="text-2xl font-semibold">Guided katakana typing</h2><p>Enter Japanese katakana, not romaji. Eight exact spelling checks; no open-writing grade.</p></div>
  {questions.map((q,i)=><div key={q.id} className="rounded-xl border border-current/20 p-4 min-w-0">
   <label htmlFor={q.id} className="block font-semibold">{i+1}. {q.prompt}</label>
   <input id={q.id} lang="ja" type="text" autoComplete="off" spellCheck={false} disabled={submitted} value={answers[q.id]??''} onChange={e=>setAnswers(old=>({...old,[q.id]:e.target.value}))} className="mt-2 block w-full min-w-0 rounded-lg border border-current/40 bg-transparent p-3 text-lg" />
   {submitted&&<p role="status" className="mt-2"><strong>{gradeWord(answers[q.id]??'',q.answerKey.accepted)?'Correct.':'Review:'}</strong> <span lang="ja">{q.answerKey.accepted[0]}</span> — {q.explanation}</p>}
  </div>)}
  {!submitted?<button type="button" disabled={!complete} onClick={submit} className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50">Check eight spellings</button>:<div role="status" aria-live="polite" className="space-y-2"><p><strong>Typing score: {score}/{questions.length}.</strong> Exact written spelling only.</p>{saving==='saved'&&<p>Practice attempt saved locally.</p>}{saving==='error'&&<p>Progress storage unavailable; your feedback remains visible.</p>}<button type="button" onClick={reset} className="rounded-lg border border-current px-5 py-3">Try spellings again</button></div>}
  <div className="rounded-xl border border-current/20 p-4 space-y-4">
   <h2 className="text-2xl font-semibold">Compose a two-line sign</h2>
   <fieldset><legend className="font-semibold">Choose a fictional setting</legend><div className="flex flex-wrap gap-4">{(['cafe','station'] as const).map(c=><label key={c} className="inline-flex min-h-11 items-center gap-2"><input type="radio" name="sign-context" checked={context===c} onChange={()=>{setContext(c);setChecks([false,false,false,false]);}}/>{c==='cafe'?'Café menu':'Station counter'}</label>)}</div></fieldset>
   <label htmlFor="loanword-sign-draft" className="block font-semibold">Your two lines (Japanese input supported)</label>
   <textarea id="loanword-sign-draft" lang="ja" rows={4} maxLength={400} value={draft} onChange={e=>setDraft(e.target.value)} className="block w-full min-w-0 rounded-lg border border-current/40 bg-transparent p-3 text-lg" placeholder={context==='cafe'?'カフェ　メニュー':'チケット　タクシー'}/>
   <p className="text-sm">Fictional words only. This draft is not sent to a server. Use Save to keep it on this device.</p>
   <div className="flex flex-wrap gap-2"><button type="button" onClick={saveDraft} className="rounded-lg border border-current px-4 py-3">Save draft</button><button type="button" onClick={loadDraft} className="rounded-lg border border-current px-4 py-3">Load saved draft</button><button type="button" onClick={clearDraft} className="rounded-lg border border-current px-4 py-3">Clear draft</button><button type="button" onClick={()=>setShowModel(v=>!v)} aria-expanded={showModel} className="rounded-lg border border-current px-4 py-3">{showModel?'Hide model and rubric':'Show model and rubric'}</button></div>
   {draftNotice&&<p role="status" aria-live="polite">{draftNotice}</p>}
   {showModel&&<div className="space-y-3"><h3 className="font-semibold">Example — compare, do not copy blindly</h3><p lang="ja" className="whitespace-pre-line text-lg">{context==='cafe'?'カフェ　メニュー\nコーヒー　ケーキ　ティー':'チケット　タクシー\nファイル　サービス'}</p><fieldset><legend className="font-semibold">Self-review checklist (not an automatic grade)</legend>{rubrics.map((r,i)=><label key={r} className="flex min-h-11 items-center gap-3"><input type="checkbox" checked={checks[i]} onChange={e=>setChecks(old=>old.map((v,j)=>i===j?e.target.checked:v))}/>{r}</label>)}</fieldset><p>{checks.filter(Boolean).length} of 4 self-checks marked. Review your actual writing before marking them.</p></div>}
  </div>
 </section>;
}
