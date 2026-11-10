import {describe,it,expect} from 'vitest';
import bank from '../../src/content/exercises/n5-m04-c02-l01-v1.json';
describe('shopping and prices context',()=>{
 it('has twelve stable distinct questions',()=>{expect(bank.items).toHaveLength(12);expect(new Set(bank.items.map(q=>q.id)).size).toBe(12)});
 it('has answer keys, rationales and objective links',()=>{for(const q of bank.items){expect(q.answerKey.choiceId).toBeDefined();expect(q.choices).toHaveLength(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.every(c=>c.rationale.length>8)).toBe(true);expect(q.objectiveIds.length).toBeGreaterThan(0)}});
 it('distinguishes two prices of 400 yen',()=>{expect(bank.items[3].choices[0].text).toBe('400円');expect(bank.items[9].choices[0].text).toContain('Two small notebooks')});
});