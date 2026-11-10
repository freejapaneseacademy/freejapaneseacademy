import { useState } from 'react';
import { recordAttempt } from '../../lib/progress';
import bank from '../../content/exercises/l0-m05-c03-l06.json';

const tracks = [
 {id:'a',title:'Scene A — at the study table',src:'/audio/fja-l0-m05-c03-l06-a-v1.wav',transcript:'Learner: これは、なんですか。\nTeacher: それは、ほんです。\nLearner: たなかさんは、せんせいですか。\nTeacher: はい。たなかさんは、せんせいです。',translation:'Learner: What is this?\nTeacher: That is a book.\nLearner: Is Tanaka a teacher?\nTeacher: Yes. Tanaka is a teacher.'},
 {id:'b',title:'Scene B — at the classroom door',src:'/audio/fja-l0-m05-c03-l06-b-v1.wav',transcript:'Visitor: すみません。これは、ノートですか。\nTeacher: はい。ノートです。\nVisitor: あのひとは、がくせいですか。\nTeacher: いいえ。あのひとは、せんせいです。',translation:'Visitor: Excuse me. Is this a notebook?\nTeacher: Yes. It is a notebook.\nVisitor: Is that person a student?\nTeacher: No. That person is a teacher.'}
];
export default function FirstSentenceListeningPractice(){
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [reveal,setReveal]=useState<Record<string,boolean>>({});
 const [everRevealed,setEverRevealed]=useState(false);
 const [submitted,setSubmitted]=useState(false);
 const [save,setSave]=useState<'idle'|'saving'|'saved'|'error'>('idle');
 const [audioErrors,setAudioErrors]=useState<Record<string,boolean>>({});
 const [played,setPlayed]=useState<Record<string,boolean>>({});
 const complete=bank.items.every(q=>!!answers[q.id]);
 const score=bank.items.filter(q=>answers[q.id]===q.answerKey.choiceId).length;
 async function submit(){if(!complete||submitted||!tracks.every(t=>played[t.id])||Object.values(audioErrors).some(Boolean))return;setSubmitted(true);setSave('saving');try{await recordAttempt('l0-m05-c03-l06-'+(everRevealed?'assisted':'unaided')+'-v1','l0',score,bank.items.length);setSave('saved');}catch{setSave('error');}}
 return <section aria-labelledby="first-sentence-listening-heading" className="min-w-0 space-y-6">
 <h2 id="first-sentence-listening-heading" className="text-2xl font-semibold">Listen to two question-and-answer scenes</h2>
 <p>Play both real recordings before submitting. Reveal transcripts only when you want assisted practice; that mode is stored separately.</p>
 {tracks.map(t=><section key={t.id} className="min-w-0 rounded-xl border border-current/20 p-4" aria-label={t.title}>
 <h3 className="text-lg font-semibold">{t.title}</h3>
 <audio controls preload="none" className="w-full max-w-full" aria-label={t.title} onPlay={()=>setPlayed(v=>({...v,[t.id]:true}))} onError={()=>setAudioErrors(v=>({...v,[t.id]:true}))}><source src={t.src} type="audio/wav"/>Your browser does not support WAV audio.</audio>
 {audioErrors[t.id]&&<p role="alert">Audio is unavailable. This listening assessment cannot be scored until verified recordings are online.</p>}
 <button type="button" aria-expanded={!!reveal[t.id]} onClick={()=>{setEverRevealed(true);setReveal(v=>({...v,[t.id]:!v[t.id]}));}} className="rounded-lg border border-current px-3 py-2 mt-2">{reveal[t.id]?'Hide':'Reveal'} transcript (assisted mode)</button>
 {reveal[t.id]&&<div className="mt-3 rounded-lg border border-current/20 p-3"><p lang="ja" className="whitespace-pre-line">{t.transcript}</p><p className="whitespace-pre-line mt-2">{t.translation}</p></div>}
 {bank.items.filter(q=>q.trackId==='audio-l0-m05-c03-l06-'+t.id).map((q,i)=><fieldset key={q.id} disabled={submitted} className="min-w-0 border-t border-current/20 mt-4 pt-3"><legend className="font-semibold">{i+1}. {q.prompt}</legend><div className="space-y-1 mt-2">{q.choices.map(c=><label key={c.id} className="flex items-start gap-3 rounded-lg p-2 min-h-11 focus-within:outline focus-within:outline-2"><input className="mt-1" type="radio" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(v=>({...v,[q.id]:c.id}))}/><span>{c.text}</span></label>)}</div>{submitted&&<p role="status" className="mt-2"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct.':'Review.'}</strong> {q.explanation} <span lang="ja">{q.evidence}</span></p>}</fieldset>)}
 </section>)}
 {!submitted?<><p role="status">{tracks.every(t=>played[t.id])?'Both recordings started. Answer all six questions to check.':'Play both recordings to enable checking.'}</p><button type="button" disabled={!complete||!tracks.every(t=>played[t.id])||Object.values(audioErrors).some(Boolean)} onClick={submit} className="rounded-lg bg-blue-700 text-white px-5 py-3 font-semibold disabled:opacity-50">Check listening answers</button></>:<div role="status" aria-live="polite"><p><strong>{everRevealed?'Assisted':'Unaided'} listening: {score}/{bank.items.length}.</strong></p><p>{save==='saved'?'Attempt saved on this device.':save==='error'?'Storage unavailable; score remains visible.':save==='saving'?'Saving attempt…':''}</p><button type="button" onClick={()=>{setAnswers({});setReveal({});setEverRevealed(false);setPlayed({});setSubmitted(false);setSave('idle');}} className="rounded-lg border border-current px-4 py-2">Try again</button></div>}
 </section>;
}
