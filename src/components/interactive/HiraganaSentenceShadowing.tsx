import { useEffect, useRef, useState } from 'react';
import { recordAttempt } from '../../lib/progress';
import { models, questions, scoreKnowledge } from '../../lib/hiraganaSentenceShadowing';

export default function HiraganaSentenceShadowing() {
  const [ready,setReady]=useState(false);
  const [audioError,setAudioError]=useState<Record<string,boolean>>({});
  const [answers,setAnswers]=useState<Record<string,number>>({});
  const [submitted,setSubmitted]=useState(false);
  const [saving,setSaving]=useState(false);
  const [saveError,setSaveError]=useState('');
  const [checks,setChecks]=useState<Record<number,boolean>>({});
  const [recording,setRecording]=useState(false);
  const [recordUrl,setRecordUrl]=useState('');
  const [recordError,setRecordError]=useState('');
  const recorder=useRef<MediaRecorder|null>(null);
  const stream=useRef<MediaStream|null>(null);
  const chunks=useRef<Blob[]>([]);
  const blobUrl=useRef<string|null>(null);
  useEffect(()=>{setReady(true);return()=>{if(recorder.current?.state==='recording')recorder.current.stop();stream.current?.getTracks().forEach(t=>t.stop());if(blobUrl.current)URL.revokeObjectURL(blobUrl.current);};},[]);
  const discard=()=>{if(blobUrl.current)URL.revokeObjectURL(blobUrl.current);blobUrl.current=null;setRecordUrl('');};
  const start=async()=>{
    setRecordError('');
    if(!navigator.mediaDevices?.getUserMedia||typeof MediaRecorder==='undefined'){setRecordError('Microphone unavailable. You can still rehearse without recording.');return;}
    try{
      const mic=await navigator.mediaDevices.getUserMedia({audio:true});stream.current=mic;discard();chunks.current=[];
      const rec=new MediaRecorder(mic);recorder.current=rec;
      rec.ondataavailable=e=>{if(e.data.size)chunks.current.push(e.data);};
      rec.onstop=()=>{mic.getTracks().forEach(t=>t.stop());stream.current=null;setRecording(false);const blob=new Blob(chunks.current,{type:rec.mimeType||'audio/webm'});if(blob.size){const url=URL.createObjectURL(blob);blobUrl.current=url;setRecordUrl(url);}else setRecordError('No audio was captured.');};
      rec.onerror=()=>{setRecordError('Recording failed. Try speaking without recording.');if(rec.state==='recording')rec.stop();};
      rec.start();setRecording(true);
    }catch{setRecordError('Microphone permission denied or unavailable.');}
  };
  const answered=questions.every(q=>answers[q.id]!==undefined);
  const score=scoreKnowledge(answers);
  const submit=async()=>{
    if(!answered||submitted||saving)return;
    setSaving(true);setSaveError('');
    try{await recordAttempt('l0-m03-c04-l08-knowledge-v1','l0',score,questions.length);setSubmitted(true);}
    catch{setSaveError('Could not save on this device. Your answers are still selected.');setSubmitted(true);}
    finally{setSaving(false);}
  };
  const rubric=['I repeated both polite question endings with か.','I kept は and を connected to their phrases.','I paused naturally between sentences.','I could rehearse one complete exchange without English.'];
  return <section className="foundation-practice speaking-practice vowel-speaking" aria-labelledby="library-shadow-title">
    <h2 id="library-shadow-title">Optional model shadowing</h2>
    <p>Listen to two original Chapter 04 Lesson 06 AivisSpeech dialogues. Audio must be verified before this lesson is released. The printed transcript is available here because this is speaking practice, not a blind listening assessment.</p>
    <div className="vowel-speaking-models">{models.map((model,i)=><section key={model.id} className="listening-track vowel-speaking-track">
      <h3>Track {i===0?'A':'B'} · {model.title}</h3>
      <audio controls preload="metadata" src={model.src} aria-label={'Track '+(i===0?'A':'B')+' Japanese model'} onError={()=>setAudioError(e=>({...e,[model.id]:true}))} onCanPlay={()=>setAudioError(e=>({...e,[model.id]:false}))}/>
      {audioError[model.id]&&<p role="alert">The recording is unavailable. Do not treat a missing recording as a speaking model.</p>}
      <ol className="vowel-speaking-turns">{model.turns.map((turn,j)=><li key={j} className="vowel-speaking-turn"><strong>{turn.speaker} · Turn {j+1}</strong><p lang="ja">{turn.japanese}</p><p>{turn.english}</p></li>)}</ol>
      <p>Replay the whole track, pause after each turn, and repeat. Native audio controls allow pausing, seeking and volume changes.</p>
    </section>)}</div>
    <section className="writing-stage" aria-label="Optional private microphone rehearsal"><h3>Private voice rehearsal</h3>
      <p>Only the Start button requests microphone access. The recording stays in this tab; it is never uploaded or saved in progress storage.</p>
      {!recording?<button type="button" className="btn btn-outline" disabled={!ready} onClick={()=>void start()}>Start optional recording</button>:<button type="button" className="btn btn-outline" onClick={()=>recorder.current?.stop()}>Stop recording</button>}
      {recording&&<p role="status">Recording in progress.</p>}{recordError&&<p role="alert">{recordError}</p>}
      {recordUrl&&<><audio controls src={recordUrl} aria-label="My private voice recording"/><button type="button" className="btn btn-outline" onClick={discard}>Discard recording</button></>}
    </section>
    <fieldset className="writing-stage"><legend><strong>Personal self-review · not a pronunciation grade</strong></legend>
      {rubric.map((item,i)=><label key={item} className="writing-rubric-item"><input type="checkbox" checked={!!checks[i]} onChange={e=>setChecks(s=>({...s,[i]:e.target.checked}))}/><span>{item}</span></label>)}
      <p role="status">{rubric.filter((_,i)=>checks[i]).length} of {rubric.length} observations checked.</p>
    </fieldset>
    <h3>Optional meaning and strategy check</h3><p>Six scored knowledge questions. No voice quality is graded.</p>
    {questions.map((q,i)=><fieldset key={q.id} data-question-id={q.id} className="foundation-question" disabled={!ready||submitted||saving}>
      <legend>{i+1}. {q.prompt}</legend><div className="foundation-options">{q.options.map((option,j)=><label key={option} className="foundation-option"><input type="radio" name={q.id} checked={answers[q.id]===j} onChange={()=>setAnswers(s=>({...s,[q.id]:j}))}/><span>{option}</span></label>)}</div>
      {submitted&&<div className="foundation-feedback" role="note"><strong>{answers[q.id]===q.correctIndex?'Correct':'Review'}</strong><p>{q.rationale}</p></div>}
    </fieldset>)}
    {saveError&&<p role="alert">{saveError}</p>}
    {!submitted?<button type="button" className="btn btn-primary" disabled={!ready||!answered||saving} onClick={()=>void submit()}>{saving?'Saving…':'Check six knowledge answers'}</button>:<div role="status" className="foundation-result"><h3>Knowledge score: {score}/{questions.length}</h3><p>This is not a speaking grade.</p><button type="button" className="btn btn-outline" onClick={()=>{setAnswers({});setSubmitted(false);}}>Try again</button></div>}
  </section>;
}
