import { useState } from 'react';
import { recordAttempt } from '../../lib/progress';
import bank from '../../content/exercises/l0-m01-c03-chk-listening-v1.json';
import manifest from '../../content/audio/l0-m01-c03-l06-v1.json';

/**
 * Audio-first comprehension section. The transcript is never rendered before
 * the learner explicitly requests assistance or submits their answers.
 * Assisted attempts are stored under a different stable progress key.
 */
export default function RhythmCheckpointListening() {
  const questions = bank.items;
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [assisted, setAssisted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [audioError, setAudioError] = useState<Record<string, boolean>>({});
  const [played, setPlayed] = useState<Record<string, boolean>>({});
  const allPlayed = manifest.assets.every((asset) => played[asset.id]);
  const complete = questions.every((q) => answers[q.id] !== undefined);
  const score = questions.filter((q) => answers[q.id] === q.answerKey.choiceId).length;

  async function submit() {
    if (!complete || !allPlayed || submitted || Object.values(audioError).some(Boolean)) return;
    setSubmitted(true);
    setSaving('saving');
    try {
      await recordAttempt(
        assisted ? 'l0-m01-c03-chk-listening-assisted-v1' : 'l0-m01-c03-chk-listening-blind-v1',
        'l0', score, questions.length,
      );
      setSaving('saved');
    } catch {
      setSaving('error');
    }
  }

  function retry() {
    setAnswers({});
    setAssisted(false);
    setSubmitted(false);
    setSaving('idle');
    setAudioError({});
    setPlayed({});
  }

  return (
    <section aria-labelledby="checkpoint-listening-title" className="space-y-6 min-w-0">
      <h2 id="checkpoint-listening-title" className="text-2xl font-semibold">Listen to two conversations</h2>
      <p>Play each real Japanese dialogue, then answer the questions about what the speakers mean.
        Transcripts are hidden until you submit. You can reveal them earlier for an assisted attempt;
        assisted results are never counted as blind listening.</p>
      {manifest.assets.map((asset, index) => (
        <div key={asset.id} className="rounded-xl border border-current/20 p-4 space-y-3 min-w-0">
          <h3 className="font-semibold">Conversation {index + 1}</h3>
          <audio controls preload="none" src={asset.mediaPath} className="block w-full max-w-full min-w-0" style={{ width: "100%", maxWidth: "100%", minWidth: 0 }} aria-label={`Play Japanese conversation ${index + 1}`}
            onEnded={() => setPlayed((prev) => ({ ...prev, [asset.id]: true }))}
            onError={() => setAudioError((prev) => ({ ...prev, [asset.id]: true }))}>
            Your browser does not support WAV playback.
          </audio>
          {audioError[asset.id] && <p role="alert">This audio could not be loaded. Listening scoring is disabled until the recording is available.</p>}
          {(assisted || submitted) && (
            <div className="rounded-lg border border-current/20 p-3">
              <p className="font-semibold">Japanese transcript and English translation</p>
              <p lang="ja" className="whitespace-pre-line">{asset.transcript}</p>
              <p className="whitespace-pre-line">{asset.english}</p>
            </div>
          )}
          {questions.filter((q) => q.stimulusId === asset.id).map((question, questionIndex) => (
            <fieldset key={question.id} disabled={submitted} className="space-y-2">
              <legend className="font-medium">{questionIndex + 1}. {question.prompt}</legend>
              {question.choices.map((choice) => (
                <label key={choice.id} className="flex items-start gap-3 rounded-lg p-2 focus-within:outline focus-within:outline-2">
                  <input type="radio" name={question.id} className="mt-1"
                    checked={answers[question.id] === choice.id}
                    onChange={() => setAnswers((prev) => ({ ...prev, [question.id]: choice.id }))} />
                  <span>{choice.text}</span>
                </label>
              ))}
              {submitted && <p role="status">
                <strong>{answers[question.id] === question.answerKey.choiceId ? 'Correct.' : 'Not quite.'}</strong>{' '}
                {question.explanation}
              </p>}
            </fieldset>
          ))}
        </div>
      ))}
      {!submitted ? (
        <div className="space-y-3">
          {!assisted && <button type="button" onClick={() => setAssisted(true)}
            className="rounded-lg border border-current px-4 py-2">
            Reveal transcripts (switch to assisted mode)
          </button>}
          {assisted && <p role="status">Assisted mode: transcripts are visible. This attempt will not be recorded as blind listening.</p>}
          <p role="status">{!allPlayed ? 'Listen to both recordings through to the end before checking your answers.' : 'Both recordings have finished playing.'}</p>
          <div><button type="button" disabled={!complete || !allPlayed || Object.values(audioError).some(Boolean)}
            onClick={submit} className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50">
            Check listening answers
          </button></div>
        </div>
      ) : (
        <div role="status" aria-live="polite" className="space-y-3">
          <p><strong>{assisted ? 'Assisted' : 'Blind'} listening: {score}/{questions.length}.</strong> This is not a pronunciation or official JLPT grade.</p>
          {saving === 'saving' && <p>Saving locally…</p>}
          {saving === 'saved' && <p>Attempt saved on this device.</p>}
          {saving === 'error' && <p>Local progress could not be saved; the result above is still visible.</p>}
          <button type="button" onClick={retry} className="rounded-lg border border-current px-4 py-2">Try again</button>
        </div>
      )}
      <p className="text-sm">Recording attribution: {manifest.assets[0].rights.attribution}. Licensed under ACML 1.0; independent native pronunciation review pending.</p>
    </section>
  );
}
