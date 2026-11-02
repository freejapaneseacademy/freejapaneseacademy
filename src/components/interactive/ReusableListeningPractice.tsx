import { useEffect, useRef, useState } from 'react';
import { recordAttempt } from '../../lib/progress';

export type AudioTrack = {
  id: 'a' | 'b';
  assetId: string;
  label: string;
  url: string;
  durationSeconds: number;
  transcript: string;
  english: string;
};
export type AudioQuestion = {
  id: string;
  trackId: string;
  prompt: string;
  choices: { id: string; text: string; rationale?: string }[];
  answerKey: { choiceId: string };
  explanation: string;
  evidence: string;
};
export type ReusableListeningProps = {
  lessonId: string;
  level: string;
  version: number;
  tracks: AudioTrack[];
  questions: AudioQuestion[];
};

export default function ReusableListeningPractice({ lessonId, level, version, tracks, questions }: ReusableListeningProps) {
  const players = useRef<Record<string, HTMLAudioElement | null>>({});
  const [ready, setReady] = useState(false);
  const [heard, setHeard] = useState<Record<string, boolean>>({});
  const [rates, setRates] = useState<Record<string, number>>({});
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [assisted, setAssisted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => setReady(true), []);
  const answered = questions.filter(q => Boolean(answers[q.id])).length;
  const heardAll = tracks.length === 2 && tracks.every(t => heard[t.id]);
  const score = questions.reduce((total, q) => total + Number(answers[q.id] === q.answerKey.choiceId), 0);
  const uniqueTracks = tracks.length === 2 && new Set(tracks.map(t => t.assetId)).size === 2;
  const valid = questions.length >= 4 && questions.length <= 10 && uniqueTracks;
  const canSubmit = ready && valid && !submitted && !saving &&
    answered === questions.length && (heardAll || assisted) &&
    (assisted || !Object.values(failed).some(Boolean));
  const quizId = lessonId + '-check-v' + version;
  const toggleTranscript = (id: string) => {
    setRevealed(previous => ({ ...previous, [id]: !previous[id] }));
    if (!submitted) setAssisted(true);
  };
  const submit = async () => {
    if (!canSubmit) return;
    setError('');
    if (assisted) {
      setSubmitted(true);
      setSaved(false);
      return;
    }
    setSaving(true);
    try {
      await recordAttempt(quizId, level, score, questions.length);
      setSaved(true);
      setSubmitted(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to save listening progress.');
    } finally {
      setSaving(false);
    }
  };
  const restart = () => {
    for (const audio of Object.values(players.current)) audio?.pause();
    setAnswers({}); setHeard({}); setFailed({}); setRevealed({});
    setAssisted(false); setSubmitted(false); setSaved(false); setError('');
  };
  return <section className="foundation-practice listening-practice" aria-labelledby={'listening-' + lessonId}>
    <div className="foundation-practice__header">
      <span className="eyebrow">JAPANESE LISTENING · TWO REAL AUDIO TRACKS</span>
      <h2 id={'listening-' + lessonId}>Listen, understand, then verify</h2>
      <p>Play each original Japanese recording, answer what you heard, and check your understanding. No question requires seeing Japanese characters.</p>
      <p className="foundation-storage-note">The academy uses the approved AivisSpeech Japanese synthetic voices. Independent human pronunciation review is separately recorded, never inferred from audio checks.</p>
    </div>
    {!valid && <p role="alert" className="inline-error">This listening lesson is incomplete. Two distinct recordings and their questions are required before scoring.</p>}
    <div className="listening-tracks">
      {tracks.map(track => <section className="listening-track" key={track.id} aria-labelledby={lessonId + '-track-' + track.id}>
        <span className="eyebrow">TRACK {track.id.toUpperCase()} · APPROX. {Math.round(track.durationSeconds)} SECONDS</span>
        <h3 id={lessonId + '-track-' + track.id}>{track.label}</h3>
        <p>Try listening without reading the transcript first. Replay as often as you need.</p>
        <audio ref={element => { players.current[track.id] = element; }}
          src={track.url} controls preload="metadata"
          aria-label={track.label + ' Japanese recording'}
          onPlay={() => setHeard(previous => ({ ...previous, [track.id]: true }))}
          onError={() => setFailed(previous => ({ ...previous, [track.id]: true }))}
          onCanPlay={() => setFailed(previous => ({ ...previous, [track.id]: false }))}>
          Your browser does not support audio playback.
        </audio>
        {failed[track.id] && <p role="alert" className="inline-error">The audio could not be loaded. You may reveal the transcript for accessible assisted practice, but no blind listening score will be recorded.</p>}
        <div className="listening-playback-options">
          <label htmlFor={lessonId + '-speed-' + track.id}>Playback speed</label>
          <select id={lessonId + '-speed-' + track.id} value={rates[track.id] ?? 1}
            onChange={event => {
              const next = Number(event.target.value);
              setRates(previous => ({ ...previous, [track.id]: next }));
              if (players.current[track.id]) players.current[track.id]!.playbackRate = next;
            }}>
            <option value={0.8}>0.8× slower</option>
            <option value={1}>1× normal</option>
            <option value={1.2}>1.2× faster</option>
          </select>
          <span className="muted">{heard[track.id] ? 'Playback started' : 'Not yet played'}</span>
        </div>
        <button type="button" className="btn btn-outline"
          onClick={() => toggleTranscript(track.id)} aria-expanded={Boolean(revealed[track.id])}>
          {revealed[track.id] ? 'Hide transcript' : 'Reveal transcript (assisted practice)'}
        </button>
        {revealed[track.id] && <div className="listening-transcript" aria-label={track.label + ' transcript'}>
          <strong>Japanese transcript</strong>
          <p lang="ja" style={{ whiteSpace: 'pre-line' }}>{track.transcript}</p>
          <strong>English translation</strong>
          <p style={{ whiteSpace: 'pre-line' }}>{track.english}</p>
        </div>}
      </section>)}
    </div>
    {assisted && !submitted && <p role="status" className="listening-mode-note">
      Assisted practice: you revealed written support. You can still answer every question and complete the lesson,
      but the attempt will not be recorded as unaided listening mastery.
    </p>}
    <div className="foundation-practice__header">
      <h2>Check what you heard</h2>
      <p>Use only spoken information for an unaided score. Answers and evidence appear after submission.</p>
      <div className="foundation-progress-label" aria-live="polite">{answered} of {questions.length} answered</div>
      <div className="foundation-progress" role="progressbar" aria-label="Listening questions answered"
        aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={answered}>
        <span style={{ width: (questions.length ? answered / questions.length * 100 : 0) + '%' }} />
      </div>
    </div>
    {questions.map((q, index) => <fieldset className="foundation-question" key={q.id}
      data-question-id={q.id} disabled={!ready || submitted || saving}>
      <legend><span className="foundation-question__number">{String(index + 1).padStart(2, '0')}</span>{q.prompt}</legend>
      <p className="muted">Track {tracks.find(t => t.assetId === q.trackId)?.id.toUpperCase() ?? '?'}</p>
      <div className="foundation-options">
        {q.choices.map(choice => <label className={'foundation-option' +
          (answers[q.id] === choice.id ? ' foundation-option--selected' : '')} key={choice.id}>
          <input type="radio" name={q.id} value={choice.id} checked={answers[q.id] === choice.id}
            onChange={() => setAnswers(previous => ({ ...previous, [q.id]: choice.id }))} />
          <span>{choice.text}</span>
        </label>)}
      </div>
      {submitted && <div className="foundation-feedback" role="note">
        <strong>{answers[q.id] === q.answerKey.choiceId ? 'Correct' : 'Review this answer'}</strong>
        <p>{q.explanation}</p>
        <p><strong>Listening evidence:</strong> {q.evidence}</p>
      </div>}
    </fieldset>)}
    {error && <p role="alert" className="inline-error">{error} Your answers are preserved; try again.</p>}
    {!submitted ? <div className="foundation-practice__actions">
      <span className="muted">{!valid ? 'Audio package is incomplete.' :
        !heardAll && !assisted ? 'Start both recordings before saving a blind score.' :
        answered !== questions.length ? 'Answer all questions to continue.' :
        assisted ? 'Ready for transcript-assisted answer review.' : 'Ready for listening scoring.'}</span>
      <button type="button" className="btn btn-primary" onClick={submit} disabled={!canSubmit}>
        {saving ? 'Saving…' : assisted ? 'Check assisted answers' : 'Check answers & save blind score'}
      </button>
    </div> : <div className="foundation-result" role="status">
      <h3>{score} / {questions.length} correct</h3>
      <p>{saved ? 'Your unaided listening score was saved locally in this browser.' :
        'Assisted answers reviewed. No unaided listening score was recorded.'}</p>
      <p>Now reveal the transcripts and replay the spoken lines that you missed.</p>
    </div>}
    <button type="button" className="btn btn-outline listening-restart" onClick={restart}>
      Start a new listening attempt
    </button>
    <p className="foundation-storage-note">Learning progress is saved in this browser only. No microphone access is required. Transcript-assisted practice remains accessible even when the sound cannot play.</p>
  </section>;
}
