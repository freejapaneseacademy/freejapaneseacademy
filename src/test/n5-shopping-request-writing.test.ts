import {describe,it,expect} from 'vitest';
import bank from '../content/exercises/n5-m04-c02-l07-v1.json';
import {questions,scoreShoppingWriting,QUIZ_ID} from '../components/interactive/ShoppingWritingPractice';
describe('n5-m04-c02-l07 writing frames',()=>{
 it('has ten unique, schema-compatible internally screened items',()=>{
  expect(bank.lessonId).toBe('n5-m04-c02-l07');expect(questions).toHaveLength(10);
  expect(new Set(questions.map(q=>q.id)).size).toBe(10);
  for(const q of questions){expect(q.status).toBe('internally-checked');expect(q.id).toMatch(/^ex-n5-m04-c02-l07-q\d\d-v1$/);expect(q.choices).toHaveLength(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.choices.every(c=>c.rationale.length>20)).toBe(true);}
 });
 it('scores exact keys and does not grade free writing',()=>{
  expect(QUIZ_ID).toBe('n5-m04-c02-l07-writing-frames-v1');
  expect(scoreShoppingWriting(Object.fromEntries(questions.map(q=>[q.id,q.answerKey.choiceId])))).toBe(10);
  expect(scoreShoppingWriting({})).toBe(0);
  expect(scoreShoppingWriting({[questions[0].id]:questions[0].answerKey.choiceId})).toBe(1);
 });
});
