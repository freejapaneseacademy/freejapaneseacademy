import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/n5-m07-c03-l04-v1.json';
import { gradeChoiceKanji } from '../../src/components/interactive/ChoiceBoardKanjiPractice';
describe('choice-board kanji',()=>{
 it('has eight uniquely keyed questions with distinct choices and feedback',()=>{
  expect(bank.items).toHaveLength(8);expect(new Set(bank.items.map(q=>q.id)).size).toBe(8);
  for(const q of bank.items){expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.explanation.length).toBeGreaterThan(25);expect(q.choices.every(c=>c.rationale.length>12)).toBe(true);}
 });
 it('grades complete, empty, partial and incorrect attempts',()=>{
  expect(gradeChoiceKanji(Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId])))).toBe(8);
  expect(gradeChoiceKanji({})).toBe(0);
  expect(gradeChoiceKanji({[bank.items[0].id]:bank.items[0].answerKey.choiceId})).toBe(1);
  expect(gradeChoiceKanji({[bank.items[0].id]:bank.items[0].choices.find(c=>c.id!==bank.items[0].answerKey.choiceId)!.id})).toBe(0);
 });
});