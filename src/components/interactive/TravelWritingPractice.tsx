import {useState} from 'react';
import bank from '../../content/exercises/n5-m05-c02-l07-v1.json';
import {recordAttempt} from '../../lib/progress';
const DRAFT_KEY='fja-writing-n5-m05-c02-l07-v1';
export function scoreTravelWriting(answers:Record<string,string>):number{
 return bank.items.filter(q=>answers[q.id]===q.answerKey.choiceId).length;
}
export default function TravelWritingPractice(){
 const [draft,setDraft]=useState('');
 const [loaded,setLoaded]=useState(false);
 const [saveNotice,setSaveNotice]=useState('');
 const [models,setModels]=useState(false);
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false);
 const [notice,setNotice]=useState('');
 function loadDraft(){if(loaded)return;try{setDraft(localStorage.getItem(DRAFT_KEY)||'');}catch{setSaveNotice('Browser storage unavailable; you can still type and compare.');}setLoaded(true);}
 function save(){try{localStorage.setItem(DRAFT_KEY,draft);setSaveNotice('Draft saved in this browser only.');}catch{setSaveNotice('Could not save locally. Copy your draft before leaving.');}}
 function clear(){setDraft('');try{localStorage.removeItem(DRAFT_KEY);}catch{}setSaveNotice('Draft cleared from this browser.');}
 const score=scoreTravelWriting(answers);
 async function check(){
  if(bank.items.some(q=>!answers[q.id])){setNotice('Please answer all ten questions first.');return;}
  setSubmitted(true);setNotice('Answers checked. Review each explanation.');
  try{await recordAttempt('n5-m05-c02-l07-v1','n5',score,bank.items.length);}
  catch{setNotice('Answers checked, but the attempt could not be saved in this browser.');}
 }
 return <div className="foundation-practice" style={{minWidth:0}}>
 <section aria-label="Japanese travel writing draft">
 <h2>Write and revise your travel plan</h2>
 <p>Type two to five Japanese sentences. Your writing is self-reviewed, not automatically graded or uploaded.</p>
 <label htmlFor="travel-writing-draft"><strong>Your Japanese draft</strong></label>
 <textarea id="travel-writing-draft" lang="ja" rows={6} value={draft} onFocus={loadDraft} onChange={e=>setDraft(e.target.value)} style={{display:'block',width:'100%',maxWidth:'100%',boxSizing:'border-box',fontSize:'1rem',padding:'.75rem',borderRadius:'.5rem',color:'inherit',background:'var(--surface, transparent)',border:'1px solid var(--border, #888)'}} placeholder="土曜日、博物館に行きます。…" />
 <div style={{display:'flex',flexWrap:'wrap',gap:'.6rem',marginBlock:'1rem'}}>
 <button type="button" onClick={save}>Save draft locally</button>
 <button type="button" onClick={clear}>Clear draft</button>
 <button type="button" onClick={()=>setModels(v=>!v)} aria-expanded={models}>{models?'Hide models':'Show model answers and rubric'}</button>
 </div>
 <p role="status" aria-live="polite">{saveNotice}</p>
 {models&&<div aria-label="Writing self-review models">
 <p><strong>Prompt A:</strong> <span lang="ja">土曜日、博物館に行きます。友だちと行きます。バスで行きます。</span></p>
 <p><strong>Prompt B:</strong> <span lang="ja">日曜日、公園に行きます。一人で行きます。電車で行きます。</span></p>
 <p>Check: destination に/へ; companion と or alone 一人で; means で or walking 歩いて; two to five connected polite sentences. These are models, not automatic corrections.</p>
 </div>}
 </section>
 <section aria-label="Travel writing pattern quiz">
 <h2>Check the sentence patterns</h2><p>Choose one answer per question. This checks fixed patterns, not your free writing.</p>
 {bank.items.map((q,i)=><fieldset key={q.id} style={{minWidth:0,padding:'1rem',marginBlock:'1rem',border:'1px solid var(--border, #888)',borderRadius:'.75rem'}}>
 <legend><strong>{i+1}. {q.prompt}</strong></legend>
 {q.choices.map(c=><label key={c.id} style={{display:'flex',alignItems:'center',gap:'.75rem',minHeight:44,padding:'.4rem',overflowWrap:'anywhere'}}>
 <input type="radio" name={q.id} checked={answers[q.id]===c.id} disabled={submitted} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span>{c.text}</span></label>)}
 {submitted&&<p role="status"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct.':'Review:'}</strong> {q.choices.find(c=>c.id===answers[q.id])?.rationale}</p>}
 </fieldset>)}
 <p aria-live="polite">{notice}</p>
 {submitted?<><p role="status">Pattern recognition: {score} of {bank.items.length} correct. This does not grade your writing or pronunciation.</p><button type="button" onClick={()=>{setAnswers({});setSubmitted(false);setNotice('Ready to retry.');}}>Retry questions</button></>:<button type="button" onClick={check}>Check answers</button>}
 </section></div>;
}
