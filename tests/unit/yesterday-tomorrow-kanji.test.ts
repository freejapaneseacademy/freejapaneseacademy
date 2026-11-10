import { describe, it, expect } from 'vitest';
import bank from '../../src/content/exercises/n5-m03-c03-l04-v1.json';
import { gradePlannerKanji } from '../../src/components/interactive/PlannerKanjiPractice';
describe('N5 past/future kanji',()=>{
 it('has unique answer keys, distinct choices and explanatory rationales',()=>{
  expect(bank.lessonId).toBe('n5-m03-c03-l04');
  expect(bank.items).toHaveLength(10);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(10);
  for(const q of bank.items){
   expect(q.choices).toHaveLength(3);
   expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);
   expect(q.choices[q.correctIndex].id).toBe(q.answerKey.choiceId);
   expect(q.choices.every(c=>c.rationale.length>20)).toBe(true);
  }
 });
 it('grades correct, missing and wrong answers',()=>{
  expect(gradePlannerKanji(Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId])))).toBe(10);
  expect(gradePlannerKanji({})).toBe(0);
  expect(gradePlannerKanji(Object.fromEntries(bank.items.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id])))).toBe(0);
 });
});