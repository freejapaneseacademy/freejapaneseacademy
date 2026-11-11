import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/n5-m05-c04-l03-v1.json';
import { gradeTravelPlanParticles } from '../../src/components/interactive/TravelPlanParticlesPractice';
describe('n5-m05-c04-l03 grammar bank', () => {
 it('has 12 distinct valid questions and three distinct options each', () => {
   expect(bank.items).toHaveLength(12);
   expect(new Set(bank.items.map(q=>q.id)).size).toBe(12);
   for (const q of bank.items) {
     expect(q.choices).toHaveLength(3);
     expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);
     expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);
     expect(q.choices.every(c=>c.rationale.length>10)).toBe(true);
   }
 });
 it('scores correct and incorrect attempts separately', () => {
   const correct=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));
   const wrong=Object.fromEntries(bank.items.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id]));
   expect(gradeTravelPlanParticles(correct)).toBe(12);
   expect(gradeTravelPlanParticles(wrong)).toBe(0);
 });
});