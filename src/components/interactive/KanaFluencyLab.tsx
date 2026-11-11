import {useState} from 'react';
import {recordAttempt} from '../../lib/progress';
import bank from '../../content/exercises/l0-m05-c04-l04-v1.json';

export const scoreKanaFluency=(answers:Record<string,string>)=>bank.items.filter(q=>answers[q.id]===q.answerKey.choiceId).length;
const models=[{label:'School — gakkō',value:'がっこう',hint:'Look for small っ and final う.'},{label:'Ticket — chiketto',value:'チケット',hint:'Look for small ッ.'},{label:'Coffee — kōhī',value:'コーヒー',hint:'Two long-vowel marks.'},{label:'Contracted kya',value:'きゃ',hint:'Small ゃ, not full や.'}];
export default function KanaFluencyLab(){
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false);
 const [saveMessage,setSaveMessage]=useState('');
 const [typing,setTyping]=useState<Record<string,string>>({});
 const [revealed,setRevealed]=useState<Record<string,boolean>>({});
 const [note,setNote]=useState('');
 const ready=bank.items.every(q=>Boolean(answers[q.id]));
 async function check(){if(!ready||submitted)return;setSubmitted(true);try{await recordAttempt('l0-m05-c04-l04-written-v1','l0',scoreKanaFluency(answers),bank.items.length);setSaveMessage('Attempt saved on this device.');}catch{setSaveMessage('Local storage unavailable; your feedback is still shown.');}}
 return <section className="min-w-0 space-y-6" aria-labelledby="kana-fluency-title">
 <h2 id="kana-fluency-title" className="text-2xl font-semibold">Kana recognition check</h2><p>Choose one answer per question. Feedback appears after submission. These are written checks, not pronunciation tests.</p>
 {bank.items.map((q,i)=><fieldset key={q.id} data-question-id={q.id} disabled={submitted} className="min-w-0 rounded-xl border border-current/25 p-4"><legend className="font-semibold">{i+1}. {q.prompt}</legend>{q.choices.map(c=><label key={c.id} className="flex min-h-11 items-center gap-3 rounded p-2 focus-within:outline focus-within:outline-2"><input type="radio" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span className="break-words" lang={/[\u3040-\u30ff]/.test(c.text)?'ja':undefined}>{c.text}</span></label>)}{submitted&&<p role="status"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct.':'Review.'}</strong> {q.explanation}</p>}</fieldset>)}
 {!submitted?<button type="button" className="btn btn-primary" disabled={!ready} onClick={()=>void check()}>Check ten answers</button>:<div><p role="status">Written score: {scoreKanaFluency(answers)}/{bank.items.length}. {saveMessage}</p><button type="button" className="btn btn-outline" onClick={()=>{setAnswers({});setSubmitted(false);setSaveMessage('');}}>Try again</button></div>}
 <section className="space-y-4 rounded-xl border border-current/25 p-4" aria-labelledby="typing-title"><h3 id="typing-title" className="text-xl font-semibold">Independent typing studio (ungraded)</h3><p>Type without looking at the model, then reveal it to compare exact kana. No input is sent to a server.</p>{models.map((m,i)=><div key={m.value} className="min-w-0 space-y-2"><label className="block font-semibold" htmlFor={`kana-type-${i}`}>{m.label}</label><input id={`kana-type-${i}`} lang="ja" autoComplete="off" className="w-full min-w-0 rounded border border-current/30 bg-transparent p-3" value={typing[m.value]||''} onChange={e=>setTyping(v=>({...v,[m.value]:e.target.value}))}/><button type="button" className="btn btn-outline" aria-expanded={Boolean(revealed[m.value])} onClick={()=>setRevealed(v=>({...v,[m.value]:!v[m.value]}))}>{revealed[m.value]?'Hide model':'Reveal model'}</button>{revealed[m.value]&&<p role="status">Model: <span lang="ja">{m.value}</span>. {m.hint} {typing[m.value]?.normalize('NFC').trim()===m.value?'Your typed form matches the model.':'Compare each character with your typed form.'}</p>}</div>)}</section>
 <div className="rounded-xl border border-current/25 p-4"><label htmlFor="kana-note" className="block font-semibold">My next two review targets (private, ungraded)</label><textarea id="kana-note" rows={3} maxLength={300} className="w-full min-w-0 rounded border border-current/30 bg-transparent p-3" value={note} onChange={e=>setNote(e.target.value)}/><p>Copy this note if you want to keep it; it is not saved or uploaded.</p></div>
 </section>;
}