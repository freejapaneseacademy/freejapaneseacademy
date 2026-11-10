import {useState} from 'react';
import bank from '../../content/exercises/n5-m01-c04-l06-v1.json';
import {recordAttempt} from '../../lib/progress';
const tracks=[
{id:'a',title:'Two students at orientation',url:'/audio/fja-n5-m01-c04-l06-a-v1.wav',turns:[['Aki','はじめまして。わたしは小林あきです。十九歳です。','Nice to meet you. I am Aki Kobayashi. I am nineteen.'],['Ken','はじめまして。田中けんです。小林さんは大学生ですか。','Nice to meet you. I am Ken Tanaka. Are you a university student?'],['Aki','はい、大学生です。出身は京都です。','Yes, I am a university student. I am from Kyoto.'],['Ken','そうですか。わたしも大学生です。出身は大阪です。','I see. I am also a university student. I am from Osaka.']]},
{id:'b',title:'Profiles at a community class',url:'/audio/fja-n5-m01-c04-l06-b-v1.wav',turns:[['Visitor','佐藤さんは会社員ですか。','Sato, are you a company employee?'],['Sato','いいえ、会社員じゃありません。高校の先生です。','No, I am a high school teacher.'],['Visitor','そうですか。出身は東京ですか。','I see. Are you from Tokyo?'],['Sato','いいえ、出身は名古屋です。今は東京に住んでいます。','No, I am from Nagoya. I live in Tokyo now.']]}
];
export function gradeProfileListening(a:Record<string,string>){return bank.items.filter(q=>a[q.id]===q.answerKey.choiceId).length;}
export default function ProfileListeningPractice(){
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [ready,setReady]=useState<Record<string,boolean>>({});
 const [failed,setFailed]=useState<Record<string,boolean>>({});
 const [revealed,setRevealed]=useState<Record<string,boolean>>({});
 const [submitted,setSubmitted]=useState(false);
 const [assisted,setAssisted]=useState(false);
 const [notice,setNotice]=useState('');
 const allReady=tracks.every(t=>ready[t.id])&&!tracks.some(t=>failed[t.id]);
 const complete=bank.items.every(q=>answers[q.id]);
 async function submit(){if(!allReady||!complete||submitted)return;setSubmitted(true);const usedTranscript=assisted;try{await recordAttempt('n5-m01-c04-l06-'+(usedTranscript?'assisted':'unaided')+'-v1','n5',gradeProfileListening(answers),bank.items.length);setNotice('Attempt saved on this device ('+(assisted?'transcript-assisted':'unaided')+').')}catch{setNotice('Storage unavailable; feedback remains visible.');}}
 return <section aria-label="Personal profile listening practice" className="min-w-0 space-y-6">
 <h2 className="text-2xl font-semibold">Listen and answer</h2><p>Play both recordings before submitting. The transcripts are optional and make an attempt transcript-assisted.</p>
 {tracks.map(t=><section key={t.id} className="min-w-0 rounded-xl border border-current/20 p-4" aria-label={t.title}><h3 className="text-xl font-semibold">{t.title}</h3>
 <audio controls preload="none" className="mt-3 w-full max-w-full" src={t.url} onPlay={()=>{setReady(s=>({...s,[t.id]:true}));setFailed(s=>({...s,[t.id]:false}))}} onError={()=>{setReady(s=>({...s,[t.id]:false}));setFailed(s=>({...s,[t.id]:true}))}} aria-label={'Play '+t.title}/>
 <p role="status">{failed[t.id]?'Recording unavailable. Listening scoring is locked until genuine audio is ready.':ready[t.id]?'Recording ready to play.':'Waiting for playable audio.'}</p>
 <button type="button" className="min-h-11 rounded-lg border border-current px-4 py-2" onClick={()=>{setAssisted(true);setRevealed(s=>({...s,[t.id]:!s[t.id]}));}} aria-expanded={Boolean(revealed[t.id])}>{revealed[t.id]?'Hide':'Show'} transcript (assisted mode)</button>
 {revealed[t.id]&&<div className="mt-3 space-y-2">{t.turns.map((turn,i)=><p key={i}><strong>{turn[0]}:</strong> <span lang="ja">{turn[1]}</span> — {turn[2]}</p>)}</div>}
 {bank.items.filter(q=>q.trackId===t.id).map((q,i)=><fieldset key={q.id} data-question-id={q.id} disabled={submitted} className="mt-4 min-w-0 rounded-lg border border-current/20 p-3"><legend className="font-semibold px-1">{i+1}. {q.prompt}</legend>{q.choices.map(c=><label key={c.id} className="flex min-h-11 items-center gap-3 rounded-lg p-2 focus-within:outline focus-within:outline-2"><input type="radio" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(s=>({...s,[q.id]:c.id}))}/><span>{c.text}</span></label>)}{submitted&&<div role="status" className="mt-2"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct. ':'Review. '}</strong>{q.explanation}<p lang="ja">Evidence: {q.evidence}</p><p>{q.choices.find(c=>c.id===answers[q.id])?.rationale}</p></div>}</fieldset>)}</section>)}
 {!submitted?<button type="button" disabled={!allReady||!complete} onClick={submit} className="min-h-11 rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50">Check six listening answers</button>:<div role="status" aria-live="polite"><p>Practice score: {gradeProfileListening(answers)}/{bank.items.length}. Not an official JLPT result.</p><button type="button" className="min-h-11 rounded-lg border border-current px-4 py-3" onClick={()=>{setAnswers({});setSubmitted(false);setNotice('')}}>Try again</button></div>}
 <p role="status" aria-live="polite">{notice}</p></section>;
}
