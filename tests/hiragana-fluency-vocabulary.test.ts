import { describe, expect, it } from 'vitest';
import bank from '../src/content/exercises/l0-m02-c04-l02-v1.json';
describe('L0-M02-C04-L02 vocabulary bank', () => {
 it('has ten unique stable questions with aligned keys and source evidence', () => {
  expect(bank.items).toHaveLength(10);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(10);
  for(const q of bank.items){expect(q.options[q.correctIndex]).toBe(q.choices[q.correctIndex].text);expect(q.answerKey.choiceId).toBe(q.choices[q.correctIndex].id);expect(q.explanation.length).toBeGreaterThan(20);expect(q.evidence.source).toContain('hiragana-fluency-vocabulary.mdx');}
 });
 it('distinguishes homonyms and particle usage',()=>{expect(bank.items.some(q=>q.prompt.includes('はな'))).toBe(true);expect(bank.items.some(q=>q.prompt.includes('ねこを'))).toBe(true);});
});
