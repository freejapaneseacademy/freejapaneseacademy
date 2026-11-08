import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/l0-m04-c01-l06.json';
import job from '../../scripts/tts/jobs/l0-m04-c01-l06.json';

describe('L0-M04-C01-L06 listening bank', () => {
 it('has six unique scored questions across both audio tracks', () => {
  expect(bank.lessonId).toBe('l0-m04-c01-l06');
  expect(bank.items).toHaveLength(6);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(6);
  expect(new Set(bank.items.map(q=>q.trackId))).toEqual(new Set(['audio-l0-m04-c01-l06-a','audio-l0-m04-c01-l06-b']));
 });
 it('answers every question with literal transcript evidence and valid schema choices', () => {
  const speech=job.tracks.flatMap(t=>t.turns.map(turn=>turn.text));
  for (const item of bank.items) {
   expect(item.status).toBe('drafted');
   expect(item.id.startsWith('ex-')).toBe(true);
   expect(item.objectiveIds.length).toBeGreaterThan(0);
   expect(item.knowledgeItemIds.length).toBeGreaterThan(0);
   expect(item.skills.length).toBeGreaterThan(0);
   expect(item.choices).toHaveLength(3);
   expect(new Set(item.choices.map(c=>c.id)).size).toBe(3);
   expect(item.choices.some(c=>c.id===item.answerKey.choiceId)).toBe(true);
   expect(speech).toContain(item.evidence);
  }
 });
 it('uses exactly two original audio-first scenarios', () => {
  expect(job.schemaVersion).toBe(3);
  expect(job.auditoryOnly).toBe(true);
  expect(job.tracks).toHaveLength(2);
  expect(job.tracks.map(t=>t.id)).toEqual(['a','b']);
  expect(job.tracks.every(t=>t.turns.length>=4 && t.comprehensionPrompts.length===3)).toBe(true);
 });
});
