import { describe, expect, it } from 'vitest';
import bank from '../src/content/exercises/l0-m03-c02-l06.json';
import manifest from '../src/content/audio/l0-m03-c02-l06-v1.json';

describe('contracted-kana listening lesson', () => {
 it('has two different recorded situations with verified candidate media metadata', () => {
  expect(manifest.assets).toHaveLength(2);
  expect(new Set(manifest.assets.map(a=>a.mediaPath)).size).toBe(2);
  for (const asset of manifest.assets) {
   expect(asset.mediaPath).toMatch(/\.wav$/);
   expect(asset.sampleRateHz).toBe(44100);
   expect(asset.qa.sha256).toMatch(/^[a-f0-9]{64}$/);
   expect(asset.rights.redistributionCleared).toBe(true);
   expect(asset.turns.length).toBeGreaterThanOrEqual(4);
  }
 });
 it('asks six audible questions, three per track, with stable unique IDs and transcript evidence', () => {
  expect(bank.items).toHaveLength(6);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(6);
  for (const asset of manifest.assets) {
   const qs=bank.items.filter(q=>q.trackId===asset.id);
   expect(qs).toHaveLength(3);
   for (const q of qs) {
    expect(asset.transcript).toContain(q.evidence);
    expect(q.choices).toHaveLength(3);
    expect(q.choices.filter(c=>c.id===q.answerKey.choiceId)).toHaveLength(1);
    expect(q.choices.every(c=>c.rationale.length>10)).toBe(true);
   }
  }
 });
});
