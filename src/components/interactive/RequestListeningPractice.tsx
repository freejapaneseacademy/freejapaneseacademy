import { useState } from 'react';
import bank from '../../content/exercises/n5-m06-c03-l06.json';
import { recordAttempt } from '../../lib/progress';
export const LISTENING_QUIZ_ID = 'n5-m06-c03-l06-v1';
export const listeningQuestions = bank.items;
export const scoreListening = (answers: Record<string,string>) => listeningQuestions.filter(q => answers[q.id] === q.answerKey.choiceId).length;
const scenes = [
 {id:'a',title:'Scene A — Study room',url:'/audio/fja-n5-m06-c03-l06-a-v1.wav',lines:[['Visitor','すみません。この辞書を使ってもいいですか。','Excuse me. May I use this dictionary?'],['Attendant','はい、いいですよ。でも、ここで使ってください。',"Yes, that's fine. But please use it here."],['Visitor','わかりました。写真を撮ってもいいですか。','Understood. May I take a photograph?'],['Attendant','すみません。ここでは写真を撮ってはいけません。','Sorry. You must not take photographs here.'],['Visitor','わかりました。ありがとうございます。','Understood. Thank you.']]},
 {id:'b',title:'Scene B — Community hall',url:'/audio/fja-n5-m06-c03-l06-b-v1.wav',lines:[['Visitor','こんにちは。ここで水を飲んでもいいですか。','Hello. May I drink water here?'],['Staff','はい、水は飲んでもいいですよ。','Yes, you may drink water.'],['Visitor','ありがとうございます。あの部屋に入ってもいいですか。','Thank you. May I enter that room?'],['Staff','すみません。今は入ってはいけません。ここで待ってください。','Sorry. You must not enter now. Please wait here.'],['Visitor','はい、ここで待ちます。',"Okay, I'll wait here."]]}
];
export default function RequestListeningPractice(){
 const [available,setAvailable]=useState<Record<string,boolean>>({});
 const [failed,setFailed]=useState<Record<string,boolean>>({});
 const [reveal,setReveal]=useState<Record<string,boolean>>({});
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false);
 const [notice,setNotice]=useState('');
 const ready=scenes.every(s=>available[s.id]&&!failed[s.id]);
 const score=scoreListening(answers);
 async function submit(){
  if(!ready){setNotice('Verified audio must be available before a listening score can be saved.');return;}
  if(listeningQuestions.some(q=>!answers[q.id])){setNotice('Answer all six questions.');return;}
  if(Object.values(reveal).some(Boolean)){setNotice('Transcript revealed: use this as assisted practice. Hide transcripts and retry for a blind listening attempt.');setSubmitted(true);return;}
  setSubmitted(true);
  try{await recordAttempt(LISTENING_QUIZ_ID,'n5',score,listeningQuestions.length);setNotice('Blind listening attempt saved on this device.');}
  catch{setNotice('Answers checked; local progress storage is unavailable.');}
 }
 return <section className="foundation-practice" aria-label="Japanese requests listening practice">
  <h2>Listen to the two scenes</h2>
  <p>Listen before revealing text. If a recording is missing, you can read the transcript for study, but no listening score will be recorded.</p>
  {scenes.map(s=><section key={s.id} aria-label={s.title} style={{marginBlock:'1.5rem',minWidth:0}}>
   <h3>{s.title}</h3><audio controls preload="metadata" src={s.url} style={{width:'100%',maxWidth:'100%'}} onCanPlay={()=>setAvailable(v=>({...v,[s.id]:true}))} onError={()=>{setFailed(v=>({...v,[s.id]:true}));setAvailable(v=>({...v,[s.id]:false}));}} aria-label={s.title+' recording'} />
   {failed[s.id]&&<p role="status">This recording is not available yet. Audio generation and verification are required before scored listening.</p>}
   <button type="button" aria-expanded={!!reveal[s.id]} onClick={()=>setReveal(v=>({...v,[s.id]:!v[s.id]}))}>{reveal[s.id]?'Hide transcript':'Reveal Japanese transcript and translation (assisted practice)'}</button>
   {reveal[s.id]&&<div className="course-notice">{s.lines.map((line,i)=><p key={i}><strong>{line[0]}:</strong> <span lang="ja">{line[1]}</span> — {line[2]}</p>)}</div>}
  </section>)}
  <h2>Six audible comprehension questions</h2>
  {listeningQuestions.map((q,i)=><fieldset key={q.id} className="foundation-question" disabled={submitted} style={{minWidth:0,marginBlock:'1rem',padding:'1rem',border:'1px solid var(--border,#888)',borderRadius:'.75rem'}}>
   <legend><strong>{i+1}. {q.prompt}</strong></legend>
   {q.choices.map(c=><label key={c.id} style={{display:'flex',alignItems:'center',gap:'.75rem',minHeight:44,overflowWrap:'anywhere'}}><input type="radio" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(v=>({...v,[q.id]:c.id}))}/><span>{c.text}</span></label>)}
   {submitted&&<p role="status"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct.':'Review.'}</strong> {q.choices.find(c=>c.id===answers[q.id])?.rationale} <span lang="ja">{q.evidence}</span></p>}
  </fieldset>)}
  <p aria-live="polite">{notice}</p>
  {submitted?<><p role="status">Practice result: {score} / {listeningQuestions.length}{Object.values(reveal).some(Boolean)?' (assisted, not saved)':''}</p><button type="button" onClick={()=>{setAnswers({});setSubmitted(false);setReveal({});setNotice('Ready for another attempt.');}}>Retry without transcript</button></>:<button type="button" onClick={submit} disabled={!ready||Object.keys(answers).length!==listeningQuestions.length}>Check listening answers</button>}
 </section>;
}