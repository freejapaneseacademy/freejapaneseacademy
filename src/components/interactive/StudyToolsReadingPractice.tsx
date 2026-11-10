import {useState} from 'react';
import {recordAttempt} from '../../lib/progress';
import {studyToolsReadingQuestions as questions,studyToolsReadingQuizId,scoreStudyToolsReading} from '../../lib/studyToolsReadingPractice';
export default function StudyToolsReadingPractice(){
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false);
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState('');
 const answered=questions.filter(q=>Boolean(answers[q.id])).length;
 const score=scoreStudyToolsReading(answers);
 async function submit(){if(submitted||busy||answered!==questions.length)return;setBusy(true);setError('');
 try{await recordAttempt(studyToolsReadingQuizId,'l0',score,questions.length);setSubmitted(true);}
 catch(e){setError(e instanceof Error?e.message:'Could not save local progress');}
 finally{setBusy(false);}}
 return <section className="foundation-practice" aria-labelledby="c04l05-heading">
 <div className="foundation-practice__header"><span className="eyebrow">EVIDENCE-BASED READING</span><h2 id="c04l05-heading">Find the line that proves it</h2><p>12 scored questions. Read the seven-step handout first. Japanese evidence and rationales appear after submission.</p><p aria-live="polite">{answered} of {questions.length} answered</p><div className="foundation-progress" role="progressbar" aria-label="Questions answered" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={answered}><span style={{width:(100*answered/questions.length)+'%'}}/></div></div>
 {questions.map((q,i)=><fieldset className="foundation-question" key={q.id} disabled={submitted||busy}><legend><span className="foundation-question__number">{String(i+1).padStart(2,'0')}</span>{q.prompt}</legend><div className="foundation-options">{q.choices.map(c=><label key={c.id} className={'foundation-option '+(answers[q.id]===c.id?'foundation-option--selected':'')}><input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span>{c.text}</span></label>)}</div>{submitted&&<div className="foundation-feedback" role="note"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct':'Review this answer'}</strong><p>Evidence, step {q.evidenceStep}: <span lang="ja">{q.evidence}</span></p><p>{q.explanation}</p>{answers[q.id]!==q.answerKey.choiceId&&<p>Model answer: {q.choices.find(c=>c.id===q.answerKey.choiceId)?.text}</p>}</div>}</fieldset>)}
 {error&&<p role="alert">{error}</p>}
 {!submitted?<button className="btn btn-primary" type="button" disabled={busy||answered!==questions.length} onClick={submit}>{busy?'Saving…':'Submit answers'}</button>:<div role="status"><p>Score: {score} of {questions.length}.</p><button className="btn btn-outline" type="button" onClick={()=>{setAnswers({});setSubmitted(false);}}>Try again</button></div>}
 </section>;
}
