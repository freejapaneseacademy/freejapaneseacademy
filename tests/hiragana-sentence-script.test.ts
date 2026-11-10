import { describe, expect, it } from 'vitest';
import bank from '../src/content/exercises/l0-m03-c04-l04-v1.json';
describe('L0-M03-C04-L04 written question bank',()=>{
 it('has eight unique stable scored items with matching answer keys and source evidence',()=>{
  expect(bank.items).toHaveLength(8);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(8);
  for(const q of bank.items){expect(q.id).toMatch(/^ex-l0-m03-c04-l04-/);expect(q.choices[q.correctIndex].id).toBe(q.answerKey.choiceId);expect(q.evidence.phrase.length).toBeGreaterThan(0);expect(q.explanation.length).toBeGreaterThan(15);}
 });
});
