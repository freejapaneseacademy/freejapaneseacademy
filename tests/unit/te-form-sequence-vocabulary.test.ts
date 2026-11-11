import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/n5-m06-c02-l02-v1.json';
import { gradeSequenceWords } from '../../src/components/interactive/SequenceWordsPractice';
describe('n5-m06-c02-l02 vocabulary bank',()=>{
 it('contains 12 unique questions with three distinct choices and feedback',()=>{
  expect(bank.items).toHaveLength(12);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(12);
  for(const q of bank.items){
   expect(q.choices).toHaveLength(3);
   expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);
   expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);
   expect(q.choices.every(c=>c.rationale.length>10)).toBe(true);
  }
 });
 it('scores fully correct and fully incorrect attempts',()=>{
  const correct=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));
  const wrong=Object.fromEntries(bank.items.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id]));
  expect(gradeSequenceWords(correct)).toBe(12);
  expect(gradeSequenceWords(wrong)).toBe(0);
 });
});
