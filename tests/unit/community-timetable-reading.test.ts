import { describe, expect, it } from 'vitest';
import { questions, scoreTimetable, QUIZ_ID } from '../../src/components/interactive/TimetableReading';
describe('N5-M03-C01-L05 timetable reading',()=>{
 it('has unique versioned questions and keys',()=>{
  expect(questions).toHaveLength(10);expect(new Set(questions.map(q=>q.id)).size).toBe(10);
  for(const q of questions){expect(q.id).toMatch(/^ex-n5-m03-c01-l05-q\d\d-v1$/);expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.explanation.length).toBeGreaterThan(20);expect(q.choices.every(c=>c.rationale.length>5)).toBe(true);}
 });
 it('scores empty, correct and wrong answers deterministically',()=>{
  expect(scoreTimetable({})).toBe(0);
  expect(scoreTimetable(Object.fromEntries(questions.map(q=>[q.id,q.answerKey.choiceId])))).toBe(10);
  expect(scoreTimetable(Object.fromEntries(questions.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id])))).toBe(0);
  expect(QUIZ_ID).toBe('n5-m03-c01-l05-timetable-v1');
 });
});
