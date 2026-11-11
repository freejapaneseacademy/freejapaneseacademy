import {useState} from 'react';
import bank from '../../content/exercises/n5-m01-c04-chk-v1.json';
import {recordAttempt} from '../../lib/progress';

const tracks=[
 {id:'a',name:'Track A — two students at orientation',url:'/audio/fja-n5-m01-c04-l06-a-v1.wav',transcript:'あき：はじめまして。わたしは小林あきです。十九歳です。 けん：はじめまして。田中けんです。小林さんは大学生ですか。 あき：はい、大学生です。出身は京都です。 けん：そうですか。わたしも大学生です。出身は大阪です。'},
 {id:'b',name:'Track B — community class',url:'/audio/fja-n5-m01-c04-l06-b-v1.wav',transcript:'訪問者：佐藤さんは会社員ですか。 佐藤：いいえ、会社員じゃありません。高校の先生です。 訪問者：そうですか。出身は東京ですか。 佐藤：いいえ、出身は名古屋です。今は東京に住んでいます。'}
];
export function gradeProfileCheckpoint(answers:Record<string,string>,writtenOnly=false){
 const selected=bank.items.filter(q=>!writtenOnly||q.skills[0]!=='listening');
 return {correct:selected.filter(q=>answers[q.id]===q.answerKey.choiceId).length,total:selected.length};
}
export default function N5PersonalProfileCheckpoint(){
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [ready,setReady]=useState<Record<string,boolean>>({});
 const [assisted,setAssisted]=useState(false);
 const [revealed,setRevealed]=useState<Record<string,boolean>>({});
 const [submitted,setSubmitted]=useState(false);
 const [notice,setNotice]=useState('');
 const audioReady=tracks.every(t=>ready[t.id]);
 const visible=bank.items.filter(q=>audioReady||q.skills[0]!=='listening');
 const complete=visible.every(q=>Boolean(answers[q.id]));
 const score=gradeProfileCheckpoint(answers,!audioReady);
 async function submit(){
  if(submitted||!complete)return;
  setSubmitted(true);
  try{await recordAttempt('n5-m01-c04-chk-'+(audioReady?(assisted?'assisted':'unaided'):'written')+'-v1','n5',score.correct,score.total);setNotice('Attempt saved on this device.');}
  catch{setNotice('Local storage unavailable; feedback is still visible.');}
 }
 return <section className="min-w-0 space-y-5" aria-labelledby="profile-checkpoint-heading">
 <h2 id="profile-checkpoint-heading" className="text-2xl font-semibold">Check your understanding</h2>
 <p>Answer ten written questions. Four listening questions unlock when both real recordings are playable. Choose one answer per question.</p>
 <div className="min-w-0 space-y-4 rounded-xl border border-current/20 p-4">
 <h3 className="font-semibold">Original chapter recordings</h3>
 {tracks.map(t=><div key={t.id} className="min-w-0 space-y-2">
 <label htmlFor={'profile-checkpoint-audio-'+t.id}>{t.name}</label>
 <audio id={'profile-checkpoint-audio-'+t.id} controls preload="none" className="w-full max-w-full" src={t.url} onCanPlay={()=>setReady(v=>({...v,[t.id]:true}))} onError={()=>setReady(v=>({...v,[t.id]:false}))}>Audio unavailable.</audio>
 <button type="button" className="min-h-11 rounded-lg border border-current px-4 py-2" aria-expanded={Boolean(revealed[t.id])} onClick={()=>{setAssisted(true);setRevealed(v=>({...v,[t.id]:!v[t.id]}))}}>{revealed[t.id]?'Hide':'Show'} {t.name} transcript (assisted)</button>
 {revealed[t.id]&&<p lang="ja" className="break-words rounded-lg border border-current/20 p-3">{t.transcript}</p>}
 </div>)}
 <p role="status">{audioReady?'Both recordings report playable audio; listening questions are unlocked.':'Listening scoring is locked until both genuine recordings can play. Written questions remain available.'}</p>
 </div>
 {visible.map((q,i)=><fieldset key={q.id} data-question-id={q.id} disabled={submitted} className="min-w-0 rounded-xl border border-current/20 p-4">
 <legend className="px-1 font-semibold">{i+1}. {q.prompt}</legend>
 <div className="mt-3 space-y-2">{q.choices.map(c=><label key={c.id} className="flex min-h-11 items-start gap-3 rounded-lg p-3 focus-within:outline focus-within:outline-2"><input type="radio" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(v=>({...v,[q.id]:c.id}))} className="mt-1"/><span className="min-w-0 break-words">{c.text}</span></label>)}</div>
 {submitted&&<div className="mt-3" role="status"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct.':'Review.'}</strong> {q.explanation}<p lang="ja">Evidence: {q.evidence}</p><p>{q.choices.find(c=>c.id===answers[q.id])?.rationale}</p></div>}
 </fieldset>)}
 {!submitted?<button type="button" disabled={!complete} className="min-h-11 rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50" onClick={submit}>Check {visible.length} answers</button>:<div role="status" aria-live="polite"><p><strong>{score.correct}/{score.total} correct.</strong> {audioReady?(assisted?'Transcript-assisted':'Unaided listening'):'Written-only'} practice; not an official JLPT score.</p><p>{notice}</p><button type="button" className="min-h-11 rounded-lg border border-current px-4 py-2" onClick={()=>{setAnswers({});setSubmitted(false);setNotice('');setAssisted(false);setRevealed({})}}>Try again</button></div>}
 </section>;
}
