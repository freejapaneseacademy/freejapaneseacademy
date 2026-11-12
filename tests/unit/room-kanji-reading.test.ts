import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/n5-m02-c04-l04-v1.json';
import { questions, QUIZ_ID, scoreRoomKanji } from '../../src/components/interactive/RoomKanjiPractice';
describe('n5-m02-c04-l04 kanji reading',()=>{
 it('has eight stable, unambiguous items',()=>{
  expect(QUIZ_ID).toBe('n5-m02-c04-l04-kanji-v1');
  expect(bank.items).toHaveLength(8);
  expect(new Set(questions.map(q=>q.id)).size).toBe(8);
  for(const q of questions){expect(q.id).toMatch(/^ex-n5-m02-c04-l04-q\d\d-v1$/);expect(q.status).toBe('internally-checked');expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.filter(c=>c.id===q.answerKey.choiceId)).toHaveLength(1);expect(q.choices.every(c=>c.rationale.length>12)).toBe(true);}
 });
 it('scores exact keyed answers only',()=>{
  expect(scoreRoomKanji({})).toBe(0);
  const correct=Object.fromEntries(questions.map(q=>[q.id,q.answerKey.choiceId]));
  expect(scoreRoomKanji(correct)).toBe(8);
  expect(scoreRoomKanji({...correct,[questions[0].id]:'wrong'})).toBe(7);
 });
});
