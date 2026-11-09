import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/l0-m04-c03-l05-v1.json';
describe('katakana voiced store reading bank',()=>{
 it('has eight uniquely keyed, versioned evidence questions',()=>{
  expect(bank.items).toHaveLength(8);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(8);
  for(const q of bank.items){expect(q.id).toMatch(/^ex-l0-m04-c03-l05-/);expect(q.status).toBe('drafted');expect(q.choices).toHaveLength(q.options.length);expect(q.choices[q.correctIndex].id).toBe(q.answerKey.choiceId);expect(q.explanation.length).toBeGreaterThan(15);expect(q.evidence.phrase.length).toBeGreaterThan(0);expect(q.objectiveIds.length).toBeGreaterThan(0);}
 });
 it('requires exact printed evidence for ン/ソ and sound marks',()=>{
  expect(bank.items[2].options[bank.items[2].correctIndex]).toBe('ソース');
  expect(bank.items[5].options[bank.items[5].correctIndex]).toBe('カバン');
  expect(bank.items[6].options[bank.items[6].correctIndex]).toBe('コップ');
 });
});
