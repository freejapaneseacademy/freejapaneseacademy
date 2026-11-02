import { useEffect, useState } from 'react';
import { recordAttempt } from '../../lib/progress';
import {
  writingQuestions, writingQuizId, writingPalette, writingCards, writingScriptOptions,
  writingRubric, scoreWritingQuestions, isWritingAnswerCorrect, buildWritingLabel,
  checkWritingCard, type WritingScriptName
} from '../../lib/writingPractice';

export default function WritingPractice() {
  const [ready, setReady] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [labels, setLabels] = useState<Record<string, WritingScriptName | ''>>({});
  const [labelsChecked, setLabelsChecked] = useState(false);
  const [japaneseDraft, setJapaneseDraft] = useState('');
  const [englishDraft, setEnglishDraft] = useState('');
  const [showModel, setShowModel] = useState(false);
  const [selfChecks, setSelfChecks] = useState<Record<string, boolean>>({});
  const [draftMessage, setDraftMessage] = useState('');
  useEffect(() => setReady(true), []);

  const answered = writingQuestions.filter(q => Boolean(answers[q.id]?.trim())).length;
  const score = scoreWritingQuestions(writingQuestions, answers);
  const updateAnswer = (id: string, value: string) => setAnswers(previous => ({ ...previous, [id]: value }));

  const submit = async () => {
    if (!ready || saving || submitted || answered !== writingQuestions.length) return;
    setSaving(true); setError('');
    try {
      await recordAttempt(writingQuizId, 'l0', score, writingQuestions.length);
      setSubmitted(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not save the typing check.');
    } finally { setSaving(false); }
  };

  const downloadDraft = () => {
    if (!japaneseDraft.trim() && !englishDraft.trim()) return;
    const content = 'FreeJapaneseAcademy — L0-M01-C01-L07 self-reviewed writing\n\nJapanese labels:\n' +
      japaneseDraft + '\n\nFour-script explanation:\n' + englishDraft +
      '\n\nSelf-review only. Not a teacher grade.\n';
    const url = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url; link.download = 'fja-l0-m01-c01-l07-writing.txt';
    document.body.appendChild(link); link.click(); link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setDraftMessage('Your text-file download was requested. Keep your copy: this page does not save writing drafts.');
  };
  const clearDraft = () => {
    if (!window.confirm('Clear both writing fields and the self-review checklist? This cannot be undone.')) return;
    setJapaneseDraft(''); setEnglishDraft(''); setSelfChecks({}); setShowModel(false);
    setDraftMessage('Both writing fields were cleared.');
  };

  return <section className="foundation-practice writing-practice" aria-labelledby="writing-practice-title">
    <span className="eyebrow">WRITING AND TYPING · L07</span>
    <h2 id="writing-practice-title">Workshop: produce Japanese, then explain it</h2>
    <p>Use your Japanese IME or the complete character palettes. First type the forms from memory, then check your responses. The eight constrained prompts have exact written targets; open composition is reviewed by you, not automatically scored.</p>
    <div className="foundation-practice__header">
      <h3>Stage 1 · Kana and familiar words</h3>
      <p>All required characters appear in the palettes, but the full answers are not assembled for you. The palettes help if you do not have a Japanese keyboard; they do not measure independent IME skill. Only surrounding spaces and Unicode composition are normalized.</p>
      <div className="foundation-progress-label" aria-live="polite">{answered} of {writingQuestions.length} entries completed</div>
      <div className="foundation-progress" role="progressbar" aria-label="Writing prompts answered" aria-valuemin={0} aria-valuemax={writingQuestions.length} aria-valuenow={answered}>
        <span style={{ width: 100 * answered / writingQuestions.length + '%' }} />
      </div>
    </div>
    {writingQuestions.map((q, index) => <fieldset className="foundation-question" data-question-id={q.id} key={q.id} disabled={!ready || submitted || saving}>
      <legend><span className="foundation-question__number">{String(index + 1).padStart(2, '0')}</span>{q.prompt}</legend>
      <div className="vocabulary-input">
        <label htmlFor={'writing-answer-' + q.id}>Your {q.inputScript} entry</label>
        <input id={'writing-answer-' + q.id} type="text" lang="ja" autoComplete="off" autoCapitalize="off" spellCheck={false}
          maxLength={24} value={answers[q.id] ?? ''} onChange={event => updateAnswer(q.id, event.target.value)} />
        <p className="muted">Optional {q.inputScript} character palette — select characters in order:</p>
        <div className="script-keyboard" role="group" aria-label={'Characters for writing prompt ' + (index + 1)}>
          {writingPalette[q.inputScript].map(glyph => <button className="script-keyboard__key" key={glyph} type="button" lang="ja"
            aria-label={'Insert ' + glyph + ' in answer ' + (index + 1)}
            onClick={() => updateAnswer(q.id, (answers[q.id] ?? '') + glyph)}>{glyph}</button>)}
          <button className="writing-keyboard-action" type="button" onClick={() => updateAnswer(q.id, (answers[q.id] ?? '').slice(0, -1))}>Delete last</button>
          <button className="writing-keyboard-action" type="button" onClick={() => updateAnswer(q.id, '')}>Clear entry</button>
        </div>
      </div>
      {submitted && <div className="foundation-feedback" role="note">
        <strong>{isWritingAnswerCorrect(q, answers[q.id] ?? '') ? 'Correct written form' : 'Review this form'}</strong>
        <p>{q.explanation}</p>
        {!isWritingAnswerCorrect(q, answers[q.id] ?? '') && <p className="foundation-feedback__why">Target: <strong lang="ja">{q.answerKey.accepted[0]}</strong>. Compare the actual characters, script and any ー marks before retrying.</p>}
      </div>}
    </fieldset>)}
    {error && <p className="inline-error" role="alert">{error} Your entries remain available so you can retry saving.</p>}
    {!submitted ? <div className="foundation-practice__actions">
      <span className="muted">Complete all eight entries before checking. The score is saved only in your browser.</span>
      <button type="button" className="btn btn-primary" disabled={!ready || saving || answered !== writingQuestions.length} onClick={submit}>{saving ? 'Saving…' : 'Check entries & save score'}</button>
    </div> : <div className="foundation-result" role="status" aria-live="polite">
      <h3>{score} / {writingQuestions.length} correct forms</h3>
      <p>Writing entry score saved locally. This measures constrained character production, not free-writing proficiency or handwriting quality.</p>
      <button type="button" className="btn btn-outline" onClick={() => { setAnswers({}); setSubmitted(false); setError(''); }}>Try the entries again</button>
    </div>}

    <div className="writing-stage">
      <h3>Stage 2 · Build two classroom labels</h3>
      <p>Point to each card. Choose its script name to finish the sentence <span lang="ja">これは…です。</span> (“This is …”). The builder checks your choice and shows a model; it is guided practice, not a saved score.</p>
      {writingCards.map(card => <div className="writing-label-card" key={card.id}>
        <p className="writing-label-card__glyph" lang="ja">{card.glyph}</p>
        <div>
          <label htmlFor={'writing-label-' + card.id}>Script name for {card.meaning}</label>
          <select id={'writing-label-' + card.id} value={labels[card.id] ?? ''} disabled={!ready || labelsChecked}
            onChange={event => setLabels(old => ({ ...old, [card.id]: event.target.value as WritingScriptName }))}>
            <option value="">Choose a script</option>
            {writingScriptOptions.map(option => <option key={option} value={option}>{option}</option>)}
          </select>
          {labels[card.id] && <p className="writing-label-preview" lang="ja">{buildWritingLabel(labels[card.id] as WritingScriptName)}</p>}
          {labelsChecked && <div className="foundation-feedback" role="note">
            <strong>{checkWritingCard(card.id, labels[card.id] as WritingScriptName) ? 'This label fits the card' : 'Revise this label'}</strong>
            <p lang="ja">Model: {buildWritingLabel(card.correctScript)}</p>
            <p>{card.glyph} belongs to {card.correctScript === 'ひらがな' ? 'hiragana' : 'katakana'}. The vowel sound is the same for both cards; the written script differs.</p>
          </div>}
        </div>
      </div>)}
      <div className="writing-actions">
        {!labelsChecked ? <button className="btn btn-outline" type="button" disabled={!ready || writingCards.some(card => !labels[card.id])}
          onClick={() => setLabelsChecked(true)}>Check my two labels</button>
          : <button className="btn btn-outline" type="button" onClick={() => setLabelsChecked(false)}>Edit labels</button>}
      </div>
    </div>

    <div className="foundation-teachback writing-stage">
      <h3>Stage 3 · Your own writing and four-script explanation</h3>
      <p>Without copying the builder's output, type two short Japanese labels for the cards あ and ア. Then write 3–5 English sentences distinguishing hiragana, katakana, kanji and romaji, with an example. You can use fictional classroom cards; do not enter your name or private information.</p>
      <label htmlFor="writing-japanese-draft">Japanese labels (two short sentences)</label>
      <textarea id="writing-japanese-draft" lang="ja" rows={3} maxLength={500} value={japaneseDraft}
        onChange={event => { setJapaneseDraft(event.target.value); setDraftMessage(''); }}
        placeholder="Type two Japanese labels here…" />
      <label htmlFor="writing-english-draft">English explanation (3–5 sentences)</label>
      <textarea id="writing-english-draft" rows={6} maxLength={2000} value={englishDraft}
        onChange={event => { setEnglishDraft(event.target.value); setDraftMessage(''); }}
        placeholder="Explain the roles of all four scripts, with examples…" />
      <div className="writing-actions">
        <button className="btn btn-outline" type="button" disabled={!ready} aria-expanded={showModel}
          onClick={() => setShowModel(value => !value)}>{showModel ? 'Hide model and rubric' : 'Compare with model and rubric'}</button>
        <button className="btn btn-outline" type="button" disabled={!ready || (!japaneseDraft.trim() && !englishDraft.trim())} onClick={downloadDraft}>Download my draft</button>
        <button className="btn btn-outline" type="button" disabled={!ready || (!japaneseDraft && !englishDraft)} onClick={clearDraft}>Clear my draft</button>
      </div>
      {draftMessage && <p role="status" className="foundation-storage-note">{draftMessage}</p>}
      {showModel && <div className="foundation-feedback writing-model" role="region" aria-label="Writing model and self-review rubric">
        <h4>One possible model (not the only valid answer)</h4>
        <p lang="ja">これはひらがなです。<br />これはカタカナです。</p>
        <p>Here the first label points to あ and the second points to ア. Hiragana writes many native word forms and grammatical endings; さくら is one example. Katakana often writes loanwords such as コーヒー. Kanji are characters used in many Japanese words; 山 is a kanji read やま in our example. Romaji uses Latin letters to represent Japanese readings, so sakura is not the English translation “cherry blossom.”</p>
        <h4>Criteria-based self-review</h4>
        <p>Check each criterion only if your own writing meets it. These checkboxes record no grade and are not saved.</p>
        {writingRubric.map(item => <label className="writing-rubric-item" key={item.id}>
          <input type="checkbox" checked={Boolean(selfChecks[item.id])} onChange={event => setSelfChecks(old => ({ ...old, [item.id]: event.target.checked }))} />
          <span><strong>{item.title}</strong><span>{item.check}</span></span>
        </label>)}
        <p><strong>{writingRubric.filter(item => selfChecks[item.id]).length} of {writingRubric.length} criteria checked by you.</strong> Revise any missing point in the writing fields above. This is self-report, not a teacher's assessment.</p>
      </div>}
    </div>
    <p className="foundation-storage-note">Privacy and progress: only the eight-item aggregate typing score, separately chosen lesson completion and bookmarks use the existing Dexie v1 database. Guided labels, open writing and rubric choices are held in page memory only, never uploaded or automatically saved. Download a copy before leaving; browser-local progress can also be lost when storage is cleared. No new libraries, migrations, audio or microphone access.</p>
  </section>;
