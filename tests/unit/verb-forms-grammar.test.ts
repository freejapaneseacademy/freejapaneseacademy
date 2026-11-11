import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/n5-m06-c01-l03-v1.json';
import { gradeVerbForms } from '../../src/components/interactive/VerbFormsPractice';
describe('n5-m06-c01-l03 grammar bank',()=>{
 it('contains twelve uniquely keyed questions with three distinct options',()=>{
  expect(bank.items).toHaveLength(12);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(12);
  for(const q of bank.items){
   expect(q.choices).toHaveLength(3);
   expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);
   expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);
   expect(q.choices.every(c=>c.rationale.length>10)).toBe(true);
  }
 });
 it('scores correct and incorrect attempts',()=>{
  const right=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));
  const wrong=Object.fromEntries(bank.items.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id]));
  expect(gradeVerbForms(right)).toBe(12);
  expect(gradeVerbForms(wrong)).toBe(0);
 });
});