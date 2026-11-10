import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/n5-m01-c03-l02-v1.json';
import { gradeFamilyWords } from '../../src/components/interactive/FamilyWordsPractice';
describe('N5 family vocabulary',()=>{
 it('has ten unique answerable questions and explanations',()=>{
  expect(bank.items).toHaveLength(10);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(10);
  for(const q of bank.items){expect(q.choices).toHaveLength(3);expect(q.choices[q.correctIndex].id).toBe(q.answerKey.choiceId);expect(q.choices.every(c=>Boolean(c.rationale))).toBe(true);expect(q.explanation.length).toBeGreaterThan(10);}
 });
 it('grades complete and partial selections',()=>{
  const correct=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));
  expect(gradeFamilyWords(correct)).toBe(10);
  expect(gradeFamilyWords({})).toBe(0);
  expect(gradeFamilyWords({...correct,[bank.items[0].id]:'b'})).toBe(9);
 });
});
