import { useEffect, useRef, useState } from 'react';
import { recordAttempt } from '../../lib/progress';

type Turn = { speakerLabel: string; japanese: string; english: string; startSeconds: number; endSeconds: number };
type Track = { id: string; mediaPath: string; durationSeconds: number; scriptPurpose: string; transcript: string; english: string; turns: Turn[] };
type Question = { id: string; prompt: string; choices: { id: string; text: string; rationale: string }[]; answerKey: { choiceId: string }; explanation: string };
type Bank = { id: string; lessonId: string; items: Question[] };
const rubric = [
  ['Purpose','I can ask for help with Japanese input or a word reading in the correct classroom situation.'],
  ['Polite request','I can say 選んでください or 見てください as one connected polite request.'],
  ['Pacing','I pause at sentence boundaries without reading each kana separately.'],
  ['Clarity','I can repeat the model expression clearly and compare it with the actual recorded turn.'],
  ['Meaning','I understand the response before imitating it; I am not merely copying sounds.']
] as const;

export default function StudyToolsSpeakingPractice({ tracks, bank }: { tracks: Track[]; bank: Bank }) {
  const players = useRef<Record<string, HTMLAudioElement | null>>({});
  const clip = useRef<{ id: string; end: number } | null>(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const chunks = useRef<Blob[]>([]);
  const objectUrl = useRef<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [speed, setSpeed] = useState<Record<string, number>>({});
  const [recording, setRecording] = useState(false);
  const [recordUrl, setRecordUrl] = useState('');
  const [recordType, setRecordType] = useState('');
  const [recordError, setRecordError] = useState('');
  const [checks, setChecks] = useState<Record<number, boolean>>({});
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [transcripts, setTranscripts] = useState<Record<string, boolean>>({});
  useEffect(() => {
    setHydrated(true);
    return () => {
      if (recorder.current?.state === 'recording') recorder.current.stop();
      stream.current?.getTracks().forEach(t => t.stop());
      if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    };
  }, []);
  const discard = () => {
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    objectUrl.current = null; setRecordUrl(''); setRecordType('');
  };
  const start = async () => {
    setRecordError('');
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setRecordError('Microphone recording is unavailable. You can still shadow aloud.'); return;
    }
    try {
      const mic = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      stream.current = mic; discard(); chunks.current = [];
      const rec = new MediaRecorder(mic); recorder.current = rec;
      rec.ondataavailable = e => { if (e.data.size) chunks.current.push(e.data); };
      rec.onerror = () => { setRecordError('Recording failed; continue without the microphone.'); setRecording(false); mic.getTracks().forEach(t => t.stop()); };
      rec.onstop = () => {
        mic.getTracks().forEach(t => t.stop()); setRecording(false);
        const blob = new Blob(chunks.current, { type: rec.mimeType || 'audio/webm' });
        if (!blob.size) { setRecordError('No audio captured.'); return; }
        const url = URL.createObjectURL(blob); objectUrl.current = url;
        setRecordUrl(url); setRecordType(blob.type);
      };
      rec.start(); setRecording(true);
    } catch { setRecordError('Microphone permission denied or unavailable. Speaking aloud remains an option.'); }
  };
  const playTurn = async (id: string, turn: Turn) => {
    const player = players.current[id]; if (!player) return;
    try { player.pause(); clip.current = { id, end: turn.endSeconds }; player.currentTime = turn.startSeconds; await player.play(); setErrors(e => ({ ...e, [id]: '' })); }
    catch { clip.current = null; setErrors(e => ({ ...e, [id]: 'Audio playback failed; do not treat this model as heard.' })); }
  };
  const timeUpdate = (id: string) => {
    const p = players.current[id];
    if (p && clip.current?.id === id && p.currentTime >= clip.current.end - 0.055) { p.pause(); clip.current = null; }
  };
  const selected = bank.items.filter(q => answers[q.id]).length;
  const score = bank.items.filter(q => answers[q.id] === q.answerKey.choiceId).length;
  const submit = async () => {
    if (!hydrated || saving || submitted || selected !== bank.items.length) return;
    setSaving(true); setSaveError('');
    try { await recordAttempt(bank.id, 'l0', score, bank.items.length); setSubmitted(true); }
    catch { setSaveError('Could not save the knowledge score locally. Your choices remain selected.'); }
    finally { setSaving(false); }
  };
  return <section className="foundation-practice speaking-practice vowel-speaking" aria-labelledby="tools-speaking-heading">
    <span className="eyebrow">OPTIONAL SPEAKING · CHAPTER 04 · LESSON 08</span>
    <h2 id="tools-speaking-heading">Listen, shadow and self-review</h2>
    <p>These are the unchanged licensed Chapter 04 Lesson 06 conversations. Read the displayed turns to support speaking; this is not a blind listening assessment. No automatic speech scoring is performed.</p>
    <div className="vowel-speaking-models">
      {tracks.map((track, index) => <section key={track.id} className="listening-track vowel-speaking-track" aria-labelledby={'tools-track-' + index}>
        <span className="eyebrow">TRACK {index ? 'B' : 'A'} · {Math.round(track.durationSeconds)} SECONDS</span>
        <h3 id={'tools-track-' + index}>{index ? 'Checking a reading' : 'At the classroom'}</h3>
        <p>{track.scriptPurpose}</p>
        <audio controls preload="metadata" src={track.mediaPath} ref={el => { players.current[track.id] = el; }}
          aria-label={'Track ' + (index ? 'B' : 'A') + ' complete Japanese model conversation'}
          onTimeUpdate={() => timeUpdate(track.id)}
          onError={() => setErrors(e => ({ ...e, [track.id]: 'Audio could not load. Try again when the recording is available.' }))}
          onCanPlay={() => setErrors(e => ({ ...e, [track.id]: '' }))} />
        {errors[track.id] && <p role="alert" className="inline-error">{errors[track.id]}</p>}
        <div className="vowel-speaking-rate"><label htmlFor={'tools-speed-' + index}>Playback speed</label>
          <select id={'tools-speed-' + index} value={speed[track.id] ?? 1} onChange={e => {
            const value = Number(e.target.value); setSpeed(s => ({ ...s, [track.id]: value }));
            if (players.current[track.id]) players.current[track.id]!.playbackRate = value;
          }}><option value={0.85}>0.85×</option><option value={0.95}>0.95×</option><option value={1}>1× normal</option></select>
        </div>
        <ol className="vowel-speaking-turns">{track.turns.map((turn, n) => <li className="vowel-speaking-turn" key={n}>
          <div><strong>{turn.speakerLabel} · Turn {n + 1}</strong><p lang="ja">{turn.japanese}</p><p className="muted">{turn.english}</p></div>
          <button className="btn btn-outline" type="button" disabled={!hydrated || !!errors[track.id]}
            aria-label={'Play track ' + (index ? 'B' : 'A') + ' turn ' + (n + 1)} onClick={() => playTurn(track.id, turn)}>Play this turn</button>
        </li>)}</ol>
        <button type="button" className="btn btn-outline" aria-expanded={!!transcripts[track.id]}
          onClick={() => setTranscripts(t => ({ ...t, [track.id]: !t[track.id] }))}>{transcripts[track.id] ? 'Hide' : 'Show'} full transcript and translation</button>
        {transcripts[track.id] && <div className="vowel-speaking-transcript"><h4>Japanese</h4><p lang="ja" style={{ whiteSpace: 'pre-line' }}>{track.transcript}</p><h4>English</h4><p style={{ whiteSpace: 'pre-line' }}>{track.english}</p></div>}
      </section>)}
    </div>
    <div className="writing-stage vowel-speaking-record"><h3>Optional private microphone practice</h3>
      <p>Recording starts only when you press Start and allow access. The audio stays in this browser tab; it is never uploaded or saved to Dexie. You can practise without a microphone.</p>
      <div className="writing-actions">{!recording
        ? <button type="button" className="btn btn-outline" disabled={!hydrated} onClick={start}>Start optional recording</button>
        : <button type="button" className="btn btn-primary" onClick={() => recorder.current?.stop()}>Stop recording</button>}
        {recordUrl && <button type="button" className="btn btn-outline" onClick={() => {
          const link = document.createElement('a'); link.href = recordUrl;
          link.download = 'fja-classroom-shadowing.' + (recordType.includes('mp4') ? 'm4a' : recordType.includes('ogg') ? 'ogg' : 'webm'); link.click();
        }}>Download locally</button>}
        {recordUrl && <button type="button" className="btn btn-outline" onClick={discard}>Discard recording</button>}
      </div>
      {recording && <p role="status">Recording in progress; press Stop when ready.</p>}
      {recordError && <p role="alert" className="inline-error">{recordError}</p>}
      {recordUrl && <audio aria-label="My private speaking recording" controls src={recordUrl} />}
    </div>
    <div className="writing-stage vowel-speaking-self-review"><h3>Self-review, not a pronunciation grade</h3>
      {rubric.map(([title, tip], n) => <label key={title} className="writing-rubric-item"><input type="checkbox" checked={!!checks[n]}
        onChange={e => setChecks(s => ({ ...s, [n]: e.target.checked }))} /><span><strong>{title}</strong><span>{tip}</span></span></label>)}
      <p role="status">{rubric.filter((_, n) => checks[n]).length} of {rubric.length} self-review criteria checked. No speaking score is saved.</p>
    </div>
    <div className="foundation-practice__header"><span className="eyebrow">OPTIONAL KNOWLEDGE CHECK</span><h3>Five preparation questions</h3>
      <p>These assess classroom meaning and speaking preparation only, never your voice.</p>
      <p aria-live="polite">{selected} of {bank.items.length} selected</p>
    </div>
    {bank.items.map((q, n) => <fieldset className="foundation-question" key={q.id} data-question-id={q.id} disabled={!hydrated || submitted || saving}>
      <legend><span className="foundation-question__number">{String(n + 1).padStart(2, '0')}</span>{q.prompt}</legend>
      <div className="foundation-options">{q.choices.map(choice => <label className={'foundation-option' + (answers[q.id] === choice.id ? ' foundation-option--selected' : '')} key={choice.id}>
        <input type="radio" name={q.id} value={choice.id} checked={answers[q.id] === choice.id} onChange={() => setAnswers(s => ({ ...s, [q.id]: choice.id }))} /><span>{choice.text}</span>
      </label>)}</div>
      {submitted && <div className="foundation-feedback" role="note"><strong>{answers[q.id] === q.answerKey.choiceId ? 'Correct' : 'Review this answer'}</strong>
        <p>{q.explanation}</p><p>{q.choices.find(c => c.id === answers[q.id])?.rationale}</p></div>}
    </fieldset>)}
    {saveError && <p role="alert" className="inline-error">{saveError}</p>}
    {!submitted ? <button type="button" className="btn btn-primary" disabled={!hydrated || saving || selected !== bank.items.length} onClick={submit}>
      {saving ? 'Saving…' : 'Check preparation and save knowledge score'}</button>
      : <div className="foundation-result" role="status"><h3>{score} / {bank.items.length} knowledge answers correct</h3>
        <p>Saved locally. This does not measure pronunciation.</p><button type="button" className="btn btn-outline" onClick={() => { setAnswers({}); setSubmitted(false); }}>Try again</button></div>}
  </section>;
}
