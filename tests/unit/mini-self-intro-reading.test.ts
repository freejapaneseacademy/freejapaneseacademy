import {describe,it,expect} from 'vitest';
import bank from '../../src/content/exercises/l0-m05-c03-l05-v1.json';
import {scoreAnswers} from '../../src/components/interactive/MiniSelfIntroReading';
describe('mini self-intro reading bank',()=>{
 it('has ten unique valid scored items with written evidence',()=>{expect(bank.items).toHaveLength(10);expect(new Set(bank.items.map(q=>q.id)).size).toBe(10);for(const q of bank.items){expect(q.status).toBe('drafted');expect(q.explanation.length).toBeGreaterThan(12);expect(q.objectiveIds.length).toBeGreaterThan(0);expect(q.knowledgeItemIds.length).toBeGreaterThan(0);expect(new Set(q.choices.map(c=>c.id)).size).toBe(q.choices.length);expect(q.choices.map(c=>c.id)).toContain(q.answerKey.choiceId);}});
 it('scores correct and incorrect answers separately from completion',()=>{const correct=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));expect(scoreAnswers(correct)).toBe(10);const wrong=Object.fromEntries(bank.items.map(q=>[q.id,q.choices[1].id]));expect(scoreAnswers(wrong)).toBe(0);});
});