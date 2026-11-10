import { useState } from 'react';
import bank from '../../content/exercises/n5-m01-c02-l08-v1.json';
import { recordAttempt } from '../../lib/progress';

const turns = [
  { question: 'あの人はだれですか。', answer: '田中先生です。' },
  { question: '教室はどこですか。', answer: 'あそこです。' },
  { question: 'これは何ですか。', answer: '名札（なふだ）です。' },
  { question: 'どれが先生の本ですか。', answer: 'この青い本です。' },
  { question: '佐藤さんも先生ですか。', answer: 'いいえ、佐藤さんは学生です。' }
];
export default function ClassroomInterviewShadowing() {
  const [revealed, setRevealed] = useState<number[]>([]);
  const [answers, setAnswers] = useState<Record<string,string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [notice, setNotice] = useState('');
  const [reflection, setReflection] = useState('');
  const [criteria, setCriteria] = useState<boolean[]>([false,false,false,false]);
  const score = bank.items.filter(q => answers[q.id] === q.answerKey.choiceId).length;
  async function submit() {
    if (Object.keys(answers).length !== bank.items.length) { setNotice('Answer every recognition question before submitting.'); return; }
    setSubmitted(true);
    try { await recordAttempt('n5-m01-c02-l08-recognition-v1','n5',score,bank.items.length); setNotice('Recognition attempt saved on this device. This is not a pronunciation grade.'); }
    catch { setNotice('Score shown, but browser storage is unavailable.'); }
  }
  function retry() { setAnswers({}); setSubmitted(false); setNotice('Choose new answers to try again.'); }
  function saveReflection() {
    try { localStorage.setItem('n5-m01-c02-l08-reflection-v1',JSON.stringify({reflection,criteria})); setNotice('Private self-review saved on this device.'); }
    catch { setNotice('Browser storage unavailable. Copy your notes to keep them.'); }
  }
  function loadReflection() {
    try { const raw=localStorage.getItem('n5-m01-c02-l08-reflection-v1'); if (!raw) {setNotice('No saved review found.');return;} const value=JSON.parse(raw); setReflection(typeof value.reflection==='string'?value.reflection:''); setCriteria(Array.isArray(value.criteria)?[0,1,2,3].map(i=>value.criteria[i]===true):[false,false,false,false]); setNotice('Saved review loaded.'); }
    catch { setNotice('Could not load saved review.'); }
  }
  return <section className="foundation-example" aria-label="Optional interview rehearsal and recognition">
    <h2>Rehearse with turn cards</h2><p>Read each question, pause, answer privately, then reveal the model. No microphone is accessed.</p>
    {turns.map((t,i)=><div key={i} style={{padding:'1rem 0',borderBottom:'1px solid currentColor'}}>
      <p lang="ja"><strong>Turn {i+1}:</strong> {t.question}</p>
      <button type="button" aria-expanded={revealed.includes(i)} aria-controls={`turn-answer-${i}`} onClick={()=>setRevealed(v=>v.includes(i)?v.filter(n=>n!==i):[...v,i])}>{revealed.includes(i)?'Hide model answer':'Reveal model answer'}</button>
      <p id={`turn-answer-${i}`} lang="ja">{revealed.includes(i)?t.answer:'Answer hidden until reveal.'}</p>
    </div>)}
    <h2>Check question-and-answer meaning</h2>
    {bank.items.map((q,i)=><fieldset key={q.id} style={{margin:'1rem 0',padding:'1rem',minWidth:0}}>
      <legend><strong>{i+1}. {q.prompt}</strong></legend>
      {q.choices.map(c=><label key={c.id} style={{display:'block',padding:'0.65rem 0',overflowWrap:'anywhere'}}>
        <input type="radio" name={q.id} value={c.id} disabled={submitted} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/> <span lang="ja">{c.text}</span>
      </label>)}
      {submitted&&<p role="status">{answers[q.id]===q.answerKey.choiceId?'Correct. ':'Review. '}{q.explanation} {q.choices.find(c=>c.id===answers[q.id])?.rationale}</p>}
    </fieldset>)}
    {!submitted?<button type="button" onClick={submit}>Check recognition answers</button>:<><p role="status">Recognition score: {score}/{bank.items.length}. Spoken performance is not graded.</p><button type="button" onClick={retry}>Retry recognition</button></>}
    <h2>Private speaking self-review</h2>
    {['Question word matched purpose','Reply gave the requested information','Polite question used ですか','も described a shared role'].map((c,i)=><label key={c} style={{display:'block',padding:'0.5rem 0'}}><input type="checkbox" checked={criteria[i]} onChange={e=>setCriteria(v=>v.map((x,j)=>i===j?e.target.checked:x))}/> {c}</label>)}
    <label htmlFor="interview-reflection">One thing to improve next time</label>
    <textarea id="interview-reflection" rows={4} maxLength={300} value={reflection} onChange={e=>setReflection(e.target.value)} style={{width:'100%',maxWidth:'100%',boxSizing:'border-box'}}/>
    <div style={{display:'flex',flexWrap:'wrap',gap:'0.75rem'}}><button type="button" onClick={saveReflection}>Save private review</button><button type="button" onClick={loadReflection}>Load saved review</button><button type="button" onClick={()=>{setReflection('');setCriteria([false,false,false,false]);try{localStorage.removeItem('n5-m01-c02-l08-reflection-v1');setNotice('Saved review cleared.')}catch{setNotice('Could not clear browser storage.')}}}>Clear review</button></div>
    <p aria-live="polite" role="status">{notice}</p>
  </section>;
}
