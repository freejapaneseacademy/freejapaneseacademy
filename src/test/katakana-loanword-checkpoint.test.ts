import {describe,it,expect} from 'vitest';
import bank from '../content/exercises/l0-m04-c04-chk-v1.json';
import {scoreCheckpoint} from '../components/interactive/KatakanaLoanwordCheckpoint';
describe('katakana loanword checkpoint',()=>{
 it('has 13 unique valid items and at least three listening items',()=>{expect(bank.items).toHaveLength(13);expect(new Set(bank.items.map(q=>q.id)).size).toBe(13);expect(bank.items.filter(q=>q.area==='listening').length).toBeGreaterThanOrEqual(3);for(const q of bank.items){expect(q.id).toMatch(/^ex-/);expect(q.choices.length).toBeGreaterThanOrEqual(3);expect(new Set(q.choices.map(c=>c.id)).size).toBe(q.choices.length);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.explanation.length).toBeGreaterThan(15);}});
 it('scores only exact keyed choices',()=>{expect(scoreCheckpoint(Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId])))).toBe(13);expect(scoreCheckpoint({})).toBe(0);});
});
