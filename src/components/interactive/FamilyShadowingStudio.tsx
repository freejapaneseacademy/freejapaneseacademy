import { useEffect, useRef, useState } from 'react';
import bank from '../../content/exercises/n5-m01-c03-l08-v1.json';
import { recordAttempt } from '../../lib/progress';

export const gradeFamilyShadowing = (answers: Record<string,string>) =>
  bank.items.filter(q => answers[q.id] === q.answerKey.choiceId).length;

const scenes = [
  { id:'a', title:'Scene A — school exhibition', src:'/audio/fja-n5-m01-c03-l06-a-v1.wav',
    turns:['Woman: こちらは、わたしの妹、ゆいです。','Man: ゆいさんは、学生ですか。','Woman: はい、高校生です。こちらは、わたしの母です。','Man: はじめまして。よろしくお願いします。'] },
  { id:'b', title:'Scene B — family photograph', src:'/audio/fja-n5-m01-c03-l06-b-v1.wav',
    turns:['Man: この写真の人は、だれですか。','Woman: その人は、わたしの兄です。','Man: お兄さんは、先生ですか。','Woman: いいえ、先生じゃありません。会社員です。'] }
];

export default function FamilyShadowingStudio() {
  const [answers,setAnswers]=useState<Record<string,string>>({});
  const [submitted,setSubmitted]=useState(false);
  const [notice,setNotice]=useState('');
  const [checks,setChecks]=useState([false,false,false,false]);
  const [recording,setRecording]=useState(false);
  const [clip,setClip]=useState<string|null>(null);
  const [micNotice,setMicNotice]=useState('Microphone is off.');
  const recorder=useRef<MediaRecorder|null>(null);
  const stream=useRef<MediaStream|null>(null);
  const chunks=useRef<Blob[]>([]);
  const url=useRef<string|null>(null);
  const ready=bank.items.every(q=>Boolean(answers[q.id]));
  function discard() {
    if(url.current) URL.revokeObjectURL(url.current);
    url.current=null;setClip(null);setMicNotice('Local recording discarded.');
  }
  function stop() {
    if(recorder.current?.state==='recording') recorder.current.stop();
    stream.current?.getTracks().forEach(t=>t.stop());
    stream.current=null;setRecording(false);
  }
  useEffect(()=>()=> {
    if(recorder.current?.state==='recording') recorder.current.stop();
    stream.current?.getTracks().forEach(t=>t.stop());
    if(url.current) URL.revokeObjectURL(url.current);
  },[]);
  async function start() {
    if(recording)return;
    if(!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder==='undefined') {
      setMicNotice('Microphone recording is unavailable; silent practice is fine.');return;
    }
    try {
      const media=await navigator.mediaDevices.getUserMedia({audio:true});
      stream.current=media;const r=new MediaRecorder(media);recorder.current=r;chunks.current=[];
      r.ondataavailable=e=>{if(e.data.size)chunks.current.push(e.data);};
      r.onstop=()=>{
        if(url.current)URL.revokeObjectURL(url.current);
        if(chunks.current.length) {
          url.current=URL.createObjectURL(new Blob(chunks.current,{type:r.mimeType||'audio/webm'}));
          setClip(url.current);setMicNotice('Private playback ready; discard when finished.');
        } else setMicNotice('No audio was captured.');
        media.getTracks().forEach(t=>t.stop());setRecording(false);
      };
      r.start();setRecording(true);setMicNotice('Microphone active; stop to review.');
    } catch {setMicNotice('Microphone permission not granted. No recording was made.');}
  }
  async function submit() {
    if(!ready||submitted)return;
    setSubmitted(true);
    try {await recordAttempt('n5-m01-c03-l08-written-v1','n5',gradeFamilyShadowing(answers),bank.items.length);setNotice('Written result saved on this device.');}
    catch {setNotice('Storage unavailable; your result is still visible.');}
  }
  return <section aria-label="Family role-play and optional shadowing" className="min-w-0 space-y-6">
    <h2 className="text-2xl font-semibold">Shadow, pause, then switch roles</h2>
    <p>Audio sources are L06 licensed candidate assets and must be verified before publication. If unavailable, use the transcript for ungraded reading rehearsal; this is not proof of listening.</p>
    {scenes.map(scene=><section key={scene.id} className="min-w-0 space-y-3 rounded-xl border border-current/30 p-4">
      <h3 className="text-xl font-semibold">{scene.title}</h3>
      <audio controls preload="none" className="block w-full max-w-full" aria-label={scene.title+' model audio'}>
        <source src={scene.src} type="audio/wav"/>Audio is not supported in this browser.
      </audio>
      <details className="rounded-lg border border-current/20 p-3">
        <summary className="cursor-pointer font-semibold">Show script for reading practice</summary>
        <ol className="list-decimal space-y-2 pl-6">{scene.turns.map((t,i)=><li key={i} lang="ja">{t}</li>)}</ol>
      </details>
      <p>First repeat one role after each pause, then switch roles. No pronunciation is automatically assessed.</p>
    </section>)}
    <section className="space-y-3 rounded-xl border border-current/30 p-4">
      <h3 className="text-xl font-semibold">Optional private microphone practice</h3>
      <p>Recording is off until you choose Start and grant permission. Nothing is uploaded. The temporary recording is discarded when you discard it or leave the page.</p>
      <div className="flex flex-wrap gap-2">
        <button type="button" disabled={recording} onClick={start} className="min-h-11 rounded-lg border border-current px-4 py-2">Start recording</button>
        <button type="button" disabled={!recording} onClick={stop} className="min-h-11 rounded-lg border border-current px-4 py-2">Stop recording</button>
        <button type="button" disabled={!clip||recording} onClick={discard} className="min-h-11 rounded-lg border border-current px-4 py-2">Discard recording</button>
      </div>
      <p role="status" aria-live="polite">{micNotice}</p>
      {clip&&<audio controls src={clip} className="block w-full max-w-full" aria-label="Private recording playback"/>}
    </section>
    <fieldset className="space-y-2"><legend className="text-xl font-semibold">Speaking self-check (ungraded)</legend>
      {['My family relationship word matches the fictional person.','I connect the person and relationship with の.','I use こちら for introducing and その人 for referring back.','I can switch roles and use a respectful term for someone else’s relative.'].map((s,i)=><label key={s} className="flex min-h-11 items-center gap-3"><input type="checkbox" checked={checks[i]} onChange={e=>setChecks(old=>old.map((v,j)=>j===i?e.target.checked:v))}/><span>{s}</span></label>)}
    </fieldset>
    <h2 className="text-2xl font-semibold">Eight written preparation checks</h2>
    {bank.items.map((q,i)=><fieldset key={q.id} data-question-id={q.id} disabled={submitted} className="min-w-0 rounded-xl border border-current/30 p-4">
      <legend className="font-semibold">{i+1}. {q.prompt}</legend>
      {q.choices.map(c=><label key={c.id} className="flex min-h-11 items-center gap-3 rounded-lg p-2 focus-within:outline focus-within:outline-2"><input type="radio" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span className="break-words">{c.text}</span></label>)}
      {submitted&&<div role="status" className="mt-2"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct. ':'Review. '}</strong>{q.explanation}<p>{q.choices.find(c=>c.id===answers[q.id])?.rationale}</p></div>}
    </fieldset>)}
    {!submitted?<button type="button" disabled={!ready} onClick={submit} className="min-h-11 rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50">Check 8 answers</button>:<div role="status"><p>Written recognition: {gradeFamilyShadowing(answers)}/{bank.items.length}. Not a speaking, listening or official JLPT score.</p><button type="button" onClick={()=>{setAnswers({});setSubmitted(false);setNotice('');}} className="min-h-11 rounded-lg border border-current px-4 py-2">Retry questions</button></div>}
    <p role="status" aria-live="polite">{notice}</p>
  </section>;
}
