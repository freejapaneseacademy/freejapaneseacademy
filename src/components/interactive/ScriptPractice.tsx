import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { recordAttempt } from '../../lib/progress';
import { kanaPairs, kanaPalette, scriptQuestions, scriptQuizId, isScriptAnswerCorrect, scoreScriptQuestions } from '../../lib/scriptPractice';

export default function ScriptPractice() {
  const [ready,setReady]=useState(false);
  const [card,setCard]=useState(0);
  const [revealed,setRevealed]=useState(false);
  const [answers,setAnswers]=useState<Record<string,string>>({});
  const [submitted,setSubmitted]=useState(false);
  const [saving,setSaving]=useState(false);
  const [error,setError]=useState('');
  const [draft,setDraft]=useState('');
  const [showModel,setShowModel]=useState(false);
  const canvasRef=useRef<HTMLCanvasElement>(null);
  const drawing=useRef(false);
  useEffect(()=>setReady(true),[]);
  const answered=scriptQuestions.filter(q=>Boolean(answers[q.id]?.trim())).length;
  const score=scoreScriptQuestions(scriptQuestions,answers);
  const pair=kanaPairs[card];

  const clearDrawing=()=>{
    const c=canvasRef.current;
    c?.getContext('2d')?.clearRect(0,0,c.width,c.height);
    drawing.current=false;
  };
  const draw=(event:ReactPointerEvent<HTMLCanvasElement>,start:boolean)=>{
    const c=canvasRef.current;
    if(!c)return;
    const ctx=c.getContext('2d');
    if(!ctx)return;
    const rect=c.getBoundingClientRect();
    const x=(event.clientX-rect.left)*c.width/rect.width;
    const y=(event.clientY-rect.top)*c.height/rect.height;
    ctx.strokeStyle='#d71920';ctx.lineWidth=6;ctx.lineCap='round';ctx.lineJoin='round';
    if(start){
      drawing.current=true;c.setPointerCapture(event.pointerId);
      ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+0.01,y+0.01);ctx.stroke();
    }else if(drawing.current){ctx.lineTo(x,y);ctx.stroke();}
  };
  const endDrawing=(event:ReactPointerEvent<HTMLCanvasElement>)=>{
    drawing.current=false;
    if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId);
  };
  const submit=async()=>{
    if(!ready||submitted||saving||answered!==scriptQuestions.length)return;
    setSaving(true);setError('');
    try{
      await recordAttempt(scriptQuizId,'l0',score,scriptQuestions.length);
      setSubmitted(true);
    }catch(e){setError(e instanceof Error?e.message:'Could not save this practice result.');}
    finally{setSaving(false);}
  };
  return <section className="foundation-practice script-practice" aria-labelledby="script-practice-title">
    <span className="eyebrow">KANA RECOGNITION AND TYPING</span>
    <h2 id="script-practice-title">Study a vowel pair</h2>
    <p>Look at the hiragana character. Recall the katakana partner, then reveal it. These five unscored cards are for practice, not a listening or pronunciation test.</p>
    <div className="vocabulary-card" aria-live="polite">
      <p className="muted">Pair {card+1} of {kanaPairs.length} · vowel {pair.romaji}</p>
      <p className="script-pair__glyph" lang="ja">{pair.hira}{revealed && <span className="script-pair__match"> ↔ {pair.kata}</span>}</p>
      {revealed && <div className="foundation-feedback"><strong>Both write the vowel {pair.romaji}.</strong><p>{pair.cue}</p><p>These are approximate written cues, not a verified recording.</p></div>}
      <div className="vocabulary-card__controls">
        <button type="button" className="btn btn-outline" disabled={!ready||card===0} onClick={()=>{setCard(n=>n-1);setRevealed(false);clearDrawing();}}>Previous</button>
        <button type="button" className="btn btn-outline" disabled={!ready} aria-expanded={revealed} onClick={()=>setRevealed(v=>!v)}>{revealed?'Hide partner':'Reveal partner'}</button>
        <button type="button" className="btn btn-outline" disabled={!ready||card===kanaPairs.length-1} onClick={()=>{setCard(n=>n+1);setRevealed(false);clearDrawing();}}>Next</button>
      </div>
    </div>
    <div className="script-tracing">
      <h3>Optional: trace a character</h3>
      <p>Copy <strong lang="ja">{pair.hira}</strong> or <strong lang="ja">{pair.kata}</strong> in the drawing area with a finger, stylus or mouse. This is free drawing, <strong>not stroke-order guidance or automatic handwriting grading</strong>. If drawing is inaccessible, use the typing tasks below or write on paper.</p>
      <canvas ref={canvasRef} width={420} height={220} className="script-tracing__canvas" role="img" aria-label="Optional freehand drawing area for practising kana. Use the keyboard-accessible typing tasks below as an alternative." onPointerDown={e=>draw(e,true)} onPointerMove={e=>draw(e,false)} onPointerUp={endDrawing} onPointerCancel={endDrawing}/>
      <div><button type="button" className="btn btn-outline" onClick={clearDrawing}>Clear drawing</button></div>
    </div>
    <div className="foundation-practice__header">
      <h2>Check what you can recognize and enter</h2>
      <p>Eight script-identification questions and four kana-entry questions. Use your Japanese keyboard or the complete on-screen vowel palette. Romaji alone does not count as kana in the four entry questions. Results are saved only in this browser.</p>
      <div className="foundation-progress-label" aria-live="polite">{answered} of {scriptQuestions.length} answered</div>
      <div className="foundation-progress" role="progressbar" aria-label="Kana questions answered" aria-valuemin={0} aria-valuemax={scriptQuestions.length} aria-valuenow={answered}><span style={{width:(100*answered/scriptQuestions.length)+'%'}} /></div>
    </div>
    {scriptQuestions.map((q,i)=><fieldset className="foundation-question" key={q.id} disabled={!ready||submitted||saving} data-question-id={q.id}>
      <legend><span className="foundation-question__number">{String(i+1).padStart(2,'0')}</span>{q.prompt}</legend>
      {q.example && <p className="foundation-prompt-jp" lang="ja">{q.example}</p>}
      {q.type==='single-choice'?<div className="foundation-options">{q.choices.map(choice=><label key={choice.id} className={'foundation-option'+(answers[q.id]===choice.id?' foundation-option--selected':'')}>
        <input type="radio" name={q.id} value={choice.id} checked={answers[q.id]===choice.id} onChange={()=>setAnswers(a=>({...a,[q.id]:choice.id}))}/>
        <span>{choice.text}</span>
      </label>)}</div>:<div className="vocabulary-input">
        <label htmlFor={q.id}>Your {q.inputScript} character</label>
        <input id={q.id} name={q.id} type="text" maxLength={3} autoComplete="off" autoCapitalize="off" spellCheck={false} value={answers[q.id]??''} onChange={e=>setAnswers(a=>({...a,[q.id]:e.target.value}))}/>
        <p className="muted">Optional on-screen {q.inputScript} vowel palette (all five choices):</p>
        <div className="script-keyboard" role="group" aria-label={q.inputScript+' vowel characters'}>{kanaPalette[q.inputScript].map(glyph=><button key={glyph} type="button" className="script-keyboard__key" lang="ja" aria-label={'Enter '+glyph} onClick={()=>setAnswers(a=>({...a,[q.id]:glyph}))}>{glyph}</button>)}</div>
      </div>}
      {submitted && <div className="foundation-feedback" role="note">
        <strong>{isScriptAnswerCorrect(q,answers[q.id]??'')?'Correct':'Review this answer'}</strong>
        <p>{q.explanation}</p>
        {!isScriptAnswerCorrect(q,answers[q.id]??'') && <p className="foundation-feedback__why">{q.type==='single-choice'
          ? 'Your choice: '+(q.choices.find(c=>c.id===answers[q.id])?.rationale??'No choice selected')
          : 'Correct character: '+q.answerKey.accepted[0]}</p>}
      </div>}
    </fieldset>)}
    {error && <p role="alert" className="inline-error">{error} Your answers remain available to retry saving.</p>}
    {!submitted?<div className="foundation-practice__actions"><span className="muted">Answer all questions to save your score.</span>
      <button type="button" className="btn btn-primary" disabled={!ready||saving||answered!==scriptQuestions.length} onClick={submit}>{saving?'Saving…':'Check answers & save score'}</button>
    </div>:<div className="foundation-result" role="status" aria-live="polite">
      <h3>{score} / {scriptQuestions.length} correct</h3>
      <p>Your result was saved locally. This checks written recognition/entry only, not pronunciation, handwriting accuracy or long-term mastery.</p>
      <button type="button" className="btn btn-outline" onClick={()=>{setAnswers({});setSubmitted(false);setError('');}}>Practice again</button>
    </div>}
    <div className="foundation-teachback">
      <h3>Optional writing: label a classroom card</h3>
      <p>A teacher shows the hiragana word さくら and the katakana word コーヒー. Write which script each word uses, in English or Japanese. Compare your answer with the model and self-review; no automatic grade is assigned.</p>
      <label htmlFor="script-draft">Your explanation</label>
      <textarea id="script-draft" rows={3} disabled={!ready} value={draft} onChange={e=>setDraft(e.target.value)} placeholder="Describe both writing systems."/>
      <button type="button" className="btn btn-outline" disabled={!ready} aria-expanded={showModel} onClick={()=>setShowModel(v=>!v)}>{showModel?'Hide model':'Compare with model and checklist'}</button>
      {showModel && <div className="foundation-feedback"><strong>Model response</strong><p>さくら uses hiragana (さ・く・ら). コーヒー uses katakana (コ・ー・ヒ・ー); the long mark ー extends a vowel. Neither example asks you to memorize a kanji.</p><p>Self-review: Did you identify both scripts? Did you avoid treating romaji as English? Did you describe ー as a length mark, not a separate vowel? Other clear explanations are fine.</p></div>}
    </div>
    <p className="foundation-storage-note">Only aggregate quiz scores and separately chosen lesson completion/bookmarks use the existing Dexie v1 browser database. The optional writing and drawing are not stored or uploaded. Clearing the drawing erases it; browser data can also be lost if storage is cleared. No microphone or audio is used.</p>
  </section>;
}
