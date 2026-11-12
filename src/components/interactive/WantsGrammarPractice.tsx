import {useState} from 'react';
import bank from '../../content/exercises/n5-m07-c02-l03-v1.json';
import {recordAttempt} from '../../lib/progress';
export const WANTS_GRAMMAR_QUIZ_ID='n5-m07-c02-l03-v1';
export const wantsGrammarQuestions=bank.items;
export function scoreWantsGrammar(answers:Record<string,string>){return wantsGrammarQuestions.filter(q=>answers[q.id]===q.answerKey.choiceId).length;}
export default function WantsGrammarPractice(){
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false);
 const [notice,setNotice]=useState('');
 const [draft,setDraft]=useState('');
 const [showModel,setShowModel]=useState(false);
 const score=scoreWantsGrammar(answers);
 async function submit(){
  if(wantsGrammarQuestions.some(q=>!answers[q.id])){setNotice('Answer all questions before checking.');return;}
  setSubmitted(true);
  try{await recordAttempt(WANTS_GRAMMAR_QUIZ_ID,'n5',score,wantsGrammarQuestions.length);setNotice('Recognition attempt saved on this device.');}
  catch{setNotice('Answers checked; browser progress storage is unavailable.');}
 }
 return <section className="foundation-practice" aria-label="Wants and intentions grammar practice">
  <h2>Write a Saturday plan (ungraded)</h2>
  <label htmlFor="wants-grammar-draft"><strong>Write three or four polite sentences about a desired activity, item and trip purpose</strong></label>
  <textarea id="wants-grammar-draft" lang="ja" rows={5} value={draft} onChange={e=>setDraft(e.target.value)} style={{width:'100%',maxWidth:'100%',minWidth:0,boxSizing:'border-box'}} placeholder="土曜日は日本語を勉強したいです。" />
  <p>Your text stays in this page until refresh or navigation; it is not uploaded, saved or automatically graded.</p>
  <button type="button" aria-expanded={showModel} onClick={()=>setShowModel(v=>!v)}>{showModel?'Hide writing model':'Show writing model and self-check'}</button>
  {showModel&&<div className="course-notice"><p lang="ja">土曜日は日本語を勉強したいです。新しいノートがほしいです。午後は本屋へノートを買いに行きます。</p><p>Self-check: ます-stem + たい, noun + がほしい, stem + に行きます for purpose, consistent polite endings. Other natural plans are welcome.</p></div>}
  <h2>Grammar recognition check</h2>
  {wantsGrammarQuestions.map((q,i)=><fieldset key={q.id} className="foundation-question" disabled={submitted} style={{minWidth:0,marginBlock:'1rem',padding:'1rem',border:'1px solid var(--border,#888)',borderRadius:'.75rem'}}>
   <legend><strong>{i+1}. {q.prompt}</strong></legend>
   {q.choices.map(c=><label key={c.id} style={{display:'flex',alignItems:'center',gap:'.75rem',minHeight:44,overflowWrap:'anywhere'}}><input type="radio" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span>{c.text}</span></label>)}
   {submitted&&<p role="status" className="foundation-feedback"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct.':'Review.'}</strong> {q.choices.find(c=>c.id===answers[q.id])?.rationale} Answer: {q.choices.find(c=>c.id===q.answerKey.choiceId)?.text}. Evidence: <span lang="ja">{q.evidence}</span></p>}
  </fieldset>)}
  <p aria-live="polite">{notice}</p>
  {submitted?<><p role="status">Recognition score: {score} / {wantsGrammarQuestions.length}</p><button type="button" onClick={()=>{setAnswers({});setSubmitted(false);setNotice('Ready to retry.');}}>Retry questions</button></>:<button type="button" disabled={Object.keys(answers).length!==wantsGrammarQuestions.length} onClick={submit}>Check answers</button>}
 </section>;
}
