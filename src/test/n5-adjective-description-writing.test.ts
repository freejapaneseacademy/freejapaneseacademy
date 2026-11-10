import {describe,it,expect} from 'vitest';
import bank from '../content/exercises/n5-m04-c03-l07-v1.json';
import {questions,scoreAdjectiveWriting,QUIZ_ID} from '../components/interactive/AdjectiveWritingPractice';
describe('n5-m04-c03-l07 adjective writing',()=>{
 it('has 12 unique internally checked and answer-keyed questions',()=>{
  expect(bank.lessonId).toBe('n5-m04-c03-l07');
  expect(questions).toHaveLength(12);
  expect(new Set(questions.map(q=>q.id)).size).toBe(12);
  for(const q of questions){
   expect(q.id).toMatch(/^ex-n5-m04-c03-l07-q\d\d-v1$/);
   expect(q.status).toBe('internally-checked');
   expect(q.choices).toHaveLength(3);
   expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);
   expect(q.choices.filter(c=>c.id===q.answerKey.choiceId)).toHaveLength(1);
   expect(q.choices.every(c=>c.rationale.length>10)).toBe(true);
  }
 });
 it('scores only the controlled quiz and uses stable progress identifier',()=>{
  expect(QUIZ_ID).toBe('n5-m04-c03-l07-adjective-writing-v1');
  expect(scoreAdjectiveWriting(Object.fromEntries(questions.map(q=>[q.id,q.answerKey.choiceId])))).toBe(12);
  expect(scoreAdjectiveWriting({})).toBe(0);
  expect(scoreAdjectiveWriting({[questions[0].id]:questions[0].answerKey.choiceId})).toBe(1);
 });
});
