import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/l0-m05-c02-l02-v1.json';
import { gradeNumbersVocabulary } from '../../src/components/interactive/NumbersPersonalDetailsVocabularyPractice';
describe('l0-m05-c02-l02 written vocabulary',()=>{
 it('has twelve unique schema-aligned questions with valid keys and rationales',()=>{
  expect(bank.items).toHaveLength(12);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(12);
  for(const q of bank.items){expect(q.id).toMatch(/^ex-/);expect(q.status).toBe('drafted');expect(q.choices).toHaveLength(3);expect(q.choices.find(c=>c.id===q.answerKey.choiceId)).toBeTruthy();expect(q.choices.every(c=>c.rationale.length>0)).toBe(true);}
 });
 it('scores a correct and a wrong answer without leaking another question',()=>{
  const answers=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));
  expect(gradeNumbersVocabulary(answers)).toBe(12);
  answers[bank.items[0].id]=bank.items[0].choices.find(c=>c.id!==bank.items[0].answerKey.choiceId)!.id;
  expect(gradeNumbersVocabulary(answers)).toBe(11);
 });
});
