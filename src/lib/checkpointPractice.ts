import bank from '../content/exercises/l0-m01-c01-chk.json';
import { readingRows } from './readingPractice';
import { listeningTracks } from './listeningPractice';

export type CheckpointChoice = { id: string; text: string; rationale: string };
export type CheckpointQuestion = {
  id: string; version: number; status: 'published'; type: 'single-choice'; level: 'l0';
  objectiveIds: string[]; knowledgeItemIds: string[]; skills: string[];
  source: 'concept' | 'reading' | 'listening'; prompt: string;
  choices: CheckpointChoice[]; answerKey: { choiceId: string };
  explanation: string; evidence: string; rowIds?: string[]; trackId?: string;
};
export const checkpointLessonId = 'l0-m01-c01-chk';
export const checkpointQuizId = 'l0-m01-c01-chk-v2';
export const checkpointQuestions = (bank as unknown as { items: CheckpointQuestion[] }).items;
export function scoreCheckpointQuestions(answers: Record<string,string>) {
  return checkpointQuestions.reduce((n,q) => n + Number(answers[q.id] === q.answerKey.choiceId), 0);
}
export function validateCheckpointQuestions() {
  const ids = new Set<string>();
  const rowIds = new Set(readingRows.map(r => r.id));
  const tracks = new Map(listeningTracks.map(t => [t.assetId,t]));
  if (checkpointQuestions.length !== 16) throw new Error('Chapter checkpoint needs exactly 16 questions.');
  for (const source of ['concept','reading','listening']) {
    const expected = source === 'concept' ? 8 : 4;
    if (checkpointQuestions.filter(q => q.source === source).length !== expected) throw new Error('Wrong checkpoint skill distribution: '+source);
  }
  for (const q of checkpointQuestions) {
    if (ids.has(q.id)) throw new Error('Duplicate checkpoint question '+q.id);
    ids.add(q.id);
    if (!q.id.startsWith('ex-l0-m01-c01-chk-') || q.version !== (q.source==='listening'?2:1) || q.status !== 'published' ||
        q.type !== 'single-choice' || q.level !== 'l0' || !q.prompt.trim() || !q.explanation.trim() ||
        !q.evidence.trim() || !q.objectiveIds.length || !q.knowledgeItemIds.length || !q.skills.length)
      throw new Error('Invalid checkpoint metadata '+q.id);
    const c = q.choices.map(x=>x.id);
    if (c.length !== 3 || new Set(c).size !== 3 || !c.includes(q.answerKey.choiceId) ||
        q.choices.some(x => !x.text.trim() || !x.rationale.trim()) ||
        new Set(q.choices.map(x=>x.text.normalize('NFC').trim())).size !== 3)
      throw new Error('Invalid checkpoint answer options '+q.id);
    if (q.source === 'reading') {
      if (!q.rowIds?.length || q.rowIds.some(id=>!rowIds.has(id))) throw new Error('Missing reading rows '+q.id);
      for (const id of q.rowIds) {
        const row = readingRows.find(r=>r.id===id)!;
        if (!q.evidence.includes('Row '+id) || !q.evidence.includes(row.printed)) throw new Error('Reading evidence does not cite chart '+q.id);
      }
    }
    if (q.source === 'listening') {
      const track = tracks.get(q.trackId ?? '');
      if (!track || !track.transcript.includes(q.evidence)) throw new Error('Listening evidence does not occur in real transcript '+q.id);
    }
  }
  return true;
}
