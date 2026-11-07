import { describe, it, expect } from 'vitest';
import bank from '../src/content/exercises/l0-m03-c02-chk.json';
import { scoreCheckpoint } from '../src/components/interactive/HiraganaYoonCheckpoint';
describe('L0-M03-C02-CHK', () => {
 it('contains twelve stable mixed scored items with explanations and evidence', () => {
  expect(bank.items).toHaveLength(12);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(12);
  expect(bank.items.filter(q=>q.area==='kana')).toHaveLength(4);
  expect(bank.items.filter(q=>q.area==='reading')).toHaveLength(4);
  expect(bank.items.filter(q=>q.area==='listening')).toHaveLength(4);
  for (const q of bank.items) { expect(q.id).toMatch(/^ex-l0-m03-c02-chk-\d{3}$/); expect(q.choices).toHaveLength(3); expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true); expect(q.explanation.length).toBeGreaterThan(20); expect(q.evidence.length).toBeGreaterThan(2); }
 });
 it('scores full and empty answers', () => {
  expect(scoreCheckpoint(bank.items,Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId])))).toBe(12);
  expect(scoreCheckpoint(bank.items,{})).toBe(0);
 });
});