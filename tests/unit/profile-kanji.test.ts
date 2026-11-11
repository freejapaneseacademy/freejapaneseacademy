import { describe,it,expect } from 'vitest';
import bank from '../../src/content/exercises/n5-m01-c04-l04-v1.json';
import { gradeProfileKanji } from '../../src/components/interactive/ProfileKanjiPractice';
describe('N5 personal profile kanji',()=>{
 it('has ten unique keyed questions and explanatory choices',()=>{
  expect(bank.lessonId).toBe('n5-m01-c04-l04');
  expect(bank.items).toHaveLength(10);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(10);
  for (const q of bank.items) {
   expect(q.choices).toHaveLength(3);
   expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);
   expect(q.options).toEqual(q.choices.map(c=>c.text));
   expect(q.choices[q.correctIndex].id).toBe(q.answerKey.choiceId);
   expect(q.choices.every(c=>c.rationale.length>15)).toBe(true);
  }
 });
 it('scores only keyed answers',()=>{
  expect(gradeProfileKanji(Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId])))).toBe(10);
  expect(gradeProfileKanji({})).toBe(0);
  expect(gradeProfileKanji(Object.fromEntries(bank.items.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id])))).toBe(0);
 });
});