import {describe,it,expect} from 'vitest';
import bank from '../../src/content/exercises/n5-m04-c03-l08-v1.json';
import {scoreAdjectiveSpeaking} from '../../src/components/interactive/AdjectiveSpeakingRehearsal';
describe('n5-m04-c03-l08 speaking preparation',()=>{
 it('has eight keyed unique items and rationale feedback',()=>{
 expect(bank.lessonId).toBe('n5-m04-c03-l08');expect(bank.items).toHaveLength(8);
 expect(new Set(bank.items.map(q=>q.id)).size).toBe(8);
 for(const q of bank.items){expect(q.status).toBe('internally-checked');expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.choices.every(c=>c.rationale.length>25)).toBe(true);}
 });
 it('scores written recognition without claiming speech assessment',()=>{
 const a=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));
 expect(scoreAdjectiveSpeaking(a)).toBe(8);expect(scoreAdjectiveSpeaking({})).toBe(0);
 a[bank.items[0].id]='invalid';expect(scoreAdjectiveSpeaking(a)).toBe(7);
 });
});