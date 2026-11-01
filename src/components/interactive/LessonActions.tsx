import { useEffect, useState } from 'react';
import { completeLesson, getSnapshot, toggleBookmark } from '../../lib/progress';

type Props = { lessonId: string; level: string };
export default function LessonActions({ lessonId, level }: Props) {
  const [completed, setCompleted] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    getSnapshot().then(({ lessons, bookmarks }) => {
      setCompleted(lessons.some((item) => item.id === lessonId));
      setBookmarked(bookmarks.some((item) => item.id === lessonId));
    }).catch((e) => setError(e instanceof Error ? e.message : 'Storage is unavailable.'));
  }, [lessonId]);
  const run = async (operation: () => Promise<void>) => {
    setBusy(true); setError('');
    try { await operation(); } catch (e) { setError(e instanceof Error ? e.message : 'Unable to save changes.'); }
    finally { setBusy(false); }
  };
  return <div className="lesson-actions">
    <button className="btn btn-primary" type="button" disabled={busy || completed} onClick={() => run(async () => { await completeLesson(lessonId, level); setCompleted(true); })}>{completed ? '✓ Lesson completed' : '✓ Mark lesson complete'}</button>
    <button className="btn btn-outline" type="button" disabled={busy} aria-pressed={bookmarked} onClick={() => run(async () => { setBookmarked(await toggleBookmark(lessonId)); })}>{bookmarked ? '★ Bookmarked' : '☆ Save lesson'}</button>
    {error && <p role="alert" className="inline-error">{error}</p>}
  </div>;
}
