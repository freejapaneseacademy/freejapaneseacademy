import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/n5-m06-c01-l02-v1.json';
import { questions, QUIZ_ID, scoreActionWords } from '../../src/components/interactive/ActionWordPractice';
describe('n5-m06-c01-l02 action vocabulary',()=>{
 it('has unique versioned items and valid answer keys',()=>{
  expect(bank.lessonId).toBe('n5-m06-c01-l02');expect(questions).toHaveLength(12);
  expect(new Set(questions.map(q=>q.id)).size).toBe(12);
  for(const q of questions){expect(q.id).toMatch(/^ex-n5-m06-c01-l02-q\d{2}-v1$/);expect(q.choices.filter(c=>c.id===q.answerKey.choiceId)).toHaveLength(1);expect(new Set(q.choices.map(c=>c.text)).size).toBe(q.choices.length);expect(q.choices.every(c=>c.rationale.length>0)).toBe(true);}
 });
 it('scores all-correct, all-wrong and unanswered independently',()=>{
  expect(QUIZ_ID).toContain('n5-m06-c01-l02');
  expect(scoreActionWords({})).toBe(0);
  expect(scoreActionWords(Object.fromEntries(questions.map(q=>[q.id,q.answerKey.choiceId])))).toBe(12);
  expect(scoreActionWords(Object.fromEntries(questions.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id])))).toBe(0);
 });
});