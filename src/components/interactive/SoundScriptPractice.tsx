import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { recordAttempt } from '../../lib/progress';
import { soundScriptCards, soundScriptPalette, soundScriptQuestions, soundScriptQuizId, scoreSoundScript, isSoundScriptCorrect } from '../../lib/soundScriptPractice';

export default function SoundScriptPractice() {
  const [ready,setReady] = useState(false);
  const [card,setCard] = useState(0);
  const [revealed,setRevealed] = useState(false);
  const [answers,setAnswers] = useState<Record<string,string>>({});
  const [submitted,setSubmitted] = useState(false);
  const [saving,setSaving] = useState(false);
  const [error,setError] = useState('');
  const [draft,setDraft] = useState('');
  const [showModel,setShowModel] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  useEffect(() => setReady(true),[]);
  const answered = soundScriptQuestions.filter(q => !!answers[q.id]?.trim()).length;
  const score = scoreSoundScript(answers);
  const current = soundScriptCards[card];
  const clearDrawing = () => { const c=canvasRef.current; c?.getContext('2d')?.clearRect(0,0,c.width,c.height); drawing.current=false; };
  const draw = (e:ReactPointerEvent<HTMLCanvasElement>,start:boolean) => {
    const c=canvasRef.current, ctx=c?.getContext('2d');
    if (!c || !ctx) return;
    const rect=c.getBoundingClientRect(), x=(e.clientX-rect.left)*c.width/rect.width, y=(e.clientY-rect.top)*c.height/rect.height;
    ctx.strokeStyle='#d71920';ctx.lineWidth=6;ctx.lineCap='round';ctx.lineJoin='round';
    if(start){drawing.current=true;c.setPointerCapture(e.pointerId);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+.01,y+.01);ctx.stroke();}
    else if(drawing.current){ctx.lineTo(x,y);ctx.stroke();}
  };
  const endDrawing=(e:ReactPointerEvent<HTMLCanvasElement>)=>{drawing.current=false;if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);};
  const setAnswer=(id:string,value:string)=>setAnswers(a=>({...a,[id]:value}));
  async function submit() {
    if(!ready || saving || submitted || answered !== soundScriptQuestions.length) return;
    setSaving(true);setError('');
    try {await recordAttempt(soundScriptQuizId,'l0',score,soundScriptQuestions.length);setSubmitted(true);}
    catch(e){setError(e instanceof Error?e.message:'Could not save your score in this browser.');}
    finally{setSaving(false);}
  }
  return <section className="foundation-practice sound-script-practice" aria-labelledby="sound-script-title">
    <span className="eyebrow">KANA RECOGNITION · TYPING · OPTIONAL COPYING</span>
    <h2 id="sound-script-title">Reveal a sample-syllable card</h2>
    <p>Recall the hiragana from the Latin reading cue, then reveal its printed form and word context. These cards are unscored. They do not test audio perception.</p>
    <div className="vocabulary-card" aria-live="polite">
      <p className="muted">Card {card+1} of {soundScriptCards.length} · {current.cue}</p>
      {!revealed?<p className="vocabulary-card__term">Which kana?</p>:<><p className="script-pair__glyph" lang="ja">{current.glyph}</p><div className="foundation-feedback"><strong>Written form revealed</strong><p>{current.context}</p></div></>}
      <div className="vocabulary-card__controls">
        <button type="button" className="btn btn-outline" disabled={!ready||card===0} onClick={()=>{setCard(n=>n-1);setRevealed(false);clearDrawing();}}>Previous</button>
        <button type="button" className="btn btn-outline" disabled={!ready} aria-expanded={revealed} onClick={()=>setRevealed(v=>!v)}>{revealed?'Hide kana':'Reveal kana'}</button>
        <button type="button" className="btn btn-outline" disabled={!ready||card===soundScriptCards.length-1} onClick={()=>{setCard(n=>n+1);setRevealed(false);clearDrawing();}}>Next</button>
      </div>
    </div>
    <div className="script-tracing">
      <h3>Optional freehand copying</h3>
      <p>Reveal a card, then copy its kana with a finger, stylus or mouse. This canvas has <strong>no stroke-order guide and no handwriting grading</strong>. The scored kana-entry questions below are a keyboard-accessible alternative. Drawing is never uploaded or saved.</p>
      <canvas ref={canvasRef} width={420} height={220} className="script-tracing__canvas" role="img" aria-label="Optional freehand kana drawing area; the kana-entry questions below provide a keyboard-accessible alternative." onPointerDown={e=>draw(e,true)} onPointerMove={e=>draw(e,false)} onPointerUp={endDrawing} onPointerCancel={endDrawing}/>
      <div><button type="button" className="btn btn-outline" onClick={clearDrawing}>Clear drawing</button></div>
    </div>
    <div className="foundation-practice__header">
      <h2>Check your written kana recognition</h2>
      <p>Eight choice questions and four real kana-entry questions. You may type with a Japanese IME or use the on-screen palette. Romaji alone is not accepted as kana. The score records written work only, not hearing or pronunciation.</p>
      <div className="foundation-progress-label" aria-live="polite">{answered} of {soundScriptQuestions.length} answered</div>
      <div className="foundation-progress" role="progressbar" aria-label="Kana questions answered" aria-valuemin={0} aria-valuemax={soundScriptQuestions.length} aria-valuenow={answered}><span style={{width:(100*answered/soundScriptQuestions.length)+'%'}}/></div>
    </div>
    {soundScriptQuestions.map((q,i)=><fieldset className="foundation-question" data-question-id={q.id} key={q.id} disabled={!ready||saving||submitted}>
      <legend><span className="foundation-question__number">{String(i+1).padStart(2,'0')}</span>{q.prompt}</legend>
      {q.example&&<p className="foundation-prompt-jp" lang="ja">{q.example}</p>}
      {q.type==='single-choice'?<div className="foundation-options">{q.choices.map(c=><label key={c.id} className={'foundation-option'+(answers[q.id]===c.id?' foundation-option--selected':'')}>
        <input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} onChange={()=>setAnswer(q.id,c.id)}/><span>{c.text}</span>
      </label>)}</div>:<div className="vocabulary-input">
        <label htmlFor={q.id}>Your kana answer</label>
        <input id={q.id} name={q.id} type="text" maxLength={8} autoComplete="off" autoCapitalize="off" spellCheck={false} lang="ja" value={answers[q.id]??''} onChange={e=>setAnswer(q.id,e.target.value)}/>
        <p className="muted">Optional kana palette · tap a character to append it (all taught choices shown):</p>
        <div className="script-keyboard" role="group" aria-label="On-screen hiragana input palette">{soundScriptPalette.map(glyph=><button type="button" key={glyph} className="script-keyboard__key" lang="ja" aria-label={'Enter '+glyph} onClick={()=>setAnswers(a=>({...a,[q.id]:(a[q.id]??'')+glyph}))}>{glyph}</button>)}
          <button type="button" className="btn btn-outline" onClick={()=>setAnswer(q.id,(answers[q.id]??'').slice(0,-1))}>Delete last</button>
          <button type="button" className="btn btn-outline" onClick={()=>setAnswer(q.id,'')}>Clear answer</button>
        </div>
      </div>}
      {submitted&&<div className="foundation-feedback" role="note"><strong>{isSoundScriptCorrect(q,answers[q.id]??'')?'Correct':'Review this answer'}</strong>
        <p>{q.explanation}</p>
        {!isSoundScriptCorrect(q,answers[q.id]??'')&&<p className="foundation-feedback__why">{q.type==='single-choice'?'Your choice: '+(q.choices.find(c=>c.id===answers[q.id])?.rationale??'No choice selected'):'Correct kana: '+q.answerKey.accepted[0]}</p>}
      </div>}
    </fieldset>)}
    {error&&<p className="inline-error" role="alert">{error} Your responses remain available to retry saving.</p>}
    {!submitted?<div className="foundation-practice__actions"><span className="muted">Answer all twelve questions before saving a written score.</span><button type="button" className="btn btn-primary" disabled={!ready||saving||answered!==soundScriptQuestions.length} onClick={submit}>{saving?'Saving…':'Check answers & save score'}</button></div>:<div className="foundation-result" role="status" aria-live="polite"><h3>{score} / {soundScriptQuestions.length} correct</h3><p>Saved locally. This is written kana practice, not an audio, handwriting or long-term mastery grade.</p><button type="button" className="btn btn-outline" onClick={()=>{setAnswers({});setSubmitted(false);setError('');}}>Practice again</button></div>}
    <div className="foundation-teachback">
      <h3>Optional writing: explain the two labels</h3>
      <p>Emi asks why the umbrella card says <span lang="ja">かさ</span>, but a negative reply says <span lang="ja">いいえ</span>. Write a short explanation in English or simple Japanese. This is a self-review, not a machine-scored composition.</p>
      <label htmlFor="sound-script-draft">Your explanation (private to this page)</label>
      <textarea id="sound-script-draft" rows={3} disabled={!ready} value={draft} onChange={e=>{setDraft(e.target.value);setShowModel(false);}}/>
      <button type="button" className="btn btn-outline" disabled={!ready} aria-expanded={showModel} onClick={()=>setShowModel(v=>!v)}>{showModel?'Hide model and checklist':'Compare with model and checklist'}</button>
      {showModel&&<div className="foundation-feedback" role="note"><strong>Model and self-review</strong><p><span lang="ja">かさ</span> (か・さ, two morae) means umbrella. <span lang="ja">いいえ</span> (い・い・え, three morae) is a reply meaning no. Kana are written characters; Latin cues are not the same as kana.</p><ul><li>Did you write both labels correctly?</li><li>Did you distinguish their meanings?</li><li>Did you count the morae and preserve the extra い?</li><li>Did you avoid claiming that writing alone proves pronunciation?</li></ul><p>Revise your draft if needed. It is not sent to a teacher or server.</p></div>}
    </div>
    <p className="foundation-storage-note">Only the aggregate written quiz attempt and separately selected lesson completion/bookmark use existing Dexie v1 storage. Draft text and freehand drawing stay in this tab and are lost on refresh; no audio or microphone is used. Browser storage can be cleared by the user or browser.</p>
  </section>;
}
