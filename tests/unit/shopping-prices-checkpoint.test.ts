import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/n5-m04-c02-chk-v1.json';
import { checkpointItems, scoreCheckpoint } from '../../src/components/interactive/ShoppingPricesCheckpoint';
describe('shopping prices chapter checkpoint',()=>{
 it('has twelve distinct versioned questions and keyed choices',()=>{expect(bank.items).toHaveLength(12);expect(new Set(bank.items.map(q=>q.id)).size).toBe(12);for(const q of bank.items){expect(q.status).toBe('internally-checked');expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.choices.every(c=>c.rationale.length>5)).toBe(true);}});
 it('scores only matching keyed answers',()=>{expect(scoreCheckpoint({})).toBe(0);expect(scoreCheckpoint(Object.fromEntries(checkpointItems.map(q=>[q.id,q.answerKey.choiceId])))).toBe(12);});
});
