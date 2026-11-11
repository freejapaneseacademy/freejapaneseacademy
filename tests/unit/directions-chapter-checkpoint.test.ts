import {describe,it,expect} from 'vitest';
import bank from '../../src/content/exercises/n5-m05-c03-chk-v1.json';
import {scoreDirectionCheckpoint} from '../../src/components/interactive/DirectionChapterCheckpoint';
describe('directions checkpoint bank',()=>{
 it('contains 12 distinct, evidence-based, keyed questions',()=>{
  expect(bank.items).toHaveLength(12);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(12);
  for(const q of bank.items){expect(q.id).toMatch(/^ex-n5-m05-c03-chk-/);expect(q.choices).toHaveLength(3);expect(q.choices.filter(c=>c.id===q.answerKey.choiceId)).toHaveLength(1);expect(q.evidence.length).toBeGreaterThan(2);expect(q.explanation.length).toBeGreaterThan(5);for(const c of q.choices)expect(c.rationale.length).toBeGreaterThan(5);}
 });
 it('scores correct, wrong and unanswered choices',()=>{
  const all=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));
  expect(scoreDirectionCheckpoint(all)).toBe(12);
  expect(scoreDirectionCheckpoint({})).toBe(0);
  const wrong=Object.fromEntries(bank.items.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id]));
  expect(scoreDirectionCheckpoint(wrong)).toBe(0);
 });
});