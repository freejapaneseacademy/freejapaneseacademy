import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/l0-m04-c03-l01-v1.json';
describe('voiced katakana context bank',()=>{
 it('has eight stable, structurally aligned and independently keyed items',()=>{
  expect(bank.items).toHaveLength(8);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(8);
  for(const q of bank.items){expect(q.id).toMatch(/^ex-l0-m04-c03-l01-/);expect(q.status).toBe('drafted');expect(q.choices).toHaveLength(q.options.length);expect(q.choices[q.correctIndex].id).toBe(q.answerKey.choiceId);expect(q.explanation.length).toBeGreaterThan(15);expect(q.objectiveIds.length).toBeGreaterThan(0);}
 });
 it('distinguishes voiced and semi-voiced marks and ン/ソ',()=>{
  expect(bank.items[3].options[bank.items[3].correctIndex]).toBe('カバン');
  expect(bank.items[4].options[bank.items[4].correctIndex]).toBe('パン');
  expect(bank.items[5].options[bank.items[5].correctIndex]).toBe('ン');
 });
});