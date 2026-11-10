import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/n5-m03-c01-l04-v1.json';
import { questions, QUIZ_ID, scoreCalendarKanji } from '../../src/components/interactive/CalendarKanjiPractice';
describe('n5-m03-c01-l04 kanji reading',()=>{
 it('has unique keyed questions and useful explanations',()=>{
  expect(QUIZ_ID).toBe('n5-m03-c01-l04-kanji-v1');
  expect(bank.items).toHaveLength(10);
  expect(new Set(questions.map(q=>q.id)).size).toBe(10);
  for(const q of questions){
   expect(q.id).toMatch(/^ex-n5-m03-c01-l04-q\d\d-v1$/);
   expect(q.status).toBe('internally-checked');
   expect(q.choices).toHaveLength(3);
   expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);
   expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);
   expect(q.choices.every(c=>c.rationale.length>8)).toBe(true);
   expect(q.explanation.length).toBeGreaterThan(8);
  }
 });
 it('scores only the selected answer key',()=>{
  expect(scoreCalendarKanji({})).toBe(0);
  const correct=Object.fromEntries(questions.map(q=>[q.id,q.answerKey.choiceId]));
  expect(scoreCalendarKanji(correct)).toBe(10);
  expect(scoreCalendarKanji({...correct,[questions[0].id]:'wrong'})).toBe(9);
 });
});