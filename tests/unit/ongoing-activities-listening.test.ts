import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/n5-m06-c04-l06.json';
import job from '../../scripts/tts/jobs/n5-m06-c04-l06.json';
describe('n5-m06-c04-l06 listening contract', () => {
 it('has two distinct audible scenes and three questions each', () => {
  expect(job.schemaVersion).toBe(3);
  expect(job.tracks.map(t=>t.id)).toEqual(['a','b']);
  expect(new Set(job.tracks.map(t=>t.title)).size).toBe(2);
  expect(bank.items).toHaveLength(6);
  for(const t of job.tracks) expect(bank.items.filter(q=>q.trackId==='audio-n5-m06-c04-l06-'+t.id)).toHaveLength(3);
 });
 it('keys every answer and grounds each in a spoken turn', () => {
  const spoken=job.tracks.flatMap(t=>t.turns.map(s=>s.text));
  for(const q of bank.items) {
   expect(new Set(q.choices.map(c=>c.id)).size).toBe(3);
   expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);
   expect(spoken.some(s=>s.includes(q.evidence))).toBe(true);
  }
 });
});
