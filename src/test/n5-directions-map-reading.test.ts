import {describe,it,expect} from 'vitest';
import bank from '../content/exercises/n5-m05-c03-l05-v1.json';
import {scoreDirectionReading} from '../components/interactive/DirectionReadingPractice';
describe('N5-M05-C03-L05 written route',()=>{
 it('has eight unique answerable items with three distinct feedback choices',()=>{expect(bank.items).toHaveLength(8);expect(new Set(bank.items.map(q=>q.id)).size).toBe(8);for(const q of bank.items){expect(q.id).toMatch(/^ex-n5-m05-c03-l05-\d\d$/);expect(q.type).toBe('single-choice');expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.choices.every(c=>c.rationale.length>20)).toBe(true);expect(q.evidence.length).toBeGreaterThan(4);}});
 it('scores correct, empty and wrong responses',()=>{expect(scoreDirectionReading(Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId])))).toBe(8);expect(scoreDirectionReading({})).toBe(0);expect(scoreDirectionReading(Object.fromEntries(bank.items.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id])))).toBe(0);});
 it('is written reading, not simulated listening',()=>{expect(bank.scoring.maxWrittenScore).toBe(8);expect(bank.items.every(q=>!q.skills.includes('listening'))).toBe(true);});
});