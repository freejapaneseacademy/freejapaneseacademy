import { describe, expect, it } from 'vitest';
import written from '../src/content/exercises/l0-m02-c01-chk-written-v1.json';
import listening from '../src/content/exercises/l0-m02-c01-chk-listening-v1.json';
import audio from '../src/content/audio/l0-m02-c01-l06-v1.json';
describe('Hiragana Chapter 01 checkpoint integrity',()=>{
 it('has twelve uniquely keyed written and reading items',()=>{
  expect(written.items).toHaveLength(12);
  expect(new Set(written.items.map(q=>q.id)).size).toBe(12);
  for(const q of written.items){expect(q.options).toHaveLength(3);expect(q.choices[q.correctIndex].id).toBe(q.answerKey.choiceId);expect(q.feedback.length).toBeGreaterThan(20);expect(q.evidence.phrase.length).toBeGreaterThan(0);}
 });
 it('has four spoken meaning questions supported by licensed source turns',()=>{
  expect(listening.items).toHaveLength(4);expect(new Set(listening.items.map(q=>q.id)).size).toBe(4);
  expect(new Set(listening.items.map(q=>q.stimulusId)).size).toBe(2);
  for(const q of listening.items){const a=audio.assets.find(x=>x.id===q.stimulusId);expect(a?.rights.redistributionCleared).toBe(true);expect(a?.qa.sha256).toMatch(/^[a-f0-9]{64}$/);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.evidence.turn).toMatch(/s$/);expect(q.transcriptPolicy).toContain('assisted');}
 });
});