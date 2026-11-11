import { useState } from 'react';
import { recordAttempt } from '../../lib/progress';
import bank from '../../content/exercises/n5-m01-c03-chk-v1.json';

export default function N5FamilyCheckpoint() {
  const [answers,setAnswers]=useState<Record<string,string>>({});
  const [submitted,setSubmitted]=useState(false);
  const [saved,setSaved]=useState<'idle'|'saving'|'saved'|'error'>('idle');
  const [ready,setReady]=useState<Record<string,boolean>>({a:false,b:false});
  const [assisted,setAssisted]=useState(false);
  const [showTranscript,setShowTranscript]=useState(false);
  const audioReady=ready.a && ready.b;
  const visible=bank.items.filter(q=>audioReady || q.skills[0]!=='listening');
  const complete=visible.every(q=>Boolean(answers[q.id]));
  const score=visible.filter(q=>answers[q.id]===q.answerKey.choiceId).length;
  async function submit() {
    if(!complete || submitted)return;
    setSubmitted(true);setSaved('saving');
    try {await recordAttempt('n5-m01-c03-chk-'+(audioReady?(assisted?'assisted':'unaided'):'written')+'-v1','n5',score,visible.length);setSaved('saved');}
    catch {setSaved('error');}
  }
  return <section aria-labelledby="family-checkpoint" className="min-w-0 space-y-5">
    <h2 id="family-checkpoint" className="text-2xl font-semibold">Check your understanding</h2>
    <p>Answer ten written questions. Four additional listening questions become available only when both original recordings can play. Choose one answer for each question.</p>
    <div className="space-y-3 rounded-xl border border-current/20 p-4">
      <h3 className="font-semibold">Original chapter listening</h3>
      {(['a','b'] as const).map(t=><div key={t}><label htmlFor={'family-audio-'+t}>Family talk {t.toUpperCase()}</label><audio id={'family-audio-'+t} controls preload="none" className="w-full" src={'/audio/fja-n5-m01-c03-l06-'+t+'-v1.wav'} onCanPlay={()=>setReady(r=>({...r,[t]:true}))} onError={()=>setReady(r=>({...r,[t]:false}))}>Audio playback unavailable.</audio></div>)}
      <p role="status">{audioReady?'Both recordings report playable audio; listening questions are available.':'Listening questions remain locked until both recordings can play.'}</p>
      {audioReady&&<button type="button" className="rounded-lg border border-current px-4 py-2" onClick={()=>{setShowTranscript(v=>!v);setAssisted(true)}}>{showTranscript?'Hide':'Show'} transcript (marks attempt assisted)</button>}
      {showTranscript&&<div lang="ja" className="rounded-lg border border-current/20 p-3"><p>A: こちらは、わたしの妹です。ユイです。ユイは、高校生です。</p><p>B: その人は、だれですか。わたしの兄です。先生ですか。いいえ、先生じゃありません。会社員です。</p></div>}
    </div>
    {visible.map((q,i)=><fieldset key={q.id} disabled={submitted} className="min-w-0 rounded-xl border border-current/20 p-4"><legend className="px-1 font-semibold">{i+1}. {q.prompt}</legend><div className="mt-3 space-y-2">{q.choices.map(c=><label key={c.id} className="flex min-h-11 items-start gap-3 rounded-lg p-3 focus-within:outline focus-within:outline-2"><input type="radio" name={q.id} className="mt-1" checked={answers[q.id]===c.id} onChange={()=>setAnswers(v=>({...v,[q.id]:c.id}))}/><span className="min-w-0 break-words">{c.text}</span></label>)}</div>{submitted&&<div role="status" className="mt-3"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct.':'Review.'}</strong> {q.explanation}<p lang="ja">Evidence: {q.evidence}</p><p>{q.choices.find(c=>c.id===answers[q.id])?.rationale}</p></div>}</fieldset>)}
    {!submitted?<button type="button" disabled={!complete} onClick={submit} className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50">Check {visible.length} answers</button>:<div role="status" aria-live="polite"><p><strong>{score}/{visible.length} correct.</strong> {audioReady?(assisted?'Transcript-assisted':'Unaided listening'):'Written-only'} practice.</p><p>{saved==='saved'?'Attempt saved on this device.':saved==='error'?'Local storage unavailable; result remains visible.':'Saving locally…'}</p><button type="button" className="rounded-lg border border-current px-4 py-2" onClick={()=>{setAnswers({});setSubmitted(false);setSaved('idle');setAssisted(false);setShowTranscript(false)}}>Try again</button></div>}
  </section>;
}
