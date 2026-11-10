import { useState } from 'react';
import bank from '../../content/exercises/n5-m03-c03-l07-v1.json';
import { recordAttempt } from '../../lib/progress';

const key = 'n5-m03-c03-l07-draft-v1';
export function gradeTwoDayWriting(answers: Record<string,string>) {
  return bank.items.filter(q => answers[q.id] === q.answerKey.choiceId).length;
}
export default function TwoDayWritingWorkshop() {
  const [draft,setDraft] = useState('');
  const [message,setMessage] = useState('');
  const [model,setModel] = useState(false);
  const [answers,setAnswers] = useState<Record<string,string>>({});
  const [score,setScore] = useState<number|null>(null);
  const [progressMessage,setProgressMessage] = useState('');
  const save = () => { try { localStorage.setItem(key,draft); setMessage('Draft saved on this device.'); } catch { setMessage('Local storage unavailable. Copy your text to keep it.'); } };
  const load = () => { try { setDraft(localStorage.getItem(key) || ''); setMessage('Saved draft loaded.'); } catch { setMessage('Local storage unavailable.'); } };
  const clear = () => { setDraft(''); try { localStorage.removeItem(key); } catch {} setMessage('Draft cleared from this editor and local storage where available.'); };
  async function check() {
    if (score !== null || bank.items.some(q => !answers[q.id])) return;
    const result = gradeTwoDayWriting(answers);
    setScore(result);
    try { await recordAttempt('n5-m03-c03-l07-recognition-v1','n5',result,bank.items.length); setProgressMessage('Recognition attempt saved on this device.'); }
    catch { setProgressMessage('Progress storage unavailable; feedback remains visible.'); }
  }
  return <section aria-labelledby="two-day-writing-title" className="foundation-practice">
    <h2 id="two-day-writing-title">Two-day writing workshop</h2>
    <label htmlFor="two-day-draft"><strong>Your fictional two-day message (2–5 sentences)</strong></label>
    <textarea id="two-day-draft" lang="ja" rows={7} value={draft} onChange={e=>setDraft(e.target.value)} style={{display:'block',width:'100%',maxWidth:'100%',minHeight:160,marginBlock:'0.75rem',padding:'0.75rem',background:'transparent',color:'inherit',border:'1px solid currentColor',borderRadius:8}}/>
    <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
      <button type="button" className="btn btn-primary" onClick={save}>Save draft locally</button>
      <button type="button" className="btn btn-outline" onClick={load}>Load saved draft</button>
      <button type="button" className="btn btn-outline" onClick={clear}>Clear draft</button>
      <button type="button" className="btn btn-outline" aria-expanded={model} onClick={()=>setModel(v=>!v)}>{model?'Hide comparison model':'Show comparison model'}</button>
    </div>
    <p role="status" aria-live="polite">{message}</p>
    {model && <div><h3>Comparison model — not an automatic writing grade</h3><p lang="ja">昨日の朝、図書室へ行きました。昨日の夜、本を読みませんでした。明日の午後、本を読みます。明日の午後三時に日本語を勉強します。</p><p>Compare the day expressions, polite endings, particles and continuity of your message. Other natural sentences are valid.</p></div>}
    <h3>Self-review: four criteria</h3>
    <ol><li>2–5 connected sentences about one person</li><li>Yesterday with past; tomorrow with nonpast plans</li><li>Appropriate を, へ and clock-time に</li><li>Readable, understandable activities</li></ol>
    <h3>Recognition check — 8 questions</h3>
    {bank.items.map((q,i)=><fieldset key={q.id} data-question-id={q.id} disabled={score!==null} style={{minWidth:0,marginBlock:'1rem',padding:'1rem',border:'1px solid currentColor',borderRadius:8}}>
      <legend><strong>{i+1}. {q.prompt}</strong></legend>
      {q.choices.map(c=><label key={c.id} style={{display:'flex',alignItems:'center',gap:8,minHeight:44,overflowWrap:'anywhere'}}><input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(v=>({...v,[q.id]:c.id}))}/><span>{c.text}</span></label>)}
      {score!==null && <p role="status"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct. ':'Review. '}</strong>{q.choices.find(c=>c.id===answers[q.id])?.rationale} {answers[q.id]!==q.answerKey.choiceId&&q.explanation}</p>}
    </fieldset>)}
    <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
      <button type="button" className="btn btn-primary" disabled={score!==null || bank.items.some(q=>!answers[q.id])} onClick={check}>Check all 8 answers</button>
      <button type="button" className="btn btn-outline" onClick={()=>{setAnswers({});setScore(null);setProgressMessage('');}}>Retry questions</button>
    </div>
    {score!==null && <p role="status" aria-live="polite">Recognition score: {score} / {bank.items.length}. This does not grade your free writing.</p>}
    <p role="status" aria-live="polite">{progressMessage}</p>
  </section>;
}