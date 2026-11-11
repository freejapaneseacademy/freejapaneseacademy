import {describe,it,expect} from 'vitest';
import bank from '../../src/content/exercises/n5-m05-c02-l07-v1.json';
import {scoreTravelWriting} from '../../src/components/interactive/TravelWritingPractice';
describe('n5-m05-c02-l07 travel writing',()=>{
 it('has ten uniquely keyed questions with meaningful rationales',()=>{
  expect(bank.lessonId).toBe('n5-m05-c02-l07');expect(bank.items).toHaveLength(10);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(10);
  for(const q of bank.items){expect(q.status).toBe('internally-checked');expect(q.choices).toHaveLength(4);
   expect(new Set(q.choices.map(c=>c.text)).size).toBe(4);
   expect(q.choices.filter(c=>c.id===q.answerKey.choiceId)).toHaveLength(1);
   expect(q.choices.every(c=>c.rationale.length>30)).toBe(true);
  }
 });
 it('scores only exact keyed choices and does not grade prose',()=>{
  const a=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));
  expect(scoreTravelWriting(a)).toBe(10);expect(scoreTravelWriting({})).toBe(0);
  const q=bank.items[0];expect(scoreTravelWriting({...a,[q.id]:q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id})).toBe(9);
 });
});