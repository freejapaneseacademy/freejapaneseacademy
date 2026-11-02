import { useEffect, useState } from 'react';
import { recordAttempt } from '../../lib/progress';
import { isVocabularyAnswerCorrect, scoreVocabularyQuestions, vocabularyFlashcards, vocabularyQuestions, vocabularyQuizId } from '../../lib/vocabularyPractice';

export default function VocabularyPractice() {
  const [ready,setReady] = useState(false);
  const [card,setCard] = useState(0);
  const [revealed,setRevealed] = useState(false);
  const [answers,setAnswers] = useState<Record<string,string>>({});
  const [submitted,setSubmitted] = useState(false);
  const [saving,setSaving] = useState(false);
  const [error,setError] = useState('');
  const [draft,setDraft] = useState('');
  const [showModel,setShowModel] = useState(false);
  useEffect(()=>setReady(true),[]);
  const answered = vocabularyQuestions.filter(q=>Boolean(answers[q.id]?.trim())).length;
  const score = scoreVocabularyQuestions(vocabularyQuestions,answers);
  const submit = async () => {
    if (!ready || submitted || saving || answered !== vocabularyQuestions.length) return;
    setSaving(true); setError('');
    try {
      await recordAttempt(vocabularyQuizId,'l0',score,vocabularyQuestions.length);
      setSubmitted(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save this practice attempt.');
    } finally { setSaving(false); }
  };
  const current = vocabularyFlashcards[card];
  return <section className="foundation-practice vocabulary-practice" aria-labelledby="vocabulary-practice-title">
    <span className="eyebrow">ACTIVE WORD STUDY</span>
    <h2 id="vocabulary-practice-title">Recall the word, then check yourself</h2>
    <p>Try to recall the meaning before revealing it. These flashcards are unscored; the check below saves a separate score.</p>
    <div className="vocabulary-card" aria-live="polite">
      <p className="muted">Card {card+1} of {vocabularyFlashcards.length}</p>
      <p className="vocabulary-card__term" lang="ja">{current.term}</p>
      {revealed && <div className="foundation-feedback">
        <strong>{current.reading}</strong>
        <p>{current.meaning}</p>
        <p>In context: {current.use}</p>
      </div>}
      <div className="vocabulary-card__controls">
        <button type="button" className="btn btn-outline" disabled={!ready||card===0} onClick={()=>{setCard(n=>n-1);setRevealed(false);}}>Previous</button>
        <button type="button" className="btn btn-outline" disabled={!ready} aria-expanded={revealed} onClick={()=>setRevealed(x=>!x)}>{revealed?'Hide answer':'Reveal answer'}</button>
        <button type="button" className="btn btn-outline" disabled={!ready||card===vocabularyFlashcards.length-1} onClick={()=>{setCard(n=>n+1);setRevealed(false);}}>Next</button>
      </div>
    </div>
    <div className="foundation-practice__header">
      <h2>Check your vocabulary in context</h2>
      <p>Choose an answer or type a short word. The last two questions accept Japanese kana or lowercase romaji. Explanations appear after submission; the result is stored only in this browser.</p>
      <div className="foundation-progress-label" aria-live="polite">{answered} of {vocabularyQuestions.length} answered</div>
      <div className="foundation-progress" role="progressbar" aria-label="Vocabulary questions answered" aria-valuemin={0} aria-valuemax={vocabularyQuestions.length} aria-valuenow={answered}><span style={{width:(100*answered/vocabularyQuestions.length)+'%'}} /></div>
    </div>
    {vocabularyQuestions.map((q,i)=><fieldset key={q.id} className="foundation-question" disabled={!ready||submitted||saving} data-question-id={q.id}>
      <legend><span className="foundation-question__number">{String(i+1).padStart(2,'0')}</span>{q.prompt}</legend>
      {q.example && <div className="foundation-prompt-jp" lang="ja">{q.example}</div>}
      {q.type === 'single-choice' ? <div className="foundation-options">{q.choices.map(choice=><label key={choice.id} className={'foundation-option'+(answers[q.id]===choice.id?' foundation-option--selected':'')}>
        <input type="radio" name={q.id} value={choice.id} checked={answers[q.id]===choice.id} onChange={()=>setAnswers(prev=>({...prev,[q.id]:choice.id}))}/>
        <span>{choice.text}</span>
      </label>)}</div> : <div className="vocabulary-input">
        <label htmlFor={q.id}>Your answer (kana or lowercase romaji)</label>
        <input id={q.id} name={q.id} type="text" autoComplete="off" spellCheck={false} value={answers[q.id]??''} onChange={e=>setAnswers(prev=>({...prev,[q.id]:e.target.value}))}/>
      </div>}
      {submitted && <div className="foundation-feedback" role="note">
        <strong>{isVocabularyAnswerCorrect(q,answers[q.id]??'')?'Correct':'Review this answer'}</strong>
        <p>{q.explanation}</p>
        {!isVocabularyAnswerCorrect(q,answers[q.id]??'') && <p className="foundation-feedback__why">{q.type==='single-choice'
          ? 'Your choice: '+(q.choices.find(c=>c.id===answers[q.id])?.rationale??'Not selected')
          : 'Accepted example: '+q.answerKey.accepted[0]}</p>}
      </div>}
    </fieldset>)}
    {error && <p className="inline-error" role="alert">{error} Your answers are preserved so you can retry saving.</p>}
    {!submitted ? <div className="foundation-practice__actions">
      <span className="muted">Answer all questions to save your score.</span>
      <button type="button" className="btn btn-primary" disabled={!ready||saving||answered!==vocabularyQuestions.length} onClick={submit}>{saving?'Saving…':'Check answers & save score'}</button>
    </div> : <div className="foundation-result" role="status" aria-live="polite">
      <h3>{score} / {vocabularyQuestions.length} correct</h3>
      <p>Your practice result was saved on this browser. This score is not a pronunciation or mastery assessment.</p>
      <button type="button" className="btn btn-outline" onClick={()=>{setAnswers({});setSubmitted(false);setError('');}}>Practice again</button>
    </div>}
    <div className="foundation-teachback">
      <h3>Use a word in a classroom situation</h3>
      <p>Imagine the teacher speaks too quickly. Write a polite request for repetition in Japanese or romaji. Compare your attempt with the model; this is self-review, not automatic grading.</p>
      <label htmlFor="vocabulary-draft">Your optional response</label>
      <textarea id="vocabulary-draft" rows={3} value={draft} onChange={e=>setDraft(e.target.value)} disabled={!ready} placeholder="Write your request here" />
      <button type="button" className="btn btn-outline" disabled={!ready} aria-expanded={showModel} onClick={()=>setShowModel(x=>!x)}>{showModel?'Hide model':'Compare with model and checklist'}</button>
      {showModel && <div className="foundation-feedback">
        <strong lang="ja">もういちどおねがいします。</strong>
        <p>One more time, please. Check that your response asks for repetition, is polite to a teacher, and uses a complete expression. If using romaji, compare the long vowel in mō with the written もう.</p>
      </div>}
    </div>
    <p className="foundation-storage-note">Quiz attempts use the existing browser-local progress database. Your optional writing is not saved or uploaded; copy it if you want to keep it. No microphone or audio recording is used.</p>
  </section>;
}
