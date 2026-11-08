import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/l0-m04-c01-l01-v1.json';
describe('katakana kiosk context question bank',()=>{
 it('contains eight stable unique graded questions and schema-v3 compatible choices',()=>{
  expect(bank.items).toHaveLength(8);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(8);
  for(const q of bank.items){expect(q.id).toMatch(/^ex-l0-m04-c01-l01-/);expect(q.status).toBe('drafted');expect(q.choices).toHaveLength(q.options.length);expect(q.choices[q.correctIndex].id).toBe(q.answerKey.choiceId);expect(q.explanation.length).toBeGreaterThan(15);expect(q.objectiveIds.length).toBeGreaterThan(0);}
 });
 it('distinguishes hiragana from katakana and the clerk from the customer',()=>{expect(bank.items[0].options[bank.items[0].correctIndex]).toContain('Mika');expect(bank.items[3].options[bank.items[3].correctIndex]).toBe('おかし');});
});
