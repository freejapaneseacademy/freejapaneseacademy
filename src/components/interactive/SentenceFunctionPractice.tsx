import { useEffect, useState } from 'react';
import { recordAttempt } from '../../lib/progress';
import { isSentenceAnswerCorrect, scoreSentenceQuestions, sentenceQuestions, sentenceQuizId } from '../../lib/sentenceFunction';

export default function SentenceFunctionPractice() {
  const [ready,setReady]=useState(false);
  const [answers,setAnswers]=useState<Record<string,string>>({});
  const [submitted,setSubmitted]=useState(false);
  const [saving,setSaving]=useState(false);
  const [error,setError]=useState('');
  const [draft,setDraft]=useState('');
  const [showModel,setShowModel]=useState(false);
  useEffect(()=>setReady(true),[]);
  const answered=sentenceQuestions.filter(q=>Boolean(answers[q.id])).length;
  const score=scoreSentenceQuestions(sentenceQuestions,answers);
  const submit=async()=>{
    if(!ready||submitted||saving||answered!==sentenceQuestions.length)return;
    setSaving(true);setError('');
    try{
      await recordAttempt(sentenceQuizId,'l0',score,sentenceQuestions.length);
      setSubmitted(true);
    }catch(e){setError(e instanceof Error?e.message:'Could not save your practice result.');}
    finally{setSaving(false);}
  };
  return <section className="foundation-practice" aria-labelledby="sentence-practice-title">
    <span className="eyebrow">GRAMMAR IN CONTEXT</span>
    <div className="foundation-practice__header">
      <h2 id="sentence-practice-title">Check how the sentence works</h2>
      <p>Identify the topic, object, writing systems and verb position. Choose one best answer for each question. Your score measures written practice only, not speaking, listening or mastery.</p>
      <div className="foundation-progress-label" aria-live="polite">{answered} of {sentenceQuestions.length} answered</div>
      <div className="foundation-progress" role="progressbar" aria-label="Sentence questions answered" aria-valuemin={0} aria-valuemax={sentenceQuestions.length} aria-valuenow={answered}><span style={{width:(100*answered/sentenceQuestions.length)+'%'}} /></div>
    </div>
    {sentenceQuestions.map((q,i)=><fieldset className="foundation-question" key={q.id} disabled={!ready||submitted||saving} data-question-id={q.id}>
      <legend><span className="foundation-question__number">{String(i+1).padStart(2,'0')}</span>{q.prompt}</legend>
      {q.example && <p className="foundation-prompt-jp" lang="ja">{q.example}</p>}
      <div className="foundation-options">{q.choices.map(c=><label key={c.id} className={'foundation-option'+(answers[q.id]===c.id?' foundation-option--selected':'')}>
        <input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))} />
        <span>{c.text}</span>
      </label>)}</div>
      {submitted && <div className="foundation-feedback" role="note">
        <strong>{isSentenceAnswerCorrect(q,answers[q.id]??'')?'Correct':'Review this answer'}</strong>
        <p>{q.explanation}</p>
        {!isSentenceAnswerCorrect(q,answers[q.id]??'') && <p className="foundation-feedback__why">Your choice: {q.choices.find(c=>c.id===answers[q.id])?.rationale ?? 'No answer selected'}</p>}
      </div>}
    </fieldset>)}
    {error && <p className="inline-error" role="alert">{error} Your answers remain selected so you can retry.</p>}
    {!submitted?<div className="foundation-practice__actions"><span className="muted">Answer all questions before saving.</span>
      <button type="button" className="btn btn-primary" disabled={!ready||saving||answered!==sentenceQuestions.length} onClick={submit}>{saving?'Saving…':'Check answers & save score'}</button>
    </div>:<div className="foundation-result" role="status" aria-live="polite">
      <h3>{score} / {sentenceQuestions.length} correct</h3>
      <p>Your result was saved locally in this browser. You can retry without overwriting previous attempts.</p>
      <button type="button" className="btn btn-outline" onClick={()=>{setAnswers({});setSubmitted(false);setError('');}}>Practice again</button>
    </div>}
    <div className="foundation-teachback">
      <h3>Try a sentence of your own</h3>
      <p>Imagine you are at a café. Write “I drink tea” in Japanese using わたし, おちゃ and のみます. A romaji attempt is fine if you do not have a Japanese keyboard. Compare with the model rather than expecting automatic grading.</p>
      <label htmlFor="sentence-function-draft">Your optional sentence</label>
      <textarea id="sentence-function-draft" rows={3} disabled={!ready} value={draft} onChange={e=>setDraft(e.target.value)} placeholder="Type your sentence here" />
      <button type="button" className="btn btn-outline" disabled={!ready} aria-expanded={showModel} onClick={()=>setShowModel(v=>!v)}>{showModel?'Hide model':'Compare with model & checklist'}</button>
      {showModel && <div className="foundation-feedback">
        <strong lang="ja">わたしはおちゃをのみます。</strong>
        <p>Self-review: Is わたし marked as topic by は? Does を follow the object おちゃ? Does のみます finish the sentence? Are you using です only where appropriate? Other natural wording is possible when context supplies the topic.</p>
      </div>}
    </div>
    <p className="foundation-storage-note">Only aggregate quiz attempts and optional lesson completion use the existing Dexie v1 browser database. This writing draft is neither saved nor uploaded; copy it if you want to keep it. No microphone or audio is used.</p>
  </section>;
}
