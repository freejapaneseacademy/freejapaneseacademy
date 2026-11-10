import {describe,it,expect} from 'vitest';
import bank from '../../src/content/exercises/l0-m05-c03-l08-v1.json';
import {scoreFirstSentenceShadow} from '../../src/components/interactive/FirstSentenceShadowing';
describe('first sentence optional shadowing written check',()=>{
 it('has eight unique keyed items and rationales',()=>{expect(bank.items).toHaveLength(8);expect(new Set(bank.items.map(q=>q.id)).size).toBe(8);for(const q of bank.items){expect(q.version).toBe(1);expect(q.status).toBe('internally-checked');expect(q.choices).toHaveLength(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.choices.every(c=>c.rationale.length>0)).toBe(true);}});
 it('scores only correct answers',()=>{const correct=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));expect(scoreFirstSentenceShadow(correct)).toBe(8);expect(scoreFirstSentenceShadow({})).toBe(0);expect(scoreFirstSentenceShadow({...correct,[bank.items[0].id]:'b'})).toBe(7);});
});