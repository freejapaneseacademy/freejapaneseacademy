import {describe,expect,it} from 'vitest';
import bank from '../../src/content/exercises/n5-m05-c03-l04-v1.json';
import {QUIZ_ID,questions,scoreDirectionsKanji} from '../../src/components/interactive/DirectionsKanjiPractice';
describe('n5-m05-c03-l04 navigation kanji',()=>{
 it('has twelve unique complete items',()=>{
  expect(QUIZ_ID).toBe('n5-m05-c03-l04-kanji-v1');
  expect(bank.lessonId).toBe('n5-m05-c03-l04');
  expect(questions).toHaveLength(12);
  expect(new Set(questions.map(q=>q.id)).size).toBe(12);
  for(const q of questions){
   expect(q.id).toMatch(/^ex-n5-m05-c03-l04-q\d\d-v1$/);
   expect(q.choices).toHaveLength(3);
   expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);
   expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);
   expect(q.choices.every(c=>c.rationale.length>10)).toBe(true);
   expect(q.explanation.length).toBeGreaterThan(10);
  }
 });
 it('scores answer references',()=>{
  expect(scoreDirectionsKanji({})).toBe(0);
  const correct=Object.fromEntries(questions.map(q=>[q.id,q.answerKey.choiceId]));
  expect(scoreDirectionsKanji(correct)).toBe(12);
  expect(scoreDirectionsKanji({...correct,[questions[0].id]:'unknown'})).toBe(11);
 });
});