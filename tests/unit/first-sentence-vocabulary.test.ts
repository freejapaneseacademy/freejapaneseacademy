import { describe, it, expect } from 'vitest';
import bank from '../../src/content/exercises/l0-m05-c03-l02-v1.json';
import { gradeFirstSentenceVocabulary } from '../../src/components/interactive/FirstSentenceVocabularyPractice';
describe('l0-m05-c03-l02 vocabulary bank',()=>{
 it('has ten unique valid questions with unique choices and keyed answers',()=>{
  expect(bank.items).toHaveLength(10);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(10);
  for(const q of bank.items) {
   expect(q.choices.length).toBeGreaterThanOrEqual(3);
   expect(new Set(q.choices.map(c=>c.id)).size).toBe(q.choices.length);
   expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);
   expect(q.explanation.length).toBeGreaterThan(15);
  }
 });
 it('grades all correct and all wrong',()=>{
  expect(gradeFirstSentenceVocabulary(Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId])))).toBe(10);
  expect(gradeFirstSentenceVocabulary(Object.fromEntries(bank.items.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id])))).toBe(0);
 });
});