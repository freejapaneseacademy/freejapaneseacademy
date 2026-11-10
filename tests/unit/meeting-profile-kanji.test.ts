import { describe,it,expect } from 'vitest';
import bank from '../../src/content/exercises/n5-m01-c01-l04-v1.json';
import { gradeProfileKanji } from '../../src/components/interactive/MeetingProfileKanjiPractice';
describe('N5 meeting profile kanji',()=>{
 it('has unique IDs, three distinct answers and valid stable keys',()=>{
  expect(bank.lessonId).toBe('n5-m01-c01-l04');
  expect(bank.items).toHaveLength(12);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(12);
  for(const q of bank.items){expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices[q.correctIndex].id).toBe(q.answerKey.choiceId);expect(q.explanation.length).toBeGreaterThan(15);expect(q.choices.every(c=>c.rationale.length>10)).toBe(true);}
 });
 it('grades exact keys without accepting distractors',()=>{
  const correct=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));
  expect(gradeProfileKanji(correct)).toBe(12);
  expect(gradeProfileKanji({})).toBe(0);
  const wrong=Object.fromEntries(bank.items.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id]));
  expect(gradeProfileKanji(wrong)).toBe(0);
 });
});