import {describe,it,expect} from 'vitest';
import bank from '../content/exercises/l0-m05-c01-chk-v1.json';
import {scoreGreetingCheckpoint} from '../components/interactive/GreetingClassroomCheckpoint';
describe('greeting classroom checkpoint',()=>{
 it('has 14 uniquely keyed questions and listening evidence',()=>{expect(bank.items).toHaveLength(14);expect(new Set(bank.items.map(q=>q.id)).size).toBe(14);expect(bank.items.filter(q=>q.area==='listening')).toHaveLength(4);for(const q of bank.items){expect(q.id).toMatch(/^ex-/);expect(q.choices.length).toBeGreaterThanOrEqual(3);expect(new Set(q.choices.map(c=>c.id)).size).toBe(q.choices.length);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.explanation.length).toBeGreaterThan(15);}});
 it('scores only correct answer keys',()=>{expect(scoreGreetingCheckpoint(Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId])))).toBe(14);expect(scoreGreetingCheckpoint({})).toBe(0);});
});
