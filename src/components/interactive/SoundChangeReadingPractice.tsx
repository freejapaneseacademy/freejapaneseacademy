import { useState } from 'react';
import { recordAttempt } from '../../lib/progress';
import { captionQuestions, gradeCaptionAnswers, readingQuizId } from '../../lib/soundChangeReading';

export default function SoundChangeReadingPractice(){
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [checked,setChecked]=useState(false);
 const [saving,setSaving]=useState(false);
 const [error,setError]=useState('');
 const answered=captionQuestions.filter(q=>answers[q.id]).length;
 const score=gradeCaptionAnswers(answers);
 async function submit(){
  if(checked||saving||answered!==captionQuestions.length)return;
  setSaving(true);setError('');
  try{await recordAttempt(readingQuizId,'l0',score,captionQuestions.length);setChecked(true)}
  catch(e){setError(e instanceof Error?e.message:'Could not save this attempt.')}
  finally{setSaving(false)}
 }
 return <section className="foundation-practice" aria-labelledby="sound-reading-title">
  <div className="foundation-practice__header">
   <span className="eyebrow">CHAPTER 03 · READING</span>
   <h2 id="sound-reading-title">Find the caption and cite its evidence</h2>
   <p>Refer to the eight-card board above. Choose the card supported by the Japanese printed on it. No audio or pronunciation is assessed.</p>
   <p aria-live="polite">{answered} of {captionQuestions.length} answered</p>
   <div className="foundation-progress" role="progressbar" aria-label="Reading questions answered" aria-valuemin={0} aria-valuemax={captionQuestions.length} aria-valuenow={answered}><span style={{width:`${100*answered/captionQuestions.length}%`}} /></div>
  </div>
  {captionQuestions.map((q,i)=><fieldset className="foundation-question" key={q.id} data-question-id={q.id} disabled={saving||checked}>
    <legend><strong>{i+1}. {q.prompt}</strong></legend>
    <div style={{display:'flex',flexWrap:'wrap',gap:'.65rem',marginBlock:'.75rem'}}>
      {q.choices.map(c=><label key={c} style={{display:'inline-flex',alignItems:'center',gap:'.4rem',padding:'.45rem .7rem',border:'1px solid currentColor',borderRadius:'.5rem'}}>
       <input type="radio" name={q.id} value={c} checked={answers[q.id]===c} onChange={()=>setAnswers(a=>({...a,[q.id]:c}))}/>{c}
      </label>)}
    </div>
    {checked&&<div className="foundation-feedback" role="note"><strong>{answers[q.id]===q.answer?'Correct':'Review this evidence'}</strong><p><span lang="ja">{q.evidence}</span></p><p>{q.explanation}</p></div>}
   </fieldset>)}
  {error&&<p role="alert" className="inline-error">{error} Your selections remain available for another save attempt.</p>}
  {!checked?<button className="btn btn-primary" type="button" disabled={saving||answered!==captionQuestions.length} onClick={submit}>{saving?'Saving…':'Check answers and save reading score'}</button>:<div className="foundation-result" role="status"><h3>{score} / {captionQuestions.length} correct</h3><p>Saved locally on this device. This result assesses printed reading evidence, not listening or speaking.</p><button className="btn btn-outline" type="button" onClick={()=>{setAnswers({});setChecked(false);setError('')}}>Try again</button></div>}
 </section>
}
