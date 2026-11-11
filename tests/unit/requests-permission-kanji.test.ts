import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/n5-m06-c03-l04-v1.json';
import { gradeRequestsKanji } from '../../src/components/interactive/RequestsKanjiPractice';
describe('requests and permission kanji',()=>{
 it('has eight unique keyed questions with distinct answers and evidence',()=>{
  expect(bank.items).toHaveLength(8);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(8);
  for(const q of bank.items){expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.evidence.length).toBeGreaterThan(4);expect(q.choices.every(c=>c.rationale.length>5)).toBe(true);}
 });
 it('grades correct, empty, and partial submissions',()=>{
  const full=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));
  expect(gradeRequestsKanji(full)).toBe(8);
  expect(gradeRequestsKanji({})).toBe(0);
  expect(gradeRequestsKanji({[bank.items[0].id]:bank.items[0].answerKey.choiceId})).toBe(1);
 });
});
