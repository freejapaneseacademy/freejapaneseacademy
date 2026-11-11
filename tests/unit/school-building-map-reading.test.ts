import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/n5-m02-c02-l05-v1.json';
import { QUIZ_ID, questions, scoreBuildingMap } from '../../src/components/interactive/BuildingMapReading';
describe('n5-m02-c02-l05 reading bank',()=>{
 it('uses ten distinct stable IDs and valid single-choice answer keys',()=>{
  expect(bank.lessonId).toBe('n5-m02-c02-l05');expect(questions).toHaveLength(10);
  expect(new Set(questions.map(q=>q.id)).size).toBe(10);
  for(const q of questions){expect(q.id).toMatch(/^ex-n5-m02-c02-l05-q\d\d-v1$/);expect(q.status).toBe('internally-checked');expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.choices.every(c=>c.rationale.length>0)).toBe(true);expect(q.explanation).toMatch(/Evidence:/);}
 });
 it('scores exact keys, no guessed credit',()=>{
  const correct=Object.fromEntries(questions.map(q=>[q.id,q.answerKey.choiceId]));
  expect(scoreBuildingMap(correct)).toBe(10);expect(scoreBuildingMap({})).toBe(0);
  const wrong=Object.fromEntries(questions.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id]));
  expect(scoreBuildingMap(wrong)).toBe(0);expect(QUIZ_ID).toContain('n5-m02-c02-l05');
 });
});
