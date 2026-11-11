import {useState} from 'react';
import bank from '../../content/exercises/n5-m02-c03-chk-v1.json';
import {recordAttempt} from '../../lib/progress';

const tracks=[
 {id:'a',title:'Track A — notebooks in a study room',url:'/audio/fja-n5-m02-c03-l06-a-v1.wav',turns:['すみません。机の上にノートがありますか。','はい、青いノートがあります。','赤いノートもありますか。','いいえ、赤いノートはありません。']},
 {id:'b',title:'Track B — teacher and bag',url:'/audio/fja-n5-m02-c03-l06-b-v1.wav',turns:['すみません。教室に先生がいますか。','はい、先生がいます。','かばんも教室にありますか。','いいえ、かばんは教室にありません。廊下にあります。']}
];
export function gradeExistenceCheckpoint(answers:Record<string,string>,writtenOnly=false){
 const selected=bank.items.filter(q=>!writtenOnly||q.skills[0]!=='listening');
 return {correct:selected.filter(q=>answers[q.id]===q.answerKey.choiceId).length,total:selected.length};
}
export default function ExistenceLocationCheckpoint(){
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [ready,setReady]=useState<Record<string,boolean>>({});
 const [assisted,setAssisted]=useState(false);
 const [revealed,setRevealed]=useState<Record<string,boolean>>({});
 const [submitted,setSubmitted]=useState(false);
 const [notice,setNotice]=useState('');
 const playable=tracks.every(t=>ready[t.id]);
 const visible=bank.items.filter(q=>playable||q.skills[0]!=='listening');
 const complete=visible.every(q=>Boolean(answers[q.id]));
 const score=gradeExistenceCheckpoint(answers,!playable);
 async function submit(){
  if(submitted||!complete)return;
  setSubmitted(true);
  try{await recordAttempt('n5-m02-c03-chk-'+(playable?(assisted?'assisted':'unaided'):'written')+'-v1','n5',score.correct,score.total);setNotice('Attempt saved on this device.');}
  catch{setNotice('Browser storage unavailable; feedback remains visible.');}
 }
 return <section className="min-w-0 space-y-5" aria-labelledby="existence-checkpoint-title">
  <h2 id="existence-checkpoint-title" className="text-2xl font-semibold">Check people, objects and locations</h2>
  <p>Ten written questions are always available. Four listening questions unlock only when both authentic recordings can play.</p>
  <section aria-label="Chapter recordings" className="min-w-0 space-y-4 rounded-xl border border-current/20 p-4">
   {tracks.map(t=><div key={t.id} className="min-w-0 space-y-2"><h3 className="font-semibold">{t.title}</h3>
    <audio controls preload="none" className="w-full max-w-full" aria-label={'Play '+t.title} src={t.url}
     onCanPlay={()=>setReady(s=>({...s,[t.id]:true}))} onError={()=>setReady(s=>({...s,[t.id]:false}))}/>
    <button type="button" className="min-h-11 rounded-lg border border-current px-4 py-2" aria-expanded={Boolean(revealed[t.id])}
     onClick={()=>{setAssisted(true);setRevealed(s=>({...s,[t.id]:!s[t.id]}));}}>{revealed[t.id]?'Hide':'Show'} transcript (assisted)</button>
    {revealed[t.id]&&<ol className="list-inside list-decimal space-y-1" lang="ja">{t.turns.map((turn,i)=><li key={i} className="break-words">{turn}</li>)}</ol>}
   </div>)}
   <p role="status" aria-live="polite">{playable?'Both recordings can play; listening questions unlocked.':'Listening scoring locked until both recordings can play.'}</p>
  </section>
  {visible.map((q,i)=><fieldset key={q.id} disabled={submitted} data-question-id={q.id} className="min-w-0 rounded-xl border border-current/20 p-4">
   <legend className="px-1 font-semibold">{i+1}. {q.prompt}</legend>
   <div className="mt-3 space-y-2">{q.choices.map(c=><label key={c.id} className="flex min-h-11 items-start gap-3 rounded-lg p-3 focus-within:outline focus-within:outline-2">
    <input type="radio" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(s=>({...s,[q.id]:c.id}))} className="mt-1"/>
    <span className="min-w-0 break-words">{c.text}</span></label>)}</div>
   {submitted&&<div className="mt-3 space-y-1" role="status"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct.':'Review.'}</strong> {q.explanation}
    <p lang="ja">Evidence: {q.evidence}</p><p>{q.choices.find(c=>c.id===answers[q.id])?.rationale}</p></div>}
  </fieldset>)}
  {!submitted?<button type="button" disabled={!complete} onClick={submit} className="min-h-11 rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50">Check {visible.length} answers</button>:
   <div role="status" aria-live="polite"><p>Practice score: {score.correct}/{score.total} correct. {playable?(assisted?'Transcript-assisted':'Unaided'):'Written-only'} attempt; not an official JLPT result.</p>
    <button type="button" className="min-h-11 rounded-lg border border-current px-4 py-3" onClick={()=>{setAnswers({});setSubmitted(false);setNotice('Ready to retry.')}}>Try again</button></div>}
  <p role="status" aria-live="polite">{notice}</p>
 </section>;
}
