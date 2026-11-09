import {describe,it,expect} from 'vitest';
import bank from '../../src/content/exercises/l0-m04-c04-l08-v1.json';
import {scoreLoanwordShadow} from '../../src/components/interactive/KatakanaLoanwordShadowing';
describe('l0-m04-c04-l08 original speaking knowledge bank',()=>{
 it('has six unique versioned schema-aligned questions with matching keys',()=>{
  expect(bank.items).toHaveLength(6);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(6);
  for(const q of bank.items){expect(q.id).toMatch(/^ex-/);expect(q.version).toBe(1);expect(q.status).toBe('drafted');expect(q.choices[q.correctIndex].id).toBe(q.answerKey.choiceId);expect(q.options.length).toBe(3);expect(new Set(q.options).size).toBe(3);expect(q.explanation.length).toBeGreaterThan(15);}
 });
 it('scores the correct answer key and all incorrect answers',()=>{
  expect(scoreLoanwordShadow(Object.fromEntries(bank.items.map(q=>[q.id,q.correctIndex])))).toBe(6);
  expect(scoreLoanwordShadow(Object.fromEntries(bank.items.map(q=>[q.id,(q.correctIndex+1)%3])))).toBe(0);
 });
});
