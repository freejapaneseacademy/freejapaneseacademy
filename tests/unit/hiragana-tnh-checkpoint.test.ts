import { describe, expect, it } from 'vitest';
import written from '../../src/content/exercises/l0-m02-c02-chk-written-v1.json';
import listening from '../../src/content/exercises/l0-m02-c02-chk-listening-v1.json';
import audio from '../../src/content/audio/l0-m02-c02-l06-v1.json';
describe('T/N/H checkpoint', () => {
 it('has twelve valid uniquely identified written answers', () => {
  expect(written.items).toHaveLength(12);
  expect(new Set(written.items.map(q=>q.id)).size).toBe(12);
  for(const q of written.items) { expect(q.options[q.correctIndex]).toBeTruthy();expect(q.choices[q.correctIndex].id).toBe(q.answerKey.choiceId); }
 });
 it('has four evidence-linked spoken questions across two licensed tracks', () => {
  expect(listening.items).toHaveLength(4);
  expect(new Set(listening.items.map(q=>q.id)).size).toBe(4);
  for(const q of listening.items) {expect(audio.assets.some(a=>a.id===q.stimulusId)).toBe(true);expect(q.choices.filter(c=>c.id===q.answerKey.choiceId)).toHaveLength(1);}
  for(const a of audio.assets) {expect(a.rights.redistributionCleared).toBe(true);expect(a.qa.sha256).toMatch(/^[a-f0-9]{64}$/);}
 });
});