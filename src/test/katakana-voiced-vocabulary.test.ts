import { describe, expect, it } from 'vitest';
import bank from '../content/exercises/l0-m04-c03-l02-v1.json';
describe('katakana voiced vocabulary lesson',()=>{
 it('has eight unique schema-aligned items with unambiguous answer keys',()=>{
  expect(bank.items).toHaveLength(8);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(8);
  for(const q of bank.items){expect(q.id).toMatch(/^ex-/);expect(q.version).toBe(1);expect(q.status).toBe('drafted');expect(q.choices[q.correctIndex].id).toBe(q.answerKey.choiceId);expect(new Set(q.choices.map(c=>c.id)).size).toBe(q.choices.length);expect(q.explanation.length).toBeGreaterThan(15);}
 });
 it('preserves the shelf evidence',()=>{expect(bank.items[0].choices[bank.items[0].correctIndex].text).toBe('ペン');expect(bank.items[5].choices[bank.items[5].correctIndex].text).toBe('ペン');});
});
