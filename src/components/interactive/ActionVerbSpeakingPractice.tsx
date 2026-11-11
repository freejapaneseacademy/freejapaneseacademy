import { useState } from 'react';
import bank from '../../content/exercises/n5-m06-c01-l08-v1.json';
import { recordAttempt } from '../../lib/progress';

export const ACTION_SPEAKING_QUIZ_ID = 'n5-m06-c01-l08-v1';
export const actionSpeakingQuestions = bank.items;
export function scoreActionSpeaking(answers: Record<string, string>) {
  return actionSpeakingQuestions.filter(q => answers[q.id] === q.answerKey.choiceId).length;
}
const criteria = [
  'I asked a polite question about a day or activity.',
  'I included two sensible activity statements with objects.',
  'I matched a dictionary form to its correct polite ます form.',
  'I identified the verb group accurately, including any exception.',
  'I gave a coherent confirmation or correction.'
];
const model = 'A：土曜日に何をしますか。\nB：午前は本を読みます。午後は絵を見ます。\nA：「読みます」の辞書形は何ですか。\nB：「読む」です。グループ１です。\nA：「見る」はグループ１ですか。\nB：いいえ。グループ２です。\nA：ありがとうございます。\nB：どういたしまして。';

export default function ActionVerbSpeakingPractice() {
  const [draft, setDraft] = useState('');
  const [modelOpen, setModelOpen] = useState(false);
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [notice, setNotice] = useState('');
  const score = scoreActionSpeaking(answers);
  async function submit() {
    if (actionSpeakingQuestions.some(q => !answers[q.id])) { setNotice('Choose one answer for every written question.'); return; }
    setSubmitted(true);
    try {
      await recordAttempt(ACTION_SPEAKING_QUIZ_ID, 'n5', score, actionSpeakingQuestions.length);
      setNotice('Written recognition attempt saved on this device.');
    } catch {
      setNotice('Answers checked, but browser-local progress storage is unavailable.');
    }
  }
  return <section className="foundation-practice" aria-label="Optional action-verb rehearsal">
    <h2>Rehearse your own exchange</h2>
    <p>Write or rehearse six to eight lines. Your draft stays in this page's memory and is not uploaded or automatically graded. No microphone is accessed.</p>
    <label htmlFor="action-speaking-draft"><strong>My six-to-eight-line exchange</strong></label>
    <textarea id="action-speaking-draft" lang="ja" rows={8} value={draft} onChange={e => setDraft(e.target.value)} placeholder="土曜日に何をしますか。" style={{width:'100%',maxWidth:'100%',minWidth:0,boxSizing:'border-box'}} />
    <div style={{display:'flex',flexWrap:'wrap',gap:'.75rem',marginBlock:'1rem'}}>
      <button type="button" aria-expanded={modelOpen} onClick={() => setModelOpen(v => !v)}>{modelOpen ? 'Hide printed model' : 'Compare with printed model'}</button>
      <button type="button" onClick={() => {setDraft('');setChecks({});setModelOpen(false);}}>Clear rehearsal</button>
    </div>
    {modelOpen && <div className="course-notice"><h3>Model exchange (printed, not recorded)</h3><p lang="ja" style={{whiteSpace:'pre-line'}}>{model}</p><p>The dictionary form 読む corresponds to 読みます (Group 1); 見る corresponds to 見ます (Group 2). Adapt the actions rather than copying unchanged.</p></div>}
    <fieldset style={{minWidth:0}}><legend><strong>Ungraded speaking self-review</strong></legend>
      {criteria.map(c => <label key={c} style={{display:'flex',alignItems:'center',gap:'.75rem',minHeight:44,overflowWrap:'anywhere'}}><input type="checkbox" checked={!!checks[c]} onChange={e=>setChecks(v=>({...v,[c]:e.target.checked}))}/><span>{c}</span></label>)}
    </fieldset>
    <p aria-live="polite">Self-review: {criteria.filter(c=>checks[c]).length} of 5 marked. This is not a pronunciation or speaking grade.</p>
    <h2>Written recognition check</h2><p>These {actionSpeakingQuestions.length} items check verb forms, meaning, and the printed models; they do not assess listening or speaking.</p>
    {actionSpeakingQuestions.map((q,i) => <fieldset key={q.id} disabled={submitted} className="foundation-question" style={{minWidth:0,marginBlock:'1rem',padding:'1rem',border:'1px solid var(--border,#888)',borderRadius:'.75rem'}}>
      <legend><strong>{i+1}. {q.prompt}</strong></legend>
      {q.choices.map(c=><label key={c.id} style={{display:'flex',alignItems:'center',gap:'.75rem',minHeight:44,overflowWrap:'anywhere'}}><input type="radio" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(v=>({...v,[q.id]:c.id}))}/><span>{c.text}</span></label>)}
      {submitted && <p role="status" className="foundation-feedback"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct.':'Review.'}</strong> {q.choices.find(c=>c.id===answers[q.id])?.rationale} Answer: {q.choices.find(c=>c.id===q.answerKey.choiceId)?.text}</p>}
    </fieldset>)}
    <p aria-live="polite">{notice}</p>
    {submitted ? <><p role="status">Written score: {score} / {actionSpeakingQuestions.length}</p><button type="button" onClick={()=>{setAnswers({});setSubmitted(false);setNotice('Ready to retry.');}}>Retry written questions</button></> : <button type="button" disabled={Object.keys(answers).length!==actionSpeakingQuestions.length} onClick={submit}>Check written answers</button>}
    <p>Optional oral practice is never automatically scored. No recording, microphone, upload, or speech recognition is used.</p>
  </section>;
}
