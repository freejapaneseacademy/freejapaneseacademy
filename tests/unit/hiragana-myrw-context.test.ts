import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/l0-m02-c03-l01-v1.json';
describe('M/Y/R/W context written bank',()=>{
 it('has eight unique scored IDs and consistent answer keys',()=>{
  expect(bank.items).toHaveLength(8);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(8);
  for(const q of bank.items){
   expect(q.options[q.correctIndex]).toBe(q.choices[q.correctIndex].text);
   expect(q.answerKey.choiceId).toBe(q.choices[q.correctIndex].id);
   expect(q.explanation.length).toBeGreaterThan(15);
   expect(q.evidence.phrase.length).toBeGreaterThan(1);
  }
 });
});
