import { describe,it,expect } from 'vitest';
import bank from '../../src/content/exercises/n5-m01-c01-l05-v1.json';
import { gradeProfileReading } from '../../src/components/interactive/FirstMeetingProfileReading';
describe('N5 first-meeting profile evidence reading',()=>{
 it('has ten unique IDs and answer keys with distinct choices and rationales',()=>{
  expect(bank.lessonId).toBe('n5-m01-c01-l05');
  expect(bank.items).toHaveLength(10);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(10);
  for(const q of bank.items){expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices[q.correctIndex].id).toBe(q.answerKey.choiceId);expect(q.explanation.length).toBeGreaterThan(15);expect(q.choices.every(c=>c.rationale.length>10)).toBe(true);}
 });
 it('scores exact evidence-based choices, never distractors',()=>{
  const correct=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));
  expect(gradeProfileReading(correct)).toBe(10);
  expect(gradeProfileReading({})).toBe(0);
  const wrong=Object.fromEntries(bank.items.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id]));
  expect(gradeProfileReading(wrong)).toBe(0);
 });
});
