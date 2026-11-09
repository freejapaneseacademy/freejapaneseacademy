import {useEffect,useRef,useState} from 'react';
import {recordAttempt} from '../../lib/progress';
import bank from '../../content/exercises/l0-m04-c03-l08-v1.json';
export const scoreKatakanaShopShadow=(answers:Record<string,number>)=>bank.items.filter(q=>answers[q.id]===q.correctIndex).length;
const tracks=[
 {id:'a',title:'Bakery counter',src:'/audio/fja-l0-m04-c03-l06-a-v1.wav',turns:['いらっしゃいませ。パンはいかがですか。','はい。パンをふたつください。','はい。ジュースもありますよ。','では、ジュースもひとつください。']},
 {id:'b',title:'Gift shop',src:'/audio/fja-l0-m04-c03-l06-b-v1.wav',turns:['このバッグはだれのですか。','それはミナさんのバッグです。','ああ。プレゼントですか。','はい。ミナさんへのプレゼントです。']}
];
export default function KatakanaShopShadowing(){
 const [ready,setReady]=useState(false),[answers,setAnswers]=useState<Record<string,number>>({}),[submitted,setSubmitted]=useState(false);
 const [save,setSave]=useState(''),[checks,setChecks]=useState<Record<number,boolean>>({}),[audioError,setAudioError]=useState<Record<string,boolean>>({});
 const [recording,setRecording]=useState(false),[recordUrl,setRecordUrl]=useState(''),[recordError,setRecordError]=useState('');
 const recorder=useRef<MediaRecorder|null>(null),stream=useRef<MediaStream|null>(null),chunks=useRef<Blob[]>([]),blobUrl=useRef<string|null>(null);
 useEffect(()=>{setReady(true);return()=>{if(recorder.current?.state==='recording')recorder.current.stop();stream.current?.getTracks().forEach(t=>t.stop());if(blobUrl.current)URL.revokeObjectURL(blobUrl.current);};},[]);
 function discard(){if(blobUrl.current)URL.revokeObjectURL(blobUrl.current);blobUrl.current=null;setRecordUrl('');}
 async function start(){
  setRecordError('');
  if(!navigator.mediaDevices?.getUserMedia||typeof MediaRecorder==='undefined'){setRecordError('Microphone unavailable; rehearsal without recording still works.');return;}
  try{const mic=await navigator.mediaDevices.getUserMedia({audio:true});stream.current=mic;discard();chunks.current=[];
   const rec=new MediaRecorder(mic);recorder.current=rec;
   rec.ondataavailable=e=>{if(e.data.size)chunks.current.push(e.data);};
   rec.onstop=()=>{mic.getTracks().forEach(t=>t.stop());stream.current=null;setRecording(false);const blob=new Blob(chunks.current,{type:rec.mimeType||'audio/webm'});if(blob.size){const url=URL.createObjectURL(blob);blobUrl.current=url;setRecordUrl(url);}else setRecordError('No sound captured.');};
   rec.onerror=()=>{setRecordError('Recording failed. You can rehearse without recording.');if(rec.state==='recording')rec.stop();};
   rec.start();setRecording(true);
  }catch{setRecordError('Microphone permission denied or unavailable.');}
 }
 async function submit(){if(submitted||!bank.items.every(q=>answers[q.id]!==undefined))return;setSubmitted(true);try{await recordAttempt('l0-m04-c03-l08-knowledge-v1','l0',scoreKatakanaShopShadow(answers),bank.items.length);setSave('Attempt saved on this device.');}catch{setSave('Local storage unavailable; feedback remains visible.');}}
 const rubric=['I contrasted パ and バ in the model words.','I kept the final ン in プレゼント.','I kept ください and ですか complete.','I paused at the ends of the sentences.'];
 return <section className="min-w-0 space-y-6" aria-labelledby="katakana-shop-shadow-title">
  <h2 id="katakana-shop-shadow-title" className="text-2xl font-semibold">Optional model shadowing</h2>
  <p>Play genuine Lesson 06 AivisSpeech WAVs when available. No synthesized browser voice is substituted. Recording is optional and never uploaded.</p>
  {tracks.map((t,i)=><section key={t.id} className="min-w-0 rounded-xl border border-current/25 p-4 space-y-3"><h3 className="text-xl font-semibold">Track {i?'B':'A'} · {t.title}</h3>
   <audio controls preload="metadata" className="w-full max-w-full" src={t.src} aria-label={'Japanese model track '+t.id.toUpperCase()} onError={()=>setAudioError(e=>({...e,[t.id]:true}))} onCanPlay={()=>setAudioError(e=>({...e,[t.id]:false}))}/>
   {audioError[t.id]&&<p role="alert">This genuine model recording is unavailable. Do not substitute an unverified voice.</p>}
   <ol className="list-decimal pl-6 space-y-2">{t.turns.map((turn,j)=><li key={j}><strong>{j%2===0?'Speaker 1':'Speaker 2'}</strong><p lang="ja" className="break-words">{turn}</p></li>)}</ol><p>Listen, pause, repeat, then switch roles.</p></section>)}
  <section className="rounded-xl border border-current/25 p-4 space-y-3" aria-label="Optional private voice recording"><h3 className="text-xl font-semibold">Private microphone rehearsal</h3><p>Microphone permission is requested only when you press Start. The audio stays in this tab and is not uploaded.</p>
   {!recording?<button type="button" className="btn btn-outline" disabled={!ready} onClick={()=>void start()}>Start optional recording</button>:<button type="button" className="btn btn-outline" onClick={()=>recorder.current?.stop()}>Stop recording</button>}
   {recording&&<p role="status">Recording in progress.</p>}{recordError&&<p role="alert">{recordError}</p>}
   {recordUrl&&<><audio controls src={recordUrl} aria-label="My private rehearsal"/><button type="button" className="btn btn-outline" onClick={discard}>Discard recording</button></>}
  </section>
  <fieldset className="rounded-xl border border-current/25 p-4 space-y-3"><legend className="font-semibold">Self-review — never a pronunciation grade</legend>
   {rubric.map((s,i)=><label key={s} className="flex min-h-11 items-center gap-3"><input type="checkbox" checked={!!checks[i]} onChange={e=>setChecks(v=>({...v,[i]:e.target.checked}))}/><span>{s}</span></label>)}
   <p role="status">{rubric.filter((_,i)=>checks[i]).length} of {rubric.length} observations checked.</p></fieldset>
  <h3 className="text-xl font-semibold">Six optional meaning and script checks</h3><p>These score knowledge only, not speaking or pronunciation.</p>
  {bank.items.map((q,i)=><fieldset key={q.id} disabled={!ready||submitted} className="min-w-0 rounded-xl border border-current/25 p-4"><legend className="font-semibold">{i+1}. {q.prompt}</legend>
   {q.options.map((o,j)=><label key={j} className="flex min-h-11 items-center gap-3 rounded p-2 focus-within:outline focus-within:outline-2"><input type="radio" name={q.id} checked={answers[q.id]===j} onChange={()=>setAnswers(v=>({...v,[q.id]:j}))}/><span lang="ja">{o}</span></label>)}
   {submitted&&<p role="note"><strong>{answers[q.id]===q.correctIndex?'Correct.':'Review.'}</strong> {q.explanation}</p>}</fieldset>)}
  {!submitted?<button type="button" className="btn btn-primary" disabled={!ready||!bank.items.every(q=>answers[q.id]!==undefined)} onClick={()=>void submit()}>Check six knowledge answers</button>:<div role="status"><strong>Knowledge score: {scoreKatakanaShopShadow(answers)}/{bank.items.length}.</strong><p>Not a pronunciation grade. {save}</p><button type="button" className="btn btn-outline" onClick={()=>{setAnswers({});setSubmitted(false);setSave('');}}>Try again</button></div>}
 </section>;
}
