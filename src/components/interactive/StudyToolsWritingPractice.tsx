import { useState } from 'react';
import { recordAttempt } from '../../lib/progress';

export const items = [
  {id:'japanese',cue:'Japanese language (hiragana)',answer:'にほんご',why:'The final kana are に・ほ・ん・ご; romaji is not the requested script.'},
  {id:'hiragana',cue:'Hiragana (hiragana)',answer:'ひらがな',why:'The four hiragana are ひ・ら・が・な.'},
  {id:'katakana',cue:'Katakana (katakana)',answer:'カタカナ',why:'Use the katakana script, not かたかな.'},
  {id:'character',cue:'Written character (hiragana)',answer:'もじ',why:'もじ refers to a written character.'},
  {id:'reading',cue:'How to read (hiragana)',answer:'よみかた',why:'よみかた means reading or how to read.'},
  {id:'please',cue:'Polite “please” expression (hiragana)',answer:'おねがいします',why:'おねがいします is a polite request expression.'},
  {id:'japanese-de',cue:'In Japanese (hiragana)',answer:'にほんごで',why:'で marks the language used.'},
  {id:'hiragana-de',cue:'In hiragana (hiragana)',answer:'ひらがなで',why:'で marks the script used.'},
  {id:'reading-object',cue:'The reading, marked as object (hiragana)',answer:'よみかたを',why:'を marks what is to be explained.'},
  {id:'teach',cue:'Please tell me / teach me (hiragana)',answer:'おしえてください',why:'おしえてください is a polite action request.'},
  {id:'write',cue:'Please write (hiragana)',answer:'かいてください',why:'かいてください asks someone to write.'},
  {id:'furigana',cue:'Furigana (hiragana)',answer:'ふりがな',why:'Furigana are reading annotations, not translations.'}
] as const;
export const models = [
  {id:'script',cue:'Ask a teacher to write in hiragana.',hint:'ひらがなで …',model:'ひらがなで かいてください。'},
  {id:'aid',cue:'Ask a teacher to add furigana.',hint:'ふりがなを …',model:'ふりがなを つけてください。'},
  {id:'steps',cue:'Give two steps: write in Japanese, then check the reading.',hint:'まず …。つぎに …。',model:'まず、にほんごで かいてください。つぎに、よみかたを かくにんしてください。'}
] as const;
export const normalize = (s:string) => s.normalize('NFKC').replace(/[\s\u3000]/g,'').replace(/[。．]/g,'').trim();
export default function StudyToolsWritingPractice(){
  const [answers,setAnswers]=useState<Record<string,string>>({});
  const [drafts,setDrafts]=useState<Record<string,string>>({});
  const [checked,setChecked]=useState(false);
  const [modelsVisible,setModelsVisible]=useState(false);
  const [saveStatus,setSaveStatus]=useState('');
  const correct=items.filter(q=>normalize(answers[q.id]||'')===q.answer).length;
  const check=async()=>{setChecked(true);try{await recordAttempt('l0-m01-c04-l07-writing-v1','l0',correct,items.length);setSaveStatus('Numeric score saved in this browser.');}catch{setSaveStatus('Local storage unavailable; you can still review your answers.');}};
  return <section className="course-notice" aria-labelledby="tools-writing-heading">
    <h2 id="tools-writing-heading">Writing studio · 12 scored labels and 3 guided messages</h2>
    <p>Type Japanese text with an IME. Short prompts have one requested spelling. Longer messages are self-reviewed; no automated grammar or handwriting grade is claimed.</p>
    <div style={{display:'grid',gap:'1rem'}}>{items.map((q,i)=><div key={q.id} style={{border:'1px solid var(--border, #777)',borderRadius:'.6rem',padding:'1rem'}}>
      <label htmlFor={'tool-write-'+q.id}><strong>{i+1}. {q.cue}</strong></label>
      <input id={'tool-write-'+q.id} lang="ja" autoComplete="off" spellCheck={false} value={answers[q.id]||''}
        onChange={e=>{setAnswers(a=>({...a,[q.id]:e.target.value}));setChecked(false);setSaveStatus('');}}
        style={{display:'block',width:'100%',maxWidth:'30rem',marginTop:'.5rem',padding:'.65rem',color:'inherit',background:'transparent',border:'1px solid currentColor',borderRadius:'.35rem'}} />
      {checked&&<p role="status">{normalize(answers[q.id]||'')===q.answer?'Correct.':'Compare and revise.'} <strong lang="ja">{q.answer}</strong> — {q.why}</p>}
    </div>)}</div>
    <p><button type="button" className="btn btn-primary" onClick={check}>Check 12 Japanese spellings</button></p>
    {checked&&<p role="status"><strong>{correct} / {items.length}</strong> matched. {saveStatus}</p>}
    <h3>Guided messages · learner self-review</h3>
    {models.map((q,i)=><div key={q.id} style={{marginBlock:'1rem'}}>
      <label htmlFor={'tool-draft-'+q.id}><strong>{i+1}. {q.cue}</strong> Hint: <span lang="ja">{q.hint}</span></label>
      <textarea id={'tool-draft-'+q.id} lang="ja" rows={3} value={drafts[q.id]||''}
        onChange={e=>setDrafts(d=>({...d,[q.id]:e.target.value}))}
        style={{display:'block',width:'100%',padding:'.7rem',color:'inherit',background:'transparent',border:'1px solid currentColor',borderRadius:'.35rem'}} />
      {modelsVisible&&<p><strong>Possible model:</strong> <span lang="ja">{q.model}</span></p>}
    </div>)}
    <p><button type="button" className="btn btn-outline" aria-expanded={modelsVisible} onClick={()=>setModelsVisible(v=>!v)}>{modelsVisible?'Hide models':'Reveal models for self-review'}</button>{' '}<button type="button" className="btn btn-outline" onClick={()=>{setDrafts({});setModelsVisible(false);}}>Clear my drafts</button></p>
    {modelsVisible&&<fieldset><legend>Self-review (not scored)</legend>{['Meaning matches the classroom request','Kana and converted candidates are correct','Polite request form fits the intended action','Reading aids are not confused with translation'].map(x=><label key={x} style={{display:'block',margin:'.5rem 0'}}><input type="checkbox" /> {x}</label>)}</fieldset>}
    <p>Your drafts stay in this page session and are not uploaded. Only the numeric constrained-answer result is stored locally when you check.</p>
  </section>;
}
