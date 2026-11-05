import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/l0-m02-c03-l02-v1.json';
describe('M/Y/R/W vocabulary written bank',()=>{
 it('has ten unique scored IDs and consistent answer keys',()=>{
  expect(bank.items).toHaveLength(10);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(10);
  for(const q of bank.items){
   expect(q.options[q.correctIndex]).toBe(q.choices[q.correctIndex].text);
   expect(q.answerKey.choiceId).toBe(q.choices[q.correctIndex].id);
   expect(q.explanation.length).toBeGreaterThan(15);
   expect(q.evidence.phrase.length).toBeGreaterThan(1);
  }
 });
});
