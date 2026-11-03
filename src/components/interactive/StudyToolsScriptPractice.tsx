import {useState} from 'react';
import {recordAttempt} from '../../lib/progress';
import {studyToolsScriptQuestions as questions,studyToolsScriptQuizId,scoreStudyToolsScript} from '../../lib/studyToolsScriptPractice';
export default function StudyToolsScriptPractice(){
const [answers,setAnswers]=useState<Record<string,string>>({});
const [submitted,setSubmitted]=useState(false);
const [busy,setBusy]=useState(false);
const [error,setError]=useState('');
const answered=questions.filter(q=>answers[q.id]).length;
const score=scoreStudyToolsScript(answers);
async function submit(){if(busy||submitted||answered!==questions.length)return;setBusy(true);setError('');
try{await recordAttempt(studyToolsScriptQuizId,'l0',score,questions.length);setSubmitted(true);}
catch(e){setError(e instanceof Error?e.message:'Could not save local progress');}finally{setBusy(false);}}
return <section className="foundation-practice" aria-labelledby="study-tools-script-heading">
<div className="foundation-practice__header"><span className="eyebrow">KANA AND INPUT CHECK</span><h2 id="study-tools-script-heading">Recognize the written forms</h2><p>12 written questions; check all characters carefully, including small kana. Explanations appear after submission.</p><p aria-live="polite">{answered} of {questions.length} answered</p><div className="foundation-progress" role="progressbar" aria-label="Questions answered" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={answered}><span style={{width:(100*answered/questions.length)+'%'}}/></div></div>
{questions.map((q,i)=><fieldset className="foundation-question" key={q.id} disabled={submitted||busy}><legend><span className="foundation-question__number">{String(i+1).padStart(2,'0')}</span>{q.prompt}</legend><div className="foundation-options">{q.choices.map(c=><label className={'foundation-option '+(answers[q.id]===c.id?'foundation-option--selected':'')} key={c.id}><input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span lang={/[ぁ-んァ-ン]/.test(c.text)?'ja':undefined}>{c.text}</span></label>)}</div>{submitted&&<div className="foundation-feedback" role="note"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct':'Review this answer'}</strong><p>{q.explanation}</p>{answers[q.id]!==q.answerKey.choiceId&&<p>Model answer: {q.choices.find(c=>c.id===q.answerKey.choiceId)?.text}</p>}</div>}</fieldset>)}
{error&&<p role="alert">{error}</p>}
{!submitted?<button className="btn btn-primary" type="button" disabled={busy||answered!==questions.length} onClick={submit}>{busy?'Saving…':'Submit answers'}</button>:<div role="status"><p>Score: {score} of {questions.length}. Review your answers before continuing.</p><button className="btn btn-outline" type="button" onClick={()=>{setAnswers({});setSubmitted(false);}}>Try again</button></div>}
</section>;}
