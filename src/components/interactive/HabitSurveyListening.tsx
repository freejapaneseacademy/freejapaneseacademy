import {useState,useRef} from 'react';
import {recordAttempt} from '../../lib/progress';
import bank from '../../content/exercises/n5-m03-c04-l06-v1.json';
const tracks=[
{id:'a',label:'Track A — Library survey',url:'/audio/n5-m03-c04-l06-a.wav',lines:[['Woman','こんにちは。図書館のアンケートです。よく本を読みますか。','Hello. This is a library survey. Do you often read books?'],['Man','はい、いつも夜に本を読みます。','Yes, I always read books at night.'],['Woman','日本語も勉強しますか。','Do you study Japanese too?'],['Man','はい、ときどき図書館で勉強します。でも、朝はあまり勉強しません。','Yes, sometimes at the library. But not much in the morning.']]},
{id:'b',label:'Track B — Exercise survey',url:'/audio/n5-m03-c04-l06-b.wav',lines:[['Man','運動について聞きます。よく歩きますか。','I will ask about exercise. Do you walk often?'],['Woman','はい、よく公園を歩きます。','Yes, I often walk in the park.'],['Man','毎日走りますか。','Do you run every day?'],['Woman','いいえ、ぜんぜん走りません。でも、ときどき家でヨガをします。','No, I never run. But I sometimes do yoga at home.']]}] as const;
export const habitQuestions=bank.items;
export function scoreHabitAnswers(a:Record<string,string>){return habitQuestions.filter(q=>a[q.id]===q.answerKey.choiceId).length;}
export function validateHabitEvidence(){return habitQuestions.length===8&&new Set(habitQuestions.map(q=>q.id)).size===8&&habitQuestions.every(q=>{const t=tracks.find(t=>t.id===q.trackId);return !!t&&t.lines.some(line=>line[1].includes(q.evidence))&&q.choices.some(c=>c.id===q.answerKey.choiceId);});}
export default function HabitSurveyListening(){
const refs=useRef<Record<string,HTMLAudioElement|null>>({});
const [played,setPlayed]=useState<Record<string,boolean>>({});
const [failed,setFailed]=useState<Record<string,boolean>>({});
const [revealed,setRevealed]=useState<Record<string,boolean>>({});
const [assisted,setAssisted]=useState(false);
const [answers,setAnswers]=useState<Record<string,string>>({});
const [submitted,setSubmitted]=useState(false);
const [saved,setSaved]=useState(false);
const [busy,setBusy]=useState(false);
const [error,setError]=useState('');
const count=habitQuestions.filter(q=>answers[q.id]).length;
const ready=tracks.every(t=>played[t.id]&&!failed[t.id])&&count===habitQuestions.length;
const score=scoreHabitAnswers(answers);
async function submit(){if(!ready||submitted||busy)return;setError('');if(assisted){setSubmitted(true);return;}setBusy(true);try{await recordAttempt('n5-m03-c04-l06-listening-v1','n5',score,habitQuestions.length);setSaved(true);setSubmitted(true);}catch(e){setError(e instanceof Error?e.message:'Unable to save progress.');}finally{setBusy(false);}}
function restart(){Object.values(refs.current).forEach(a=>a?.pause());setPlayed({});setFailed({});setRevealed({});setAssisted(false);setAnswers({});setSubmitted(false);setSaved(false);setError('');}
return <section className="foundation-practice listening-practice" aria-labelledby="habit-listening-title">
<h2 id="habit-listening-title">Listen to both habit surveys</h2><p>Try both tracks without the transcript first. Replay as needed. No audio means no listening score.</p>
<div className="listening-tracks">{tracks.map(t=><section className="listening-track" key={t.id} aria-labelledby={'track-'+t.id}><h3 id={'track-'+t.id}>{t.label}</h3>
<audio ref={el=>{refs.current[t.id]=el;}} controls preload="metadata" src={t.url} aria-label={t.label+' Japanese audio'} onPlay={()=>setPlayed(s=>({...s,[t.id]:true}))} onError={()=>setFailed(s=>({...s,[t.id]:true}))} onCanPlay={()=>setFailed(s=>({...s,[t.id]:false}))}>Your browser cannot play this audio.</audio>
{failed[t.id]&&<p role="alert">Audio unavailable. Listening scoring is disabled until this track plays.</p>}
<label htmlFor={'speed-'+t.id}>Playback speed</label> <select id={'speed-'+t.id} defaultValue="1" onChange={e=>{const a=refs.current[t.id];if(a)a.playbackRate=Number(e.target.value);}}><option value="0.8">0.8×</option><option value="1">1×</option><option value="1.2">1.2×</option></select>
<p>{played[t.id]?'Playback started':'Not yet played'}</p><button type="button" className="btn btn-outline" aria-expanded={!!revealed[t.id]} onClick={()=>{setRevealed(s=>({...s,[t.id]:!s[t.id]}));if(!submitted)setAssisted(true);}}>{revealed[t.id]?'Hide transcript':'Reveal transcript (assisted mode)'}</button>
{revealed[t.id]&&<div className="listening-transcript" aria-label={t.label+' transcript'}>{t.lines.map((line,i)=><p key={i}><strong>{line[0]}:</strong> <span lang="ja">{line[1]}</span><span style={{display:'block'}}>{line[2]}</span></p>)}</div>}</section>)}</div>
{assisted&&!submitted&&<p role="status">Assisted practice: a transcript was opened. This attempt will not be saved as an unaided listening score.</p>}
<h3>What did you hear?</h3><p aria-live="polite">{count} of {habitQuestions.length} answered</p>
{habitQuestions.map((q,i)=><fieldset className="foundation-question" key={q.id} disabled={submitted||busy} data-question-id={q.id}><legend><span className="foundation-question__number">{i+1}</span> {q.prompt}</legend><p>Track {q.trackId.toUpperCase()}</p><div className="foundation-options">{q.choices.map(c=><label className="foundation-option" key={c.id}><input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span>{c.text}</span></label>)}</div>
{submitted&&<div className="foundation-feedback" role="note"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct':'Review'}</strong><p>{q.explanation}</p><p lang="ja">Evidence: {q.evidence}</p><p>{q.choices.find(c=>c.id===answers[q.id])?.rationale}</p></div>}</fieldset>)}
{error&&<p role="alert">{error}</p>}
{!submitted?<button type="button" className="btn btn-primary" disabled={!ready||busy} onClick={submit}>{busy?'Saving…':assisted?'Check assisted answers':'Check answers and save blind score'}</button>:<div className="foundation-result" role="status"><h3>{score} / {habitQuestions.length} correct</h3><p>{saved?'Blind attempt saved locally.':'Assisted practice reviewed; no blind score saved.'}</p></div>}
<button type="button" className="btn btn-outline" onClick={restart}>Start a new blind attempt</button><p className="foundation-storage-note">Progress stays in this browser. No microphone permission is required.</p>
</section>;
