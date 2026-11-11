import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/n5-m02-c03-l02-v1.json';
import { questions, QUIZ_ID, scoreExistenceVocabulary } from '../../src/components/interactive/ExistenceVocabularyPractice';
describe('n5-m02-c03-l02 vocabulary',()=>{
 it('has twelve unique keyed items and feedback',()=>{
  expect(QUIZ_ID).toBe('n5-m02-c03-l02-vocabulary-v1');
  expect(bank.items).toHaveLength(12);
  expect(new Set(questions.map(q=>q.id)).size).toBe(12);
  for(const q of questions){
   expect(q.id).toMatch(/^ex-n5-m02-c03-l02-q\d\d-v1$/);
   expect(q.choices).toHaveLength(3);
   expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);
   expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);
   expect(q.choices.every(c=>c.rationale.length>15)).toBe(true);
   expect(q.explanation.length).toBeGreaterThan(15);
  }
 });
 it('scores only exact keyed choices',()=>{
  expect(scoreExistenceVocabulary({})).toBe(0);
  const all=Object.fromEntries(questions.map(q=>[q.id,q.answerKey.choiceId]));
  expect(scoreExistenceVocabulary(all)).toBe(12);
  expect(scoreExistenceVocabulary({...all,[questions[0].id]:'incorrect'})).toBe(11);
 });
});