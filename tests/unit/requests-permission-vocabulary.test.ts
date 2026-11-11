import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/n5-m06-c03-l02-v1.json';
import { gradeRequestsVocabulary } from '../../src/components/interactive/RequestsVocabularyPractice';
describe('n5-m06-c03-l02 vocabulary bank',()=>{
 it('has 12 unique questions, keyed choices and meaningful feedback',()=>{
  expect(bank.items).toHaveLength(12);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(12);
  for(const q of bank.items){
   expect(q.choices).toHaveLength(3);
   expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);
   expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);
   expect(q.choices.every(c=>c.rationale.length>15)).toBe(true);
  }
 });
 it('scores all correct and all wrong without counting unselected',()=>{
  const correct=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));
  const wrong=Object.fromEntries(bank.items.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id]));
  expect(gradeRequestsVocabulary(correct)).toBe(12);
  expect(gradeRequestsVocabulary(wrong)).toBe(0);
  expect(gradeRequestsVocabulary({})).toBe(0);
 });
});