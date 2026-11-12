import { describe,expect,it } from 'vitest';
import bank from '../../src/content/exercises/n5-m02-c04-l05-v1.json';
import { QUIZ_ID,questions,scoreRoomDescription } from '../../src/components/interactive/RoomDescriptionReading';
describe('n5-m02-c04-l05 reading bank',()=>{
 it('has unique IDs, valid choices and feedback',()=>{
  expect(bank.lessonId).toBe('n5-m02-c04-l05');expect(questions).toHaveLength(10);
  expect(new Set(questions.map(q=>q.id)).size).toBe(10);
  for(const q of questions){expect(q.id).toMatch(/^ex-n5-m02-c04-l05-q\d\d-v1$/);expect(q.status).toBe('internally-checked');expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.choices.every(c=>c.rationale.length>0)).toBe(true);expect(q.explanation).toMatch(/Evidence:/);}
 });
 it('scores only exact keyed choices',()=>{
  expect(scoreRoomDescription(Object.fromEntries(questions.map(q=>[q.id,q.answerKey.choiceId])))).toBe(10);
  expect(scoreRoomDescription({})).toBe(0);
  expect(scoreRoomDescription(Object.fromEntries(questions.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id])))).toBe(0);
  expect(QUIZ_ID).toContain('n5-m02-c04-l05');
 });
});