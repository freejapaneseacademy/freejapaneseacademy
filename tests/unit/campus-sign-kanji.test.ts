import {describe,it,expect} from 'vitest';
import bank from '../../src/content/exercises/n5-m02-c02-l04-v1.json';
import {scoreAnswers} from '../../src/components/interactive/CampusSignKanjiPractice';
describe('campus sign kanji',()=>{
 it('has ten unique questions and valid feedback',()=>{expect(bank.items).toHaveLength(10);expect(new Set(bank.items.map(q=>q.id)).size).toBe(10);for(const q of bank.items){expect(q.choices).toHaveLength(4);expect(new Set(q.choices.map(c=>c.text)).size).toBe(4);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.choices.every(c=>c.rationale.length>5)).toBe(true);}});
 it('scores keyed answers',()=>{expect(scoreAnswers(Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId])))).toBe(10);expect(scoreAnswers({})).toBe(0);});
 it('varies correct answer positions',()=>{expect(new Set(bank.items.map(q=>q.answerKey.choiceId)).size).toBeGreaterThan(2);});
});