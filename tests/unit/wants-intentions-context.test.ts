import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/n5-m07-c02-l01-v1.json';
import { gradeWantsContext } from '../../src/components/interactive/WantsContextPractice';
describe('wants and intentions context',()=>{
 it('has eight original, keyed, accessible-choice items',()=>{expect(bank.items).toHaveLength(8);expect(new Set(bank.items.map(q=>q.id)).size).toBe(8);for(const q of bank.items){expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.explanation.length).toBeGreaterThan(30);expect(q.choices.every(c=>c.rationale.length>10)).toBe(true);}});
 it('grades full, empty, partial and wrong answers',()=>{const all=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));expect(gradeWantsContext(all)).toBe(8);expect(gradeWantsContext({})).toBe(0);expect(gradeWantsContext({[bank.items[0].id]:bank.items[0].answerKey.choiceId})).toBe(1);expect(gradeWantsContext({[bank.items[0].id]:bank.items[0].choices.find(c=>c.id!==bank.items[0].answerKey.choiceId)!.id})).toBe(0);});
});