import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/n5-m05-c04-l06-v1.json';
describe('n5-m05-c04-l06 listening evidence', () => {
 it('has two distinct tracks and evidence-backed unique questions',()=>{
  expect(new Set(bank.tracks).size).toBe(2);
  expect(bank.items.length).toBeGreaterThanOrEqual(6);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(bank.items.length);
  for(const q of bank.items){
   expect(bank.tracks).toContain(q.trackId);
   expect(q.choices).toHaveLength(3);
   expect(new Set(q.choices.map(c=>c.id)).size).toBe(3);
   expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);
   expect(q.evidence.length).toBeGreaterThan(5);
   expect(q.explanation.length).toBeGreaterThan(8);
  }
 });
});
