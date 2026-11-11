import {describe,it,expect} from 'vitest';
import bank from '../../src/content/exercises/n5-m02-c01-l07-v1.json';
import {scoreWritingRecognition} from '../../src/components/interactive/LostFoundWritingWorkshop';
describe('n5-m02-c01-l07 written-form bank',()=>{
 it('contains eight distinct, keyed and explained items',()=>{
  expect(bank.items).toHaveLength(8);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(8);
  for(const q of bank.items){expect(q.status).toBe('internally-checked');expect(q.choices).toHaveLength(4);expect(new Set(q.choices.map(c=>c.text)).size).toBe(4);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.choices.every(c=>c.rationale.length>10)).toBe(true);expect(q.explanation.length).toBeGreaterThan(20);}
 });
 it('scores keyed responses without scoring free writing',()=>{
  const correct=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));
  expect(scoreWritingRecognition(correct)).toBe(8);
  expect(scoreWritingRecognition({})).toBe(0);
  expect(scoreWritingRecognition({...correct,[bank.items[0].id]:'invalid'})).toBe(7);
 });
});
