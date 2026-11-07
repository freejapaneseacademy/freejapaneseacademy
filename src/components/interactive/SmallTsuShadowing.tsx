import { useEffect, useRef, useState } from 'react';
import { recordAttempt } from '../../lib/progress';

export type ShadowTurn = { speakerLabel: string; japanese: string; english: string; startSeconds: number; endSeconds: number };
export type ShadowTrack = { id: string; mediaPath: string; durationSeconds: number; scriptPurpose: string; turns: ShadowTurn[] };
export const smallTsuShadowQuestions = [
  {
    "id": "ex-l0-m03-c03-l08-001",
    "prompt": "What does the customer ask to buy in the bookstore?",
    "choices": [
      "One notebook",
      "Two books",
      "A postage stamp"
    ],
    "correct": 0,
    "why": "The customer says いっさつください after selecting a notebook: one notebook, please."
  },
  {
    "id": "ex-l0-m03-c03-l08-002",
    "prompt": "Which word contains a small っ in the bookstore scene?",
    "choices": [
      "ちょっと",
      "ちいさい",
      "あおい"
    ],
    "correct": 0,
    "why": "The clerk says ちょっとおまちください。 The small っ marks a hold before と."
  },
  {
    "id": "ex-l0-m03-c03-l08-003",
    "prompt": "Which phrase is the polite request to wait?",
    "choices": [
      "ちょっとおまちください",
      "このあおいノート",
      "なにをさがしていますか"
    ],
    "correct": 0,
    "why": "ちょっとおまちください is the clerk's request to wait briefly."
  },
  {
    "id": "ex-l0-m03-c03-l08-004",
    "prompt": "When do the friends plan to meet?",
    "choices": [
      "At three o'clock",
      "At two o'clock",
      "Tomorrow morning"
    ],
    "correct": 0,
    "why": "The woman says さんじにあいましょう: let's meet at three."
  },
  {
    "id": "ex-l0-m03-c03-l08-005",
    "prompt": "Where do they finally agree to meet?",
    "choices": [
      "In front of the park",
      "In front of the school",
      "At the bookstore"
    ],
    "correct": 0,
    "why": "The woman corrects the location to こうえんのまえであいましょう."
  },
  {
    "id": "ex-l0-m03-c03-l08-006",
    "prompt": "What does optional speaking self-review establish?",
    "choices": [
      "Personal observations only",
      "Certified pronunciation proficiency",
      "Native-speaker approval"
    ],
    "correct": 0,
    "why": "A self-review checklist is not an independent pronunciation evaluation."
  }
] as const;
export function scoreSmallTsuShadowKnowledge(answers: Record<string, number>) {
  return smallTsuShadowQuestions.filter(q => answers[q.id] === q.correct).length;
}
const rubric = [
  "I held the consonant briefly in ちょっと, rather than pronouncing a full つ.",
  "I repeated いっさつ with the short hold before さ.",
  "I kept the long vowel in がっこう and こうえん without adding a separate consonant.",
  "I shadowed the whole meeting invitation さんじにあいましょう at a comfortable pace.",
  "I compared my own rehearsal with the model without treating it as a speaking grade."
];
export default function SmallTsuShadowing({ tracks }: { tracks: ShadowTrack[] }) {
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
  const answered = smallTsuShadowQuestions.filter(q => answers[q.id] !== undefined).length;
  const score = scoreSmallTsuShadowKnowledge(answers);
  const submit = async () => {
    if (!ready || submitted || saving || answered !== smallTsuShadowQuestions.length) return;
    setSaving(true); setSaveError('');
    try { await recordAttempt('l0-m03-c03-l08-knowledge-v1', 'l0', score, smallTsuShadowQuestions.length); setSubmitted(true); }
    catch { setSaveError('Local score storage unavailable; your answers are preserved.'); }
    finally { setSaving(false); }
  };
  return <section className="foundation-practice speaking-practice vowel-speaking" aria-labelledby="small-tsu-shadow-title">
    <h2 id="small-tsu-shadow-title">Listen and shadow · optional speaking</h2>
    <p>These are the unchanged rights-cleared small-tsu and long-vowel bookstore and meeting recordings from Chapter 03 Lesson 06. Speaking is optional; no microphone is required and no automatic pronunciation grade is given.</p>
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
    <h3>Optional knowledge check · six scored questions</h3>
    <p>These assess meaning and practice strategy, not pronunciation. {answered} of {smallTsuShadowQuestions.length} answered.</p>
    {smallTsuShadowQuestions.map((q, i) => <fieldset className="foundation-question" key={q.id} data-question-id={q.id} disabled={!ready || submitted || saving}>
      <legend>{i + 1}. {q.prompt}</legend>
      <div className="foundation-options">{q.choices.map((choice, j) => <label key={choice} className="foundation-option">
        <input type="radio" name={q.id} checked={answers[q.id] === j} onChange={() => setAnswers(a => ({ ...a, [q.id]: j }))}/><span>{choice}</span>
      </label>)}</div>
      {submitted && <div className="foundation-feedback" role="note"><strong>{answers[q.id] === q.correct ? 'Correct' : 'Review'}</strong><p>{q.why}</p></div>}
    </fieldset>)}
    {saveError && <p role="alert">{saveError}</p>}
    {!submitted ? <button type="button" className="btn btn-primary" disabled={!ready || saving || answered !== smallTsuShadowQuestions.length} onClick={() => void submit()}>
      {saving ? 'Saving…' : 'Check preparation and save knowledge score'}</button> :
      <div className="foundation-result" role="status"><h3>{score} / {smallTsuShadowQuestions.length} knowledge answers correct</h3>
        <p>Numeric knowledge score saved locally. This does not measure your voice.</p>
        <button type="button" className="btn btn-outline" onClick={() => { setAnswers({}); setSubmitted(false); }}>Try again</button></div>}
  </section>;
}
