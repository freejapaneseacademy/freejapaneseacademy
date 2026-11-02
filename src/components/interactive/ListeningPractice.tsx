import { useEffect, useRef, useState } from 'react';
import { recordAttempt } from '../../lib/progress';
import { listeningQuestions, listeningQuizId, listeningTracks, scoreListeningQuestions } from '../../lib/listeningPractice';

export default function ListeningPractice() {
  const refs = useRef<Record<string, HTMLAudioElement | null>>({});
  const [ready,setReady]=useState(false);
  const [played,setPlayed]=useState<Record<string,boolean>>({});
  const [rates,setRates]=useState<Record<string,number>>({a:1,b:1});
  const [failed,setFailed]=useState<Record<string,boolean>>({});
  const [revealed,setRevealed]=useState<Record<string,boolean>>({});
  const [assisted,setAssisted]=useState(false);
  const [answers,setAnswers]=useState<Record<string,string>>({});
  const [submitted,setSubmitted]=useState(false);
  const [saved,setSaved]=useState(false);
  const [saving,setSaving]=useState(false);
  const [error,setError]=useState('');
  useEffect(()=>setReady(true),[]);
  const answered=listeningQuestions.filter(q=>Boolean(answers[q.id])).length;
  const heardAll=listeningTracks.every(t=>played[t.id]);
  const score=scoreListeningQuestions(answers);
  const reveal=(id:string)=>{setRevealed(s=>({...s,[id]:!s[id]}));if(!submitted)setAssisted(true);};
  const submit=async()=>{
    if(!ready||submitted||saving||!heardAll||answered!==listeningQuestions.length||Object.values(failed).some(Boolean))return;
    setError('');
    if(assisted){setSubmitted(true);setSaved(false);return;}
    setSaving(true);
    try {await recordAttempt(listeningQuizId,'l0',score,listeningQuestions.length);setSaved(true);setSubmitted(true);}
    catch(e){setError(e instanceof Error?e.message:'Unable to save listening practice.');}
    finally{setSaving(false);}
  };
  const restart=()=>{
    for(const audio of Object.values(refs.current)) audio?.pause();
    setAnswers({});setPlayed({});setRevealed({});setAssisted(false);setSubmitted(false);setSaved(false);setError('');setFailed({});
  };
  return <section className="foundation-practice listening-practice" aria-labelledby="listening-title">
    <div className="foundation-practice__header">
      <span className="eyebrow">REAL JAPANESE AUDIO · LESSON 06</span>
      <h2 id="listening-title">Listen, identify, then verify</h2>
      <p>First listen without reading the words. Play both original Japanese narration tracks, answer eight questions and check your understanding. You may replay as often as you need.</p>
      <p className="foundation-storage-note">These are synthetic Japanese voices generated from academy-authored scripts. Audio is served by FreeJapaneseAcademy's Cloudflare audio service. Independent human pronunciation review has not been claimed.</p>
    </div>
    <div className="listening-tracks">
      {listeningTracks.map((track,i)=><section className="listening-track" key={track.id} aria-labelledby={'listening-track-'+track.id}>
        <span className="eyebrow">AUDIO {i+1} · ABOUT {Math.round(track.durationSeconds)} SECONDS</span>
        <h3 id={'listening-track-'+track.id}>{track.label}</h3>
        <p>Listen for order words, familiar character names and immediately stated details. Avoid reading the transcript until you have tried the questions.</p>
        <audio ref={el=>{refs.current[track.id]=el;}} controls preload="metadata" src={track.url}
          aria-label={track.label+' Japanese narration'} onPlay={()=>setPlayed(p=>({...p,[track.id]:true}))}
          onError={()=>setFailed(p=>({...p,[track.id]:true}))} onCanPlay={()=>setFailed(p=>({...p,[track.id]:false}))}>
          Your browser does not support audio playback.
        </audio>
        {failed[track.id]&&<p role="alert" className="inline-error">This recording could not be loaded. Check your connection and retry. Scoring is disabled until the recordings play.</p>}
        <div className="listening-playback-options">
          <label htmlFor={'listening-speed-'+track.id}>Playback speed</label>
          <select id={'listening-speed-'+track.id} value={rates[track.id]} onChange={event=>{
            const rate=Number(event.target.value);setRates(s=>({...s,[track.id]:rate}));
            if(refs.current[track.id])refs.current[track.id]!.playbackRate=rate;
          }}><option value={0.8}>0.8× slower</option><option value={1}>1× normal</option><option value={1.2}>1.2× faster</option></select>
          <span className="muted">{played[track.id]?'Playback started':'Not yet played'}</span>
        </div>
        <button type="button" className="btn btn-outline" onClick={()=>reveal(track.id)} aria-expanded={Boolean(revealed[track.id])}>
          {revealed[track.id]?'Hide transcript':'Reveal transcript (assisted practice)'}
        </button>
        {revealed[track.id]&&<div className="listening-transcript" aria-label={track.label+' transcript'}>
          <strong>Japanese transcript</strong><p lang="ja">{track.transcript}</p>
          <strong>English meaning</strong><p>{track.english}</p>
        </div>}
      </section>)}
    </div>
    {assisted&&!submitted&&<p role="status" className="listening-mode-note">Assisted mode: you revealed a transcript before submitting. You can still check your answers, but the attempt will not be saved as a blind listening score. To try again without transcript help, choose “Start a new blind attempt.”</p>}
    <div className="foundation-practice__header">
      <h2>Check what you heard</h2>
      <p>Answer questions 1–4 from Track A and 5–8 from Track B. Explanations and full answer evidence appear only after submission.</p>
      <div className="foundation-progress-label" aria-live="polite">{answered} of {listeningQuestions.length} answered</div>
      <div className="foundation-progress" role="progressbar" aria-label="Listening questions answered" aria-valuemin={0} aria-valuemax={listeningQuestions.length} aria-valuenow={answered}><span style={{width:(answered/listeningQuestions.length*100)+'%'}}/></div>
    </div>
    {listeningQuestions.map((q,i)=><fieldset className="foundation-question" key={q.id} data-question-id={q.id} disabled={!ready||submitted||saving}>
      <legend><span className="foundation-question__number">{String(i+1).padStart(2,'0')}</span>{q.prompt}</legend>
      <p className="muted">From Track {q.trackId.endsWith('-a')?'A':'B'}</p>
      <div className="foundation-options">{q.choices.map(c=><label className={'foundation-option'+(answers[q.id]===c.id?' foundation-option--selected':'')} key={c.id}>
        <input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/>
        <span>{c.text}</span>
      </label>)}</div>
      {submitted&&<div className="foundation-feedback" role="note">
        <strong>{answers[q.id]===q.answerKey.choiceId?'Correct':'Review this answer'}</strong>
        <p>{q.explanation}</p><p><strong>Listening evidence:</strong> {q.evidence}</p>
        {answers[q.id]!==q.answerKey.choiceId&&<p className="foundation-feedback__why">Your choice: {q.choices.find(c=>c.id===answers[q.id])?.rationale}</p>}
      </div>}
    </fieldset>)}
    {error&&<p role="alert" className="inline-error">{error} Your answers are still here so you can retry.</p>}
    {!submitted?<div className="foundation-practice__actions">
      <span className="muted">{!heardAll?'Start both recordings before scoring.':answered<listeningQuestions.length?'Answer all eight questions to continue.':assisted?'Assisted answer review: no blind score will be recorded.':'Ready for blind listening scoring.'}</span>
      <button type="button" className="btn btn-primary" onClick={submit} disabled={!ready||saving||!heardAll||answered!==listeningQuestions.length||Object.values(failed).some(Boolean)}>{saving?'Saving…':assisted?'Check assisted answers':'Check answers & save blind score'}</button>
    </div>:<div className="foundation-result" role="status">
      <h3>{score} / {listeningQuestions.length} correct</h3>
      <p>{saved?'Your blind listening practice score was saved locally in this browser.':'Assisted practice reviewed. No blind listening score was saved.'}</p>
      <p>Now you can reveal both transcripts, compare the actual spoken words with the answers and replay each track.</p>
    </div>}
    <button type="button" className="btn btn-outline listening-restart" onClick={restart}>Start a new blind attempt</button>
    <p className="foundation-storage-note">Only scored blind attempts use the existing browser-local progress database. Audio is streamed from the academy's Cloudflare service; no microphone or recording permission is needed.</p>
  </section>;
}
