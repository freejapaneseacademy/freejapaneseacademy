import {describe,it,expect} from 'vitest';
import bank from '../../src/content/exercises/l0-m05-c01-l05-v1.json';
import {scoreGreetingCardAnswers} from '../../src/components/interactive/GreetingCardReading';
describe('l0-m05-c01-l05 reading evidence bank',()=>{
 it('has eight unique, supported questions and valid answer keys',()=>{
 expect(bank.items).toHaveLength(8);
 expect(new Set(bank.items.map(q=>q.id)).size).toBe(8);
 for(const q of bank.items){expect(q.status).toBe('drafted');expect(q.explanation.length).toBeGreaterThan(15);expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);}
 });
 it('scores exact keyed responses, not merely completed responses',()=>{
 const correct=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));
 expect(scoreGreetingCardAnswers(correct)).toBe(8);
 expect(scoreGreetingCardAnswers({})).toBe(0);
 const wrong=Object.fromEntries(bank.items.map(q=>[q.id,q.choices[1].id]));
 expect(scoreGreetingCardAnswers(wrong)).toBe(0);
 });
});