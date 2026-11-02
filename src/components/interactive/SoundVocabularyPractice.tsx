import { useEffect, useState } from 'react';
import { recordAttempt } from '../../lib/progress';
import { isSoundVocabularyCorrect, scoreSoundVocabulary, soundVocabularyCards, soundVocabularyQuestions, soundVocabularyQuizId } from '../../lib/soundVocabularyPractice';

export default function SoundVocabularyPractice() {
  const [ready, setReady] = useState(false);
  const [card, setCard] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState<Record<string,string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [draft, setDraft] = useState('');
  const [showModel, setShowModel] = useState(false);
  useEffect(() => setReady(true), []);
  const answered = soundVocabularyQuestions.filter(q => !!answers[q.id]?.trim()).length;
  const score = scoreSoundVocabulary(answers);
  const current = soundVocabularyCards[card];

  async function submit() {
    if (!ready || saving || submitted || answered !== soundVocabularyQuestions.length) return;
    setSaving(true); setError('');
    try {
      await recordAttempt(soundVocabularyQuizId, 'l0', score, soundVocabularyQuestions.length);
      setSubmitted(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Browser storage is unavailable.');
    } finally { setSaving(false); }
  }

  return <section className="foundation-practice vocabulary-practice sound-vocabulary-practice" aria-labelledby="sound-vocab-title">
    <span className="eyebrow">ACTIVE VOCABULARY STUDY</span>
    <h2 id="sound-vocab-title">Recall the sound, word or meaning</h2>
    <p>Look at each card and try to recall its reading and use. Reveal the answer to check yourself. Flashcards are unscored, and they do not assess spoken pronunciation.</p>
    <div className="vocabulary-card" aria-live="polite">
      <p className="muted">Card {card+1} of {soundVocabularyCards.length}</p>
      <p className="vocabulary-card__term" lang="ja">{current.term}</p>
      {revealed && <div className="foundation-feedback">
        <strong>{current.reading}</strong><p>{current.meaning}</p><p>In context: {current.use}</p>
      </div>}
      <div className="vocabulary-card__controls">
        <button type="button" className="btn btn-outline" disabled={!ready || card===0} onClick={() => {setCard(n=>n-1);setRevealed(false);}}>Previous</button>
        <button type="button" className="btn btn-outline" disabled={!ready} aria-expanded={revealed} onClick={() => setRevealed(x=>!x)}>{revealed ? 'Hide answer' : 'Reveal answer'}</button>
        <button type="button" className="btn btn-outline" disabled={!ready || card===soundVocabularyCards.length-1} onClick={() => {setCard(n=>n+1);setRevealed(false);}}>Next</button>
      </div>
    </div>
    <div className="foundation-practice__header">
      <h2>Written word study: fourteen checks</h2>
      <p>Choose the word that fits the picture-card context, or type a short word. The final four items accept exact kana or the listed lowercase romaji. Written practice is not an audio or pronunciation exam.</p>
      <div className="foundation-progress-label" aria-live="polite">{answered} of {soundVocabularyQuestions.length} answered</div>
      <div className="foundation-progress" role="progressbar" aria-label="Vocabulary questions answered" aria-valuemin={0} aria-valuemax={soundVocabularyQuestions.length} aria-valuenow={answered}>
        <span style={{width:(100*answered/soundVocabularyQuestions.length)+'%'}} />
      </div>
    </div>
    {soundVocabularyQuestions.map((q,i)=><fieldset key={q.id} className="foundation-question" disabled={!ready || saving || submitted} data-question-id={q.id}>
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
        <strong>{isSoundVocabularyCorrect(q,answers[q.id]??'') ? 'Correct' : 'Review this answer'}</strong>
        <p>{q.explanation}</p>
        {!isSoundVocabularyCorrect(q,answers[q.id]??'') && <p className="foundation-feedback__why">
          {q.type==='single-choice' ? 'Your choice: '+(q.choices.find(c=>c.id===answers[q.id])?.rationale??'No choice') : 'Accepted example: '+q.answerKey.accepted[0]}
        </p>}
      </div>}
    </fieldset>)}
    {error && <p className="inline-error" role="alert">{error} Your answers were kept; try saving again.</p>}
    {!submitted ? <div className="foundation-practice__actions">
      <span className="muted">Answer every item to save your written practice score.</span>
      <button type="button" className="btn btn-primary" disabled={!ready||saving||answered!==soundVocabularyQuestions.length} onClick={submit}>{saving?'Saving…':'Check answers & save score'}</button>
    </div> : <div className="foundation-result" role="status" aria-live="polite">
      <h3>{score} / {soundVocabularyQuestions.length} correct</h3>
      <p>Your written vocabulary score was saved in this browser. It is not a pronunciation or mastery score.</p>
      <button type="button" className="btn btn-outline" onClick={()=>{setAnswers({});setSubmitted(false);setError('');}}>Practice again</button>
    </div>}
    <div className="foundation-teachback">
      <h3>Optional: explain the blue umbrella</h3>
      <p>Write a short phrase naming a blue umbrella and explain in English why you chose the adjective rather than the color noun. This is private self-review, not an automatically graded composition.</p>
      <label htmlFor="sound-vocabulary-draft">Your optional explanation</label>
      <textarea id="sound-vocabulary-draft" rows={4} disabled={!ready} value={draft} onChange={e=>setDraft(e.target.value)} placeholder="My phrase is… because…" />
      <button type="button" className="btn btn-outline" disabled={!ready} aria-expanded={showModel} onClick={()=>setShowModel(x=>!x)}>{showModel?'Hide model and checklist':'Compare with model and checklist'}</button>
      {showModel && <div className="foundation-feedback">
        <strong lang="ja">あおい かさ</strong>
        <p>“A blue umbrella.” The adjective あおい directly describes the noun かさ. The color noun あお is used when naming the color itself.</p>
        <ul><li>Did you use あおい before かさ?</li><li>Did you distinguish the adjective from the color noun?</li><li>Can you count あ・お・い (3) and か・さ (2)?</li></ul>
      </div>}
    </div>
    <p className="foundation-storage-note">Only submitted quiz summaries use the existing browser-local Dexie progress database. Your optional writing stays in this page and is not saved or uploaded. No microphone or audio is used.</p>
  </section>;
}
