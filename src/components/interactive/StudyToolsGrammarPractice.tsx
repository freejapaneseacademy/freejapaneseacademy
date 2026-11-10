import {useState} from 'react';
import {recordAttempt} from '../../lib/progress';
import {studyToolsGrammarQuestions as questions,studyToolsGrammarQuizId,scoreStudyToolsGrammar} from '../../lib/studyToolsGrammarPractice';
export default function StudyToolsGrammarPractice(){
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false);
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState('');
 const answered=questions.filter(q=>Boolean(answers[q.id])).length;
 const score=scoreStudyToolsGrammar(answers);
 async function submit(){
  if(submitted||busy||answered!==questions.length)return;
  setBusy(true);setError('');
  try{await recordAttempt(studyToolsGrammarQuizId,'l0',score,questions.length);setSubmitted(true);}
  catch(e){setError(e instanceof Error?e.message:'Local progress could not be saved');}
  finally{setBusy(false);}
 }
 return <section className="foundation-practice" aria-labelledby="study-tools-grammar-heading">
 <div className="foundation-practice__header"><span className="eyebrow">SENTENCE FUNCTION CHECK</span><h2 id="study-tools-grammar-heading">Choose the intended action</h2>
 <p>12 written questions; explanations follow submission. No listening or pronunciation is graded.</p>
 <p aria-live="polite">{answered} of {questions.length} answered</p>
 <div className="foundation-progress" role="progressbar" aria-label="Questions answered" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={answered}><span style={{width:(100*answered/questions.length)+'%'}}/></div></div>
 {questions.map((q,i)=><fieldset key={q.id} className="foundation-question" disabled={submitted||busy}>
 <legend><span className="foundation-question__number">{String(i+1).padStart(2,'0')}</span>{q.prompt}</legend>
 <div className="foundation-options">{q.choices.map(c=><label key={c.id} className={'foundation-option '+(answers[q.id]===c.id?'foundation-option--selected':'')}>
 <input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span>{c.text}</span></label>)}</div>
 {submitted&&<div className="foundation-feedback" role="note"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct':'Review this answer'}</strong>
 <p>{q.explanation}</p>{answers[q.id]!==q.answerKey.choiceId&&<p>Model answer: {q.choices.find(c=>c.id===q.answerKey.choiceId)?.text}</p>}</div>}
 </fieldset>)}
 {error&&<p role="alert">{error}</p>}
 {!submitted?<button className="btn btn-primary" type="button" disabled={busy||answered!==questions.length} onClick={submit}>{busy?'Saving…':'Submit all answers'}</button>:
 <p role="status">Score: {score} of {questions.length}. Review each explanation and revisit the dialogue before continuing.</p>}
 </section>;
}