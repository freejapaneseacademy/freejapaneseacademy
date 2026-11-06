import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/l0-m02-c04-l01-v1.json';
describe('Hiragana fluency context written bank',()=>{
 it('has eight stable IDs, aligned keys, explanations and textual evidence',()=>{
  expect(bank.items).toHaveLength(8);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(8);
  for(const q of bank.items){expect(q.options[q.correctIndex]).toBe(q.choices[q.correctIndex].text);expect(q.answerKey.choiceId).toBe(q.choices[q.correctIndex].id);expect(q.explanation.length).toBeGreaterThan(15);expect(q.evidence.phrase.length).toBeGreaterThan(1);}
 });
});
