import { useEffect, useRef, useState } from 'react';
import { recordAttempt } from '../../lib/progress';
import { checkpointQuestions, checkpointQuizId, scoreCheckpointQuestions } from '../../lib/checkpointPractice';
import { readingRows } from '../../lib/readingPractice';
import { listeningTracks } from '../../lib/listeningPractice';

export default function CheckpointPractice() {
  const [ready,setReady] = useState(false);
  const [answers,setAnswers] = useState<Record<string,string>>({});
  const [played,setPlayed] = useState<Record<string,boolean>>({});
  const [failed,setFailed] = useState<Record<string,boolean>>({});
  const [rates,setRates] = useState<Record<string,number>>({a:1,b:1});
  const [revealed,setRevealed] = useState<Record<string,boolean>>({});
  const [assisted,setAssisted] = useState(false);
  const [submitted,setSubmitted] = useState(false);
  const [saved,setSaved] = useState(false);
  const [saving,setSaving] = useState(false);
  const [error,setError] = useState('');
  const [draft,setDraft] = useState('');
  const [showModel,setShowModel] = useState(false);
  const audioRefs = useRef<Record<string,HTMLAudioElement|null>>({});
  useEffect(()=>setReady(true),[]);
  const answered = checkpointQuestions.filter(q=>Boolean(answers[q.id])).length;
  const heardAll = listeningTracks.every(t=>played[t.id]);
  const hasAudioError = Object.values(failed).some(Boolean);
  const score = scoreCheckpointQuestions(answers);
  const reveal = (id:string) => {
    setRevealed(old=>({...old,[id]:!old[id]}));
    if(!submitted)setAssisted(true);
  };
  const submit = async () => {
    if(!ready || saving || submitted || answered !== checkpointQuestions.length || !heardAll || hasAudioError)return;
    setError('');
    if(assisted){setSubmitted(true);setSaved(false);return;}
    setSaving(true);
    try {
      await recordAttempt(checkpointQuizId,'l0',score,checkpointQuestions.length);
      setSaved(true);setSubmitted(true);
    } catch(e) {
      setError(e instanceof Error?e.message:'Could not save your checkpoint attempt.');
    } finally {setSaving(false);}
  };
  const restart = () => {
    Object.values(audioRefs.current).forEach(audio=>audio?.pause());
    setAnswers({});setPlayed({});setFailed({});setRevealed({});setAssisted(false);
    setSubmitted(false);setSaved(false);setError('');
  };
  return <section className="foundation-practice checkpoint-practice" aria-labelledby="checkpoint-title">
    <div className="foundation-practice__header">
      <span className="eyebrow">CHAPTER 01 · MIXED CHECKPOINT</span>
      <h2 id="checkpoint-title">Find the evidence. Hear the detail. Explain the pattern.</h2>
      <p>Eight concept questions, four chart-reading questions and four listening questions. You can replay the audio and read the chart as often as needed. Explanations appear only after submission.</p>
      <p className="foundation-storage-note">The same two real, original synthetic Japanese WAV recordings from Lesson 06 are reused unchanged. Independent human pronunciation and assessment review remain pending.</p>
    </div>
    <div className="listening-tracks">
      {listeningTracks.map((track,i)=><section className="listening-track" key={track.id} aria-labelledby={'checkpoint-track-'+track.id}>
        <span className="eyebrow">LISTENING SOURCE {i+1} · ABOUT {Math.round(track.durationSeconds)} SECONDS</span>
        <h3 id={'checkpoint-track-'+track.id}>Recording {track.id.toUpperCase()}</h3>
        <p>Listen before reading the transcript. Use the native controls to pause or replay.</p>
        <audio ref={el=>{audioRefs.current[track.id]=el;}} controls preload="metadata" src={track.url}
          aria-label={'Recording '+track.id.toUpperCase()+' Japanese narration'}
          onPlay={()=>setPlayed(p=>({...p,[track.id]:true}))}
          onError={()=>setFailed(p=>({...p,[track.id]:true}))}
          onCanPlay={()=>setFailed(p=>({...p,[track.id]:false}))}>
          Your browser does not support audio playback.
        </audio>
        {failed[track.id]&&<p role="alert" className="inline-error">Recording unavailable. Check your connection and retry playback; scoring requires both recordings.</p>}
        <div className="listening-playback-options">
          <label htmlFor={'checkpoint-speed-'+track.id}>Playback speed</label>
          <select id={'checkpoint-speed-'+track.id} value={rates[track.id]} onChange={e=>{
            const rate=Number(e.target.value);setRates(s=>({...s,[track.id]:rate}));
            if(audioRefs.current[track.id])audioRefs.current[track.id]!.playbackRate=rate;
          }}><option value={0.8}>0.8× slower</option><option value={1}>1× normal</option><option value={1.2}>1.2× faster</option></select>
          <span className="muted">{played[track.id]?'Playback started':'Not yet played'}</span>
        </div>
        <button type="button" className="btn btn-outline" onClick={()=>reveal(track.id)} aria-expanded={Boolean(revealed[track.id])}>
          {revealed[track.id]?'Hide transcript':'Reveal transcript (assisted practice)'}
        </button>
        {revealed[track.id]&&<div className="listening-transcript">
          <strong>Japanese transcript</strong><p lang="ja">{track.transcript}</p>
          <strong>English meaning</strong><p>{track.english}</p>
        </div>}
      </section>)}
    </div>
    {assisted&&!submitted&&<p className="listening-mode-note" role="status">Assisted mode: a transcript was revealed before submission. You can review all answers, but this attempt will not be stored as a blind checkpoint score.</p>}
    <div className="foundation-practice__header">
      <h2>Read the original classroom chart</h2>
      <p>Rows A–I are the same original source chart from Lesson 05. Read the teacher's note to locate evidence. The checkpoint questions below are new.</p>
    </div>
    <div className="reading-chart-scroll" role="region" aria-label="Chapter checkpoint reading chart; scroll horizontally on small screens" tabIndex={0}>
      <table className="reading-chart">
        <caption>Classroom handout: nine examples of Japanese writing</caption>
        <thead><tr><th scope="col">Row</th><th scope="col">Example</th><th scope="col">Writing</th><th scope="col">Teacher's note</th></tr></thead>
        <tbody>{readingRows.map(row=><tr key={row.id}><th scope="row">{row.id}</th>
          <td className="reading-chart__jp" lang={row.id==='G'?'ja-Latn':'ja'}>{row.furigana?<ruby>{row.printed}<rt>{row.furigana}</rt></ruby>:row.printed}</td>
          <td>{row.script}</td><td>{row.note}</td></tr>)}</tbody>
      </table>
    </div>
    <div className="foundation-practice__header">
      <h2>Sixteen original questions</h2>
      <p>Questions 1–6 and 15–16 review chapter concepts; 7–10 require chart evidence; 11–14 require audio. Every question has one best answer.</p>
      <div className="foundation-progress-label" aria-live="polite">{answered} of {checkpointQuestions.length} answered</div>
      <div className="foundation-progress" role="progressbar" aria-label="Checkpoint questions answered" aria-valuemin={0} aria-valuemax={checkpointQuestions.length} aria-valuenow={answered}><span style={{width:(answered/checkpointQuestions.length*100)+'%'}} /></div>
    </div>
    {checkpointQuestions.map((q,i)=><fieldset className="foundation-question" key={q.id} data-question-id={q.id} disabled={!ready||submitted||saving}>
      <legend><span className="foundation-question__number">{String(i+1).padStart(2,'0')}</span>{q.prompt}</legend>
      <p className="muted">{q.source==='reading'?'Use the reading chart':q.source==='listening'?'Listen to Recording '+(q.trackId?.endsWith('-a')?'A':'B'):'Chapter concepts'}</p>
      <div className="foundation-options">{q.choices.map(choice=><label key={choice.id} className={'foundation-option'+(answers[q.id]===choice.id?' foundation-option--selected':'')}>
        <input type="radio" name={q.id} value={choice.id} checked={answers[q.id]===choice.id} onChange={()=>setAnswers(a=>({...a,[q.id]:choice.id}))}/>
        <span>{choice.text}</span>
      </label>)}</div>
      {submitted&&<div className="foundation-feedback" role="note">
        <strong>{answers[q.id]===q.answerKey.choiceId?'Correct':'Review this answer'}</strong>
        <p>{q.explanation}</p><p><strong>Evidence:</strong> {q.evidence}</p>
        {answers[q.id]!==q.answerKey.choiceId&&<p className="foundation-feedback__why">Your selection: {q.choices.find(c=>c.id===answers[q.id])?.rationale}</p>}
      </div>}
    </fieldset>)}
    {error&&<p role="alert" className="inline-error">{error} Your answers remain selected so you can retry.</p>}
    {!submitted?<div className="foundation-practice__actions">
      <span className="muted">{!heardAll?'Start both real recordings before submitting.':answered<checkpointQuestions.length?'Answer all sixteen questions before submitting.':assisted?'Assisted review only; no blind score will be saved.':'Ready to save a blind mixed-checkpoint score.'}</span>
      <button type="button" className="btn btn-primary" onClick={submit} disabled={!ready||saving||!heardAll||hasAudioError||answered!==checkpointQuestions.length}>{saving?'Saving…':assisted?'Check assisted answers':'Check answers & save checkpoint score'}</button>
    </div>:<div className="foundation-result" role="status" aria-live="polite">
      <h3>{score} / {checkpointQuestions.length} correct</h3>
      <p>{saved?'Your blind checkpoint score was saved locally in this browser.':'Assisted review complete. No blind checkpoint score was saved.'}</p>
      <p>{score<13?'Review the missed items and their source lessons before another attempt.':'Use the feedback to identify one skill to strengthen.'} Completion is independent of your score.</p>
    </div>}
    <button type="button" className="btn btn-outline listening-restart" onClick={restart}>Start a new blind attempt</button>
    <div className="foundation-teachback">
      <h3>Optional written teach-back (not scored)</h3>
      <p>Explain to a fictional classmate how hiragana, katakana, kanji and romaji differ. Give a kana/romaji pair and explain the difference between a reading and a meaning. No personal information is needed.</p>
      <label htmlFor="checkpoint-writing-draft">Your explanation</label>
      <textarea id="checkpoint-writing-draft" rows={5} value={draft} onChange={e=>setDraft(e.target.value)} placeholder="Hiragana and katakana are both kana, but…"/>
      <button type="button" className="btn btn-outline" onClick={()=>setShowModel(s=>!s)} aria-expanded={showModel}>{showModel?'Hide model and checklist':'Compare with a model and self-review checklist'}</button>
      {showModel&&<div className="foundation-feedback">
        <strong>Model explanation (for self-review, not an automatic grade)</strong>
        <p>Hiragana and katakana both represent Japanese sound units. Hiragana is common in grammatical endings and many native words; katakana is common for loanwords and emphasis. Kanji are characters used in many words and may have several readings. Romaji writes Japanese with Latin letters: さくら and sakura represent the same Japanese reading, but “cherry blossom” is the English meaning. 山 is kanji, read やま here, and means “mountain.” Japanese often combines scripts in one sentence.</p>
        <ul><li>Did you distinguish the two kana scripts without calling them separate languages?</li><li>Did you mention a common role of kanji and avoid claiming one fixed reading?</li><li>Did you correctly distinguish romaji from English translation?</li><li>Did you include an example with a reading and a meaning?</li><li>What one sentence would you revise for clarity?</li></ul>
      </div>}
    </div>
    <p className="foundation-storage-note">Only blind scored choices are stored in Dexie/IndexedDB after you submit. The optional writing draft stays in this page's memory and is not uploaded or saved. No microphone is requested. Audio is streamed from the academy's existing read-only Worker.</p>
  </section>;
