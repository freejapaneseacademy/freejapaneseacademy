import {describe,it,expect} from 'vitest';
import bank from '../../src/content/exercises/l0-m05-c01-l02-v1.json';
describe('greetings classroom vocabulary bank',()=>{
 it('has ten unique schema-keyed vocabulary questions',()=>{
 expect(bank.items).toHaveLength(10);
 expect(new Set(bank.items.map(q=>q.id)).size).toBe(10);
 for(const q of bank.items){expect(q.id).toMatch(/^ex-l0-m05-c01-l02-/);expect(q.status).toBe('drafted');expect(q.version).toBe(1);expect(q.choices.map(c=>c.id)).toContain(q.answerKey.choiceId);expect(q.options[q.correctIndex]).toBe(q.choices.find(c=>c.id===q.answerKey.choiceId)?.text);expect(new Set(q.options).size).toBe(q.options.length);expect(q.choices.every(c=>c.rationale.length>20)).toBe(true);expect(q.objectiveIds.length).toBeGreaterThan(0);expect(q.knowledgeItemIds.length).toBeGreaterThan(0)}
 });
});