import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/l0-m04-c01-l03-v1.json';
describe('katakana shape bank',()=>{
 it('has eight uniquely identified, fully explained and keyed items',()=>{
  expect(bank.items).toHaveLength(8);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(8);
  for(const q of bank.items){expect(q.choices[q.correctIndex].id).toBe(q.answerKey.choiceId);expect(q.explanation.length).toBeGreaterThan(15);expect(q.choices.length).toBe(3);}
 });
 it('covers the S/T visual contrast and K-row confusables',()=>{
  const text=bank.items.map(q=>q.prompt+' '+q.explanation).join(' ');
  expect(text).toContain('シ');expect(text).toContain('ツ');expect(text).toContain('ケ');expect(text).toContain('ク');
 });
});