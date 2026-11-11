import { useEffect, useRef, useState } from 'react';
import bank from '../../content/exercises/n5-m01-c01-l08-v1.json';
import { recordAttempt } from '../../lib/progress';

export const gradeFirstMeetingShadowing = (answers: Record<string,string>) =>
  bank.items.filter(q => answers[q.id] === q.answerKey.choiceId).length;

const scenes = [
  { id:'a', label:'Scene A — welcome table', src:'/audio/fja-n5-m01-c01-l06-a-v1.wav',
    turns:['Woman: こんにちは。わたしは、エマです。','Man: こんにちは。わたしは、たなかです。','Woman: たなかさんは、せんせいですか。','Man: はい。にほんごのせんせいです。'],
    meaning:'Emma introduces herself; Tanaka confirms he teaches Japanese.' },
  { id:'b', label:'Scene B — registration desk', src:'/audio/fja-n5-m01-c01-l06-b-v1.wav',
    turns:['Man: すみません。おなまえは？','Woman: リーです。ちゅうごくじんです。','Man: リーさんは、せんせいですか。','Woman: いいえ。せんせいじゃありません。がくせいです。'],
    meaning:'Lee says she is Chinese and corrects a mistaken occupation: she is a student.' }
];

export default function FirstMeetingShadowing() {
  const [answers,setAnswers] = useState<Record<string,string>>({});
  const [submitted,setSubmitted] = useState(false);
  const [notice,setNotice] = useState('');
  const [checks,setChecks] = useState<boolean[]>([false,false,false,false]);
  const [recording,setRecording] = useState(false);
  const [clip,setClip] = useState<string | null>(null);
  const [micNotice,setMicNotice] = useState('Recording is optional and off.');
  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const chunks = useRef<Blob[]>([]);
  const url = useRef<string | null>(null);
  const ready = bank.items.every(q=>Boolean(answers[q.id]));

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
    if(recording) return;
    if(!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder==='undefined') {
      setMicNotice('Recording is unsupported here. You can rehearse without a microphone.');return;
    }
    try {
      const media=await navigator.mediaDevices.getUserMedia({audio:true});
      stream.current=media;
      const r=new MediaRecorder(media);
      chunks.current=[];
      r.ondataavailable=e=>{if(e.data.size)chunks.current.push(e.data);};
      r.onstop=()=>{
        if(url.current) URL.revokeObjectURL(url.current);
        if(chunks.current.length){url.current=URL.createObjectURL(new Blob(chunks.current,{type:r.mimeType||'audio/webm'}));setClip(url.current);setMicNotice('Recording ready for private playback. Discard when finished.');}
        else setMicNotice('No audio was captured.');
        media.getTracks().forEach(t=>t.stop());setRecording(false);
      };
      r.start();recorder.current=r;setRecording(true);setMicNotice('Microphone active. Stop to hear your local recording.');
    } catch {setMicNotice('Microphone access was not granted. Silent rehearsal is fine.');}
  }
  async function submit() {
    if(!ready||submitted)return;
    setSubmitted(true);
    try {await recordAttempt('n5-m01-c01-l08-written-v1','n5',gradeFirstMeetingShadowing(answers),bank.items.length);setNotice('Written recognition result saved on this device.');}
    catch {setNotice('Storage unavailable; the result is visible but was not saved.');}
  }
  return <section aria-label="Optional first-meeting shadowing studio" className="min-w-0 space-y-6">
    <h2 className="text-2xl font-semibold">Listen, pause, shadow and switch roles</h2>
    <p>These are the original L06 candidate recordings. Playback and pronunciation quality are not independently verified here. If audio fails, use the printed practice alternative; do not count that as listening.</p>
    {scenes.map(scene=><section key={scene.id} className="min-w-0 space-y-3 rounded-xl border border-current/30 p-4">
      <h3 className="text-xl font-semibold">{scene.label}</h3>
      <audio controls preload="none" className="block w-full max-w-full" aria-label={scene.label+' model audio'}>
        <source src={scene.src} type="audio/wav"/>Your browser does not support this audio.
      </audio>
      <details className="rounded-lg border border-current/20 p-3"><summary className="cursor-pointer font-semibold">Show practice script and meaning</summary>
        <ol className="list-decimal space-y-2 pl-6">{scene.turns.map((turn,i)=><li key={i} lang="ja">{turn}</li>)}</ol><p>{scene.meaning}</p>
      </details>
      <p>First follow one role, then switch. Pause after each line. The transcript is a reading alternative, not a scored listening result.</p>
    </section>)}
    <section className="space-y-3 rounded-xl border border-current/30 p-4">
      <h3 className="text-xl font-semibold">Optional private microphone rehearsal</h3>
      <p>Nothing is uploaded. Recording begins only when you press Start and grant permission. The recording exists only as a temporary browser object until discarded or the page closes.</p>
      <div className="flex flex-wrap gap-2">
        <button type="button" disabled={recording} onClick={start} className="min-h-11 rounded-lg border border-current px-4 py-2">Start recording</button>
        <button type="button" disabled={!recording} onClick={stop} className="min-h-11 rounded-lg border border-current px-4 py-2">Stop recording</button>
        <button type="button" disabled={!clip || recording} onClick={discard} className="min-h-11 rounded-lg border border-current px-4 py-2">Discard recording</button>
      </div>
      <p role="status" aria-live="polite">{micNotice}</p>
      {clip && <audio controls src={clip} className="block w-full max-w-full" aria-label="Private recording playback"/>}
    </section>
    <fieldset className="space-y-2"><legend className="text-xl font-semibold">My own speaking self-check (ungraded)</legend>
      {['I can say my fictional name clearly.','I make か audible in a polite question.','I use いいえ and じゃありません for a correction.','I can pause and switch between both roles.'].map((label,i)=><label key={label} className="flex min-h-11 items-center gap-3"><input type="checkbox" checked={checks[i]} onChange={e=>setChecks(old=>old.map((v,j)=>i===j?e.target.checked:v))}/><span>{label}</span></label>)}
    </fieldset>
    <h2 className="text-2xl font-semibold">Eight written language checks (not a speaking grade)</h2>
    {bank.items.map((q,i)=><fieldset key={q.id} data-question-id={q.id} disabled={submitted} className="min-w-0 rounded-xl border border-current/20 p-4">
      <legend className="font-semibold">{i+1}. {q.prompt}</legend>
      {q.choices.map(c=><label key={c.id} className="flex min-h-11 items-center gap-3 rounded-lg p-2 focus-within:outline focus-within:outline-2"><input type="radio" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span className="break-words">{c.text}</span></label>)}
      {submitted&&<p role="status"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct. ':'Review. '}</strong>{q.explanation}</p>}
    </fieldset>)}
    {!submitted?<button type="button" disabled={!ready} onClick={submit} className="min-h-11 rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50">Check 8 answers</button>:<div role="status"><p>Written recognition: {gradeFirstMeetingShadowing(answers)}/{bank.items.length}. No pronunciation score or official JLPT result.</p><button type="button" onClick={()=>{setAnswers({});setSubmitted(false);setNotice('');}} className="min-h-11 rounded-lg border border-current px-4 py-2">Retry questions</button></div>}
    <p role="status" aria-live="polite">{notice}</p>
  </section>;
}
