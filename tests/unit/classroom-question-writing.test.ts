import { describe,it,expect } from 'vitest';
import bank from '../../src/content/exercises/n5-m01-c02-l07-v1.json';
import { gradeClassroomWriting } from '../../src/components/interactive/ClassroomQuestionWriting';
describe('N5 classroom question writing',()=>{
 it('has unique stable IDs and matching answer keys',()=>{
  expect(bank.lessonId).toBe('n5-m01-c02-l07');expect(bank.items).toHaveLength(10);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(10);
  for(const q of bank.items){expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices[q.correctIndex].id).toBe(q.answerKey.choiceId);expect(q.explanation.length).toBeGreaterThan(15);expect(q.choices.every(c=>c.rationale.length>10)).toBe(true);}
 });
 it('scores recognition only, never free writing',()=>{
  expect(gradeClassroomWriting(Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId])))).toBe(10);
  expect(gradeClassroomWriting({})).toBe(0);
  expect(gradeClassroomWriting(Object.fromEntries(bank.items.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id])))).toBe(0);
 });
});