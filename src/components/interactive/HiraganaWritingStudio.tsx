import { useState } from 'react';
import { recordAttempt } from '../../lib/progress';

export const kanaItems = [
  { id: 'a', cue: 'Write the vowel a', answer: 'あ', why: 'The vowel a is written あ.' },
  { id: 'i', cue: 'Write the vowel i', answer: 'い', why: 'The vowel i is written い.' },
  { id: 'u', cue: 'Write the vowel u', answer: 'う', why: 'The vowel u is written う.' },
  { id: 'e', cue: 'Write the vowel e', answer: 'え', why: 'The vowel e is written え.' },
  { id: 'o', cue: 'Write the vowel o', answer: 'お', why: 'The vowel o is written お; notice its separate small mark.' },
  { id: 'ka', cue: 'Write ka', answer: 'か', why: 'The K row begins with か (ka).' },
  { id: 'ki', cue: 'Write ki', answer: 'き', why: 'The K row character for ki is き.' },
  { id: 'ku', cue: 'Write ku', answer: 'く', why: 'The K row character for ku is く.' },
  { id: 'ke', cue: 'Write ke', answer: 'け', why: 'The K row character for ke is け.' },
  { id: 'ko', cue: 'Write ko', answer: 'こ', why: 'The K row character for ko is こ.' },
  { id: 'sa', cue: 'Write sa', answer: 'さ', why: 'The S row begins with さ (sa).' },
  { id: 'shi', cue: 'Write shi', answer: 'し', why: 'The S row exception is し, romanized shi.' },
  { id: 'su', cue: 'Write su', answer: 'す', why: 'The S row character for su is す.' },
  { id: 'se', cue: 'Write se', answer: 'せ', why: 'The S row character for se is せ.' },
  { id: 'so', cue: 'Write so', answer: 'そ', why: 'The S row character for so is そ.' },
  { id: 'umbrella', cue: 'Write umbrella in hiragana', answer: 'かさ', why: 'Umbrella is かさ: ka + sa.' },
  { id: 'sushi', cue: 'Write sushi in hiragana', answer: 'すし', why: 'Sushi is すし: su + shi.' },
  { id: 'chair', cue: 'Write chair in hiragana', answer: 'いす', why: 'Chair is いす: i + su.' },
  { id: 'here', cue: 'Write here in hiragana', answer: 'ここ', why: 'Here is ここ: ko + ko.' },
  { id: 'world', cue: 'Write world in hiragana', answer: 'せかい', why: 'World is せかい: se + ka + i.' },
] as const;

const drafts = [
  { id: 'labels', cue: 'Write two classroom labels: umbrella and chair, one per line.', model: 'かさ\nいす', hint: 'Use the two words from the card table.' },
  { id: 'location', cue: 'Write a tiny location note using the word “here” twice, as two separate labels.', model: 'ここ\nここ', hint: 'Repeat the familiar two-kana word.' },
] as const;
export const isKanaAnswer = (given: string, expected: string) => given.normalize('NFC').trim() === expected;
export default function HiraganaWritingStudio() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [saved, setSaved] = useState<'idle'|'saving'|'saved'|'error'>('idle');
  const [writing, setWriting] = useState<Record<string, string>>({});
  const [show, setShow] = useState(false);
  const [rubric, setRubric] = useState<Record<string, boolean>>({});
  const complete = kanaItems.every(q => (answers[q.id] ?? '').trim().length > 0);
  const score = kanaItems.filter(q => isKanaAnswer(answers[q.id] ?? '', q.answer)).length;
  async function check() {
    if (!complete || submitted) return;
    setSubmitted(true); setSaved('saving');
    try { await recordAttempt('l0-m02-c01-l07-writing-v1', 'l0', score, kanaItems.length); setSaved('saved'); }
    catch { setSaved('error'); }
  }
  return <section aria-labelledby="kana-writing-title" className="min-w-0 space-y-5">
    <h2 id="kana-writing-title" className="text-2xl font-semibold">Kana writing studio</h2>
    <p>Type Japanese hiragana, not Latin letters. The first fifteen tasks produce individual kana; the last five build words. Each item is worth one point. No handwriting is machine graded.</p>
    {kanaItems.map((q, i) => <fieldset key={q.id} disabled={submitted} className="min-w-0 rounded-xl border border-current/30 p-4">
      <legend className="px-1 font-semibold">{i + 1}. {q.cue}</legend>
      <label htmlFor={`write-${q.id}`} className="block">Japanese kana answer</label>
      <input id={`write-${q.id}`} type="text" lang="ja" autoComplete="off" spellCheck={false}
        className="mt-2 block w-full min-w-0 rounded-lg border border-current/40 bg-transparent p-3 text-xl"
        value={answers[q.id] ?? ''} onChange={e => setAnswers(a => ({ ...a, [q.id]: e.target.value }))}/>
      {submitted && <p role="status" className="mt-2"><strong>{isKanaAnswer(answers[q.id] ?? '', q.answer) ? 'Correct.' : 'Review and compare.'}</strong> Model: <span lang="ja">{q.answer}</span>. {q.why}</p>}
    </fieldset>)}
    {!submitted ? <button type="button" className="btn btn-primary" disabled={!complete} onClick={check}>Check all 20 kana answers</button> : <div role="status" aria-live="polite">
      <p><strong>Exact kana production: {score}/{kanaItems.length}.</strong> This is not a handwriting or pronunciation grade.</p>
      <p>{saved === 'saved' ? 'Numeric attempt saved in this browser.' : saved === 'saving' ? 'Saving…' : saved === 'error' ? 'Local storage unavailable; your score is still visible.' : ''}</p>
      <button type="button" className="btn btn-outline" onClick={() => { setAnswers({}); setSubmitted(false); setSaved('idle'); }}>Retry</button>
    </div>}
    <h3>Guided writing · self-review only</h3>
    <p>These drafts are not automatically scored. Natural alternatives may be valid; compare meaning and legibility with the example models.</p>
    {drafts.map((q, i) => <div key={q.id} className="space-y-2">
      <label htmlFor={`draft-${q.id}`} className="block font-semibold">{i + 1}. {q.cue} {q.hint}</label>
      <textarea id={`draft-${q.id}`} lang="ja" rows={3} value={writing[q.id] ?? ''} onChange={e => setWriting(v => ({ ...v, [q.id]: e.target.value }))}
        className="block w-full min-w-0 rounded-lg border border-current/40 bg-transparent p-3"/>
      {show && <p><strong>Example model:</strong> <span lang="ja" style={{ whiteSpace: 'pre-line' }}>{q.model}</span></p>}
    </div>)}
    <div className="flex flex-wrap gap-3">
      <button type="button" className="btn btn-outline" aria-expanded={show} onClick={() => setShow(s => !s)}>{show ? 'Hide models' : 'Reveal models and self-review'}</button>
      <button type="button" className="btn btn-outline" onClick={() => { setWriting({}); setShow(false); setRubric({}); }}>Clear drafts</button>
    </div>
    {show && <fieldset className="rounded-xl border border-current/30 p-4"><legend>Self-review rubric (not scored)</legend>
      {['I used hiragana rather than romaji.', 'Every label has the intended meaning.', 'The characters are recognizable and in the correct order.', 'I compared confusing shapes (あ/お, き/さ).', 'If handwriting on paper, I compared proportions but did not assume correct stroke order.'].map(x =>
        <label key={x} className="my-2 flex items-start gap-3"><input type="checkbox" checked={!!rubric[x]} onChange={e => setRubric(r => ({ ...r, [x]: e.target.checked }))}/>{x}</label>)}
    </fieldset>}
    <p>Your text stays in this page session. Only a numeric score is saved locally when possible. Nothing is sent to a writing grader.</p>
  </section>;
}
