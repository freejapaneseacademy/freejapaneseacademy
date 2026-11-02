import { useCallback, useEffect, useRef, useState } from 'react';
import { clearProgress, exportProgress, getSnapshot, importProgress } from '../../lib/progress';
import type { CompletedLesson, QuizAttempt, Bookmark } from '../../lib/progress';

type Snapshot = { lessons: CompletedLesson[]; attempts: QuizAttempt[]; bookmarks: Bookmark[] };
export default function ProgressPanel() {
  const [data, setData] = useState<Snapshot | null>(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const refresh = useCallback(() => {
    getSnapshot().then(setData).catch((e) => setError(e instanceof Error ? e.message : 'Browser storage is unavailable.'));
  }, []);
  useEffect(() => { refresh(); window.addEventListener('fja-progress-changed', refresh); return () => window.removeEventListener('fja-progress-changed', refresh); }, [refresh]);
  const download = async () => {
    setBusy(true); setError(''); setMessage('');
    try {
      const data = await exportProgress();
      const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
      const a = document.createElement('a'); a.href = url; a.download = 'freejapaneseacademy-progress.json'; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000); setMessage('Your progress backup is ready.');
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not export progress.'); }
    finally { setBusy(false); }
  };
  const upload = async (file?: File) => {
    if (!file) return;
    setBusy(true); setError(''); setMessage('');
    try {
      if (file.size > 2_000_000) throw new Error('Backup is too large (maximum 2 MB).');
      if (!window.confirm('Replace all existing progress with the imported backup?')) return;
      await importProgress(await file.text()); refresh(); setMessage('Progress restored from your backup.');
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not import progress.'); }
    finally { if (fileRef.current) fileRef.current.value = ''; setBusy(false); }
  };
  const clear = async () => {
    if (!window.confirm('Permanently remove all saved progress on this device? This cannot be undone without a backup.')) return;
    setBusy(true); setError(''); setMessage('');
    try { await clearProgress(); refresh(); setMessage('Progress cleared on this device.'); }
    catch (e) { setError(e instanceof Error ? e.message : 'Could not clear progress.'); }
    finally { setBusy(false); }
  };
  if (!data) return <div className="dash-loading" role="status">{error || 'Loading your learning progress…'}</div>;
  const best = data.attempts.length ? Math.max(...data.attempts.map((x) => Math.round(x.correct / x.total * 100))) : null;
  const latest = [...data.attempts].sort((a, b) => b.at.localeCompare(a.at)).slice(0, 4);
  const hasFoundationsProgress = data.lessons.some((item) => item.level === 'l0') || data.attempts.some((item) => item.level === 'l0');
  const quizLabel = (quizId: string) => quizId === 'l0-m01-c01-l01-check-v1'
    ? 'Foundations: Japanese writing systems'
    : quizId === 'l0-m01-c01-l02-check-v1' ? 'Foundations: Classroom vocabulary'
    : quizId === 'l0-m01-c01-l03-check-v1' ? 'Foundations: Sentence function'
    : quizId === 'l0-m01-c01-l04-check-v1' ? 'Foundations: Kana recognition and typing'
    : quizId === 'l0-m01-c01-l05-check-v1' ? 'Foundations: Chart reading and evidence'
    : quizId === 'l0-m01-c01-l06-check-v1' ? 'Foundations: Japanese listening overview'
    : quizId === 'l0-m01-c01-l07-check-v1' ? 'Foundations: Script writing and typing'
    : quizId === 'l0-m01-c01-l08-check-v1' ? 'Foundations: Speaking phrase preparation'
    : quizId === 'l0-m01-c02-l01-check-v1' ? 'Foundations: Five vowels and mora timing'
    : quizId === 'l0-m01-c01-chk-v1' ? 'Foundations: Chapter 01 mixed checkpoint'
    : quizId === 'hiragana-demo-v1' ? 'Hiragana demo quiz' : 'Japanese practice quiz';
  return <div>
    <div className="stat-grid">
      <div className="stat-card"><span>Lessons completed</span><strong>{data.lessons.length.toString().padStart(2, '0')}</strong><small>Keep your momentum</small></div>
      <div className="stat-card"><span>Practice attempts</span><strong>{data.attempts.length.toString().padStart(2, '0')}</strong><small>Each attempt counts</small></div>
      <div className="stat-card"><span>Best quiz score</span><strong>{best === null ? '—' : `${best}%`}</strong><small>Based on your attempts</small></div>
      <div className="stat-card"><span>Bookmarks</span><strong>{data.bookmarks.length.toString().padStart(2, '0')}</strong><small>Saved for later</small></div>
    </div>
    <div className="dash-columns">
      <section className="panel"><span className="eyebrow">YOUR JOURNEY</span><h2>Continue learning</h2>
        {data.lessons.length || data.attempts.length ? <><p>You have started building your Japanese learning history. Ready for the next step?</p><a href={hasFoundationsProgress ? '/learn/start/' : '/learn/n5/'} className="text-link">{hasFoundationsProgress ? 'Continue Japanese Foundations ↗' : 'Explore N5 lessons ↗'}</a></> : <><div className="empty-icon" aria-hidden="true">あ</div><h3>Your story starts here.</h3><p>Your lesson completions and quiz scores will appear here as you begin.</p><a href="/learn/start/" className="btn btn-primary">Start Japanese Foundations ↗</a></>}
      </section>
      <section className="panel"><span className="eyebrow">RECENT ACTIVITY</span><h2>Practice history</h2>
        {latest.length ? <ul className="activity-list">{latest.map((attempt) => <li key={attempt.id ?? attempt.at}><span>{quizLabel(attempt.quizId)}</span><strong>{attempt.correct}/{attempt.total}</strong><small>{new Date(attempt.at).toLocaleDateString()}</small></li>)}</ul> : <p>No practice attempts yet. Complete a lesson check to see your results here.</p>}
        <a href="/practice/demo/" className="text-link">Open demonstration quiz ↗</a>
      </section>
    </div>
    <section className="panel data-panel"><div><span className="eyebrow">YOUR DATA</span><h2>Progress & backups</h2><p>Your progress stays on this browser. Back it up if you move devices or clear browser data.</p></div>
      <div className="button-row"><button type="button" disabled={busy} onClick={download} className="btn btn-outline">Export JSON</button><label className="btn btn-outline file-label">Import JSON<input ref={fileRef} type="file" accept=".json,application/json" disabled={busy} onChange={(e) => upload(e.target.files?.[0])} /></label><button className="btn btn-danger" type="button" disabled={busy} onClick={clear}>Clear all data</button></div>
      {error && <p role="alert" className="inline-error">{error}</p>}{message && <p role="status" className="inline-success">{message}</p>}
    </section>
  </div>;
}
