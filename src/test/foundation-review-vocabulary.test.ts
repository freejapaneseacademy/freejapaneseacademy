import { describe, it, expect } from 'vitest';
import bank from '../content/exercises/l0-m05-c04-l02-v1.json';
describe('l0-m05-c04-l02 foundation review bank', () => {
 it('has twelve unique, valid single-choice questions with rationales', () => {
  expect(bank.items).toHaveLength(12);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(12);
  for(const q of bank.items){
   expect(q.type).toBe('single-choice');
   expect(q.choices).toHaveLength(3);
   expect(q.choices.filter(c=>c.id===q.answerKey.choiceId)).toHaveLength(1);
   expect(q.choices.every(c=>c.rationale.length>12)).toBe(true);
   expect(q.explanation.length).toBeGreaterThan(20);
  }
 });
 it('covers both greetings and study habits',()=>{
  expect(bank.items.some(q=>q.prompt.includes('morning'))).toBe(true);
  expect(bank.items.some(q=>q.prompt.includes('review action'))).toBe(true);
 });
});
