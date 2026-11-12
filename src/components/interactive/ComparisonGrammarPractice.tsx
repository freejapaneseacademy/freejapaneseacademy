import {useState} from 'react';
import bank from '../../content/exercises/n5-m07-c03-l03-v1.json';
import {recordAttempt} from '../../lib/progress';
export const COMPARISON_GRAMMAR_QUIZ_ID='n5-m07-c03-l03-v1';
export const comparisonGrammarQuestions=bank.items;
export function scoreComparisonGrammar(answers:Record<string,string>){return comparisonGrammarQuestions.filter(q=>answers[q.id]===q.answerKey.choiceId).length;}
export default function ComparisonGrammarPractice(){
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false);
 const [notice,setNotice]=useState('');
 const [draft,setDraft]=useState('');
 const [showModel,setShowModel]=useState(false);
 const score=scoreComparisonGrammar(answers);
 async function submit(){
  if(comparisonGrammarQuestions.some(q=>!answers[q.id])){setNotice('Answer all questions before checking.');return;}
  setSubmitted(true);
  try{await recordAttempt(COMPARISON_GRAMMAR_QUIZ_ID,'n5',score,comparisonGrammarQuestions.length);setNotice('Recognition attempt saved on this device.');}
  catch{setNotice('Answers checked; browser progress storage is unavailable.');}
 }
 return <section className="foundation-practice" aria-label="Comparing choices grammar practice">
  <h2>Compare three fictional study places (ungraded)</h2>
  <label htmlFor="comparison-grammar-draft"><strong>Write three or four polite sentences with より, どちら and 一番</strong></label>
  <textarea id="comparison-grammar-draft" lang="ja" rows={5} value={draft} onChange={e=>setDraft(e.target.value)} style={{width:'100%',maxWidth:'100%',minWidth:0,boxSizing:'border-box'}} placeholder="青カフェより緑カフェのほうが静かです。" />
  <p>Your text is not uploaded, automatically graded or saved after leaving this page.</p>
  <button type="button" aria-expanded={showModel} onClick={()=>setShowModel(v=>!v)}>{showModel?'Hide writing model':'Show writing model and self-check'}</button>
  {showModel&&<div className="course-notice"><p lang="ja">青カフェより緑カフェのほうが静かです。二つの店では、どちらが好きですか。三つの店の中では、白カフェが一番安いです。</p><p>Check: baseline after より, chosen side before のほうが, どちら for two, 一番 with a group. Natural alternatives are welcome.</p></div>}
  <h2>Comparison recognition check</h2>
  {comparisonGrammarQuestions.map((q,i)=><fieldset key={q.id} className="foundation-question" disabled={submitted} style={{minWidth:0,marginBlock:'1rem',padding:'1rem',border:'1px solid var(--border,#888)',borderRadius:'.75rem'}}>
   <legend><strong>{i+1}. {q.prompt}</strong></legend>
   {q.choices.map(c=><label key={c.id} style={{display:'flex',alignItems:'center',gap:'.75rem',minHeight:44,overflowWrap:'anywhere'}}><input type="radio" name={q.id} checked={answers[q.id]===c.id} onChange={()=>setAnswers(a=>({...a,[q.id]:c.id}))}/><span>{c.text}</span></label>)}
   {submitted&&<p role="status" className="foundation-feedback"><strong>{answers[q.id]===q.answerKey.choiceId?'Correct.':'Review.'}</strong> {q.choices.find(c=>c.id===answers[q.id])?.rationale} Answer: {q.choices.find(c=>c.id===q.answerKey.choiceId)?.text}. Evidence: <span lang="ja">{q.evidence}</span></p>}
  </fieldset>)}
  <p aria-live="polite">{notice}</p>
  {submitted?<><p role="status">Recognition score: {score} / {comparisonGrammarQuestions.length}</p><button type="button" onClick={()=>{setAnswers({});setSubmitted(false);setNotice('Ready to retry.');}}>Retry questions</button></>:<button type="button" disabled={Object.keys(answers).length!==comparisonGrammarQuestions.length} onClick={submit}>Check answers</button>}
 </section>;
}
