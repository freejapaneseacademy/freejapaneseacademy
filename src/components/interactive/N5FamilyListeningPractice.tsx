import {useState} from 'react';
import bank from '../../content/exercises/n5-m01-c03-l06-v1.json';
import {recordAttempt} from '../../lib/progress';
const tracks=[
 {id:'a',title:'Family at the school exhibition',url:'/audio/fja-n5-m01-c03-l06-a-v1.wav',turns:[['Woman','こちらは、わたしの妹、ゆいです。','This is my younger sister, Yui.'],['Visitor','ゆいさんは、学生ですか。','Is Yui a student?'],['Woman','はい、高校生です。こちらは、わたしの母です。','Yes, she is a high school student. This is my mother.'],['Visitor','はじめまして。よろしくお願いします。','Nice to meet you. It is a pleasure.']]},
 {id:'b',title:'A family photograph',url:'/audio/fja-n5-m01-c03-l06-b-v1.wav',turns:[['Visitor','この写真の人は、だれですか。','Who is the person in this photograph?'],['Woman','その人は、わたしの兄です。','That person is my older brother.'],['Visitor','お兄さんは、先生ですか。','Is your older brother a teacher?'],['Woman','いいえ、先生じゃありません。会社員です。','No, he is not a teacher. He is an office worker.']]}
];
export function gradeFamilyListening(a:Record<string,string>){return bank.items.filter(q=>a[q.id]===q.answerKey.choiceId).length;}
export default function FamilyListeningPractice(){
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [ready,setReady]=useState<Record<string,boolean>>({});
 const [failed,setFailed]=useState<Record<string,boolean>>({});
 const [revealed,setRevealed]=useState<Record<string,boolean>>({});
 const [submitted,setSubmitted]=useState(false);
 const [assisted,setAssisted]=useState(false);
 const [notice,setNotice]=useState('');
 const allReady=tracks.every(t=>ready[t.id])&&!tracks.some(t=>failed[t.id]);
 const complete=bank.items.every(q=>answers[q.id]);
 async function submit(){if(!allReady||!complete||submitted)return;setSubmitted(true);const usedTranscript=assisted;try{await recordAttempt('n5-m01-c03-l06-'+(usedTranscript?'assisted':'unaided')+'-v1','n5',gradeFamilyListening(answers),bank.items.length);setNotice('Attempt saved on this device ('+(assisted?'transcript-assisted':'unaided')+').')}catch{setNotice('Storage unavailable; feedback remains visible.');}}
 return <section aria-label="Family listening practice" className="min-w-0 space-y-6">
 <h2 className="text-2xl font-semibold">Listen and answer</h2><p>Play both recordings before submitting. The transcripts are optional and make an attempt transcript-assisted.</p>
 {tracks.map(t=><section key={t.id} className="min-w-0 rounded-xl border border-current/20 p-4" aria-label={t.title}><h3 className="text-xl font-semibold">{t.title}</h3>
 <audio controls preload="none" className="mt-3 w-full max-w-full" src={t.url} onPlay={()=>{setReady(s=>({...s,[t.id]:true}));setFailed(s=>({...s,[t.id]:false}))}} onError={()=>{setReady(s=>({...s,[t.id]:false}));setFailed(s=>({...s,[t.id]:true}))}} aria-label={'Play '+t.title}/>
 <p role="status">{failed[t.id]?'Recording unavailable. Listening scoring is locked until genuine audio is ready.':ready[t.id]?'Recording ready to play.':'Waiting for playable audio.'}</p>
 <button type="button" className="min-h-11 rounded-lg border border-current px-4 py-2" onClick={()=>{setAssisted(true);setRevealed(s=>({...s,[t.id]:!s[t.id]}));}} aria-expanded={Boolean(revealed[t.id])}>{revealed[t.id]?'Hide':'Show'} transcript (assisted mode)</button>
 {revealed[t.id]&&<div className="mt-3 space-y-2">{t.turns.map((turn,i)=><p key={i}><strong>{turn[0]}:</strong> <span lang="ja">{turn[1]}</span> — {turn[2]}</p>)}</div>}
 {bank.items.filter(q=>q.trackId===t.id).map((q,i)=><fieldset key={q.id} data-question-id={q.id} disabled={submitted} className="mt-4 min-w-0 rounded-lg border border-current/20 p-3"><legend className="font-semibold px-1">{i+1}. {q.prompt}</legend>{q.choices.map(c=><label key={c.id} className="flex min-h-11 items-center gap-3 rounded-lg p-2 focus-within:outline focus-within:outline-2"><input type="radio" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(s=>({...s,[q.id]:c.id}))}/><span>{c.text}</span></label>)}{submitted&&<div role="status" className="mt-2"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct. ':'Review. '}</strong>{q.explanation}<p lang="ja">Evidence: {q.evidence}</p><p>{q.choices.find(c=>c.id===answers[q.id])?.rationale}</p></div>}</fieldset>)}</section>)}
 {!submitted?<button type="button" disabled={!allReady||!complete} onClick={submit} className="min-h-11 rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50">Check six listening answers</button>:<div role="status" aria-live="polite"><p>Practice score: {gradeFamilyListening(answers)}/{bank.items.length}. Not an official JLPT result.</p><button type="button" className="min-h-11 rounded-lg border border-current px-4 py-3" onClick={()=>{setAnswers({});setSubmitted(false);setNotice('')}}>Try again</button></div>}
 <p role="status" aria-live="polite">{notice}</p></section>;
}
