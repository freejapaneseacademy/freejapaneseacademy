import {useEffect,useRef,useState} from 'react';
import {recordAttempt} from '../../lib/progress';
import bank from '../../content/exercises/l0-m04-c04-l08-v1.json';
export const scoreLoanwordShadow=(answers:Record<string,number>)=>bank.items.filter(q=>answers[q.id]===q.correctIndex).length;
const tracks=[
 {id:'a',title:'Station café',src:'/audio/fja-l0-m04-c04-l06-a-v1.wav',turns:['駅のカフェからお知らせです。コーヒーとティーがあります。ケーキもあります。','ティーはカウンターでご注文ください。']},
 {id:'b',title:'Station travel services',src:'/audio/fja-l0-m04-c04-l06-b-v1.wav',turns:['駅からのお知らせです。タクシーは駅の前にいます。','チケットについては、スタッフにおたずねください。','ファイルのわすれものがありました。']}
];
export default function KatakanaLoanwordShadowing(){
 const [ready,setReady]=useState(false),[answers,setAnswers]=useState<Record<string,number>>({}),[submitted,setSubmitted]=useState(false),[save,setSave]=useState('');
 const [checks,setChecks]=useState<Record<number,boolean>>({}),[audioError,setAudioError]=useState<Record<string,boolean>>({});
 const [recording,setRecording]=useState(false),[recordUrl,setRecordUrl]=useState(''),[recordError,setRecordError]=useState('');
 const recorder=useRef<MediaRecorder|null>(null),stream=useRef<MediaStream|null>(null),chunks=useRef<Blob[]>([]),blobUrl=useRef<string|null>(null);
 useEffect(()=>{setReady(true);return()=>{if(recorder.current?.state==='recording')recorder.current.stop();stream.current?.getTracks().forEach(t=>t.stop());if(blobUrl.current)URL.revokeObjectURL(blobUrl.current);};},[]);
 function discard(){if(blobUrl.current)URL.revokeObjectURL(blobUrl.current);blobUrl.current=null;setRecordUrl('');}
 async function start(){
  setRecordError('');
  if(!navigator.mediaDevices?.getUserMedia||typeof MediaRecorder==='undefined'){setRecordError('Microphone unavailable; you can rehearse without recording.');return;}
  try{const mic=await navigator.mediaDevices.getUserMedia({audio:true});stream.current=mic;discard();chunks.current=[];
   const rec=new MediaRecorder(mic);recorder.current=rec;
   rec.ondataavailable=e=>{if(e.data.size)chunks.current.push(e.data);};
   rec.onstop=()=>{mic.getTracks().forEach(t=>t.stop());stream.current=null;setRecording(false);const blob=new Blob(chunks.current,{type:rec.mimeType||'audio/webm'});if(blob.size){const url=URL.createObjectURL(blob);blobUrl.current=url;setRecordUrl(url);}else setRecordError('No audio captured.');};
   rec.onerror=()=>{setRecordError('Recording failed; you can rehearse without recording.');if(rec.state==='recording')rec.stop();};
   rec.start();setRecording(true);
  }catch{setRecordError('Microphone permission denied or unavailable.');}
 }
 async function submit(){if(submitted||!bank.items.every(q=>answers[q.id]!==undefined))return;setSubmitted(true);try{await recordAttempt('l0-m04-c04-l08-knowledge-v1','l0',scoreLoanwordShadow(answers),bank.items.length);setSave('Attempt saved on this device.');}catch{setSave('Local storage unavailable; feedback remains visible.');}}
 const rubric=['I sustained ー in コーヒー and タクシー.','I kept ティ and ファ as single borrowed-sound combinations.','I kept the polite request ending ください.','I paused at sentence boundaries.'];
 return <section className="min-w-0 space-y-6" aria-labelledby="loanword-shadow-title">
  <h2 id="loanword-shadow-title" className="text-2xl font-semibold">Optional model shadowing</h2>
  <p>These players use original Chapter 04 Lesson 06 WAVs, not a browser-generated substitute. If a track is unavailable, do not treat it as verified audio. Recording is optional and never uploaded.</p>
  {tracks.map((t,i)=><section key={t.id} className="min-w-0 rounded-xl border border-current/25 p-4 space-y-3"><h3 className="text-xl font-semibold">Track {i?'B':'A'} · {t.title}</h3>
   <audio controls preload="metadata" className="w-full max-w-full" src={t.src} aria-label={'Japanese announcement model track '+t.id.toUpperCase()} onError={()=>setAudioError(e=>({...e,[t.id]:true}))} onCanPlay={()=>setAudioError(e=>({...e,[t.id]:false}))}/>
   {audioError[t.id]&&<p role="alert">The original model recording is unavailable. Try again when the audio is released.</p>}
   <ol className="list-decimal pl-6 space-y-2">{t.turns.map((turn,j)=><li key={j}><span lang="ja" className="break-words">{turn}</span></li>)}</ol><p>Listen, pause, repeat, then try the whole announcement.</p></section>)}
  <section className="rounded-xl border border-current/25 p-4 space-y-3" aria-label="Optional private recording"><h3 className="text-xl font-semibold">Private microphone rehearsal</h3><p>Microphone permission is requested only after you press Start. Recording stays in this tab and is not uploaded.</p>
   {!recording?<button type="button" className="btn btn-outline" disabled={!ready} onClick={()=>void start()}>Start optional recording</button>:<button type="button" className="btn btn-outline" onClick={()=>recorder.current?.stop()}>Stop recording</button>}
   {recording&&<p role="status">Recording in progress.</p>}{recordError&&<p role="alert">{recordError}</p>}
   {recordUrl&&<><audio controls className="w-full max-w-full" src={recordUrl} aria-label="My private rehearsal"/><button type="button" className="btn btn-outline" onClick={discard}>Discard recording</button></>}
  </section>
  <fieldset className="rounded-xl border border-current/25 p-4 space-y-3"><legend className="font-semibold">Self-review — not a pronunciation grade</legend>
   {rubric.map((s,i)=><label key={s} className="flex min-h-11 items-center gap-3"><input type="checkbox" checked={!!checks[i]} onChange={e=>setChecks(v=>({...v,[i]:e.target.checked}))}/><span>{s}</span></label>)}
   <p role="status">{rubric.filter((_,i)=>checks[i]).length} of {rubric.length} observations checked.</p></fieldset>
  <h3 className="text-xl font-semibold">Six optional written knowledge checks</h3><p>These check written understanding only. They do not grade speaking or pronunciation.</p>
  {bank.items.map((q,i)=><fieldset key={q.id} disabled={!ready||submitted} className="min-w-0 rounded-xl border border-current/25 p-4"><legend className="font-semibold">{i+1}. {q.prompt}</legend>
   {q.options.map((o,j)=><label key={j} className="flex min-h-11 items-center gap-3 rounded p-2 focus-within:outline focus-within:outline-2"><input type="radio" name={q.id} checked={answers[q.id]===j} onChange={()=>setAnswers(v=>({...v,[q.id]:j}))}/><span>{o}</span></label>)}
   {submitted&&<p role="note"><strong>{answers[q.id]===q.correctIndex?'Correct.':'Review.'}</strong> {q.explanation}</p>}</fieldset>)}
  {!submitted?<button type="button" className="btn btn-primary" disabled={!ready||!bank.items.every(q=>answers[q.id]!==undefined)} onClick={()=>void submit()}>Check six knowledge answers</button>:<div role="status"><strong>Knowledge score: {scoreLoanwordShadow(answers)}/{bank.items.length}.</strong><p>Not a pronunciation grade. {save}</p><button type="button" className="btn btn-outline" onClick={()=>{setAnswers({});setSubmitted(false);setSave('');}}>Try again</button></div>}
 </section>;
}
