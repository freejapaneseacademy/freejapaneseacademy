import {describe,it,expect} from 'vitest';
import bank from '../../src/content/exercises/n5-m04-c01-l06-v1.json';
import {gradeCafeListening,cafeListeningQuestions} from '../../src/components/interactive/CafeListeningPractice';
describe('n5-m04-c01-l06 listening',()=>{
 it('contains six unique evidence-backed items split evenly across two tracks',()=>{
 expect(bank.items).toHaveLength(6);
 expect(new Set(bank.items.map(q=>q.id)).size).toBe(6);
 expect(bank.items.filter(q=>q.trackId==='a')).toHaveLength(3);
 expect(bank.items.filter(q=>q.trackId==='b')).toHaveLength(3);
 for(const q of bank.items){expect(q.evidence.length).toBeGreaterThan(5);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(new Set(q.choices.map(c=>c.text)).size).toBe(q.choices.length);}
 expect(cafeListeningQuestions).toHaveLength(6);
 });
 it('grades only exact choice IDs',()=>{const correct=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));expect(gradeCafeListening(correct)).toBe(6);expect(gradeCafeListening({})).toBe(0);});
});
