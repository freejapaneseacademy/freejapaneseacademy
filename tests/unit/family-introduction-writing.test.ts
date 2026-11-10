import { describe,it,expect } from 'vitest';
import bank from '../../src/content/exercises/n5-m01-c03-l07-v1.json';
import { gradeFamilyWriting } from '../../src/components/interactive/FamilyIntroductionWriting';
describe('family introduction writing',()=>{
 it('has eight unique schema-consistent answer keys',()=>{expect(bank.items).toHaveLength(8);expect(new Set(bank.items.map(q=>q.id)).size).toBe(8);for(const q of bank.items){expect(q.choices[q.correctIndex].id).toBe(q.answerKey.choiceId);expect(q.choices.map(c=>c.text)).toEqual(q.options);expect(q.choices.every(c=>Boolean(c.rationale))).toBe(true);}});
 it('scores keyed answers and rejects distractors',()=>{const all=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));expect(gradeFamilyWriting(all)).toBe(8);const wrong=Object.fromEntries(bank.items.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id]));expect(gradeFamilyWriting(wrong)).toBe(0);});
});