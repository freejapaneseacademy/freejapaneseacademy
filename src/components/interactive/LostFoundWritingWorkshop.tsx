import { useState } from 'react';
import bank from '../../content/exercises/n5-m02-c01-l07-v1.json';
import { recordAttempt } from '../../lib/progress';
const draftKey = 'fja:n5-m02-c01-l07:writing:v1';
export function scoreWritingRecognition(answers: Record<string,string>) {
  return bank.items.filter(q => answers[q.id] === q.answerKey.choiceId).length;
}
export default function LostFoundWritingWorkshop() {
  const [draft,setDraft]=useState('');
  const [saved,setSaved]=useState('');
  const [answers,setAnswers]=useState<Record<string,string>>({});
  const [submitted,setSubmitted]=useState(false);
  const [notice,setNotice]=useState('');
  function save() {
    try { localStorage.setItem(draftKey,draft);setSaved('Draft saved in this browser only.'); }
    catch {setSaved('Browser storage unavailable. Copy your text before leaving.');}
  }
  function load() {
    try {const value=localStorage.getItem(draftKey);if(value===null){setSaved('No saved draft in this browser.');return;}setDraft(value);setSaved('Saved draft loaded.');}
    catch {setSaved('Browser storage unavailable.');}
  }
  function clear() {
    try {localStorage.removeItem(draftKey);setDraft('');setSaved('Local draft cleared.');}
    catch {setSaved('Could not clear browser storage.');}
  }
  async function check() {
    if(Object.keys(answers).length!==bank.items.length){setNotice('Answer all eight questions before checking.');return;}
    setSubmitted(true);setNotice('Recognition answers checked. Free writing is self-reviewed, not graded.');
    try {await recordAttempt('n5-m02-c01-l07-v1','n5',scoreWritingRecognition(answers),bank.items.length);}
    catch {setNotice('Answers checked, but browser progress storage was unavailable.');}
  }
  return <section className="foundation-practice" aria-label="Lost-and-found writing workshop">
    <h2>Your writing workshop</h2>
    <label htmlFor="lost-found-draft"><strong>Write 2–5 connected polite sentences in Japanese</strong></label>
    <textarea id="lost-found-draft" lang="ja" value={draft} onChange={e=>setDraft(e.target.value)} rows={6} style={{display:'block',width:'100%',maxWidth:'100%',boxSizing:'border-box',marginBlock:'.75rem',padding:'.8rem',color:'inherit',background:'transparent',border:'1px solid currentColor',borderRadius:'.5rem'}} placeholder="これは ノートです。…" />
    <div style={{display:'flex',flexWrap:'wrap',gap:'.6rem'}}>
      <button type="button" onClick={save}>Save draft locally</button>
      <button type="button" onClick={load}>Load saved draft</button>
      <button type="button" onClick={clear}>Clear local draft</button>
    </div>
    <p role="status" aria-live="polite">{saved}</p>
    <details><summary>Compare with a model and self-review</summary>
      <p lang="ja">これは ノートです。この ノートは だれのですか。それは ミナさんのです。ありがとうございます。</p>
      <p>Check: 2–5 sentences; demonstratives match noun placement and perspective; ownership question and answer; polite endings. Revise your draft yourself—there is no automatic composition grade.</p>
    </details>
    <h2>Written-form recognition check</h2>
    <p>These eight questions test forms taught above, not the quality of your free writing.</p>
    {bank.items.map((q,i)=><fieldset key={q.id} style={{minWidth:0,padding:'1rem',marginBlock:'1rem',border:'1px solid var(--border, #888)',borderRadius:'.75rem'}}>
      <legend><strong>{i+1}. {q.prompt}</strong></legend>
      {q.choices.map(c=><label key={c.id} style={{display:'flex',alignItems:'center',gap:'.7rem',minHeight:44,padding:'.4rem',overflowWrap:'anywhere'}}>
        <input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} disabled={submitted} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span>{c.text}</span>
      </label>)}
      {submitted&&<p role="status"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct.':'Review:'}</strong> {q.explanation} {q.choices.find(c=>c.id===answers[q.id])?.rationale}</p>}
    </fieldset>)}
    <p aria-live="polite">{notice}</p>
    {submitted?<><p role="status">Written-form recognition: {scoreWritingRecognition(answers)} of {bank.items.length} correct.</p><button type="button" onClick={()=>{setAnswers({});setSubmitted(false);setNotice('Ready to retry.');}}>Retry recognition questions</button></>:<button type="button" onClick={check}>Check recognition answers</button>}
  </section>;
}
