import { describe,expect,it } from 'vitest';
import bank from '../../src/content/exercises/l0-m04-c01-l05-v1.json';
describe('katakana kiosk evidence reading bank',()=>{
 it('has eight unique schema-conforming stable questions',()=>{expect(bank.items).toHaveLength(8);expect(new Set(bank.items.map(q=>q.id)).size).toBe(8);for(const q of bank.items){expect(q.id).toMatch(/^ex-l0-m04-c01-l05-/);expect(q.status).toBe('drafted');expect(q.choices).toHaveLength(q.options.length);expect(q.answerKey.choiceId).toBe(q.choices[q.correctIndex].id);expect(q.explanation.length).toBeGreaterThan(15);expect(q.objectiveIds.length).toBeGreaterThan(0);}});
 it('grounds reading keys in printed evidence without invented prices',()=>{expect(bank.items[0].options[bank.items[0].correctIndex]).toBe('ココア');expect(bank.items[6].explanation).toContain('separate lines');expect(bank.items[7].explanation).toContain('No prices');});
});
