import { describe,it,expect } from 'vitest';
import bank from '../../src/content/exercises/l0-m05-c01-l07-v1.json';
describe('classroom greeting writing',()=>{
 it('has eight unique, fully keyed written questions',()=>{
 expect(bank.items).toHaveLength(8);
 expect(new Set(bank.items.map(q=>q.id)).size).toBe(8);
 for(const q of bank.items){expect(q.id.startsWith('ex-')).toBe(true);expect(q.choices[q.correctIndex].id).toBe(q.answerKey.choiceId);expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.id)).size).toBe(3);expect(q.choices.every(c=>c.rationale.length>8)).toBe(true);expect(q.objectiveIds.length).toBeGreaterThan(0);}
 });
});