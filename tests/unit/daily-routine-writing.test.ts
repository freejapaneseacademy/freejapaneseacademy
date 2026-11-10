import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/n5-m03-c02-l07-v1.json';
import { gradeRoutineWriting } from '../../src/components/interactive/RoutineWritingWorkshop';
describe('n5-m03-c02-l07 writing recognition bank',()=>{
 it('has eight unique questions, three distinct choices, keyed feedback',()=>{
  expect(bank.items).toHaveLength(8);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(8);
  for(const q of bank.items){expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.choices.every(c=>c.rationale.length>12)).toBe(true);}
 });
 it('grades only correct keyed answers',()=>{
  const correct=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));
  expect(gradeRoutineWriting(correct)).toBe(8);
  expect(gradeRoutineWriting({})).toBe(0);
 });
});