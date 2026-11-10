import {describe,it,expect} from 'vitest';
import bank from '../../src/content/exercises/n5-m01-c01-l02-v1.json';
import {scoreMeetingWords} from '../../src/components/interactive/MeetingWordsPractice';
describe('N5 first-meeting vocabulary',()=>{
 it('has ten unique keyed and explained questions',()=>{expect(bank.items).toHaveLength(10);expect(new Set(bank.items.map(q=>q.id)).size).toBe(10);for(const q of bank.items){expect(q.choices).toHaveLength(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.choices.every(c=>c.rationale.length>15)).toBe(true);}});
 it('scores only selected correct IDs',()=>{const a=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));expect(scoreMeetingWords(a)).toBe(10);a[bank.items[0].id]=bank.items[0].choices[1].id;expect(scoreMeetingWords(a)).toBe(9);expect(scoreMeetingWords({})).toBe(0);});
});