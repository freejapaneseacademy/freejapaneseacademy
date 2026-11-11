import { useState } from 'react';
import { recordAttempt } from '../../lib/progress';
import bank from '../../content/exercises/n5-m01-c01-l06-v1.json';

const tracks = [
 {id:'a',title:'Scene A — language exchange',src:'/audio/fja-n5-m01-c01-l06-a-v1.wav',transcript:'Emma: こんにちは。わたしは、エマです。\nTanaka: こんにちは。わたしは、たなかです。\nEmma: たなかさんは、せんせいですか。\nTanaka: はい。にほんごのせんせいです。',translation:"Emma: Hello. I'm Emma.\nTanaka: Hello. I'm Tanaka.\nEmma: Tanaka, are you a teacher?\nTanaka: Yes. I'm a Japanese teacher."},
 {id:'b',title:'Scene B — registration desk',src:'/audio/fja-n5-m01-c01-l06-b-v1.wav',transcript:'Staff: すみません。おなまえは？\nLee: リーです。ちゅうごくじんです。\nStaff: リーさんは、せんせいですか。\nLee: いいえ。せんせいじゃありません。がくせいです。',translation:"Staff: Excuse me. Your name?\nLee: I'm Lee. I'm Chinese.\nStaff: Lee, are you a teacher?\nLee: No. I'm not a teacher. I'm a student."}
];
export default function FirstMeetingListeningPractice(){
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [revealed,setRevealed]=useState<Record<string,boolean>>({});
 const [assisted,setAssisted]=useState(false);
 const [played,setPlayed]=useState<Record<string,boolean>>({});
 const [errors,setErrors]=useState<Record<string,boolean>>({});
 const [submitted,setSubmitted]=useState(false);
 const [save,setSave]=useState('idle');
 const complete=bank.items.every(q=>Boolean(answers[q.id]));
 const audioReady=tracks.every(t=>played[t.id]&&!errors[t.id]);
 const score=bank.items.filter(q=>answers[q.id]===q.answerKey.choiceId).length;
 async function submit(){if(!complete||!audioReady||submitted)return;setSubmitted(true);setSave('saving');try{await recordAttempt('n5-m01-c01-l06-'+(assisted?'assisted':'unaided')+'-v1','n5',score,bank.items.length);setSave('saved');}catch{setSave('error');}}
 function retry(){setAnswers({});setRevealed({});setAssisted(false);setPlayed({});setSubmitted(false);setSave('idle');}
 return <section aria-labelledby="n5-listening-heading" className="min-w-0 space-y-6">
 <h2 id="n5-listening-heading" className="text-2xl font-semibold">Listen and check your understanding</h2>
 <p>Play both recordings before submitting. Open a transcript for assisted practice, or keep it hidden for unaided practice.</p>
 {tracks.map(t=><section key={t.id} aria-label={t.title} className="min-w-0 rounded-xl border border-current/20 p-4 space-y-3">
 <h3 className="text-lg font-semibold">{t.title}</h3>
 <audio controls preload="none" aria-label={t.title} className="w-full max-w-full" onPlay={()=>setPlayed(v=>({...v,[t.id]:true}))} onError={()=>setErrors(v=>({...v,[t.id]:true}))}><source src={t.src} type="audio/wav"/>Your browser does not support audio playback.</audio>
 {errors[t.id]&&<p role="alert">The recording is unavailable. This listening attempt cannot be scored without verified audio.</p>}
 <button type="button" aria-expanded={!!revealed[t.id]} onClick={()=>{setAssisted(true);setRevealed(v=>({...v,[t.id]:!v[t.id]}));}} className="rounded-lg border border-current px-4 py-3 min-h-11">{revealed[t.id]?'Hide':'Reveal'} transcript (assisted mode)</button>
 {revealed[t.id]&&<div className="rounded-lg border border-current/20 p-3"><p lang="ja" className="whitespace-pre-line">{t.transcript}</p><p className="whitespace-pre-line mt-3">{t.translation}</p></div>}
 {bank.items.filter(q=>q.trackId==='audio-n5-m01-c01-l06-'+t.id).map((q,i)=><fieldset key={q.id} disabled={submitted} className="min-w-0 border-t border-current/20 pt-3"><legend className="font-semibold">{i+1}. {q.prompt}</legend><div className="space-y-2 mt-2">{q.choices.map(c=><label key={c.id} className="flex min-h-11 items-center gap-3 rounded-lg p-2 focus-within:outline focus-within:outline-2"><input type="radio" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(v=>({...v,[q.id]:c.id}))}/><span>{c.text}</span></label>)}</div>{submitted&&<p role="status" className="mt-2"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct.':'Review.'}</strong> {q.explanation} <span lang="ja">{q.evidence}</span></p>}</fieldset>)}
 </section>)}
 {!submitted?<><p role="status">{audioReady?'Both recordings have started. Select an answer for every question.':'Play both recordings to enable checking.'}</p><button type="button" disabled={!complete||!audioReady} onClick={submit} className="rounded-lg bg-blue-700 text-white px-5 py-3 font-semibold disabled:opacity-50">Check listening answers</button></>:<div role="status" aria-live="polite"><p><strong>{assisted?'Assisted':'Unaided'} listening: {score}/{bank.items.length}</strong></p><p>{save==='saved'?'Attempt saved on this device.':save==='error'?'Browser storage unavailable; the score is still shown.':'Saving attempt…'}</p><button type="button" onClick={retry} className="rounded-lg border border-current px-4 py-3">Try again</button></div>}
 </section>;
}
