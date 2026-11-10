import { useEffect, useState } from 'react';
import { getSnapshot } from '../../lib/progress';
export default function LevelProgress({ level, total }: { level: string; total: number }) {
  const [completed, setCompleted] = useState(0);
  useEffect(() => { const update = () => getSnapshot().then(({ lessons }) => setCompleted(lessons.filter((x) => x.level === level).length)).catch(() => undefined); update(); window.addEventListener('fja-progress-changed', update); return () => window.removeEventListener('fja-progress-changed', update); }, [level]);
  return <div className="level-progress"><div className="progress-label"><span>Your progress</span><span>{completed} / {total} available lessons</span></div><div className="progress-track" role="progressbar" aria-label={`${level.toUpperCase()} lesson completion`} aria-valuemin={0} aria-valuemax={Math.max(1, total)} aria-valuenow={Math.min(completed, total)}><div style={{ width: `${total ? Math.min(100, completed / total * 100) : 0}%` }} /></div></div>;
}
