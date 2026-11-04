import { describe, expect, it } from 'vitest';
import bank from '../src/content/exercises/l0-m01-c04-l08.json';
import audio from '../src/content/audio/l0-m01-c04-l06-v1.json';
describe('Chapter 04 L08 optional speaking', () => {
 it('has five unique stable classroom knowledge items with rationales', () => {
  expect(bank.items).toHaveLength(5);
  expect(new Set(bank.items.map(q => q.id)).size).toBe(5);
  for (const q of bank.items) { expect(q.explanation.length).toBeGreaterThan(20); expect(q.choices).toHaveLength(3); expect(q.choices.find(c => c.id === q.answerKey.choiceId)?.rationale).toBeTruthy(); }
 });
 it('reuses exactly two rights-cleared recorded classroom tracks', () => {
  expect(audio.assets).toHaveLength(2);
  for (const track of audio.assets) { expect(bank.modelAssetIds).toContain(track.id); expect(track.rights.redistributionCleared).toBe(true); expect(track.qa.sha256).toMatch(/^[0-9a-f]{64}$/); expect(track.turns.length).toBeGreaterThan(2); }
 });
});
