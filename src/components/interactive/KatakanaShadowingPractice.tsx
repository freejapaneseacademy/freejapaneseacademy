import { useState } from 'react';
import { recordAttempt } from '../../lib/progress';
import bank from '../../content/exercises/l0-m04-c01-l08-v1.json';
export default function KatakanaShadowingPractice(){
 const questions=bank.items;
 const [answers,setAnswers]=useState<Record<string,number>>({});
 const [submitted,setSubmitted]=useState(false);
 const [save,setSave]=useState<'idle'|'saving'|'saved'|'error'>('idle');
 const [played,setPlayed]=useState<Record<string,boolean>>({});
 const score=questions.filter(q=>answers[q.id]===q.correctIndex).length;
 const complete=questions.every(q=>answers[q.id]!==undefined);
 async function submit(){if(!complete||submitted)return;setSubmitted(true);setSave('saving');try{await recordAttempt('l0-m04-c01-l08-written-v1','l0',score,questions.length);setSave('saved')}catch{setSave('error')}}
 return <section className="space-y-5 min-w-0" aria-labelledby="katakana-shadowing-heading">
 <h2 id="katakana-shadowing-heading" className="text-2xl font-semibold">Listen, repeat, and check the written sounds</h2>
 <p>Original Chapter 01 L06 AivisSpeech recordings. Play at your own pace; no microphone is used. If either audio file is unavailable, return after its verified generation rather than substituting a synthetic browser voice.</p>
 {(['a','b'] as const).map((track,i)=><div key={track} className="rounded-xl border border-current/20 p-4"><h3 className="font-semibold">Scene {i+1}</h3><audio controls preload="none" className="w-full max-w-full" onPlay={()=>setPlayed(old=>({...old,[track]:true}))}><source src={`/audio/fja-l0-m04-c01-l06-${track}-v1.wav`} type="audio/wav"/>Your browser does not support audio playback.</audio><p className="text-sm">Pause after each short segment and repeat only syllables heard in the actual recording.</p></div>)}
 <p>Written quiz: eight questions. You may listen before answering; the score does not measure speaking ability.</p>
 {questions.map((q,i)=><fieldset key={q.id} disabled={submitted} className="rounded-xl border border-current/20 p-4 min-w-0"><legend className="font-semibold px-1">{i+1}. {q.prompt}</legend><div className="space-y-2 mt-3">{q.options.map((option,j)=><label key={j} className="flex min-h-11 items-center gap-3 rounded-lg p-3 focus-within:outline focus-within:outline-2"><input type="radio" name={q.id} checked={answers[q.id]===j} onChange={()=>setAnswers(old=>({...old,[q.id]:j}))}/><span lang={/[\u30a0-\u30ff]/.test(option)?'ja':undefined}>{option}</span></label>)}</div>{submitted&&<p role="status"><strong>{answers[q.id]===q.correctIndex?'Correct.':'Review.'}</strong> {q.explanation}</p>}</fieldset>)}
 {!submitted?<button type="button" disabled={!complete} onClick={submit} className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50">Check written answers</button>:<div role="status" aria-live="polite"><p>Written score: {score}/{questions.length}. This is not a pronunciation grade.</p>{save==='saved'&&<p>Attempt saved on this device.</p>}{save==='error'&&<p>Storage unavailable; results remain visible.</p>}{save==='saving'&&<p>Saving locally…</p>}<button type="button" onClick={()=>{setAnswers({});setSubmitted(false);setSave('idle')}} className="rounded-lg border border-current px-4 py-2">Try written check again</button></div>}
 <fieldset className="rounded-xl border border-current/20 p-4"><legend className="font-semibold">Optional ungraded reflection</legend>{['I replayed actual audio rather than relying on printed prompts.','I repeated at a comfortable pace.','I can distinguish シ from ツ on the page.'].map(s=><label key={s} className="flex items-start gap-2 py-2"><input type="checkbox"/>{s}</label>)}</fieldset>
 </section>
}