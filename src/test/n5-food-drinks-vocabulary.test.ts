import {describe,it,expect} from 'vitest';
import bank from '../content/exercises/n5-m04-c01-l02-v1.json';
import {questions,scoreFoodWords,QUIZ_ID} from '../components/interactive/FoodWordsPractice';
describe('n5-m04-c01-l02 vocabulary',()=>{
 it('has twelve unique versioned questions with keyed rationales',()=>{
  expect(bank.lessonId).toBe('n5-m04-c01-l02');expect(questions).toHaveLength(12);
  expect(new Set(questions.map(q=>q.id)).size).toBe(12);
  for(const q of questions){expect(q.status).toBe('internally-checked');expect(q.id).toMatch(/^ex-n5-m04-c01-l02-q\d\d-v1$/);expect(q.choices).toHaveLength(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.choices.every(c=>c.rationale.length>10)).toBe(true);}
 });
 it('scores exact keyed choices and distinct wrong choices',()=>{
  expect(QUIZ_ID).toBe('n5-m04-c01-l02-food-words-v1');
  expect(scoreFoodWords(Object.fromEntries(questions.map(q=>[q.id,q.answerKey.choiceId])))).toBe(12);
  expect(scoreFoodWords({})).toBe(0);
  const one=questions[0];expect(scoreFoodWords({[one.id]:one.answerKey.choiceId})).toBe(1);
 });
});
