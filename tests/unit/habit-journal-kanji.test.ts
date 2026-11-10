import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/n5-m03-c04-l04-v1.json';
import { gradeHabitJournalKanji } from '../../src/components/interactive/HabitJournalKanjiPractice';
describe('n5-m03-c04-l04 answer integrity',()=>{
 it('has ten uniquely keyed items with rationales',()=>{
  expect(bank.items).toHaveLength(10);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(10);
  for(const q of bank.items){
   expect(q.choices).toHaveLength(3);
   expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);
   expect(q.choices[q.correctIndex].id).toBe(q.answerKey.choiceId);
   expect(q.choices.every(c=>c.rationale.length>15)).toBe(true);
  }
 });
 it('grades exact answer keys',()=>{
  const correct=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));
  expect(gradeHabitJournalKanji(correct)).toBe(10);
  expect(gradeHabitJournalKanji({})).toBe(0);
 });
});