import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/l0-m04-c01-l02-v1.json';
describe('katakana kiosk vocabulary question bank',()=>{
 it('has eight stable schema-compliant scored items',()=>{expect(bank.items).toHaveLength(8);expect(new Set(bank.items.map(q=>q.id)).size).toBe(8);for(const q of bank.items){expect(q.id).toMatch(/^ex-l0-m04-c01-l02-/);expect(q.status).toBe('drafted');expect(q.choices).toHaveLength(q.options.length);expect(q.choices[q.correctIndex].id).toBe(q.answerKey.choiceId);expect(q.explanation.length).toBeGreaterThan(20);expect(q.objectiveIds.length).toBeGreaterThan(0);expect(new Set(q.options).size).toBe(q.options.length);}});
 it('distinguishes cocoa, cacao and context-sensitive ice',()=>{expect(bank.items[0].options[bank.items[0].correctIndex]).toBe('ココア');expect(bank.items[1].options[bank.items[1].correctIndex]).toBe('カカオ');expect(bank.items[6].options[bank.items[6].correctIndex]).toMatch(/depending on context/);});
});