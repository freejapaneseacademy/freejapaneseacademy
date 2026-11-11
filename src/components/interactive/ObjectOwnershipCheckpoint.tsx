import {useState} from 'react';
import bank from '../../content/exercises/n5-m02-c01-chk-v1.json';
import {recordAttempt} from '../../lib/progress';
const tracks=[
{id:'a',title:'Track A — umbrellas',url:'/audio/fja-n5-m02-c01-l06-a-v1.wav',transcript:'職員：すみません。この青いかさはだれのですか。 生徒：それは田中さんのです。田中さんは今、教室にいます。 職員：じゃあ、この赤いかさは田中さんのですか。 生徒：いいえ、それは山本さんのです。'},
{id:'b',title:'Track B — bag and notebook',url:'/audio/fja-n5-m02-c01-l06-b-v1.wav',transcript:'生徒：あのかばんはだれのですか。 職員：あれは佐藤さんのです。 生徒：このノートも佐藤さんのですか。 職員：いいえ、そのノートはわたしのです。佐藤さんのノートは机の上です。'}
];
export function gradeObjectCheckpoint(answers:Record<string,string>,writtenOnly=false){
const selected=bank.items.filter(q=>!writtenOnly||q.skills[0]!=='listening');
return {correct:selected.filter(q=>answers[q.id]===q.answerKey.choiceId).length,total:selected.length};
}
export default function ObjectOwnershipCheckpoint(){
const [answers,setAnswers]=useState<Record<string,string>>({});
const [ready,setReady]=useState<Record<string,boolean>>({});
const [revealed,setRevealed]=useState<Record<string,boolean>>({});
const [assisted,setAssisted]=useState(false);
const [submitted,setSubmitted]=useState(false);
const [notice,setNotice]=useState('');
const audioReady=tracks.every(t=>ready[t.id]);
const visible=bank.items.filter(q=>audioReady||q.skills[0]!=='listening');
const complete=visible.every(q=>Boolean(answers[q.id]));
const score=gradeObjectCheckpoint(answers,!audioReady);
async function submit(){if(submitted||!complete)return;setSubmitted(true);try{await recordAttempt('n5-m02-c01-chk-'+(audioReady?(assisted?'assisted':'unaided'):'written')+'-v1','n5',score.correct,score.total);setNotice('Attempt saved on this device.');}catch{setNotice('Browser storage unavailable; feedback is still visible.');}}
return <section className="min-w-0 space-y-5" aria-labelledby="object-checkpoint-title"><h2 id="object-checkpoint-title" className="text-2xl font-semibold">Check your understanding</h2><p>Ten written questions are always available. Four listening questions require both playable chapter recordings.</p>
<div className="min-w-0 space-y-4 rounded-xl border border-current/20 p-4"><h3 className="font-semibold">Original chapter audio</h3>{tracks.map(t=><div key={t.id} className="min-w-0 space-y-2"><label htmlFor={'objects-checkpoint-'+t.id}>{t.title}</label><audio id={'objects-checkpoint-'+t.id} controls preload="none" className="w-full max-w-full" src={t.url} onCanPlay={()=>setReady(s=>({...s,[t.id]:true}))} onError={()=>setReady(s=>({...s,[t.id]:false}))}>Audio unavailable.</audio><button type="button" className="min-h-11 rounded-lg border border-current px-4 py-2" aria-expanded={Boolean(revealed[t.id])} onClick={()=>{setAssisted(true);setRevealed(s=>({...s,[t.id]:!s[t.id]}))}}>{revealed[t.id]?'Hide':'Show'} transcript (assisted)</button>{revealed[t.id]&&<p lang="ja" className="break-words rounded-lg border border-current/20 p-3">{t.transcript}</p>}</div>)}<p role="status">{audioReady?'Both recordings are playable; listening questions unlocked.':'Listening scoring is locked until both recordings can play.'}</p></div>
{visible.map((q,i)=><fieldset key={q.id} data-question-id={q.id} disabled={submitted} className="min-w-0 rounded-xl border border-current/20 p-4"><legend className="px-1 font-semibold">{i+1}. {q.prompt}</legend><div className="mt-3 space-y-2">{q.choices.map(c=><label key={c.id} className="flex min-h-11 items-start gap-3 rounded-lg p-3 focus-within:outline focus-within:outline-2"><input type="radio" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(s=>({...s,[q.id]:c.id}))} className="mt-1"/><span className="min-w-0 break-words">{c.text}</span></label>)}</div>{submitted&&<div className="mt-3" role="status"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct.':'Review.'}</strong> {q.explanation}<p lang="ja">Evidence: {q.evidence}</p><p>{q.choices.find(c=>c.id===answers[q.id])?.rationale}</p></div>}</fieldset>)}
{!submitted?<button type="button" disabled={!complete} className="min-h-11 rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50" onClick={submit}>Check {visible.length} answers</button>:<div role="status" aria-live="polite"><p><strong>{score.correct}/{score.total} correct.</strong> {audioReady?(assisted?'Transcript-assisted':'Unaided listening'):'Written-only'} practice; not an official JLPT score.</p><p>{notice}</p><button type="button" className="min-h-11 rounded-lg border border-current px-4 py-2" onClick={()=>{setAnswers({});setSubmitted(false);setNotice('');setAssisted(false);setRevealed({})}}>Try again</button></div>}</section>;
}