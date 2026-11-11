import { useEffect, useState } from 'react';
import { recordAttempt } from '../../lib/progress';

type Question = { id: string; prompt: string; options: [string, string, string]; answer: number; feedback: string; wrong: string };
export const contrastQuestions: Question[] = [
  { id:'l0-m01-c03-l02-q01',prompt:'Which word means “grandmother” in the family album?',options:['おばさん','おばあさん','おじさん'],answer:1,feedback:'おばあさん has an additional あ mora. In this family context it means grandmother.',wrong:'Compare おばさん (aunt) with おばあさん (grandmother): the extra あ matters.' },
  { id:'l0-m01-c03-l02-q02',prompt:'Which word means “postage stamp”?',options:['きて','きって','さか'],answer:1,feedback:'きって (切手) is a postage stamp. The small っ counts as a mora.',wrong:'きて is a casual request to come; きって is the stamp.' },
  { id:'l0-m01-c03-l02-q03',prompt:'Which word means “writer/author”?',options:['さっか','さか','さんぽ'],answer:0,feedback:'さっか (作家) means writer; the small っ distinguishes it from さか (slope).',wrong:'さか means slope; さんぽ means stroll. The writer is さっか.' },
  { id:'l0-m01-c03-l02-q04',prompt:'How many mora are in きって?',options:['Two','Three','Four'],answer:1,feedback:'き・っ・て = three mora. The small っ marks a consonant hold.',wrong:'Count き, small っ and て separately: three mora.' },
  { id:'l0-m01-c03-l02-q05',prompt:'How many mora are in おばあさん?',options:['Four','Five','Six'],answer:1,feedback:'お・ば・あ・さ・ん = five mora. The extra あ and ん each count.',wrong:'Count each full vowel kana and the final ん: five mora.' },
  { id:'l0-m01-c03-l02-q06',prompt:'Which word means “stroll”?',options:['ほん','さんぽ','みんな'],answer:1,feedback:'さんぽ is a walk or stroll, with さ・ん・ぽ = three mora.',wrong:'ほん is a book and みんな means everyone; さんぽ means stroll.' },
  { id:'l0-m01-c03-l02-q07',prompt:'Which word means “book”?',options:['ほん','かんじ','おじいさん'],answer:0,feedback:'ほん means book, with ほ・ん = two mora.',wrong:'かんじ means kanji and おじいさん means grandfather. ほん is book.' },
  { id:'l0-m01-c03-l02-q08',prompt:'Which word means “everyone”?',options:['さんぽ','みんな','きって'],answer:1,feedback:'みんな means everyone. The ん counts as a mora.',wrong:'みんな means everyone; さんぽ is a stroll and きって is a stamp.' }
];

export default function RhythmVocabularyPractice() {
  const [hydrated,setHydrated]=useState(false);
  useEffect(()=>setHydrated(true),[]);
  const [answers,setAnswers]=useState<Record<string,number>>({});
  const [submitted,setSubmitted]=useState(false);
  const [status,setStatus]=useState('');
  const correct=contrastQuestions.filter(q=>answers[q.id]===q.answer).length;
  const ready=contrastQuestions.every(q=>answers[q.id]!==undefined);
  async function submit() {
    if (!ready || submitted) return;
    setSubmitted(true);
    try { await recordAttempt('l0-m01-c03-l02-v1','l0',correct,contrastQuestions.length);setStatus('Attempt saved on this device.'); }
    catch { setStatus('Your answers were checked, but local progress could not be saved.'); }
  }
  function reset(){setAnswers({});setSubmitted(false);setStatus('');}
  return <section aria-labelledby="rhythm-practice-title" className="foundation-practice">
    <h2 id="rhythm-practice-title">Written word recognition check</h2>
    <p>Eight original questions. Choose one answer per question; submit to see feedback. This is not an audio or pronunciation test.</p>
    {contrastQuestions.map((q,i)=><fieldset key={q.id} style={{marginBlock:'1.25rem',padding:'1rem',border:'1px solid var(--border, #888)',borderRadius:'0.75rem'}}>
      <legend><strong>{i+1}. {q.prompt}</strong></legend>
      {q.options.map((option,index)=><label key={option} style={{display:'flex',gap:'0.75rem',alignItems:'center',minHeight:44,marginBlock:'0.3rem'}}>
        <input type="radio" name={q.id} value={index} disabled={!hydrated||submitted} checked={answers[q.id]===index} onChange={()=>setAnswers(a=>({...a,[q.id]:index}))}/>
        <span lang={/[ぁ-ん]/.test(option)?'ja':undefined}>{option}</span>
      </label>)}
      {submitted&&<p role="status"><strong>{answers[q.id]===q.answer?'Correct. ':'Review. '}</strong>{answers[q.id]===q.answer?q.feedback:q.wrong}</p>}
    </fieldset>)}
    {submitted&&<p role="status"><strong>{correct} / {contrastQuestions.length} correct.</strong> This score measures written word recognition only. {status}</p>}
    <div style={{display:'flex',flexWrap:'wrap',gap:'0.75rem'}}>
      <button type="button" className="btn btn-primary" onClick={submit} disabled={!hydrated||!ready||submitted}>Submit answers</button>
      <button type="button" className="btn btn-outline" onClick={reset} disabled={!hydrated}>Try again</button>
    </div>
  </section>;
}
