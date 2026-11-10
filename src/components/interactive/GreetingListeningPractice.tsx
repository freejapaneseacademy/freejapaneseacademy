import { useState } from 'react';
import { recordAttempt } from '../../lib/progress';
import bank from '../../content/exercises/l0-m05-c01-l06.json';

const tracks = [
 {id:'a',title:'Conversation A — arriving in the morning',src:'/audio/fja-l0-m05-c01-l06-a-v1.wav',transcript:'Learner: おはようございます。田中先生。\nTeacher: おはようございます。どうぞ、入ってください。\nLearner: ありがとうございます。',translation:'Learner: Good morning, Tanaka-sensei.\nTeacher: Good morning. Please come in.\nLearner: Thank you.'},
 {id:'b',title:'Conversation B — an afternoon class',src:'/audio/fja-l0-m05-c01-l06-b-v1.wav',transcript:'Teacher: こんにちは。みなさん。\nLearner: こんにちは。\nTeacher: 本を開いてください。\nLearner: すみません。もう一度お願いします。\nTeacher: はい。本を開いてください。',translation:'Teacher: Hello, everyone.\nLearner: Hello.\nTeacher: Please open your books.\nLearner: Excuse me. Once more, please.\nTeacher: Certainly. Please open your books.'}
];
export default function GreetingListeningPractice(){
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [reveal,setReveal]=useState<Record<string,boolean>>({});
 const [submitted,setSubmitted]=useState(false);
 const [save,setSave]=useState<'idle'|'saving'|'saved'|'error'>('idle');
 const [audioErrors,setAudioErrors]=useState<Record<string,boolean>>({});
 const complete=bank.items.every(q=>!!answers[q.id]);
 const score=bank.items.filter(q=>answers[q.id]===q.answerKey.choiceId).length;
 const assisted=Object.values(reveal).some(Boolean);
 async function submit(){if(!complete||submitted)return;setSubmitted(true);setSave('saving');try{await recordAttempt('l0-m05-c01-l06-'+(assisted?'assisted':'unaided')+'-v1','l0',score,bank.items.length);setSave('saved');}catch{setSave('error');}}
 return <section aria-labelledby="greeting-listening-heading" className="min-w-0 space-y-6">
 <h2 id="greeting-listening-heading" className="text-2xl font-semibold">Listen to the two conversations</h2>
 <p>Listen first. Transcripts are optional and reveal a supported practice mode. Audio must be available before an unaided attempt can be meaningful.</p>
 {tracks.map(t=><section key={t.id} className="min-w-0 rounded-xl border border-current/20 p-4" aria-label={t.title}>
 <h3 className="font-semibold text-lg">{t.title}</h3>
 <audio controls preload="none" className="w-full max-w-full" aria-label={t.title} onError={()=>setAudioErrors(v=>({...v,[t.id]:true}))}><source src={t.src} type="audio/wav"/>Your browser does not support WAV audio.</audio>
 {audioErrors[t.id]&&<p role="alert">Audio is unavailable. Do not score this track until the verified recording is online.</p>}
 <button type="button" aria-expanded={!!reveal[t.id]} onClick={()=>setReveal(v=>({...v,[t.id]:!v[t.id]}))} className="rounded-lg border border-current px-3 py-2 mt-2">{reveal[t.id]?'Hide':'Reveal'} transcript (assisted mode)</button>
 {reveal[t.id]&&<div className="mt-3 rounded-lg border border-current/20 p-3"><p lang="ja" className="whitespace-pre-line">{t.transcript}</p><p className="whitespace-pre-line mt-2">{t.translation}</p></div>}
 {bank.items.filter(q=>q.trackId==='audio-l0-m05-c01-l06-'+t.id).map((q,i)=><fieldset key={q.id} disabled={submitted} className="min-w-0 border-t border-current/20 mt-4 pt-3"><legend className="font-semibold">{i+1}. {q.prompt}</legend><div className="space-y-1 mt-2">{q.choices.map(c=><label key={c.id} className="flex items-start gap-3 rounded-lg p-2 min-h-11 focus-within:outline focus-within:outline-2"><input className="mt-1" type="radio" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(v=>({...v,[q.id]:c.id}))}/><span>{c.text}</span></label>)}</div>{submitted&&<p role="status" className="mt-2"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct.':'Review.'}</strong> {q.explanation} <span lang="ja">{q.evidence}</span></p>}</fieldset>)}
 </section>)}
 {!submitted?<button type="button" disabled={!complete||Object.values(audioErrors).some(Boolean)} onClick={submit} className="rounded-lg bg-blue-700 text-white px-5 py-3 font-semibold disabled:opacity-50">Check listening answers</button>:<div role="status" aria-live="polite"><p><strong>{assisted?'Assisted':'Unaided'} listening: {score}/{bank.items.length}.</strong></p><p>{save==='saved'?'Attempt saved on this device.':save==='error'?'Storage unavailable; score remains visible.':save==='saving'?'Saving attempt…':''}</p><button type="button" onClick={()=>{setAnswers({});setReveal({});setSubmitted(false);setSave('idle');}} className="rounded-lg border border-current px-4 py-2">Try again</button></div>}
 </section>;
}
