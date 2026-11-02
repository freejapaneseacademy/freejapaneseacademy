import { useEffect, useRef, useState } from 'react';
import { recordAttempt } from '../../lib/progress';
import {
  speakingTracks, speakingCues, speakingRubric, speakingQuestions,
  speakingQuizId, scoreSpeakingPreparation
} from '../../lib/speakingPractice';

export default function SpeakingPractice() {
  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const urlRef = useRef<string | null>(null);
  const mountedRef = useRef(false);
  const [ready, setReady] = useState(false);
  const [rates, setRates] = useState<Record<string,number>>({ a: 1, b: 1 });
  const [audioErrors, setAudioErrors] = useState<Record<string,boolean>>({});
  const [answers, setAnswers] = useState<Record<string,string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [recording, setRecording] = useState(false);
  const [recordBusy, setRecordBusy] = useState(false);
  const [recordError, setRecordError] = useState('');
  const [recordUrl, setRecordUrl] = useState<string | null>(null);
  const [selfChecks, setSelfChecks] = useState<Record<string,boolean>>({});

  useEffect(() => {
    mountedRef.current = true;
    setReady(true);
    return () => {
      mountedRef.current = false;
      if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
      streamRef.current?.getTracks().forEach(track => track.stop());
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    };
  }, []);

  const discardRecording = () => {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current = null;
    setRecordUrl(null);
  };
  const stopTracks = () => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
  };
  const startRecording = async () => {
    if (!ready || recording || recordBusy) return;
    setRecordError('');
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setRecordError('This browser does not support local microphone recording. You can still speak aloud and use the self-review checklist.');
      return;
    }
    setRecordBusy(true);
    let stream: MediaStream | null = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      if (!mountedRef.current) { stream.getTracks().forEach(t => t.stop()); return; }
      discardRecording();
      streamRef.current = stream;
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      recorder.ondataavailable = event => { if (event.data.size > 0) chunksRef.current.push(event.data); };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        stopTracks();
        if (mountedRef.current) {
          if (blob.size > 0) {
            const url = URL.createObjectURL(blob);
            urlRef.current = url;
            setRecordUrl(url);
          } else {
            setRecordError('No sound data was captured. Try again or practise without recording.');
          }
          setRecording(false);
        }
      };
      recorder.onerror = () => { if (mountedRef.current) setRecordError('The microphone recording failed. You can practise without recording.'); };
      recorder.start();
      setRecording(true);
    } catch (cause) {
      stream?.getTracks().forEach(track => track.stop());
      setRecordError(cause instanceof Error ? 'Microphone unavailable: ' + cause.message : 'Microphone unavailable. You can practise without recording.');
    } finally {
      if (mountedRef.current) setRecordBusy(false);
    }
  };
  const stopRecording = () => {
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
  };
  const replay = async (id: string) => {
    const audio = audioRefs.current[id];
    if (!audio) return;
    try { audio.currentTime = 0; await audio.play(); }
    catch { setAudioErrors(previous => ({ ...previous, [id]: true })); }
  };
  const answered = speakingQuestions.filter(q => Boolean(answers[q.id])).length;
  const score = scoreSpeakingPreparation(answers);
  const submit = async () => {
    if (!ready || submitted || saving || answered !== speakingQuestions.length) return;
    setSaveError(''); setSaving(true);
    try {
      await recordAttempt(speakingQuizId, 'l0', score, speakingQuestions.length);
      setSubmitted(true);
    } catch (cause) {
      setSaveError(cause instanceof Error ? cause.message : 'Could not save your preparation check.');
    } finally { setSaving(false); }
  };
  const checked = speakingRubric.filter(item => selfChecks[item.id]).length;

  return <section className="foundation-practice speaking-practice" aria-labelledby="speaking-workshop-title">
    <span className="eyebrow">OPTIONAL SPEAKING · LESSON 08</span>
    <h2 id="speaking-workshop-title">Listen, shadow, explain and self-review</h2>
    <p>Listen to the actual narrated models from Lesson 06. They are reused here with permission, not regenerated or replaced. First listen to a whole track; then replay, pause after each printed cue, and say it aloud. The cues below occur in the audio in the same order.</p>
    <p className="foundation-storage-note">MeloTTS by MyShell.ai generated these original academy-script recordings. No independent human pronunciation verification is claimed. Speaking is optional, and nothing here automatically judges your accent or fluency.</p>
    <div className="listening-tracks">
      {speakingTracks.map(track => <section className="listening-track" key={track.id} aria-labelledby={'speaking-model-' + track.id}>
        <h3 id={'speaking-model-' + track.id}>{track.label}</h3>
        <p>About {Math.round(track.durationSeconds)} seconds. Listen to the complete track; use pause and seek in the native player to practise one phrase at a time.</p>
        <audio ref={element => { audioRefs.current[track.id] = element; }} controls preload="metadata" src={track.url}
          aria-label={track.label + ' original Japanese model audio'}
          onError={() => setAudioErrors(old => ({ ...old, [track.id]: true }))}
          onCanPlay={() => setAudioErrors(old => ({ ...old, [track.id]: false }))}>
          Your browser does not support audio playback.
        </audio>
        {audioErrors[track.id] && <p className="inline-error" role="alert">This model recording could not be played. Check your connection. Do not use silent or imagined audio as a model.</p>}
        <div className="listening-playback-options">
          <label htmlFor={'speaking-speed-' + track.id}>Playback speed</label>
          <select id={'speaking-speed-' + track.id} value={rates[track.id]} onChange={event => {
            const value = Number(event.target.value);
            setRates(old => ({ ...old, [track.id]: value }));
            if (audioRefs.current[track.id]) audioRefs.current[track.id]!.playbackRate = value;
          }}><option value={0.85}>0.85× slow</option><option value={1}>1× normal</option><option value={1.15}>1.15× fast</option></select>
          <button className="btn btn-outline" type="button" onClick={() => void replay(track.id)}>Replay full model</button>
        </div>
        <ol className="speaking-cues">
          {speakingCues.filter(cue => cue.track === track.id).map(cue => <li key={cue.id}>
            <p lang="ja" className="speaking-cue-jp">{cue.japanese}</p>
            <p>{cue.english}</p><p className="muted">Pronunciation and pacing focus: {cue.tip}</p>
          </li>)}
        </ol>
      </section>)}
    </div>

    <section className="writing-stage" aria-labelledby="speaking-dialogue-title">
      <h3 id="speaking-dialogue-title">Guided classroom teach-back</h3>
      <p>Imagine showing four classroom cards to a classmate. Listen to the model, then say the following connected explanation slowly. These sentences are a rehearsal using the recorded phrases, not a claim that the full script is a separate recording.</p>
      <ol className="speaking-dialogue">
        <li><span lang="ja">はじめは、ひらがなです。「あ」は、ひらがなです。</span> — First, hiragana; あ is hiragana.</li>
        <li><span lang="ja">つぎは、カタカナです。「ア」は、カタカナです。</span> — Next, katakana; ア is katakana.</li>
        <li><span lang="ja">つぎは、かんじです。「山」は、かんじです。「やま」と よみます。</span> — Next, kanji; 山 is read やま.</li>
        <li><span lang="ja">ローマじは、アルファベットで にほんごを かく ほうほうです。</span> — Romaji represents Japanese with Latin letters.</li>
      </ol>
      <p>Make your explanation useful: point to the actual cards, pause between examples and, if your partner does not understand, repeat the short phrase rather than rushing. Do not treat romaji as a fourth Japanese spoken language or やま as an English translation.</p>
    </section>

    <section className="writing-stage" aria-labelledby="speaking-prepare-title">
      <h3 id="speaking-prepare-title">Quick meaning check (not a pronunciation grade)</h3>
      <p>Five optional text questions help you choose the right phrase for the classroom situation. Your score measures only these choices, never your spoken performance. Answer all five to save an attempt in your browser.</p>
      <div className="foundation-progress-label" aria-live="polite">{answered} of {speakingQuestions.length} choices answered</div>
      <div className="foundation-progress" role="progressbar" aria-label="Preparation questions answered" aria-valuemin={0} aria-valuemax={speakingQuestions.length} aria-valuenow={answered}><span style={{ width: 100 * answered / speakingQuestions.length + '%' }} /></div>
      {speakingQuestions.map((q, index) => <fieldset className="foundation-question" key={q.id} data-question-id={q.id} disabled={!ready || submitted || saving}>
        <legend><span className="foundation-question__number">{String(index + 1).padStart(2, '0')}</span>{q.prompt}</legend>
        <div className="foundation-options">{q.choices.map(choice => <label className={'foundation-option' + (answers[q.id] === choice.id ? ' foundation-option--selected' : '')} key={choice.id}>
          <input type="radio" name={q.id} value={choice.id} checked={answers[q.id] === choice.id} onChange={() => setAnswers(old => ({ ...old, [q.id]: choice.id }))} />
          <span lang={/[\u3040-\u30ff\u3400-\u9fff]/.test(choice.text) ? 'ja' : undefined}>{choice.text}</span>
        </label>)}</div>
        {submitted && <div className="foundation-feedback" role="note">
          <strong>{answers[q.id] === q.answerKey.choiceId ? 'Correct choice' : 'Review this choice'}</strong>
          <p>{q.explanation}</p>
          {answers[q.id] !== q.answerKey.choiceId && <p className="foundation-feedback__why">Why that option did not fit: {q.choices.find(choice => choice.id === answers[q.id])?.rationale}</p>}
        </div>}
      </fieldset>)}
      {saveError && <p className="inline-error" role="alert">{saveError} Your answers have been kept.</p>}
      {!submitted ? <div className="foundation-practice__actions"><span className="muted">This check is optional. Speaking practice never requires a saved score.</span>
        <button type="button" className="btn btn-primary" disabled={!ready || saving || answered !== speakingQuestions.length} onClick={() => void submit()}>{saving ? 'Saving…' : 'Check phrases & save choice score'}</button>
      </div> : <div className="foundation-result" role="status"><h3>{score} / {speakingQuestions.length} phrase choices</h3>
        <p>Saved locally as a preparation check, not a pronunciation or speaking grade.</p>
        <button className="btn btn-outline" type="button" onClick={() => { setAnswers({}); setSubmitted(false); setSaveError(''); }}>Try the phrase choices again</button>
      </div>}
    </section>

    <section className="writing-stage" aria-labelledby="speaking-record-title">
      <h3 id="speaking-record-title">Optional private recording</h3>
      <p>You can speak aloud without using a microphone. Only selecting “Start optional recording” requests microphone permission. A recording stays as a temporary object URL in this tab; it is never uploaded, sent to an AI, or saved to Dexie. It disappears when you leave or refresh.</p>
      <div className="speaking-record-actions">
        {!recording ? <button className="btn btn-outline" type="button" disabled={!ready || recordBusy} onClick={() => void startRecording()}>{recordBusy ? 'Requesting microphone…' : 'Start optional recording'}</button>
          : <button className="btn btn-outline" type="button" onClick={stopRecording}>Stop recording</button>}
        {recordUrl && !recording && <button className="btn btn-outline" type="button" onClick={discardRecording}>Delete local recording</button>}
      </div>
      {recording && <p role="status">Microphone is recording in this tab. Select “Stop recording” to finish. Your audio is not being uploaded.</p>}
      {recordError && <p className="inline-error" role="alert">{recordError}</p>}
      {recordUrl && !recording && <div className="speaking-local-playback"><label htmlFor="speaking-local-audio">Listen to your own attempt</label>
        <audio id="speaking-local-audio" controls src={recordUrl}>Your browser does not support audio playback.</audio>
        <p className="muted">Compare your pacing with the model yourself. No automatic scoring or voice recognition is performed.</p>
      </div>}
    </section>

    <section className="writing-stage" aria-labelledby="speaking-rubric-title">
      <h3 id="speaking-rubric-title">Your self-review checklist</h3>
      <p>After rehearsing, check only the statements you genuinely achieved. You can change them as you practise. This is not a certified proficiency rating.</p>
      {speakingRubric.map(item => <label className="writing-rubric-item" key={item.id}>
        <input type="checkbox" checked={Boolean(selfChecks[item.id])} onChange={event => setSelfChecks(old => ({ ...old, [item.id]: event.target.checked }))} />
        <span><strong>{item.label}</strong><span>{item.help}</span></span>
      </label>)}
      <p role="status" className="foundation-storage-note">{checked} of {speakingRubric.length} criteria checked by you. These checks are not saved as mastery evidence.</p>
      <p>Try again after a short break: listen to a complete model at normal speed, shadow two lines, then give the four-script explanation in your own pace. If you cannot record, the speaking and self-review practice is still fully available.</p>
    </section>
    <p className="foundation-storage-note">Lesson completion and bookmarking are separate browser-local actions below. No microphone access is required for completion. Independent human audio pronunciation and speaking assessment reviews are pending.</p>
  </section>;
}
