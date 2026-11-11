import {describe,it,expect} from 'vitest';
import bank from '../content/exercises/n5-m05-c02-l03-v1.json';
import {scoreCompanionGrammar} from '../components/interactive/CompanionGrammarPractice';
describe('N5-M05-C01-L03 means and companions grammar',()=>{
 it('contains 12 unique, schema-compliant feedback-rich items',()=>{expect(bank.items).toHaveLength(12);expect(new Set(bank.items.map(q=>q.id)).size).toBe(12);for(const q of bank.items){expect(q.id).toMatch(/^ex-n5-m05-c02-l03-q\d\d-v1$/);expect(q.version).toBe(1);expect(q.status).toBe('internally-checked');expect(q.type).toBe('single-choice');expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.choices.every(c=>c.rationale.length>20)).toBe(true);expect(q.explanation.length).toBeGreaterThan(20);}});
 it('scores only the correct choice and supports retries',()=>{const good=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));expect(scoreCompanionGrammar(good)).toBe(12);expect(scoreCompanionGrammar({})).toBe(0);const bad=Object.fromEntries(bank.items.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id]));expect(scoreCompanionGrammar(bad)).toBe(0);});
 it('uses written skills, not simulated listening',()=>{expect(bank.items.every(q=>!q.skills.includes('listening'))).toBe(true);});
});
