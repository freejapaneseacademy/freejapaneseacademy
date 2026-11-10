import {describe,it,expect} from 'vitest';
import bank from '../content/exercises/n5-m04-c02-l04-v1.json';
import {questions,scoreShoppingKanji,QUIZ_ID} from '../components/interactive/ShoppingKanjiPractice';
describe('n5-m04-c02-l04 shopping kanji',()=>{
 it('has twelve unique versioned questions with keyed rationales',()=>{
  expect(bank.lessonId).toBe('n5-m04-c02-l04');expect(questions).toHaveLength(12);
  expect(new Set(questions.map(q=>q.id)).size).toBe(12);
  for(const q of questions){expect(q.status).toBe('internally-checked');expect(q.id).toMatch(/^ex-n5-m04-c02-l04-q\d\d-v1$/);expect(q.choices).toHaveLength(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.choices.every(c=>c.rationale.length>10)).toBe(true);}
 });
 it('scores exact keyed choices',()=>{
  expect(QUIZ_ID).toBe('n5-m04-c02-l04-shopping-kanji-v1');
  expect(scoreShoppingKanji(Object.fromEntries(questions.map(q=>[q.id,q.answerKey.choiceId])))).toBe(12);
  expect(scoreShoppingKanji({})).toBe(0);
  expect(scoreShoppingKanji({[questions[0].id]:questions[0].answerKey.choiceId})).toBe(1);
 });
});