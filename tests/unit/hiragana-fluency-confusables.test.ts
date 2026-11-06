import { describe,it,expect } from 'vitest';
import bank from '../../src/content/exercises/l0-m02-c04-l03-v1.json';
describe('L03 confusables question evidence',()=>{
 it('has ten unique stable scored keys and grounded rationales',()=>{
  expect(bank.items).toHaveLength(10);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(10);
  for(const q of bank.items){expect(q.options[q.correctIndex]).toBeTruthy();expect(q.answerKey.choiceId).toBe(q.choices[q.correctIndex].id);expect(q.evidence.phrase.length).toBeGreaterThan(1);expect(q.explanation.length).toBeGreaterThan(20);}
 });
});