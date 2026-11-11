import { useState } from 'react';
import { recordAttempt } from '../../lib/progress';
import bank from '../../content/exercises/n5-m01-c02-l06-v1.json';

export const tracks = [
 {id:'a',title:'Interview A — finding a teacher',src:'/audio/fja-n5-m01-c02-l06-a-v1.wav',transcript:'Visitor: すみません。あの人は、だれですか。\nGuide: やまださんです。にほんごのせんせいです。\nVisitor: やまださんは、どこですか。\nGuide: きょうしつです。たなかさんも、きょうしつです。',translation:'Visitor: Excuse me. Who is that person?\nGuide: That is Yamada, a Japanese teacher.\nVisitor: Where is Yamada?\nGuide: In the classroom. Tanaka is also in the classroom.'},
 {id:'b',title:'Interview B — classroom supplies',src:'/audio/fja-n5-m01-c02-l06-b-v1.wav',transcript:'Student: これは、何ですか。\nTeacher: それは、じしょです。\nStudent: あなたのノートは、どれですか。\nTeacher: あのあおいノートです。あかいノートは、わたしのじゃありません。',translation:"Student: What is this?\nTeacher: That's a dictionary.\nStudent: Which notebook is yours?\nTeacher: That blue notebook. The red notebook isn't mine."}
];
export default function QuestionInterviewListening(){
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [shown,setShown]=useState<Record<string,boolean>>({});
 const [assisted,setAssisted]=useState(false);
 const [played,setPlayed]=useState<Record<string,boolean>>({});
 const [errors,setErrors]=useState<Record<string,boolean>>({});
 const [done,setDone]=useState(false);
 const [save,setSave]=useState('idle');
 const ready=tracks.every(t=>played[t.id]&&!errors[t.id]);
 const complete=bank.items.every(q=>Boolean(answers[q.id]));
 const score=bank.items.filter(q=>answers[q.id]===q.answerKey.choiceId).length;
 async function submit(){if(done||!ready||!complete)return;setDone(true);setSave('saving');try{await recordAttempt('n5-m01-c02-l06-'+(assisted?'assisted':'unaided')+'-v1','n5',score,bank.items.length);setSave('saved');}catch{setSave('error');}}
 function retry(){setAnswers({});setShown({});setAssisted(false);setPlayed({});setErrors({});setDone(false);setSave('idle');}
 return <section aria-labelledby="question-interviews" className="min-w-0 space-y-6">
 <h2 id="question-interviews" className="text-2xl font-semibold">Listen and answer</h2>
 <p>Start both original recordings before checking your answers. Transcripts are optional and mark the attempt assisted.</p>
 {tracks.map(t=><section key={t.id} aria-label={t.title} className="min-w-0 space-y-3 rounded-xl border border-current/20 p-4">
 <h3 className="text-lg font-semibold">{t.title}</h3>
 <audio controls preload="none" className="w-full max-w-full" aria-label={t.title} onPlay={()=>setPlayed(v=>({...v,[t.id]:true}))} onError={()=>setErrors(v=>({...v,[t.id]:true}))}><source src={t.src} type="audio/wav"/>Audio is not supported.</audio>
 {errors[t.id]&&<p role="alert">Audio unavailable. This listening attempt cannot be scored.</p>}
 <button type="button" aria-expanded={!!shown[t.id]} onClick={()=>{setAssisted(true);setShown(v=>({...v,[t.id]:!v[t.id]}));}} className="min-h-11 rounded-lg border border-current px-4 py-3">{shown[t.id]?'Hide':'Reveal'} transcript (assisted)</button>
 {shown[t.id]&&<div className="rounded-lg border border-current/20 p-3"><p lang="ja" className="whitespace-pre-line">{t.transcript}</p><p className="mt-3 whitespace-pre-line">{t.translation}</p></div>}
 {bank.items.filter(q=>q.trackId==='audio-n5-m01-c02-l06-'+t.id).map((q,i)=><fieldset key={q.id} disabled={done} className="min-w-0 border-t border-current/20 pt-3"><legend className="font-semibold">{i+1}. {q.prompt}</legend><div className="mt-2 space-y-2">{q.choices.map(c=><label key={c.id} className="flex min-h-11 items-center gap-3 rounded-lg p-2 focus-within:outline focus-within:outline-2"><input type="radio" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(v=>({...v,[q.id]:c.id}))}/><span>{c.text}</span></label>)}</div>{done&&<p role="status" className="mt-2"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct.':'Review.'}</strong> {q.explanation} <span lang="ja">{q.evidence}</span></p>}</fieldset>)}
 </section>)}
 {!done?<><p role="status">{ready?'Both recordings started. Answer all six questions.':'Play both recordings to unlock checking.'}</p><button type="button" disabled={!ready||!complete} onClick={submit} className="min-h-11 rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50">Check listening answers</button></>:<div role="status" aria-live="polite"><p><strong>{assisted?'Assisted':'Unaided'} listening: {score}/{bank.items.length}</strong></p><p>{save==='saved'?'Attempt saved on this device.':save==='error'?'Storage unavailable; score still shown.':'Saving attempt…'}</p><button type="button" onClick={retry} className="min-h-11 rounded-lg border border-current px-4 py-3">Try again</button></div>}
 </section>;
}
