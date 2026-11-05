import { useEffect, useRef, useState } from 'react';
import { recordAttempt } from '../../lib/progress';

export type ShadowTurn = { speakerLabel: string; japanese: string; english: string; startSeconds: number; endSeconds: number };
export type ShadowTrack = { id: string; mediaPath: string; durationSeconds: number; scriptPurpose: string; turns: ShadowTurn[] };
export const shadowQuestions = [
  { id: 'ex-l0-m02-c01-l08-001', prompt: 'Which word in the model means umbrella?', choices: ['かさ','すし','ここ'], correct: 0, why: 'かさ (kasa) means umbrella; it is heard in Track A.' },
  { id: 'ex-l0-m02-c01-l08-002', prompt: 'What does ここ mean in the model reply?', choices: ['Sushi','Here','Umbrella'], correct: 1, why: 'ここ (koko) means here, as in ここにあります.' },
  { id: 'ex-l0-m02-c01-l08-003', prompt: 'Which familiar word does the woman use in the lunch conversation?', choices: ['かさ','いす','すし'], correct: 2, why: 'She says すしをたべます, meaning she will eat sushi.' },
  { id: 'ex-l0-m02-c01-l08-004', prompt: 'What is the best way to shadow a recorded turn?', choices: ['Listen, pause and repeat the spoken phrase','Read only the English translation','Assume a printed character proves pronunciation'], correct: 0, why: 'Shadowing means listening to a real model, then trying to repeat its spoken timing and sounds.' },
  { id: 'ex-l0-m02-c01-l08-005', prompt: 'What does checking the speaking rubric establish?', choices: ['An official JLPT score','Your own ungraded reflection','Native-speaker certification'], correct: 1, why: 'The rubric is self-review only. No automatic pronunciation or JLPT score is generated.' }
] as const;
export function scoreShadowKnowledge(answers: Record<string, number>) {
  return shadowQuestions.filter(q => answers[q.id] === q.correct).length;
}
const rubric = [
  'I recognized and repeated かさ (umbrella) in Track A.',
  'I heard and practised ここ (here) in the reply.',
  'I distinguished すし from す in Track B.',
  'I paused between question and answer and kept a comfortable pace.',
  'I compared my own attempt with the recording, without claiming a verified accent grade.'
];
export default function HiraganaShadowing({ tracks }: { tracks: ShadowTrack[] }) {
  const players = useRef<Record<string, HTMLAudioElement | null>>({});
  const clip = useRef<{ id: string; end: number } | null>(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const chunks = useRef<Blob[]>([]);
  const blobUrl = useRef<string | null>(null);
  const [ready, setReady] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [rate, setRate] = useState<Record<string, number>>({});
  const [recording, setRecording] = useState(false);
  const [recordUrl, setRecordUrl] = useState('');
  const [recordError, setRecordError] = useState('');
  const [checks, setChecks] = useState<Record<number, boolean>>({});
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  useEffect(() => { setReady(true); return () => {
    if (recorder.current?.state === 'recording') recorder.current.stop();
    stream.current?.getTracks().forEach(t => t.stop());
    if (blobUrl.current) URL.revokeObjectURL(blobUrl.current);
  }; }, []);
  const discard = () => { if (blobUrl.current) URL.revokeObjectURL(blobUrl.current); blobUrl.current = null; setRecordUrl(''); };
  const start = async () => {
    setRecordError('');
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') { setRecordError('Microphone unavailable. You can still practise aloud.'); return; }
    try {
      const mic = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.current = mic; discard(); chunks.current = [];
      const rec = new MediaRecorder(mic); recorder.current = rec;
      rec.ondataavailable = e => { if (e.data.size) chunks.current.push(e.data); };
      rec.onstop = () => {
        mic.getTracks().forEach(t => t.stop()); stream.current = null; setRecording(false);
        const blob = new Blob(chunks.current, { type: rec.mimeType || 'audio/webm' });
        if (blob.size) { const url = URL.createObjectURL(blob); blobUrl.current = url; setRecordUrl(url); }
        else setRecordError('No audio was captured.');
      };
      rec.onerror = () => { setRecordError('Recording failed. Try speaking without recording.'); rec.stop(); };
      rec.start(); setRecording(true);
    } catch { setRecordError('Microphone permission denied or unavailable.'); }
  };
  const playTurn = async (id: string, turn: ShadowTurn) => {
    const player = players.current[id]; if (!player) return;
    try { player.pause(); player.currentTime = turn.startSeconds; clip.current = { id, end: turn.endSeconds }; await player.play(); }
    catch { clip.current = null; setErrors(e => ({ ...e, [id]: true })); }
  };
  const updateTime = (id: string) => {
    const p = players.current[id]; if (p && clip.current?.id === id && p.currentTime >= clip.current.end - 0.05) { p.pause(); clip.current = null; }
  };
  const answered = shadowQuestions.filter(q => answers[q.id] !== undefined).length;
  const score = scoreShadowKnowledge(answers);
  const submit = async () => {
    if (!ready || submitted || saving || answered !== shadowQuestions.length) return;
    setSaving(true); setSaveError('');
    try { await recordAttempt('l0-m02-c01-l08-knowledge-v1', 'l0', score, shadowQuestions.length); setSubmitted(true); }
    catch { setSaveError('Local score storage unavailable; your answers are preserved.'); }
    finally { setSaving(false); }
  };
  return <section className="foundation-practice speaking-practice vowel-speaking" aria-labelledby="hiragana-shadow-title">
    <h2 id="hiragana-shadow-title">Listen and shadow · optional speaking</h2>
    <p>These are the unchanged licensed recordings from Lesson 06. Speaking is optional; no microphone is required and no automatic pronunciation grade is given.</p>
    <div className="vowel-speaking-models">{tracks.map((track, index) => <section className="listening-track vowel-speaking-track" key={track.id} aria-labelledby={'shadow-track-' + index}>
      <h3 id={'shadow-track-' + index}>Track {index ? 'B' : 'A'} · {track.scriptPurpose}</h3>
      <p>About {Math.round(track.durationSeconds)} seconds. Listen to the complete track, then replay individual turns.</p>
      <audio controls preload="metadata" src={track.mediaPath} ref={el => { players.current[track.id] = el; }}
        aria-label={'Track ' + (index ? 'B' : 'A') + ' Japanese speaking model'}
        onTimeUpdate={() => updateTime(track.id)}
        onError={() => setErrors(e => ({ ...e, [track.id]: true }))}
        onCanPlay={() => setErrors(e => ({ ...e, [track.id]: false }))} />
      {errors[track.id] && <p role="alert">Audio failed to load. Do not treat an unheard recording as a pronunciation model.</p>}
      <label htmlFor={'shadow-speed-' + index}>Playback speed</label>
      <select id={'shadow-speed-' + index} value={rate[track.id] ?? 1} onChange={e => {
        const v = Number(e.target.value); setRate(s => ({ ...s, [track.id]: v }));
        if (players.current[track.id]) players.current[track.id]!.playbackRate = v;
      }}><option value={0.85}>0.85×</option><option value={1}>1× normal</option></select>
      <ol className="vowel-speaking-turns">{track.turns.map((turn, i) => <li key={i} className="vowel-speaking-turn">
        <div><strong>{turn.speakerLabel} · Turn {i + 1}</strong><p lang="ja">{turn.japanese}</p><p>{turn.english}</p></div>
        <button type="button" className="btn btn-outline" disabled={!ready || !!errors[track.id]}
          onClick={() => void playTurn(track.id, turn)}>Play track {index ? 'B' : 'A'} turn {i + 1}</button>
      </li>)}</ol>
    </section>)}</div>
    <div className="writing-stage"><h3>Optional private recording</h3>
      <p>Recording begins only after you choose Start and grant browser permission. It stays in this tab, never uploaded or saved to progress storage.</p>
      {!recording ? <button type="button" className="btn btn-outline" disabled={!ready} onClick={() => void start()}>Start optional recording</button> :
        <button type="button" className="btn btn-outline" onClick={() => recorder.current?.stop()}>Stop recording</button>}
      {recording && <p role="status">Recording now. Stop when ready.</p>}
      {recordError && <p role="alert">{recordError}</p>}
      {recordUrl && <><audio controls src={recordUrl} aria-label="My private recording" /><button type="button" className="btn btn-outline" onClick={discard}>Discard recording</button></>}
    </div>
    <fieldset className="writing-stage"><legend><strong>Self-review · no speaking score</strong></legend>
      {rubric.map((item, i) => <label key={item} className="writing-rubric-item"><input type="checkbox" checked={!!checks[i]} onChange={e => setChecks(c => ({ ...c, [i]: e.target.checked }))}/><span>{item}</span></label>)}
      <p role="status">{rubric.filter((_, i) => checks[i]).length} of {rubric.length} self-review criteria checked. No speaking score is saved.</p>
    </fieldset>
    <h3>Optional knowledge check · five scored questions</h3>
    <p>These assess meaning and practice strategy, not pronunciation. {answered} of {shadowQuestions.length} answered.</p>
    {shadowQuestions.map((q, i) => <fieldset className="foundation-question" key={q.id} data-question-id={q.id} disabled={!ready || submitted || saving}>
      <legend>{i + 1}. {q.prompt}</legend>
      <div className="foundation-options">{q.choices.map((choice, j) => <label key={choice} className="foundation-option">
        <input type="radio" name={q.id} checked={answers[q.id] === j} onChange={() => setAnswers(a => ({ ...a, [q.id]: j }))}/><span>{choice}</span>
      </label>)}</div>
      {submitted && <div className="foundation-feedback" role="note"><strong>{answers[q.id] === q.correct ? 'Correct' : 'Review'}</strong><p>{q.why}</p></div>}
    </fieldset>)}
    {saveError && <p role="alert">{saveError}</p>}
    {!submitted ? <button type="button" className="btn btn-primary" disabled={!ready || saving || answered !== shadowQuestions.length} onClick={() => void submit()}>
      {saving ? 'Saving…' : 'Check preparation and save knowledge score'}</button> :
      <div className="foundation-result" role="status"><h3>{score} / {shadowQuestions.length} knowledge answers correct</h3>
        <p>Numeric knowledge score saved locally. This does not measure your voice.</p>
        <button type="button" className="btn btn-outline" onClick={() => { setAnswers({}); setSubmitted(false); }}>Try again</button></div>}
  </section>;
}
