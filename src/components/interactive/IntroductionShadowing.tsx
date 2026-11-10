import {useEffect,useRef,useState} from 'react';
import {recordAttempt} from '../../lib/progress';
import bank from '../../content/exercises/l0-m05-c02-l08-v1.json';

export const scoreIntroductionShadow=(answers:Record<string,string>)=>bank.items.filter(q=>answers[q.id]===q.answerKey.choiceId).length;
const tracks=[
 {id:'a',title:'Registration desk',src:'/audio/fja-l0-m05-c02-l06-a-v1.wav',turns:['Staff: こんにちは。おなまえは？','Visitor: たなかです。','Staff: たなかさんですね。ばんごうは？','Visitor: じゅうにです。','Staff: はい、じゅうにですね。ありがとうございます。']},
 {id:'b',title:'New classmates',src:'/audio/fja-l0-m05-c02-l06-b-v1.wav',turns:['Ken: はじめまして。わたしはケンです。カナダからきました。','Mika: はじめまして。わたしはミカです。にほんからきました。','Ken: ミカさん、クラスはなんばんですか。','Mika: さんばんです。ケンさんは？','Ken: わたしもさんばんです。よろしくおねがいします。']}
];
export default function IntroductionShadowing(){
 const [answers,setAnswers]=useState<Record<string,string>>({}),[submitted,setSubmitted]=useState(false),[saved,setSaved]=useState('');
 const [rubric,setRubric]=useState<Record<number,boolean>>({}),[audioErrors,setAudioErrors]=useState<Record<string,boolean>>({});
 const [recording,setRecording]=useState(false),[url,setUrl]=useState(''),[error,setError]=useState('');
 const recorder=useRef<MediaRecorder|null>(null),stream=useRef<MediaStream|null>(null),chunks=useRef<Blob[]>([]),blob=useRef<string|null>(null);
 useEffect(()=>()=>{if(recorder.current?.state==='recording')recorder.current.stop();stream.current?.getTracks().forEach(t=>t.stop());if(blob.current)URL.revokeObjectURL(blob.current);},[]);
 function discard(){if(blob.current)URL.revokeObjectURL(blob.current);blob.current=null;setUrl('');}
 async function start(){setError('');if(!navigator.mediaDevices?.getUserMedia||typeof MediaRecorder==='undefined'){setError('Microphone recording unavailable; practise without recording.');return;}
  try{const mic=await navigator.mediaDevices.getUserMedia({audio:true});stream.current=mic;discard();chunks.current=[];const rec=new MediaRecorder(mic);recorder.current=rec;
   rec.ondataavailable=e=>{if(e.data.size)chunks.current.push(e.data);};
   rec.onstop=()=>{mic.getTracks().forEach(t=>t.stop());stream.current=null;setRecording(false);const data=new Blob(chunks.current,{type:rec.mimeType||'audio/webm'});if(data.size){const next=URL.createObjectURL(data);blob.current=next;setUrl(next);}else setError('No recording data was captured.');};
   rec.onerror=()=>{setError('Recording failed.');if(rec.state==='recording')rec.stop();};rec.start();setRecording(true);
  }catch{setError('Microphone permission denied or unavailable.');}
 }
 async function submit(){if(submitted||!bank.items.every(q=>answers[q.id]))return;setSubmitted(true);try{await recordAttempt('l0-m05-c02-l08-written-v1','l0',scoreIntroductionShadow(answers),bank.items.length);setSaved('Written attempt saved on this device.');}catch{setSaved('Local storage unavailable; feedback remains visible.');}}
 const criteria=['I said a name followed by です.','I distinguished 12 from 21.','I paused for the other person.','I did not confuse country of origin with nationality.'];
 return <section aria-labelledby="introduction-shadow-title" className="min-w-0 space-y-6">
  <h2 id="introduction-shadow-title" className="text-2xl font-semibold">Listen and rehearse two introductions</h2>
  <p>Play the genuine L06 WAVs, pause and take turns. If audio fails to load, text practice is available but is not audio shadowing.</p>
  {tracks.map((t,i)=><section key={t.id} className="min-w-0 rounded-xl border border-current/25 p-4 space-y-3"><h3 className="text-xl font-semibold">Track {i?'B':'A'} — {t.title}</h3>
   <audio controls preload="metadata" className="w-full max-w-full" src={t.src} aria-label={'Original Japanese introduction track '+t.id.toUpperCase()} onError={()=>setAudioErrors(v=>({...v,[t.id]:true}))} onCanPlay={()=>setAudioErrors(v=>({...v,[t.id]:false}))}/>
   {audioErrors[t.id]&&<p role="alert">Original audio is not available yet. Do not count text rehearsal as listening practice.</p>}
   <ol className="list-decimal pl-6 space-y-2">{t.turns.map((turn,j)=><li key={j} className="break-words"><span lang="ja">{turn}</span></li>)}</ol><p>Listen once, pause between turns, repeat and switch roles.</p></section>)}
  <section className="rounded-xl border border-current/25 p-4 space-y-3" aria-label="Optional private microphone recording"><h3 className="text-xl font-semibold">Private rehearsal (optional)</h3><p>Permission is requested only when you press Start. Recordings remain in this tab; they are not uploaded.</p>
   {!recording?<button className="btn btn-outline" type="button" onClick={()=>void start()}>Start optional recording</button>:<button className="btn btn-outline" type="button" onClick={()=>recorder.current?.stop()}>Stop recording</button>}
   {recording&&<p role="status">Recording…</p>}{error&&<p role="alert">{error}</p>}
   {url&&<><audio controls className="w-full max-w-full" src={url} aria-label="Private recorded rehearsal"/><button className="btn btn-outline" type="button" onClick={discard}>Discard recording</button></>}
  </section>
  <fieldset className="rounded-xl border border-current/25 p-4 space-y-3"><legend className="font-semibold">Speaking self-review (not graded)</legend>
   {criteria.map((c,i)=><label key={c} className="flex min-h-11 items-center gap-3"><input type="checkbox" checked={!!rubric[i]} onChange={e=>setRubric(v=>({...v,[i]:e.target.checked}))}/><span>{c}</span></label>)}
   <p role="status">{criteria.filter((_,i)=>rubric[i]).length} of {criteria.length} self-review criteria checked.</p></fieldset>
  <h3 className="text-xl font-semibold">Written meaning and context check</h3><p>Eight written questions assess comprehension of phrases, not the sound of your speech.</p>
  {bank.items.map((q,i)=><fieldset key={q.id} disabled={submitted} className="min-w-0 rounded-xl border border-current/25 p-4"><legend className="font-semibold">{i+1}. {q.prompt}</legend>
   {q.choices.map(c=><label key={c.id} className="flex min-h-11 items-center gap-3 rounded p-2 focus-within:outline focus-within:outline-2"><input type="radio" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(v=>({...v,[q.id]:c.id}))}/><span>{c.text}</span></label>)}
   {submitted&&<p role="status"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct.':'Review.'}</strong> {q.explanation}</p>}</fieldset>)}
  {!submitted?<button className="btn btn-primary" type="button" disabled={!bank.items.every(q=>answers[q.id])} onClick={()=>void submit()}>Check written answers</button>:<><p role="status">{scoreIntroductionShadow(answers)} of {bank.items.length} written answers correct. {saved}</p><button className="btn btn-outline" type="button" onClick={()=>{setAnswers({});setSubmitted(false);setSaved('');}}>Try written check again</button></>}
 </section>;
}