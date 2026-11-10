import { useEffect, useRef, useState } from 'react';
import { recordAttempt } from '../../lib/progress';

export type ShadowTurn = { speakerLabel: string; japanese: string; english: string; startSeconds: number; endSeconds: number };
export type ShadowTrack = { id: string; mediaPath: string; durationSeconds: number; scriptPurpose: string; turns: ShadowTurn[] };
export const yoonShadowQuestions = [
  {
    "id": "ex-l0-m03-c02-l08-001",
    "prompt": "What does the customer request in the café scene?",
    "choices": [
      "Milk",
      "Tea",
      "Water"
    ],
    "correct": 0,
    "why": "The customer says ぎゅうにゅうをください。 The word ぎゅうにゅう means milk; the contracted ぎゅ contains small ゅ."
  },
  {
    "id": "ex-l0-m03-c02-l08-002",
    "prompt": "Which sound is written with a small ゅ in the requested drink?",
    "choices": [
      "ぎゅ",
      "ぎゆ",
      "ぎょ"
    ],
    "correct": 0,
    "why": "ぎゅ is a blended contracted sound. ぎゆ uses full-sized ゆ and is not the same written form."
  },
  {
    "id": "ex-l0-m03-c02-l08-003",
    "prompt": "Which phrase asks the customer to wait a moment?",
    "choices": [
      "しょうしょうおまちください",
      "つめたいのをひとつください",
      "こんにちは"
    ],
    "correct": 0,
    "why": "The staff member says しょうしょうおまちください。 The word しょうしょう contains small ょ twice."
  },
  {
    "id": "ex-l0-m03-c02-l08-004",
    "prompt": "Where does the woman plan to go on Sunday?",
    "choices": [
      "The library",
      "The café",
      "The park"
    ],
    "correct": 0,
    "why": "She answers としょかんへいきます。 The word としょかん means library and しょ uses small ょ."
  },
  {
    "id": "ex-l0-m03-c02-l08-005",
    "prompt": "What does the woman invite the other person to do together?",
    "choices": [
      "Read books",
      "Drink milk",
      "Take photos"
    ],
    "correct": 0,
    "why": "She says いっしょにほんをよみましょう。 This is an invitation to read books together."
  },
  {
    "id": "ex-l0-m03-c02-l08-006",
    "prompt": "What can your optional shadowing self-review establish?",
    "choices": [
      "Your own ungraded observations",
      "A certified pronunciation result",
      "A native-speaker evaluation"
    ],
    "correct": 0,
    "why": "Self-review is practice, not a qualified evaluation. The six scored questions measure meaning and written sound awareness only."
  }
] as const;
export function scoreYoonShadowKnowledge(answers: Record<string, number>) {
  return yoonShadowQuestions.filter(q => answers[q.id] === q.correct).length;
}
const rubric = [
 'I heard and repeated ぎゅ in ぎゅうにゅう without separating it into ぎ・ゆ.',
 'I shadowed ぎゅうにゅうをください。 as a connected polite request.',
 'I kept しょ blended in としょかん when repeating the library destination.',
 'I rehearsed いっしょにほんをよみましょう。 without losing the small っ or ょ.',
 'I compared my own rehearsal with the model without claiming a speaking grade.'
];
export default function YoonKanaShadowing({ tracks }: { tracks: ShadowTrack[] }) {
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
  const answered = yoonShadowQuestions.filter(q => answers[q.id] !== undefined).length;
  const score = scoreYoonShadowKnowledge(answers);
  const submit = async () => {
    if (!ready || submitted || saving || answered !== yoonShadowQuestions.length) return;
    setSaving(true); setSaveError('');
    try { await recordAttempt('l0-m03-c02-l08-knowledge-v1', 'l0', score, yoonShadowQuestions.length); setSubmitted(true); }
    catch { setSaveError('Local score storage unavailable; your answers are preserved.'); }
    finally { setSaving(false); }
  };
  return <section className="foundation-practice speaking-practice vowel-speaking" aria-labelledby="yoon-shadow-title">
    <h2 id="yoon-shadow-title">Listen and shadow · optional speaking</h2>
    <p>These are the unchanged rights-cleared contracted-kana café and library recordings from Chapter 02 Lesson 06. Speaking is optional; no microphone is required and no automatic pronunciation grade is given.</p>
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
    <p>These assess meaning and practice strategy, not pronunciation. {answered} of {yoonShadowQuestions.length} answered.</p>
    {yoonShadowQuestions.map((q, i) => <fieldset className="foundation-question" key={q.id} data-question-id={q.id} disabled={!ready || submitted || saving}>
      <legend>{i + 1}. {q.prompt}</legend>
      <div className="foundation-options">{q.choices.map((choice, j) => <label key={choice} className="foundation-option">
        <input type="radio" name={q.id} checked={answers[q.id] === j} onChange={() => setAnswers(a => ({ ...a, [q.id]: j }))}/><span>{choice}</span>
      </label>)}</div>
      {submitted && <div className="foundation-feedback" role="note"><strong>{answers[q.id] === q.correct ? 'Correct' : 'Review'}</strong><p>{q.why}</p></div>}
    </fieldset>)}
    {saveError && <p role="alert">{saveError}</p>}
    {!submitted ? <button type="button" className="btn btn-primary" disabled={!ready || saving || answered !== yoonShadowQuestions.length} onClick={() => void submit()}>
      {saving ? 'Saving…' : 'Check preparation and save knowledge score'}</button> :
      <div className="foundation-result" role="status"><h3>{score} / {yoonShadowQuestions.length} knowledge answers correct</h3>
        <p>Numeric knowledge score saved locally. This does not measure your voice.</p>
        <button type="button" className="btn btn-outline" onClick={() => { setAnswers({}); setSubmitted(false); }}>Try again</button></div>}
  </section>;
}
