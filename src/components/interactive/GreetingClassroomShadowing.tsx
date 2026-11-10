import {useEffect,useRef,useState} from 'react';
import {recordAttempt} from '../../lib/progress';
import bank from '../../content/exercises/l0-m05-c01-l08-v1.json';

export const scoreGreetingShadow=(answers:Record<string,string>)=>bank.items.filter(q=>answers[q.id]===q.answerKey.choiceId).length;
const tracks=[
 {id:'a',title:'Morning arrival',src:'/audio/fja-l0-m05-c01-l06-a-v1.wav',turns:['Learner: おはようございます。田中先生。','Teacher: おはようございます。どうぞ、入ってください。','Learner: ありがとうございます。']},
 {id:'b',title:'Afternoon classroom',src:'/audio/fja-l0-m05-c01-l06-b-v1.wav',turns:['Teacher: こんにちは。みなさん。','Learner: こんにちは。','Teacher: 本を開いてください。','Learner: すみません。もう一度お願いします。','Teacher: はい。本を開いてください。']}
];
export default function GreetingClassroomShadowing(){
 const [answers,setAnswers]=useState<Record<string,string>>({}),[submitted,setSubmitted]=useState(false),[save,setSave]=useState('');
 const [checks,setChecks]=useState<Record<number,boolean>>({}),[audioErrors,setAudioErrors]=useState<Record<string,boolean>>({});
 const [recording,setRecording]=useState(false),[recordUrl,setRecordUrl]=useState(''),[recordError,setRecordError]=useState('');
 const recorder=useRef<MediaRecorder|null>(null),stream=useRef<MediaStream|null>(null),chunks=useRef<Blob[]>([]),blobUrl=useRef<string|null>(null);
 useEffect(()=>()=>{if(recorder.current?.state==='recording')recorder.current.stop();stream.current?.getTracks().forEach(t=>t.stop());if(blobUrl.current)URL.revokeObjectURL(blobUrl.current);},[]);
 function discard(){if(blobUrl.current)URL.revokeObjectURL(blobUrl.current);blobUrl.current=null;setRecordUrl('');}
 async function start(){setRecordError('');if(!navigator.mediaDevices?.getUserMedia||typeof MediaRecorder==='undefined'){setRecordError('Recording unsupported; you can still speak without a microphone.');return;}
  try{const mic=await navigator.mediaDevices.getUserMedia({audio:true});stream.current=mic;discard();chunks.current=[];const rec=new MediaRecorder(mic);recorder.current=rec;
   rec.ondataavailable=e=>{if(e.data.size)chunks.current.push(e.data);};
   rec.onstop=()=>{mic.getTracks().forEach(t=>t.stop());stream.current=null;setRecording(false);const blob=new Blob(chunks.current,{type:rec.mimeType||'audio/webm'});if(blob.size){const url=URL.createObjectURL(blob);blobUrl.current=url;setRecordUrl(url);}else setRecordError('No recording data was captured.');};
   rec.onerror=()=>{setRecordError('Recording failed; please try without a microphone.');if(rec.state==='recording')rec.stop();};rec.start();setRecording(true);
  }catch{setRecordError('Microphone permission denied or unavailable.');}
 }
 async function submit(){if(submitted||!bank.items.every(q=>answers[q.id]))return;setSubmitted(true);try{await recordAttempt('l0-m05-c01-l08-written-v1','l0',scoreGreetingShadow(answers),bank.items.length);setSave('Written check saved locally.');}catch{setSave('Storage unavailable; feedback is still shown.');}}
 const rubric=['I chose a greeting suitable for the time of day.','I gave the other speaker time to respond.','I distinguished the invitation from the thank-you.','I rehearsed もう一度お願いします when I needed repetition.'];
 return <section aria-labelledby="greeting-shadow-title" className="min-w-0 space-y-6">
  <h2 id="greeting-shadow-title" className="text-2xl font-semibold">Listen, repeat and role-play</h2>
  <p>Both players refer to the genuine original L06 WAV recordings. If a recording is unavailable, do not treat text-only rehearsal as verified audio shadowing.</p>
  {tracks.map((t,i)=><section key={t.id} className="min-w-0 rounded-xl border border-current/25 p-4 space-y-3"><h3 className="text-xl font-semibold">Track {i?'B':'A'} — {t.title}</h3>
   <audio controls preload="metadata" className="w-full max-w-full" src={t.src} aria-label={'Japanese classroom model '+t.id.toUpperCase()} onError={()=>setAudioErrors(v=>({...v,[t.id]:true}))} onCanPlay={()=>setAudioErrors(v=>({...v,[t.id]:false}))}/>
   {audioErrors[t.id]&&<p role="alert">Original audio unavailable. Revisit this model after verified audio publication.</p>}
   <ol className="list-decimal pl-6 space-y-2">{t.turns.map((line,j)=><li key={j} className="break-words"><span lang="ja">{line}</span></li>)}</ol><p>Listen to the whole model, pause, repeat the printed lines and switch roles.</p></section>)}
  <section className="rounded-xl border border-current/25 p-4 space-y-3" aria-label="Optional private recording"><h3 className="text-xl font-semibold">Private recording (optional)</h3><p>Microphone access is requested only when you choose Start. Recordings remain in this tab and are never uploaded.</p>
   {!recording?<button className="btn btn-outline" type="button" onClick={()=>void start()}>Start optional recording</button>:<button className="btn btn-outline" type="button" onClick={()=>recorder.current?.stop()}>Stop recording</button>}
   {recording&&<p role="status">Recording…</p>}{recordError&&<p role="alert">{recordError}</p>}
   {recordUrl&&<><audio controls className="w-full max-w-full" src={recordUrl} aria-label="My private rehearsal"/><button type="button" className="btn btn-outline" onClick={discard}>Discard recording</button></>}
  </section>
  <fieldset className="rounded-xl border border-current/25 p-4 space-y-3"><legend className="font-semibold">Self-review (not an automatic pronunciation grade)</legend>
   {rubric.map((s,i)=><label key={s} className="flex min-h-11 items-center gap-3"><input type="checkbox" checked={!!checks[i]} onChange={e=>setChecks(v=>({...v,[i]:e.target.checked}))}/><span>{s}</span></label>)}
   <p role="status">{rubric.filter((_,i)=>checks[i]).length} of {rubric.length} observations checked.</p></fieldset>
  <h3 className="text-xl font-semibold">Six optional written meaning checks</h3><p>These questions do not assess the sound of your voice.</p>
  {bank.items.map((q,i)=><fieldset key={q.id} disabled={submitted} className="min-w-0 rounded-xl border border-current/25 p-4"><legend className="font-semibold">{i+1}. {q.prompt}</legend>
   {q.choices.map(c=><label key={c.id} className="flex min-h-11 items-center gap-3 rounded p-2 focus-within:outline focus-within:outline-2"><input type="radio" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(v=>({...v,[q.id]:c.id}))}/><span>{c.text}</span></label>)}
   {submitted&&<p role="status"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct.':'Review.'}</strong> {q.explanation}</p>}</fieldset>)}
  {!submitted?<button className="btn btn-primary" type="button" disabled={!bank.items.every(q=>answers[q.id])} onClick={()=>void submit()}>Check written answers</button>:<><p role="status">{scoreGreetingShadow(answers)} of {bank.items.length} written answers correct. {save}</p><button type="button" className="btn btn-outline" onClick={()=>{setAnswers({});setSubmitted(false);setSave('');}}>Try written check again</button></>}
 </section>;
}
