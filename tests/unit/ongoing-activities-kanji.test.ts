import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/n5-m06-c04-l04-v1.json';
import { gradeOngoingKanji } from '../../src/components/interactive/OngoingKanjiPractice';
describe('ongoing activities kanji',()=>{
 it('has eight distinct keyed questions and explanatory evidence',()=>{
  expect(bank.items).toHaveLength(8);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(8);
  for(const q of bank.items){expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.evidence.length).toBeGreaterThan(3);expect(q.choices.every(c=>c.rationale.length>5)).toBe(true);}
 });
 it('grades full, empty, and partial answers',()=>{
  const full=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));
  expect(gradeOngoingKanji(full)).toBe(8);
  expect(gradeOngoingKanji({})).toBe(0);
  expect(gradeOngoingKanji({[bank.items[0].id]:bank.items[0].answerKey.choiceId})).toBe(1);
 });
});