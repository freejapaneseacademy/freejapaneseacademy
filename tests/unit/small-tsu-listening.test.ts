import { describe, it, expect } from 'vitest';
import bank from '../../src/content/exercises/l0-m03-c03-l06.json';
import audio from '../../src/content/audio/l0-m03-c03-l06-v1.json';
describe('small tsu listening', () => {
 it('provides six stable scored questions with evidence in the correct recording', () => {
  expect(bank.items).toHaveLength(6);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(6);
  for(const q of bank.items){
   const track=audio.assets.find(a=>a.id===q.trackId);
   expect(track).toBeDefined();
   expect(track!.transcript).toContain(q.evidence);
   expect(q.choices.filter(c=>c.id===q.answerKey.choiceId)).toHaveLength(1);
   expect(q.explanation.length).toBeGreaterThan(12);
  }
 });
 it('uses distinct real rights-cleared recordings and honest review flags',()=>{
  expect(audio.assets).toHaveLength(2);
  for(const a of audio.assets){
   expect(a.mediaPath).toMatch(/\.wav$/);
   expect(a.qa.sha256).toMatch(/^[a-f0-9]{64}$/);
   expect(a.qa.nativePronunciationReviewed).toBe(false);
   expect(a.rights.redistributionCleared).toBe(true);
  }
 });
});
