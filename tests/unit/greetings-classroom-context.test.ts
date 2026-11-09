import {describe,it,expect} from 'vitest';
import bank from '../../src/content/exercises/l0-m05-c01-l01-v1.json';
describe('classroom greetings context bank',()=>{
 it('contains eight unique fully keyed evidence-based items',()=>{
  expect(bank.items).toHaveLength(8);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(8);
  for(const q of bank.items){expect(q.id).toMatch(/^ex-l0-m05-c01-l01-/);expect(q.version).toBe(1);expect(q.status).toBe('drafted');expect(q.options[q.correctIndex]).toBe(q.choices.find(c=>c.id===q.answerKey.choiceId)?.text);expect(q.choices.every(c=>c.rationale.length>15)).toBe(true);expect(q.objectiveIds.length).toBeGreaterThan(0);expect(q.knowledgeItemIds.length).toBeGreaterThan(0)}
 });
});