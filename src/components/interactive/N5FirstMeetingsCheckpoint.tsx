import { useState } from 'react';
import { recordAttempt } from '../../lib/progress';
import bank from '../../content/exercises/n5-m01-c01-chk-v1.json';

export default function N5FirstMeetingsCheckpoint(){
 const questions=bank.items;
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false);
 const [saved,setSaved]=useState<'idle'|'saving'|'saved'|'error'>('idle');
 const [audioReady,setAudioReady]=useState(false);
 const [assisted,setAssisted]=useState(false);
 const [transcripts,setTranscripts]=useState(false);
 const written=questions.filter(q=>q.skills[0]!=='listening');
 const visible=audioReady?questions:written;
 const complete=visible.every(q=>Boolean(answers[q.id]));
 const score=visible.filter(q=>answers[q.id]===q.answerKey.choiceId).length;
 async function submit(){if(!complete||submitted)return;setSubmitted(true);setSaved('saving');try{await recordAttempt('n5-m01-c01-chk-'+(audioReady?(assisted?'assisted':'unaided'):'written')+'-v1','n5',score,visible.length);setSaved('saved')}catch{setSaved('error')}}
 return <section className="min-w-0 space-y-5" aria-labelledby="n5-first-checkpoint">
 <h2 id="n5-first-checkpoint" className="text-2xl font-semibold">Chapter checkpoint</h2>
 <p>Answer the written questions first. Listening items become available only after both genuine recordings play successfully. Your result is practice feedback, not a JLPT grade.</p>
 <div className="rounded-xl border border-current/20 p-4 space-y-3">
 <h3 className="font-semibold">Optional audio-first listening</h3>
 <p>Use the chapter L06 recordings. If either recording fails to load, the checkpoint remains written-only. No audio is fabricated or replaced with a transcript.</p>
 {(['a','b'] as const).map((t)=><div key={t}><label htmlFor={'first-meeting-audio-'+t}>Dialogue {t.toUpperCase()}</label><audio id={'first-meeting-audio-'+t} controls preload="none" className="w-full" onError={()=>setAudioReady(false)} onCanPlay={()=>{const els=['a','b'].map(x=>document.getElementById('first-meeting-audio-'+x) as HTMLAudioElement|null);if(els.every(e=>e&&e.readyState>=2))setAudioReady(true)}} src={'/api/audio/n5-m01-c01-l06/'+t+'.wav'}>Your browser does not support audio playback.</audio></div>)}
 <p role="status">{audioReady?'Both recordings report playable audio. You can answer listening questions.':'Listening questions are locked until both recordings are playable.'}</p>
 {audioReady&&<button type="button" className="rounded-lg border border-current px-4 py-2" onClick={()=>{setTranscripts(v=>!v);setAssisted(true)}}>{transcripts?'Hide':'Show'} listening evidence (marks attempt assisted)</button>}
 {transcripts&&<div className="rounded-lg border border-current/20 p-3" lang="ja"><p>Dialogue A: こんにちは。わたしは、エマです。たなかさんは、せんせいですか。はい。にほんごのせんせいです。</p><p>Dialogue B: ちゅうごくじんです。いいえ。せんせいじゃありません。がくせいです。</p></div>}
 </div>
 {visible.map((q,i)=><fieldset key={q.id} disabled={submitted} className="min-w-0 rounded-xl border border-current/20 p-4"><legend className="px-1 font-semibold">{i+1}. {q.prompt}</legend><div className="mt-3 space-y-2">{q.choices.map(c=><label key={c.id} className="flex min-h-11 items-start gap-3 rounded-lg p-3 focus-within:outline focus-within:outline-2"><input type="radio" className="mt-1" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span>{c.text}</span></label>)}</div>{submitted&&<div role="status" className="mt-2"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct.':'Review.'}</strong> {q.explanation}<p lang="ja">Evidence: {q.evidence}</p><p>{q.choices.find(c=>c.id===answers[q.id])?.rationale}</p></div>}</fieldset>)}
 {!submitted?<button type="button" disabled={!complete} onClick={submit} className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50">Check {visible.length} answers</button>:<div role="status" aria-live="polite"><p><strong>{score}/{visible.length} correct</strong> · {audioReady?(assisted?'Transcript-assisted':'Unaided listening'):'Written-only'} attempt.</p><p>{saved==='saved'?'Saved on this device.':saved==='error'?'Storage unavailable; score remains visible.':'Saving locally…'}</p><button type="button" className="rounded-lg border border-current px-4 py-2" onClick={()=>{setAnswers({});setSubmitted(false);setSaved('idle');setAssisted(false);setTranscripts(false)}}>Try again</button></div>}
 </section>;
}