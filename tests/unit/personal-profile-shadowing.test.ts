import {describe,it,expect} from 'vitest';
import bank from '../../src/content/exercises/n5-m01-c04-l08-v1.json';
import {scoreProfileShadowing} from '../../src/components/interactive/ProfileShadowingStudio';
describe('n5-m01-c04-l08 speaking preparation',()=>{
 it('has eight unique, explained, versioned and rationalized written items',()=>{
 expect(bank.items).toHaveLength(8);expect(new Set(bank.items.map(q=>q.id)).size).toBe(8);
 for(const q of bank.items){expect(q.status).toBe('internally-checked');expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.choices.every(c=>c.rationale.length>20)).toBe(true);expect(q.explanation.length).toBeGreaterThan(20);}
 });
 it('scores perfect, blank and one incorrect answer',()=>{const a=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));expect(scoreProfileShadowing(a)).toBe(8);expect(scoreProfileShadowing({})).toBe(0);a[bank.items[0].id]='invalid';expect(scoreProfileShadowing(a)).toBe(7);});
});
