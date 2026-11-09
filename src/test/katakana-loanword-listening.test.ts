import { describe, expect, it } from 'vitest';
import bank from '../content/exercises/l0-m04-c04-l06.json';
import job from '../../scripts/tts/jobs/l0-m04-c04-l06.json';
describe('katakana station announcement listening', () => {
 it('has two distinct original licensed audio candidates', () => {
  expect(job.schemaVersion).toBe(3);
  expect(job.tracks).toHaveLength(2);
  expect(new Set(job.tracks.map(t=>t.id)).size).toBe(2);
  expect(job.licenseReview.redistributionCleared).toBe(true);
 });
 it('has six uniquely keyed, evidenced spoken-comprehension questions', () => {
  expect(bank.items).toHaveLength(6);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(6);
  for (const q of bank.items) {
   expect(q.status).toBe('drafted');
   expect(q.id.startsWith('ex-')).toBe(true);
   expect(q.choices.filter(c=>c.id===q.answerKey.choiceId)).toHaveLength(1);
   expect(q.choices.length).toBeGreaterThanOrEqual(3);
   expect(q.explanation.length).toBeGreaterThan(15);
   expect(q.evidence.length).toBeGreaterThan(4);
   expect(job.tracks.some(t=>q.trackId.endsWith('-'+t.id))).toBe(true);
  }
 });
});
