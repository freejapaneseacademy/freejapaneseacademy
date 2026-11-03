import {useState} from 'react';
import {recordAttempt} from '../../lib/progress';
import {studyToolsVocabularyQuestions as questions, studyToolsVocabularyQuizId, scoreStudyToolsVocabulary} from '../../lib/studyToolsVocabularyPractice';

export default function StudyToolsVocabularyPractice(){
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false);
 const [saving,setSaving]=useState(false);
 const [error,setError]=useState('');
 const [reflection,setReflection]=useState('');
 const [showModel,setShowModel]=useState(false);
 const answered=questions.filter(q=>answers[q.id]).length;
 const score=scoreStudyToolsVocabulary(answers);
 async function submit(){
  if(saving||submitted||answered!==questions.length)return;
  setSaving(true);setError('');
  try{await recordAttempt(studyToolsVocabularyQuizId,'l0',score,questions.length);setSubmitted(true);}
  catch(e){setError(e instanceof Error?e.message:'Local progress storage unavailable');}
  finally{setSaving(false);}
 }
 return <section className="foundation-practice" aria-labelledby="study-tools-vocab-heading">
  <div className="foundation-practice__header"><span className="eyebrow">VOCABULARY AND CONTEXT</span><h2 id="study-tools-vocab-heading">Choose the useful word or request</h2>
   <p>Answer all twelve written questions, then check explanations. No audio or pronunciation is graded.</p>
   <p aria-live="polite">{answered} of {questions.length} answered</p>
   <div className="foundation-progress" role="progressbar" aria-label="Questions answered" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={answered}><span style={{width:(100*answered/questions.length)+'%'}}/></div>
  </div>
  {questions.map((q,i)=><fieldset className="foundation-question" key={q.id} disabled={submitted||saving}>
   <legend><span className="foundation-question__number">{String(i+1).padStart(2,'0')}</span>{q.prompt}</legend>
   <div className="foundation-options">{q.choices.map(c=><label key={c.id} className={'foundation-option '+(answers[q.id]===c.id?'foundation-option--selected':'')}>
    <input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span>{c.text}</span>
   </label>)}</div>
   {submitted&&<div className="foundation-feedback" role="note"><strong>{answers[q.id]===q.answerKey.choiceId?'✓ Correct':'Review this answer'}</strong>
    <p>{q.explanation}</p>{answers[q.id]!==q.answerKey.choiceId&&<p>Your choice: {q.choices.find(c=>c.id===answers[q.id])?.rationale}</p>}</div>}
  </fieldset>)}
  {error&&<p className="inline-error" role="alert">{error}. Your answers remain selected; try saving again.</p>}
  {!submitted?<button type="button" className="btn btn-primary" disabled={saving||answered!==questions.length} onClick={submit}>{saving?'Saving…':'Check answers and save score'}</button>:
  <div className="foundation-result" role="status"><h3>{score} / {questions.length} correct</h3><p>Your written quiz result is saved locally in your browser. Review explanations before retrying.</p><button type="button" className="btn btn-outline" onClick={()=>{setAnswers({});setSubmitted(false);}}>Retry vocabulary check</button></div>}
  <div className="foundation-teachback"><h3>Optional written self-review</h3>
   <label htmlFor="study-tools-vocab-reflection">How would you ask Ken to repeat an instruction and then tell you how to read a word?</label>
   <textarea id="study-tools-vocab-reflection" rows={3} value={reflection} onChange={e=>setReflection(e.target.value)} placeholder="Try two Japanese expressions…"/>
   <button type="button" className="btn btn-outline" aria-expanded={showModel} onClick={()=>setShowModel(v=>!v)}>{showModel?'Hide model':'Compare with model answer'}</button>
   {showModel&&<p className="foundation-feedback" lang="ja">もういちど おねがいします。 よみかたを おしえて ください。</p>}
  </div>
  <p className="foundation-storage-note">Only scored attempts are saved locally. Optional writing is not uploaded, stored or automatically graded.</p>
 </section>;
}
