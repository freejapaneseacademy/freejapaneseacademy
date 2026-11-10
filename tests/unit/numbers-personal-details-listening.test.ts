import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/l0-m05-c02-l06.json';
import job from '../../scripts/tts/jobs/l0-m05-c02-l06.json';
describe('numbers and personal details listening', () => {
 it('has two distinct original audio scenes', () => {
  expect(job.schemaVersion).toBe(3);
  expect(job.tracks.map(t => t.id)).toEqual(['a','b']);
  expect(job.tracks[0].turns).not.toEqual(job.tracks[1].turns);
 });
 it('has six unique evidence-backed listening questions', () => {
  expect(bank.items).toHaveLength(6);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(6);
  for (const q of bank.items) {
   expect(q.skills).toContain('listening');
   expect(q.choices).toHaveLength(3);
   expect(q.choices.filter(c=>c.id===q.answerKey.choiceId)).toHaveLength(1);
   const scene=job.tracks.find(t=>q.trackId.endsWith('-'+t.id));
   expect(scene).toBeDefined();
   expect(scene!.turns.some(t=>q.evidence.split('／').some(e=>t.text.includes(e.trim())))).toBe(true);
  }
 });
});
