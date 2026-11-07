import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/l0-m04-c02-l06.json';
import job from '../../scripts/tts/jobs/l0-m04-c02-l06.json';
describe('L0-M04-C02-L06 listening content', () => {
 it('has six unique questions with three per track', () => {
  expect(bank.lessonId).toBe('l0-m04-c02-l06');
  expect(bank.items).toHaveLength(6);
  expect(new Set(bank.items.map(q => q.id)).size).toBe(6);
  expect(bank.items.filter(q => q.trackId.endsWith('-a'))).toHaveLength(3);
  expect(bank.items.filter(q => q.trackId.endsWith('-b'))).toHaveLength(3);
 });
 it('has schema-compliant answer choices and exact audible evidence', () => {
  for (const q of bank.items) {
   expect(q.id.startsWith('ex-')).toBe(true);
   expect(q.version).toBeGreaterThanOrEqual(1);
   expect(q.status).toBe('drafted');
   expect(q.objectiveIds.length).toBeGreaterThan(0);
   expect(q.knowledgeItemIds.length).toBeGreaterThan(0);
   expect(q.skills.length).toBeGreaterThan(0);
   expect(new Set(q.choices.map(c => c.id)).size).toBe(3);
   expect(q.choices.some(c => c.id === q.answerKey.choiceId)).toBe(true);
   const track = job.tracks.find(t => q.trackId.endsWith('-' + t.id));
   expect(track?.turns.some(t => t.text === q.evidence)).toBe(true);
  }
 });
 it('requires two original, licensed, audio-first scenarios', () => {
  expect(job.schemaVersion).toBe(3);
  expect(job.auditoryOnly).toBe(true);
  expect(job.tracks.map(t => t.id)).toEqual(['a','b']);
  expect(job.tracks.every(t => t.turns.length >= 4 && t.comprehensionPrompts.length === 3)).toBe(true);
 });
});
