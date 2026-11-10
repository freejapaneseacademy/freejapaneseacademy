import { useEffect, useState } from 'react';
import { recordAttempt } from '../../lib/progress';
import {
  soundWritingQuestions, soundWritingQuizId, soundWritingPalette, soundWritingCards,
  soundWritingRubric, scoreSoundWriting, isSoundWritingCorrect
} from '../../lib/soundWritingPractice';

export default function SoundWritingPractice() {
  const [ready, setReady] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [guided, setGuided] = useState<Record<string, string>>({});
  const [guidedChecked, setGuidedChecked] = useState(false);
  const [japaneseDraft, setJapaneseDraft] = useState('');
  const [explanationDraft, setExplanationDraft] = useState('');
  const [showModel, setShowModel] = useState(false);
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [draftMessage, setDraftMessage] = useState('');
  useEffect(() => setReady(true), []);

  const answered = soundWritingQuestions.filter(q => Boolean(answers[q.id]?.trim())).length;
  const score = scoreSoundWriting(soundWritingQuestions, answers);
  const update = (id: string, value: string) => setAnswers(old => ({ ...old, [id]: value }));

  const submit = async () => {
    if (!ready || saving || submitted || answered !== soundWritingQuestions.length) return;
    setSaving(true);
    setError('');
    try {
      await recordAttempt(soundWritingQuizId, 'l0', score, soundWritingQuestions.length);
      setSubmitted(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not save the writing check.');
    } finally {
      setSaving(false);
    }
  };

  const download = () => {
    if (!japaneseDraft.trim() && !explanationDraft.trim()) return;
    const text = 'FreeJapaneseAcademy L0-M01-C02-L07 — self-reviewed writing\n\nJapanese:\n' +
      japaneseDraft + '\n\nExplanation:\n' + explanationDraft +
      '\n\nLearner self-review only; no teacher grade.\n';
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'fja-l0-m01-c02-l07-writing.txt';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setDraftMessage('Your text download was requested. Keep your copy; drafts are not saved automatically.');
  };

  const clear = () => {
    if (!window.confirm('Clear your Japanese and English drafts and the self-review checks?')) return;
    setJapaneseDraft('');
    setExplanationDraft('');
    setChecks({});
    setShowModel(false);
    setDraftMessage('Draft fields and checklist cleared.');
  };

  return <section className="foundation-practice writing-practice sound-writing-practice" aria-labelledby="sound-writing-title">
    <span className="eyebrow">WRITING AND TYPING · CHAPTER 02 · L07</span>
    <h2 id="sound-writing-title">Workshop: make every vowel count</h2>
    <p>Write real Japanese characters, then use them in a short classroom response. The ten constrained entries are scored; your original sentences and explanations receive <strong>self-review only</strong>, not an automatic grade. A Japanese IME or the on-screen kana palette works.</p>

    <div className="foundation-practice__header">
      <h3>Stage 1 · Type vowels and meaningful contrasts</h3>
      <p>Use the prompt, not a revealed model. The optional palette offers all necessary kana, including ば and ん. It is an accessibility alternative, not proof of independent keyboard proficiency. Surrounding whitespace and Unicode composition are normalized; missing long-vowel kana are never ignored.</p>
      <div className="foundation-progress-label" aria-live="polite">{answered} of {soundWritingQuestions.length} entries filled</div>
      <div className="foundation-progress" role="progressbar" aria-label="Written entries completed" aria-valuemin={0} aria-valuemax={soundWritingQuestions.length} aria-valuenow={answered}>
        <span style={{ width: (100 * answered / soundWritingQuestions.length) + '%' }} />
      </div>
    </div>

    {soundWritingQuestions.map((q, index) => <fieldset className="foundation-question" key={q.id} data-question-id={q.id} disabled={!ready || submitted || saving}>
      <legend><span className="foundation-question__number">{String(index + 1).padStart(2, '0')}</span>{q.prompt}</legend>
      <div className="vocabulary-input">
        <label htmlFor={'sound-writing-answer-' + q.id}>Your hiragana answer</label>
        <input id={'sound-writing-answer-' + q.id} type="text" lang="ja" autoComplete="off" autoCapitalize="off"
          spellCheck={false} maxLength={24} value={answers[q.id] ?? ''} onChange={event => update(q.id, event.target.value)} />
        <p className="muted">Optional kana palette for entry {index + 1}:</p>
        <div className="script-keyboard" role="group" aria-label={'Kana palette for entry ' + (index + 1)}>
          {soundWritingPalette.map(char => <button className="script-keyboard__key" key={char} type="button" lang="ja"
            aria-label={'Insert ' + char + ' in entry ' + (index + 1)} onClick={() => update(q.id, (answers[q.id] ?? '') + char)}>{char}</button>)}
          <button type="button" className="writing-keyboard-action" onClick={() => update(q.id, Array.from(answers[q.id] ?? '').slice(0, -1).join(''))}>Delete last</button>
          <button type="button" className="writing-keyboard-action" onClick={() => update(q.id, '')}>Clear entry</button>
        </div>
      </div>
      {submitted && <div className="foundation-feedback" role="note">
        <strong>{isSoundWritingCorrect(q, answers[q.id] ?? '') ? 'Correct written form' : 'Review the written form'}</strong>
        <p>{q.explanation}</p>
        {!isSoundWritingCorrect(q, answers[q.id] ?? '') && <p className="foundation-feedback__why">Target: <strong lang="ja">{q.answerKey.accepted[0]}</strong>. Compare each kana, especially any additional vowel.</p>}
      </div>}
    </fieldset>)}

    {error && <p className="inline-error" role="alert">{error} Your answers are retained so you can try saving again.</p>}
    {!submitted ? <div className="foundation-practice__actions">
      <span className="muted">Complete all ten entries before checking; only the aggregate score is saved locally.</span>
      <button type="button" className="btn btn-primary" disabled={!ready || saving || answered !== soundWritingQuestions.length}
        onClick={submit}>{saving ? 'Saving…' : 'Check entries & save score'}</button>
    </div> : <div className="foundation-result" role="status" aria-live="polite">
      <h3>{score} / {soundWritingQuestions.length} correct forms</h3>
      <p>Constrained writing score saved in this browser. It does not certify handwriting, listening or spoken pronunciation.</p>
      <button type="button" className="btn btn-outline" onClick={() => { setAnswers({}); setSubmitted(false); setError(''); }}>Try the entries again</button>
    </div>}

    <div className="writing-stage">
      <h3>Stage 2 · Match a written response to its situation</h3>
      <p>Choose the word that fits each fictional picture or reply. These are guided, unscored choices. The correct forms appear after you check.</p>
      {soundWritingCards.map(card => <div className="writing-label-card" key={card.id}>
        <p className="writing-label-card__glyph" aria-hidden="true">✎</p>
        <div>
          <label htmlFor={'sound-writing-card-' + card.id}>{card.cue}</label>
          <select id={'sound-writing-card-' + card.id} value={guided[card.id] ?? ''} disabled={!ready || guidedChecked}
            onChange={event => setGuided(old => ({ ...old, [card.id]: event.target.value }))}>
            <option value="">Choose a Japanese expression</option>
            {card.options.map(option => <option key={option} value={option}>{option}</option>)}
          </select>
          {guidedChecked && <div className="foundation-feedback" role="note">
            <strong>{guided[card.id] === card.correct ? 'Matches the situation' : 'Revise this choice'}</strong>
            <p>Model: <strong lang="ja">{card.correct}</strong>. {card.id === 'house' ? 'A house is いえ (2 morae).' :
              card.id === 'no' ? 'The negative reply いいえ has 3 morae.' :
              card.id === 'aunt' ? 'In this family chart, おばさん is aunt (4 morae).' :
              'In this family chart, おばあさん is grandmother (5 morae).'}</p>
          </div>}
        </div>
      </div>)}
      <div className="writing-actions">
        {!guidedChecked ? <button className="btn btn-outline" type="button" disabled={!ready || soundWritingCards.some(card => !guided[card.id])}
          onClick={() => setGuidedChecked(true)}>Check four situations</button>
          : <button className="btn btn-outline" type="button" onClick={() => setGuidedChecked(false)}>Edit situations</button>}
      </div>
    </div>

    <div className="foundation-teachback writing-stage">
      <h3>Stage 3 · Compose, compare, revise</h3>
      <p>Fictional classroom task: (1) Emi points to an umbrella. Write a polite Japanese sentence identifying it. (2) Ren mistakenly calls a house a chair. Write a polite negative reply identifying the house. Then explain in English why <span lang="ja">いえ</span> / <span lang="ja">いいえ</span> and <span lang="ja">おばさん</span> / <span lang="ja">おばあさん</span> are not interchangeable. Include the mora counts. No personal information is needed.</p>
      <label htmlFor="sound-writing-japanese-draft">Your two Japanese lines</label>
      <textarea id="sound-writing-japanese-draft" lang="ja" rows={4} maxLength={500} value={japaneseDraft}
        onChange={event => { setJapaneseDraft(event.target.value); setDraftMessage(''); }} placeholder="Write two short Japanese lines…" />
      <label htmlFor="sound-writing-english-draft">Your English meaning and mora explanation</label>
      <textarea id="sound-writing-english-draft" rows={5} maxLength={1600} value={explanationDraft}
        onChange={event => { setExplanationDraft(event.target.value); setDraftMessage(''); }} placeholder="Explain the meaning and timing contrasts…" />
      <div className="writing-actions">
        <button className="btn btn-outline" type="button" disabled={!ready} aria-expanded={showModel}
          onClick={() => setShowModel(value => !value)}>{showModel ? 'Hide model and checklist' : 'Compare with model and checklist'}</button>
        <button className="btn btn-outline" type="button" disabled={!ready || (!japaneseDraft.trim() && !explanationDraft.trim())}
          onClick={download}>Download my draft</button>
        <button className="btn btn-outline" type="button" disabled={!ready || (!japaneseDraft && !explanationDraft)}
          onClick={clear}>Clear my draft</button>
      </div>
      {draftMessage && <p role="status" className="foundation-storage-note">{draftMessage}</p>}
      {showModel && <div className="foundation-feedback writing-model" role="region" aria-label="Model writing and self-review">
        <h4>One possible model (other natural answers may be valid)</h4>
        <p lang="ja">これはかさです。<br />いいえ、これはいえです。</p>
        <p>“This is an umbrella.” “No, this is a house.” The polite frame <span lang="ja">これは…です</span> is already familiar; the particle は is pronounced wa here. <span lang="ja">いえ</span> means house (い・え: 2 morae); <span lang="ja">いいえ</span> means no (い・い・え: 3 morae). On a family chart, <span lang="ja">おばさん</span> is aunt (4 morae) and <span lang="ja">おばあさん</span> is grandmother (5 morae). In other contexts those family terms can refer to women of different ages.</p>
        <h4>Criteria-based learner self-review</h4>
        <p>Tick only the criteria your writing meets. This checklist does not calculate a proficiency grade.</p>
        {soundWritingRubric.map(item => <label className="writing-rubric-item" key={item.id}>
          <input type="checkbox" checked={Boolean(checks[item.id])} onChange={event => setChecks(old => ({ ...old, [item.id]: event.target.checked }))} />
          <span><strong>{item.title}</strong><span>{item.check}</span></span>
        </label>)}
        <p><strong>{soundWritingRubric.filter(item => checks[item.id]).length} of {soundWritingRubric.length} criteria checked by you.</strong> Revise your draft where needed; there is no teacher grading.</p>
      </div>}
    </div>
    <p className="foundation-storage-note">Privacy: only the ten-item aggregate score, bookmarks and separately chosen completion use the existing Dexie v1 browser database. Your sentence draft, situation choices and rubric checks stay in page memory and are not sent anywhere or automatically saved. Export before leaving. Browser data may be cleared. No new dependencies, microphone, audio generation or schema migration are used here.</p>
  </section>;
}
