import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/n5-m07-c03-l06.json';
import job from '../../scripts/tts/jobs/n5-m07-c03-l06.json';
describe('n5-m07-c03-l06 listening integrity', () => {
 it('contains six unique, keyed questions with dialogue-supported evidence', () => {
  expect(bank.items).toHaveLength(6);
  expect(new Set(bank.items.map(q => q.id)).size).toBe(6);
  for (const q of bank.items) {
   expect(q.choices).toHaveLength(3);
   expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);
   expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);
   const track=job.tracks.find(t=>q.trackId.endsWith('-'+t.id));
   expect(track?.turns.some(turn=>turn.text.includes(q.evidence))).toBe(true);
  }
 });
 it('requires licensed pinned synthetic models and two different scripts', () => {
  expect(job.schemaVersion).toBe(3);
  expect(job.candidateOnly).toBe(true);
  expect(job.auditoryOnly).toBe(true);
  expect(job.tracks.map(t=>t.id)).toEqual(['a','b']);
  expect(job.tracks[0].turns.map(t=>t.text).join('')).not.toEqual(job.tracks[1].turns.map(t=>t.text).join(''));
  expect(job.voices.male.sha256).toMatch(/^[a-f0-9]{64}$/);
  expect(job.voices.female.sha256).toMatch(/^[a-f0-9]{64}$/);
 });
});
