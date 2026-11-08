import { describe, it, expect } from 'vitest';
import bank from '../content/exercises/l0-m04-c02-l03-v1.json';
describe('N/H/M/Y written shape question integrity',()=>{
 it('has eight unique stable questions and exact answer keys',()=>{
  expect(bank.items).toHaveLength(8);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(8);
  for(const q of bank.items){expect(q.id.startsWith('ex-l0-m04-c02-l03-')).toBe(true);expect(q.choices[q.correctIndex].id).toBe(q.answerKey.choiceId);expect(q.choices.map(c=>c.text)).toEqual(q.options);expect(q.explanation.length).toBeGreaterThan(12);}
 });
 it('contrasts distinct written shapes and context',()=>{expect(bank.items.some(q=>q.prompt.includes('ナ'))).toBe(true);expect(bank.items.some(q=>q.prompt.includes('ミナ'))).toBe(true);});
});
