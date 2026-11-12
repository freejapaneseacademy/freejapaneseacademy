import {useState} from 'react';
import bank from '../../content/exercises/n5-m07-c02-chk-v1.json';
import {recordAttempt} from '../../lib/progress';
const tracks=[
 {id:'a',name:'Track A — weekend plans',url:'/audio/fja-n5-m07-c02-l06-a-v1.wav',turns:['土曜日は何をしたいですか。','図書館で日本語の本を読みたいです。','そうですか。日曜日はどうですか。','日曜日は友だちと映画を見に行きます。','いいですね。']},
 {id:'b',name:'Track B — birthday shopping',url:'/audio/fja-n5-m07-c02-l06-b-v1.wav',turns:['田中さん、今日は何を買いたいですか。','妹の誕生日ですから、新しいかばんがほしいです。','どこに行きますか。','駅の前の店にかばんを買いに行きます。','何色がいいですか。','青いかばんがいいです。']}
];
export function gradeWantsCheckpoint(answers:Record<string,string>,listening=false){const qs=bank.items.filter(q=>listening||q.skills[0]!=='listening');return {correct:qs.filter(q=>answers[q.id]===q.answerKey.choiceId).length,total:qs.length};}
export default function WantsCheckpointPractice(){
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [ready,setReady]=useState<Record<string,boolean>>({});
 const [assisted,setAssisted]=useState(false);
 const [transcripts,setTranscripts]=useState<Record<string,boolean>>({});
 const [submitted,setSubmitted]=useState(false);
 const [notice,setNotice]=useState('');
 const playable=tracks.every(t=>ready[t.id]);
 const visible=bank.items.filter(q=>playable||q.skills[0]!=='listening');
 const complete=visible.every(q=>Boolean(answers[q.id]));
 const score=gradeWantsCheckpoint(answers,playable);
 async function submit(){if(submitted||!complete)return;setSubmitted(true);try{await recordAttempt('n5-m07-c02-chk-'+(playable?(assisted?'assisted':'unaided'):'written')+'-v1','n5',score.correct,score.total);setNotice('Attempt saved locally.');}catch{setNotice('Local storage unavailable; review remains available.');}}
 return <section className="min-w-0 space-y-5" aria-labelledby="wants-checkpoint-title">
  <h2 id="wants-checkpoint-title" className="text-2xl font-semibold">Wants and intentions checkpoint</h2>
  <p>Ten written questions are available without audio. Four listening questions unlock only when both real recordings can play.</p>
  <div className="space-y-3 rounded-xl border border-current/20 p-4" aria-label="Chapter audio">
   {tracks.map(t=><div key={t.id} className="min-w-0 space-y-2"><h3 className="font-semibold">{t.name}</h3>
    <audio controls preload="none" className="w-full max-w-full" aria-label={'Play '+t.name} src={t.url} onCanPlay={()=>setReady(s=>({...s,[t.id]:true}))} onError={()=>setReady(s=>({...s,[t.id]:false}))}/>
    <button type="button" className="min-h-11 rounded-lg border border-current px-4 py-2" aria-expanded={Boolean(transcripts[t.id])} onClick={()=>{setAssisted(true);setTranscripts(s=>({...s,[t.id]:!s[t.id]}));}}>{transcripts[t.id]?'Hide':'Show'} transcript (assisted)</button>
    {transcripts[t.id]&&<ol lang="ja" className="list-inside list-decimal space-y-1">{t.turns.map((turn,i)=><li key={i} className="break-words">{turn}</li>)}</ol>}
   </div>)}
   <p role="status">{playable?'Listening unlocked.':'Listening locked until both recordings can play.'}</p>
  </div>
  {visible.map((q,i)=><fieldset key={q.id} data-question-id={q.id} disabled={submitted} className="min-w-0 rounded-xl border border-current/20 p-4">
   <legend className="px-1 font-semibold">{i+1}. {q.prompt}</legend>
   <div className="mt-3 space-y-2">{q.choices.map(c=><label key={c.id} className="flex min-h-11 items-start gap-3 rounded-lg p-3 focus-within:outline focus-within:outline-2"><input type="radio" className="mt-1" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(s=>({...s,[q.id]:c.id}))}/><span className="min-w-0 break-words">{c.text}</span></label>)}</div>
   {submitted&&<div role="status" className="mt-3 space-y-1"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct.':'Review.'}</strong> {q.explanation}<p>Evidence: <span lang="ja">{q.evidence}</span></p><p>{q.choices.find(c=>c.id===answers[q.id])?.rationale}</p></div>}
  </fieldset>)}
  {!submitted?<button type="button" className="min-h-11 rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50" disabled={!complete} onClick={submit}>Check {visible.length} answers</button>:<div role="status" aria-live="polite"><p>Practice: {score.correct}/{score.total}. {playable?(assisted?'Transcript-assisted':'Unaided'):'Written-only'}; not an official JLPT result.</p><button type="button" className="min-h-11 rounded-lg border border-current px-4 py-3" onClick={()=>{setAnswers({});setSubmitted(false);setNotice('Ready to retry.');}}>Try again</button></div>}
  <p role="status" aria-live="polite">{notice}</p>
 </section>;
}