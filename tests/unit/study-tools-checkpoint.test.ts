import { describe, it, expect } from 'vitest';
import written from '../../src/content/exercises/l0-m01-c04-chk-written-v1.json';
import listening from '../../src/content/exercises/l0-m01-c04-chk-listening-v1.json';
import audio from '../../src/content/audio/l0-m01-c04-l06-v1.json';
describe('Chapter 04 checkpoint integrity', () => {
 it('has twelve original written questions with unique stable keys and answer feedback', () => {
  expect(written.items).toHaveLength(12);
  expect(new Set(written.items.map(q => q.id)).size).toBe(12);
  for (const q of written.items) {
   expect(q.options).toHaveLength(3);
   expect(q.options[q.correctIndex]).toBeTruthy();
   expect(q.answerKey.choiceId).toBe(q.choices[q.correctIndex].id);
   expect(q.evidence.phrase.length).toBeGreaterThan(1);
   expect(q.explanation.length).toBeGreaterThan(15);
  }
 });
 it('has four independent audible-meaning questions grounded in both licensed WAV assets', () => {
  expect(listening.items).toHaveLength(4);
  expect(new Set(listening.items.map(q => q.id)).size).toBe(4);
  expect(new Set(listening.items.map(q => q.stimulusId)).size).toBe(2);
  for (const q of listening.items) {
   const track = audio.assets.find(a => a.id === q.stimulusId);
   expect(track?.rights.redistributionCleared).toBe(true);
   expect(track?.qa.sha256).toMatch(/^[0-9a-f]{64}$/);
   expect(q.choices.some(c => c.id === q.answerKey.choiceId)).toBe(true);
   expect(q.evidence.turn).toMatch(/s$/);
  }
 });
});
