import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/l0-m03-c02-l02-v1.json';
import { readFileSync } from 'node:fs';
describe('contracted-kana word study',()=>{it('has ten distinct scored questions with grounded evidence and rationales',()=>{const source=readFileSync('src/content/lessons/l0/hiragana-yoon-vocabulary.mdx','utf8');expect(bank.items).toHaveLength(10);expect(new Set(bank.items.map(q=>q.id)).size).toBe(10);for(const q of bank.items){expect(q.options[q.correctIndex]).toBe(q.choices[q.correctIndex].text);expect(q.answerKey.choiceId).toBe(q.choices[q.correctIndex].id);expect(q.explanation.length).toBeGreaterThan(20);expect(source).toContain(q.evidence.phrase);}})});
