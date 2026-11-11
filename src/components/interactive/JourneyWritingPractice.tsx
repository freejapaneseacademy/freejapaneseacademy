import { useState } from 'react';
import bank from '../../content/exercises/n5-m05-c01-l07-v1.json';
import { recordAttempt } from '../../lib/progress';
export const JOURNEY_WRITING_QUIZ_ID = 'n5-m05-c01-l07-v1';
export const journeyWritingQuestions = bank.items;
export function scoreJourneyWriting(answers: Record<string,string>) { return journeyWritingQuestions.filter(q => answers[q.id] === q.answerKey.choiceId).length; }
export default function JourneyWritingPractice() {
 const [draft,setDraft]=useState('');
 const [review,setReview]=useState(false);
 const [checks,setChecks]=useState([false,false,false,false]);
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false);
 const [notice,setNotice]=useState('');
 const score=scoreJourneyWriting(answers);
 async function submit() {
  if(journeyWritingQuestions.some(q=>!answers[q.id])) {setNotice('Answer all ten fixed-choice questions before checking.');return;}
  setSubmitted(true);setNotice('Read the feedback below. Your original writing is not scored.');
  try { await recordAttempt(JOURNEY_WRITING_QUIZ_ID,'n5',score,journeyWritingQuestions.length); }
  catch {setNotice('Answers checked; browser progress storage is unavailable. Your draft was not uploaded.');}
 }
 return <section className="foundation-practice" aria-label="Journey writing and review">
 <h2>Write your journey</h2><p>Type 2–5 connected Japanese sentences. This draft stays in page memory while the page is open; it is not uploaded or graded. Copy it elsewhere to keep it.</p>
 <label htmlFor="journey-draft"><strong>My Japanese journey note</strong></label>
 <textarea id="journey-draft" lang="ja" rows={6} value={draft} onChange={e=>setDraft(e.target.value)} style={{width:'100%',maxWidth:'100%',minWidth:0,boxSizing:'border-box'}} placeholder="私は土曜日に家から…" />
 <div style={{display:'flex',gap:'.75rem',flexWrap:'wrap',marginBlock:'1rem'}}><button type="button" aria-expanded={review} onClick={()=>setReview(v=>!v)}>{review?'Hide':'Show'} model and self-review</button><button type="button" onClick={()=>{setDraft('');setChecks([false,false,false,false]);setReview(false);}}>Clear draft</button></div>
 {review&&<div className="course-notice"><h3>Compare with a model (not a grade)</h3><p lang="ja">土曜日に私は家から図書館へ行きます。自転車で行きます。友だちは図書館に来ます。午後、私は家に帰ります。</p><p>On Saturday I go from home to the library by bicycle. A friend comes to the library. In the afternoon I return home. Here the narrator is already at the library when the friend arrives.</p>
 {['My 2–5 sentences form an understandable journey.','Movement verbs match the viewpoint.','I checked に/へ for destinations, で for transport, and から for origin.','My places and time expressions are consistent.'].map((c,i)=><label key={c} style={{display:'flex',gap:'.6rem',alignItems:'center',minHeight:44}}><input type="checkbox" checked={checks[i]} onChange={e=>setChecks(v=>v.map((x,j)=>i===j?e.target.checked:x))}/>{c}</label>)}
 <p aria-live="polite">Self-review: {checks.filter(Boolean).length} of 4 criteria checked. This is not a teacher assessment.</p></div>}
 <h2>Fixed-answer language check</h2><p>These ten questions check grammar recognition, not the quality of your written journey.</p>
 {journeyWritingQuestions.map((q,i)=><fieldset key={q.id} className="foundation-question" style={{minWidth:0,marginBlock:'1rem',padding:'1rem',border:'1px solid var(--border,#888)',borderRadius:'.75rem'}}><legend><strong>{i+1}. {q.prompt}</strong></legend>
 {q.choices.map(c=><label key={c.id} style={{display:'flex',gap:'.75rem',alignItems:'center',minHeight:44,overflowWrap:'anywhere'}}><input type="radio" name={q.id} checked={answers[q.id]===c.id} disabled={submitted} onChange={()=>setAnswers(v=>({...v,[q.id]:c.id}))}/><span lang="ja">{c.text}</span></label>)}
 {submitted&&<p className="foundation-feedback" role="status"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct.':'Review.'}</strong> {q.choices.find(c=>c.id===answers[q.id])?.rationale}</p>}</fieldset>)}
 <p aria-live="polite">{notice}</p>
 {submitted?<><p role="status">Fixed-answer check: {score} of {journeyWritingQuestions.length} correct.</p><button type="button" onClick={()=>{setAnswers({});setSubmitted(false);setNotice('Ready to retry.');}}>Retry language check</button></>:<button type="button" onClick={submit}>Check answers and save score</button>}
 </section>;
}