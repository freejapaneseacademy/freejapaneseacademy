import { useState } from 'react';
import { recordAttempt } from '../../lib/progress';
import bank from '../../content/exercises/n5-m01-c02-chk-v1.json';

export default function N5QuestionWordsCheckpoint() {
  const [answers,setAnswers]=useState<Record<string,string>>({});
  const [submitted,setSubmitted]=useState(false);
  const [saved,setSaved]=useState<'idle'|'saving'|'saved'|'error'>('idle');
  const [ready,setReady]=useState<Record<string,boolean>>({a:false,b:false});
  const [assisted,setAssisted]=useState(false);
  const [showTranscript,setShowTranscript]=useState(false);
  const audioReady=ready.a===true && ready.b===true;
  const visible=bank.items.filter(q=>audioReady || q.skills[0]!=='listening');
  const complete=visible.every(q=>Boolean(answers[q.id]));
  const score=visible.filter(q=>answers[q.id]===q.answerKey.choiceId).length;
  async function submit(){
    if(!complete || submitted)return;
    setSubmitted(true);setSaved('saving');
    try{await recordAttempt('n5-m01-c02-chk-'+(audioReady?(assisted?'assisted':'unaided'):'written')+'-v1','n5',score,visible.length);setSaved('saved');}
    catch{setSaved('error');}
  }
  return <section aria-labelledby="question-checkpoint" className="min-w-0 space-y-5">
    <h2 id="question-checkpoint" className="text-2xl font-semibold">Try the chapter checkpoint</h2>
    <p>Choose one answer per question. Listening is available only when both authentic recordings can play. A written-only attempt has ten questions; a full attempt has fourteen.</p>
    <div className="space-y-3 rounded-xl border border-current/20 p-4">
      <h3 className="font-semibold">Optional audio-first questions</h3>
      {(['a','b'] as const).map(t=><div key={t}><label htmlFor={'questions-audio-'+t}>Interview {t.toUpperCase()}</label><audio id={'questions-audio-'+t} controls preload="none" className="w-full" src={'/audio/fja-n5-m01-c02-l06-'+t+'-v1.wav'} onCanPlay={()=>setReady(r=>({...r,[t]:true}))} onError={()=>setReady(r=>({...r,[t]:false}))}>Audio is not supported.</audio></div>)}
      <p role="status">{audioReady?'Both recordings report playable audio; listening questions are unlocked.':'Listening questions are locked until both recordings can play.'}</p>
      {audioReady&&<button type="button" className="rounded-lg border border-current px-4 py-2" onClick={()=>{setShowTranscript(v=>!v);setAssisted(true)}}>{showTranscript?'Hide':'Show'} transcript (marks attempt assisted)</button>}
      {showTranscript&&<div lang="ja" className="rounded-lg border border-current/20 p-3"><p>A: あの人は、だれですか。やまださんです。にほんごのせんせいです。どこですか。きょうしつです。たなかさんも、きょうしつです。</p><p>B: これは、何ですか。それは、じしょです。あなたのノートは、どれですか。あのあおいノートです。あかいノートは、わたしのじゃありません。</p></div>}
    </div>
    {visible.map((q,i)=><fieldset key={q.id} disabled={submitted} className="min-w-0 rounded-xl border border-current/20 p-4"><legend className="px-1 font-semibold">{i+1}. {q.prompt}</legend><div className="mt-3 space-y-2">{q.choices.map(c=><label key={c.id} className="flex min-h-11 items-start gap-3 rounded-lg p-3 focus-within:outline focus-within:outline-2"><input type="radio" name={q.id} className="mt-1" checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span className="min-w-0 break-words">{c.text}</span></label>)}</div>{submitted&&<div role="status" className="mt-3"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct.':'Review.'}</strong> {q.explanation}<p lang="ja">Evidence: {q.evidence}</p><p>{q.choices.find(c=>c.id===answers[q.id])?.rationale}</p></div>}</fieldset>)}
    {!submitted?<button type="button" disabled={!complete} onClick={submit} className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50">Check {visible.length} answers</button>:<div role="status" aria-live="polite"><p><strong>{score}/{visible.length} correct.</strong> {audioReady?(assisted?'Transcript-assisted':'Unaided listening'):'Written-only'} practice.</p><p>{saved==='saved'?'Attempt saved on this device.':saved==='error'?'Local storage unavailable; result remains visible.':'Saving locally…'}</p><button type="button" className="rounded-lg border border-current px-4 py-2" onClick={()=>{setAnswers({});setSubmitted(false);setSaved('idle');setAssisted(false);setShowTranscript(false)}}>Try again</button></div>}
  </section>;
}
