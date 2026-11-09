import {describe,it,expect} from 'vitest';
import bank from '../../src/content/exercises/l0-m05-c01-l08-v1.json';
import {scoreGreetingShadow} from '../../src/components/interactive/GreetingClassroomShadowing';
describe('greeting classroom shadowing written preparation',()=>{
 it('uses valid unique versioned keys and rationales',()=>{expect(bank.items).toHaveLength(6);expect(new Set(bank.items.map(q=>q.id)).size).toBe(6);for(const q of bank.items){expect(q.status).toBe('internally-checked');expect(q.choices).toHaveLength(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.choices.every(c=>c.rationale.length>0)).toBe(true);}});
 it('scores only correct written choices',()=>{const correct=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));expect(scoreGreetingShadow(correct)).toBe(6);expect(scoreGreetingShadow({})).toBe(0);expect(scoreGreetingShadow({...correct,[bank.items[0].id]:'b'})).toBe(5);});
});
