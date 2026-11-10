import { describe, it, expect } from 'vitest';
import bank from '../../src/content/exercises/l0-m05-c04-l06.json';
import job from '../../scripts/tts/jobs/l0-m05-c04-l06.json';
describe('foundation listening review', () => {
 it('uses two independent authentic-audio jobs', () => {
  expect(job.schemaVersion).toBe(3);
  expect(job.tracks.map(t=>t.id)).toEqual(['a','b']);
  expect(job.tracks[0].turns).not.toEqual(job.tracks[1].turns);
 });
 it('provides six unique evidence-backed answers with varied key positions', () => {
  expect(bank.items).toHaveLength(6);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(6);
  expect(new Set(bank.items.map(q=>q.answerKey.choiceId.split('-').at(-1))).size).toBe(3);
  for (const q of bank.items) {
   const scene=job.tracks.find(t=>q.trackId==='audio-l0-m05-c04-l06-'+t.id);
   expect(scene).toBeDefined();
   expect(scene!.turns.some(t=>t.text.includes(q.evidence))).toBe(true);
   expect(q.choices.filter(c=>c.id===q.answerKey.choiceId)).toHaveLength(1);
   expect(q.choices.every(c=>c.rationale.length>10)).toBe(true);
  }
 });
});
