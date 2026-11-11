import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/n5-m06-c02-l06-v1.json';
import job from '../../scripts/tts/jobs/n5-m06-c02-l06.json';

describe('n5-m06-c02-l06 listening content and assessment', () => {
 it('contains two distinct audio-only scenes with four questions each', () => {
  expect(job.schemaVersion).toBe(3);
  expect(job.candidateOnly).toBe(true);
  expect(job.auditoryOnly).toBe(true);
  expect(job.tracks.map(t => t.id)).toEqual(['a', 'b']);
  expect(job.tracks[0].title).not.toBe(job.tracks[1].title);
  expect(job.tracks.every(t => t.comprehensionPrompts.length === 4)).toBe(true);
  expect(bank.items).toHaveLength(8);
  expect(new Set(bank.items.map(q => q.id)).size).toBe(8);
  expect(bank.tracks).toEqual(['audio-n5-m06-c02-l06-a','audio-n5-m06-c02-l06-b']);
 });
 it('provides one unambiguous key and exact spoken evidence per question', () => {
  for (const q of bank.items) {
   expect(q.choices).toHaveLength(3);
   expect(new Set(q.choices.map(c => c.text)).size).toBe(3);
   expect(q.choices.filter(c => c.id === q.answerKey.choiceId)).toHaveLength(1);
   const track = job.tracks[q.trackId.endsWith('-a') ? 0 : 1];
   expect(track.turns.some(turn => turn.text.includes(q.evidence))).toBe(true);
   expect(q.choices.every(c => c.rationale.length > 15)).toBe(true);
   expect(q.explanation.length).toBeGreaterThan(20);
  }
 });
});
