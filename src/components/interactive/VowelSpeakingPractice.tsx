import { useEffect, useRef, useState } from 'react';
import { recordAttempt } from '../../lib/progress';
import {
  vowelSpeakingQuestions, vowelSpeakingQuizId, vowelSpeakingRubric,
  scoreVowelSpeakingPreparation
} from '../../lib/vowelSpeakingPractice';

type RecordedTurn = {
  speaker: string;
  speakerLabel: string;
  japanese: string;
  english: string;
  startSeconds: number;
  endSeconds: number;
};
type ModelTrack = {
  id: string;
  mediaPath: string;
  durationSeconds: number;
  transcript: string;
  english: string;
  scriptPurpose: string;
  turns: RecordedTurn[];
};
type Props = { tracks: ModelTrack[] };

export default function VowelSpeakingPractice({ tracks }: Props) {
  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});
  const clipRef = useRef<{ id: string; until: number } | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const partsRef = useRef<Blob[]>([]);
  const recordingUrlRef = useRef<string | null>(null);
  const mounted = useRef(false);
  const [hydrated, setHydrated] = useState(false);
  const [audioErrors, setAudioErrors] = useState<Record<string, boolean>>({});
  const [rates, setRates] = useState<Record<string, number>>({});
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [recordBusy, setRecordBusy] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordUrl, setRecordUrl] = useState<string | null>(null);
  const [recordType, setRecordType] = useState('');
  const [recordError, setRecordError] = useState('');
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [transcripts, setTranscripts] = useState<Record<string, boolean>>({});

  useEffect(() => {
    mounted.current = true;
    setHydrated(true);
    return () => {
      mounted.current = false;
      if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
      streamRef.current?.getTracks().forEach(t => t.stop());
      if (recordingUrlRef.current) URL.revokeObjectURL(recordingUrlRef.current);
    };
  }, []);

  const stopMedia = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
  };
  const discardRecording = () => {
    if (recordingUrlRef.current) URL.revokeObjectURL(recordingUrlRef.current);
    recordingUrlRef.current = null;
    setRecordUrl(null);
    setRecordType('');
  };
  const startRecording = async () => {
    if (!hydrated || recording || recordBusy) return;
    setRecordError('');
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setRecordError('Local microphone recording is unavailable in this browser. You can still shadow aloud and use self-review.');
      return;
    }
    setRecordBusy(true);
    let stream: MediaStream | null = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      if (!mounted.current) { stream.getTracks().forEach(t => t.stop()); return; }
      discardRecording();
      partsRef.current = [];
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      recorder.ondataavailable = event => {
        if (event.data.size) partsRef.current.push(event.data);
      };
      recorder.onerror = () => {
        stopMedia();
        if (mounted.current) {
          setRecordError('Recording failed. Continue without a microphone or try again.');
          setRecording(false);
        }
      };
      recorder.onstop = () => {
        stopMedia();
        const blob = new Blob(partsRef.current, { type: recorder.mimeType || 'audio/webm' });
        if (!mounted.current) return;
        setRecording(false);
        if (!blob.size) {
          setRecordError('The microphone captured no audio. You can still speak aloud without a recording.');
          return;
        }
        const url = URL.createObjectURL(blob);
        recordingUrlRef.current = url;
        setRecordUrl(url);
        setRecordType(blob.type);
      };
      recorder.start();
      setRecording(true);
    } catch (error) {
      stream?.getTracks().forEach(t => t.stop());
      stopMedia();
      if (mounted.current) setRecordError(error instanceof Error
        ? 'Microphone unavailable: ' + error.message
        : 'Microphone unavailable. You can keep practising without recording.');
    } finally {
      if (mounted.current) setRecordBusy(false);
    }
  };
  const stopRecording = () => {
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
  };
  const downloadRecording = () => {
    if (!recordUrl) return;
    const ext = recordType.includes('mp4') ? 'm4a' : recordType.includes('ogg') ? 'ogg' : 'webm';
    const link = document.createElement('a');
    link.href = recordUrl;
    link.download = 'fja-vowel-shadowing-self-review.' + ext;
    link.click();
  };
  const playTurn = async (trackId: string, turn: RecordedTurn) => {
    const audio = audioRefs.current[trackId];
    if (!audio) return;
    try {
      audio.pause();
      clipRef.current = { id: trackId, until: turn.endSeconds };
      audio.currentTime = turn.startSeconds;
      await audio.play();
      setAudioErrors(old => ({ ...old, [trackId]: false }));
    } catch {
      clipRef.current = null;
      setAudioErrors(old => ({ ...old, [trackId]: true }));
    }
  };
  const timeUpdate = (id: string) => {
    const clip = clipRef.current;
    const player = audioRefs.current[id];
    if (clip && clip.id === id && player && player.currentTime >= clip.until - 0.055) {
      player.pause();
      clipRef.current = null;
    }
  };
  const answered = vowelSpeakingQuestions.filter(q => !!answers[q.id]).length;
  const score = scoreVowelSpeakingPreparation(answers);
  const submit = async () => {
    if (!hydrated || saving || submitted || answered !== vowelSpeakingQuestions.length) return;
    setSaveError(''); setSaving(true);
    try {
      await recordAttempt(vowelSpeakingQuizId, 'l0', score, vowelSpeakingQuestions.length);
      setSubmitted(true);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Could not save this preparation attempt.');
    } finally { setSaving(false); }
  };
  const replay = () => {
    setAnswers({});
    setSubmitted(false);
    setSaveError('');
  };
  const checked = vowelSpeakingRubric.filter(item => !!checks[item.id]).length;

  return <section className="foundation-practice speaking-practice vowel-speaking" aria-labelledby="vowel-speaking-title">
    <span className="eyebrow">OPTIONAL SPEAKING · CHAPTER 02 · LESSON 08</span>
    <h2 id="vowel-speaking-title">Listen, shadow, speak and self-review</h2>
    <p>Use these original, already-published AivisSpeech recordings from Lesson 06. Play a whole track, then isolate a turn with its true timing. Japanese and English cues are shown because this is <strong>speaking practice</strong>, not a blind listening assessment.</p>
    <p className="foundation-storage-note">Human pronunciation review of these synthetic models is still pending. This workshop never grades your accent, fluency or speaking performance automatically.</p>

    <div className="vowel-speaking-models">
      {tracks.map((track, index) => <section className="listening-track vowel-speaking-track" key={track.id} aria-labelledby={'shadow-track-' + index}>
        <span className="eyebrow">TRACK {index === 0 ? 'A' : 'B'} · {Math.round(track.durationSeconds)} SECONDS</span>
        <h3 id={'shadow-track-' + index}>{index === 0 ? 'A house or a shop?' : 'An aunt or a grandmother?'}</h3>
        <p>{index === 0
          ? 'Listen for the contrast between いえ (house) and いいえ (no).'
          : 'Listen for おばさん (aunt) and おばあさん (grandmother).'}</p>
        <audio ref={element => { audioRefs.current[track.id] = element; }}
          src={track.mediaPath} controls preload="metadata"
          aria-label={'Track ' + (index === 0 ? 'A' : 'B') + ' complete Japanese conversation'}
          onTimeUpdate={() => timeUpdate(track.id)}
          onError={() => setAudioErrors(old => ({ ...old, [track.id]: true }))}
          onCanPlay={() => setAudioErrors(old => ({ ...old, [track.id]: false }))}>
          Japanese model audio requires an audio-capable browser.
        </audio>
        {audioErrors[track.id] && <p role="alert" className="inline-error">The recording could not play. Read the model phrases below and practise speaking aloud; do not treat audio playback as verified until it works.</p>}
        <div className="vowel-speaking-rate">
          <label htmlFor={'shadow-rate-' + index}>Playback speed</label>
          <select id={'shadow-rate-' + index} value={rates[track.id] ?? 1}
            onChange={event => {
              const speed = Number(event.target.value);
              setRates(old => ({ ...old, [track.id]: speed }));
              if (audioRefs.current[track.id]) audioRefs.current[track.id]!.playbackRate = speed;
            }}>
            <option value={0.85}>0.85× (slower)</option>
            <option value={0.95}>0.95× (slightly slower)</option>
            <option value={1}>1× (normal)</option>
          </select>
        </div>
        <p className="vowel-speaking-instruction">Try each turn: listen → pause → imitate → compare the meaning.</p>
        <ol className="vowel-speaking-turns">
          {track.turns.map((turn, turnNumber) => <li key={index + '-' + turnNumber} className="vowel-speaking-turn">
            <div>
              <strong>{turn.speakerLabel === 'Man' ? 'Man' : 'Woman'} · Turn {turnNumber + 1}</strong>
              <p lang="ja">{turn.japanese}</p>
              <p className="muted">{turn.english}</p>
            </div>
            <button type="button" className="btn btn-outline" disabled={!hydrated || !!audioErrors[track.id]}
              onClick={() => playTurn(track.id, turn)}
              aria-label={'Play track ' + (index === 0 ? 'A' : 'B') + ' turn ' + (turnNumber + 1)}>
              Play this turn
            </button>
          </li>)}
        </ol>
        <button type="button" className="btn btn-outline" aria-expanded={!!transcripts[track.id]}
          onClick={() => setTranscripts(old => ({ ...old, [track.id]: !old[track.id] }))}>
          {transcripts[track.id] ? 'Hide full transcript' : 'Show full transcript and translation'}
        </button>
        {transcripts[track.id] && <div className="vowel-speaking-transcript">
          <h4>Japanese transcript</h4><p lang="ja" style={{ whiteSpace: 'pre-line' }}>{track.transcript}</p>
          <h4>English meaning</h4><p style={{ whiteSpace: 'pre-line' }}>{track.english}</p>
        </div>}
      </section>)}
    </div>

    <div className="writing-stage vowel-speaking-record">
      <span className="eyebrow">OPTIONAL · PRIVATE RECORDING</span>
      <h3>Compare your own speaking (only if you choose)</h3>
      <p>Say one or both responses out loud. You never need to give microphone access to complete this lesson. If you choose to record, the browser asks for permission only after you press Start. Audio stays on your device, is not uploaded and is discarded if you leave this page without downloading it.</p>
      <div className="writing-actions">
        {!recording
          ? <button type="button" className="btn btn-outline" onClick={startRecording} disabled={!hydrated || recordBusy}>
              {recordBusy ? 'Opening microphone…' : 'Start optional recording'}
            </button>
          : <button type="button" className="btn btn-primary" onClick={stopRecording}>Stop recording</button>}
        {recordUrl && <button type="button" className="btn btn-outline" onClick={downloadRecording}>Download my audio locally</button>}
        {recordUrl && <button type="button" className="btn btn-outline" onClick={discardRecording}>Discard my audio</button>}
      </div>
      {recording && <p role="status">Microphone recording is active. Press Stop when you finish the speaking attempt.</p>}
      {recordError && <p className="inline-error" role="alert">{recordError}</p>}
      {recordUrl && <div className="vowel-speaking-local-playback">
        <label htmlFor="vowel-speaking-my-audio">Replay your own attempt (local only)</label>
        <audio id="vowel-speaking-my-audio" src={recordUrl} controls />
      </div>}
      <p className="foundation-storage-note">You can speak aloud without using a microphone. No recording is required for the preparation questions, self-review, or lesson completion.</p>
    </div>

    <div className="writing-stage vowel-speaking-self-review">
      <span className="eyebrow">SELF-ASSESSMENT · NEVER MACHINE-GRADED</span>
      <h3>Five things to listen for in your own voice</h3>
      <p>Check only the criteria you believe you met after comparing with a model. Your checklist is a private reflection, not proof of correct pronunciation.</p>
      {vowelSpeakingRubric.map(item => <label className="writing-rubric-item" key={item.id}>
        <input type="checkbox" checked={!!checks[item.id]} onChange={event => setChecks(old => ({ ...old, [item.id]: event.target.checked }))} />
        <span><strong>{item.title}</strong><span>{item.tip}</span></span>
      </label>)}
      <p role="status"><strong>{checked} of {vowelSpeakingRubric.length} criteria checked by you.</strong> Choose one area to practise again. No numeric speaking grade is saved.</p>
    </div>

    <div className="foundation-practice__header vowel-speaking-questions">
      <span className="eyebrow">OPTIONAL PREPARATION · FIVE QUESTIONS</span>
      <h3>Check meaning and mora knowledge</h3>
      <p>These are text-based knowledge questions, not pronunciation measurements. A choice score may be stored in your browser's existing progress database. You can leave them unanswered and still mark this optional speaking lesson complete.</p>
      <p className="foundation-progress-label" aria-live="polite">{answered} of {vowelSpeakingQuestions.length} answers selected</p>
      <div className="foundation-progress" role="progressbar" aria-label="Preparation questions answered"
        aria-valuemin={0} aria-valuemax={vowelSpeakingQuestions.length} aria-valuenow={answered}>
        <span style={{ width: (answered / vowelSpeakingQuestions.length * 100) + '%' }} />
      </div>
    </div>
    {vowelSpeakingQuestions.map((q, index) => <fieldset key={q.id} className="foundation-question" disabled={!hydrated || submitted || saving}
      data-question-id={q.id}>
      <legend><span className="foundation-question__number">{String(index + 1).padStart(2, '0')}</span>{q.prompt}</legend>
      <div className="foundation-options">
        {q.choices.map(choice => <label key={choice.id} className={'foundation-option' +
          (answers[q.id] === choice.id ? ' foundation-option--selected' : '')}>
          <input type="radio" name={q.id} checked={answers[q.id] === choice.id}
            value={choice.id} onChange={() => setAnswers(old => ({ ...old, [q.id]: choice.id }))} />
          <span>{choice.text}</span>
        </label>)}
      </div>
      {submitted && <div className="foundation-feedback" role="note">
        <strong>{answers[q.id] === q.answerKey.choiceId ? 'Correct preparation answer' : 'Review the preparation answer'}</strong>
        <p>{q.explanation}</p>
      </div>}
    </fieldset>)}
    {saveError && <p className="inline-error" role="alert">{saveError} Your choices remain selected for another attempt.</p>}
    {!submitted ? <div className="foundation-practice__actions">
      <span className="muted">Complete all five questions to save an optional knowledge score (not a speaking grade).</span>
      <button type="button" className="btn btn-primary" disabled={!hydrated || saving || answered !== vowelSpeakingQuestions.length}
        onClick={submit}>{saving ? 'Saving…' : 'Check preparation & save knowledge score'}</button>
    </div> : <div className="foundation-result" role="status">
      <h3>{score} / {vowelSpeakingQuestions.length} preparation answers correct</h3>
      <p>Saved locally as a knowledge check only. Your voice, accent, confidence, and self-review were not graded or uploaded.</p>
      <button type="button" className="btn btn-outline" onClick={replay}>Try preparation again</button>
    </div>}
    <p className="foundation-storage-note">Privacy: only the optional written-answer aggregate score and separately chosen lesson completion go to your existing browser-only progress database. The self-review and microphone audio do not. Independent human pronunciation review remains pending.</p>
  </section>;
}
