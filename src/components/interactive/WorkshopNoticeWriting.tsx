import { useState } from 'react';
import bank from '../../content/exercises/n5-m03-c01-l07-v1.json';
import { recordAttempt } from '../../lib/progress';
export const QUIZ_ID='n5-m03-c01-l07-writing-v1';
export const questions=bank.items;
export const scoreNotice=(answers:Record<string,string>)=>questions.filter(q=>answers[q.id]===q.answerKey.choiceId).length;
const DRAFT_KEY='n5-m03-c01-l07-draft-v1';
export default function WorkshopNoticeWriting(){
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false);
 const [saving,setSaving]=useState(false);
 const [error,setError]=useState('');
 const [draft,setDraft]=useState('');
 const [notice,setNotice]=useState('');
 const [showModel,setShowModel]=useState(false);
 const answered=questions.filter(q=>answers[q.id]).length;
 function saveDraft(){try{localStorage.setItem(DRAFT_KEY,draft);setNotice('Draft saved on this device.')}catch{setNotice('Browser storage unavailable; copy your writing before leaving.');}}
 function loadDraft(){try{setDraft(localStorage.getItem(DRAFT_KEY)||'');setNotice('Saved draft loaded.')}catch{setNotice('Browser storage unavailable.');}}
 function clearDraft(){try{localStorage.removeItem(DRAFT_KEY)}catch{}setDraft('');setNotice('Draft cleared.');}
 async function submit(){
  if(submitted||saving||answered!==questions.length)return;
  setSaving(true);setError('');
  try{await recordAttempt(QUIZ_ID,'n5',scoreNotice(answers),questions.length);setSubmitted(true);}
  catch{setError('Local progress storage unavailable. Answers are retained; retry saving.');}
  finally{setSaving(false);}
 }
 return <section className="foundation-practice" aria-labelledby="notice-writing-title">
 <div className="foundation-practice__header"><span className="eyebrow">WRITING WORKSHOP</span><h2 id="notice-writing-title">Draft your event notice</h2><p>Write two to five sentences. Your composition is not automatically graded.</p></div>
 <div className="foundation-teachback"><label htmlFor="notice-writing-draft">Your Japanese notice (date, weekday, start time, quantity)</label>
 <textarea id="notice-writing-draft" rows={6} value={draft} onChange={e=>setDraft(e.target.value)} placeholder="工作クラスは12月7日、月曜日です。午後1時からです。紙は2枚です。"/>
 <div className="foundation-actions"><button type="button" className="btn btn-outline" onClick={saveDraft}>Save draft locally</button><button type="button" className="btn btn-outline" onClick={loadDraft}>Load saved draft</button><button type="button" className="btn btn-outline" onClick={clearDraft}>Clear draft</button></div>
 <p role="status" aria-live="polite">{notice}</p>
 <button type="button" className="btn btn-outline" aria-expanded={showModel} onClick={()=>setShowModel(v=>!v)}>{showModel?'Hide model':'Compare with model'}</button>
 {showModel&&<div className="foundation-feedback"><p lang="ja">工作クラスは12月7日、月曜日です。午後1時からです。紙は2枚です。</p><p>Check: date and weekday; から for start; 枚 for paper; clear sentence endings.</p></div>}
 </div>
 <h3>Eight-question recognition check</h3><p aria-live="polite">{answered} of {questions.length} answered</p>
 <div className="foundation-progress" role="progressbar" aria-label="Questions answered" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={answered}><span style={{width:answered/questions.length*100+'%'}}/></div>
 {questions.map((q,i)=><fieldset key={q.id} className="foundation-question" disabled={submitted||saving}>
 <legend><span className="foundation-question__number">{String(i+1).padStart(2,'0')}</span>{q.prompt}</legend>
 <div className="foundation-options">{q.choices.map(c=><label key={c.id} className={'foundation-option '+(answers[q.id]===c.id?'foundation-option--selected':'')}>
 <input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span>{c.text}</span></label>)}</div>
 {submitted&&<div className="foundation-feedback" role="note"><strong>{answers[q.id]===q.answerKey.choiceId?'✓ Correct':'Review this answer'}</strong><p>{q.explanation}</p>{answers[q.id]!==q.answerKey.choiceId&&<p>{q.choices.find(c=>c.id===answers[q.id])?.rationale}</p>}</div>}
 </fieldset>)}
 {error&&<p role="alert">{error}</p>}
 {!submitted?<button type="button" className="btn btn-primary" disabled={saving||answered!==questions.length} onClick={submit}>{saving?'Saving…':'Check answers and save score'}</button>:<div className="foundation-result" role="status"><h3>{scoreNotice(answers)} / {questions.length} correct</h3><p>Quiz score stored locally.</p><button type="button" className="btn btn-outline" onClick={()=>{setAnswers({});setSubmitted(false);setError('');}}>Retry recognition check</button></div>}
 <p className="foundation-storage-note">Drafts and scores remain in this browser; no composition is uploaded or automatically assessed. Clear browser data to remove local records.</p>
 </section>;
}
