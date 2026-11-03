import { useState } from 'react';
import { recordAttempt } from '../../lib/progress';

export const writingItems = [
  { id: 'grandmother', cue: 'A photograph of a grandmother', answer: 'おばあさん', note: 'The long a needs an extra あ: お・ば・あ・さ・ん.' },
  { id: 'aunt', cue: 'A photograph of an aunt', answer: 'おばさん', note: 'Without the extra あ, the word refers to an aunt.' },
  { id: 'writer', cue: 'The person who writes books', answer: 'さっか', note: 'The small っ occupies one mora before か.' },
  { id: 'slope', cue: 'A hill or slope', answer: 'さか', note: 'There is no small っ in さか.' },
  { id: 'stamp', cue: 'A postage stamp', answer: 'きって', note: 'The noun きって has a small っ.' },
  { id: 'come', cue: 'Come (te-form, as in ここにきてください)', answer: 'きて', note: 'The verb form きて has no small っ.' },
  { id: 'book', cue: 'A book', answer: 'ほん', note: 'The final ん is its own mora.' },
  { id: 'stroll', cue: 'A walk or stroll', answer: 'さんぽ', note: 'The ん in さ・ん・ぽ counts as one mora.' },
  { id: 'highschool', cue: 'High school (hiragana)', answer: 'こうこう', note: 'The conventional spelling is こ・う・こ・う.' },
  { id: 'coffee', cue: 'Coffee (katakana)', answer: 'コーヒー', note: 'Each ー lengthens the vowel before it.' },
  { id: 'photo', cue: 'Photograph (hiragana)', answer: 'しゃしん', note: 'The small ゃ combines with し; the final ん counts as one mora.' },
  { id: 'two', cue: 'Two sheets / flat objects (hiragana)', answer: 'にまい', note: 'にまい is the counter phrase used in the stamp request.' },
] as const;

const models = [
  { id: 'caption', prompt: 'Write “This is a photograph of a grandmother.”', model: 'これは おばあさん の しゃしん です。', hint: 'Use これは … の しゃしん です。' },
  { id: 'request', prompt: 'Ask politely for two stamps.', model: 'きって を にまい ください。', hint: 'Use きって を … ください。' },
  { id: 'book', prompt: 'Write “The book is here.”', model: 'ほん は ここ に あります。', hint: 'Use ほん は … に あります。' },
] as const;

const normalize = (value: string) => value.normalize('NFKC').replace(/[\s\u3000]/g, '').trim();

export default function SoundChangeWritingPractice() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [showModels, setShowModels] = useState(false);
  const [saved, setSaved] = useState('');
  const correct = writingItems.filter(q => normalize(answers[q.id] || '') === q.answer).length;
  const check = async () => {
    setChecked(true);
    try {
      await recordAttempt('l0-m01-c03-l07-kana-writing-v1', 'l0', correct, writingItems.length);
      setSaved('Your constrained kana score was saved in this browser.');
    } catch {
      setSaved('Browser progress storage is unavailable. You can still review your answers here.');
    }
  };
  return <section aria-labelledby="writing-studio-title" className="course-notice">
    <h2 id="writing-studio-title">Writing studio · 12 kana tasks and 3 guided messages</h2>
    <p>Enter Japanese kana, not romaji. The short labels have one specified target spelling. Feedback appears only after you choose Check. Your longer drafts are self-reviewed, not automatically graded.</p>
    <div style={{ display: 'grid', gap: '1rem' }}>
      {writingItems.map((q, i) => {
        const right = normalize(answers[q.id] || '') === q.answer;
        return <div key={q.id} style={{ padding: '1rem', border: '1px solid var(--border, #777)', borderRadius: '0.6rem' }}>
          <label htmlFor={`kana-${q.id}`}><strong>{i + 1}. {q.cue}</strong></label>
          <input id={`kana-${q.id}`} lang="ja" type="text" autoComplete="off" spellCheck={false}
            value={answers[q.id] || ''} onChange={e => { setAnswers(a => ({ ...a, [q.id]: e.target.value })); setChecked(false); setSaved(''); }}
            style={{ display: 'block', width: '100%', maxWidth: '30rem', marginTop: '0.5rem', padding: '0.65rem', color: 'inherit', background: 'transparent', border: '1px solid currentColor', borderRadius: '0.35rem' }} />
          {checked && <p role="status">{right ? 'Correct.' : 'Compare and revise.'} <span lang="ja"><strong>{q.answer}</strong></span> — {q.note}</p>}
        </div>;
      })}
    </div>
    <p><button type="button" className="btn btn-primary" onClick={check}>Check 12 kana answers</button></p>
    {checked && <p role="status"><strong>{correct} / {writingItems.length}</strong> exact kana spellings matched. {saved}</p>}
    <h3>Guided composition · learner self-review</h3>
    <p>Write your own sentence, then reveal a possible model. Different natural sentences can be valid. No automatic grammar or pronunciation score is given.</p>
    {models.map((q, i) => <div key={q.id} style={{ marginBlock: '1rem' }}>
      <label htmlFor={`draft-${q.id}`}><strong>{i + 1}. {q.prompt}</strong> {q.hint}</label>
      <textarea id={`draft-${q.id}`} lang="ja" rows={3} value={drafts[q.id] || ''}
        onChange={e => setDrafts(d => ({ ...d, [q.id]: e.target.value }))}
        style={{ display: 'block', width: '100%', padding: '0.7rem', color: 'inherit', background: 'transparent', border: '1px solid currentColor', borderRadius: '0.35rem' }} />
      {showModels && <p><strong>Model (not an exclusive answer):</strong> <span lang="ja">{q.model}</span></p>}
    </div>)}
    <p><button type="button" className="btn btn-outline" onClick={() => setShowModels(v => !v)} aria-expanded={showModels}>{showModels ? 'Hide models' : 'Reveal model answers for self-review'}</button>{' '}<button type="button" className="btn btn-outline" onClick={() => { setDrafts({}); setShowModels(false); }}>Clear my longer drafts</button></p>
    {showModels && <fieldset><legend>Self-review checklist (not scored)</legend>{['Meaning matches the requested scene','Required long vowel, small っ or ん is spelled correctly','Sentence function fits a caption, request or statement','I can read the finished kana without romaji'].map(x => <label key={x} style={{ display: 'block', margin: '0.5rem 0' }}><input type="checkbox" /> {x}</label>)}</fieldset>}
    <p>Your text remains in this page session; only a numeric short-answer result is saved locally when you check. No text is sent to a server.</p>
  </section>;
}
