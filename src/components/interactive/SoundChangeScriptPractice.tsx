import { useEffect, useState } from 'react';
import { recordAttempt } from '../../lib/progress';
import { scriptQuestions, scriptPracticeQuizId, gradeScriptAnswers, normalizeScriptAnswer } from '../../lib/soundChangeScriptPractice';

export default function SoundChangeScriptPractice() {
  const [ready,setReady]=useState(false);
  const [answers,setAnswers]=useState<Record<string,string>>({});
  const [checked,setChecked]=useState(false);
  const [saving,setSaving]=useState(false);
  const [error,setError]=useState('');
  useEffect(()=>setReady(true),[]);
  const count=scriptQuestions.filter(q=>normalizeScriptAnswer(answers[q.id]??'').length>0).length;
  const score=gradeScriptAnswers(answers);
  async function submit(){
    if(!ready||saving||checked||count!==scriptQuestions.length)return;
    setSaving(true);setError('');
    try{await recordAttempt(scriptPracticeQuizId,'l0',score,scriptQuestions.length);setChecked(true);}
    catch(e){setError(e instanceof Error?e.message:'Local storage unavailable.');}
    finally{setSaving(false);}
  }
  return <section className="foundation-practice" aria-labelledby="sound-script-title">
    <div className="foundation-practice__header">
      <span className="eyebrow">CHAPTER 03 · SCRIPT AND TYPING</span>
      <h2 id="sound-script-title">Type the kana that match the meaning</h2>
      <p>Use a Japanese input method or paste kana from the lesson. Answers are checked as Japanese characters, not romaji. This is a written test, not a listening or pronunciation test.</p>
      <p aria-live="polite">{count} of {scriptQuestions.length} answered</p>
      <div className="foundation-progress" role="progressbar" aria-label="Typing questions answered" aria-valuemin={0} aria-valuemax={scriptQuestions.length} aria-valuenow={count}>
        <span style={{width:`${100*count/scriptQuestions.length}%`}}/>
      </div>
    </div>
    {scriptQuestions.map((q,i)=><div className="foundation-question" key={q.id} data-question-id={q.id}>
      <label htmlFor={q.id}><strong>{String(i+1).padStart(2,'0')}. {q.prompt}</strong></label>
      <p>{q.hint}</p>
      <input id={q.id} type="text" lang="ja" autoComplete="off" autoCapitalize="off" spellCheck={false}
        aria-describedby={checked?`${q.id}-feedback`:undefined}
        value={answers[q.id]??''} disabled={!ready||saving||checked}
        onChange={e=>setAnswers(prev=>({...prev,[q.id]:e.target.value}))}
        className="foundation-input" style={{maxWidth:'100%',width:'22rem',padding:'.7rem',border:'1px solid currentColor',borderRadius:'.5rem'}} />
      {checked&&<div id={`${q.id}-feedback`} className="foundation-feedback" role="note">
        <strong>{normalizeScriptAnswer(answers[q.id]??'')===q.answer?'Correct':'Review'}</strong>
        <p>{q.explanation}</p>
        {normalizeScriptAnswer(answers[q.id]??'')!==q.answer&&<p>Model answer: <strong lang="ja">{q.answer}</strong></p>}
      </div>}
    </div>)}
    {error&&<p className="inline-error" role="alert">{error} Your answers remain available; retry saving.</p>}
    {!checked?<div className="foundation-practice__actions"><p>Answer all twelve questions before checking.</p>
      <button type="button" className="btn btn-primary" disabled={!ready||saving||count!==scriptQuestions.length} onClick={submit}>{saving?'Saving…':'Check kana and save written score'}</button>
    </div>:<div className="foundation-result" role="status" aria-live="polite"><h3>{score} / {scriptQuestions.length} correct</h3>
      <p>Your written result is saved on this device. No speech, handwriting or listening proficiency has been inferred.</p>
      <button type="button" className="btn btn-outline" onClick={()=>{setAnswers({});setChecked(false);setError('');}}>Try again</button>
    </div>}
  </section>;
}
