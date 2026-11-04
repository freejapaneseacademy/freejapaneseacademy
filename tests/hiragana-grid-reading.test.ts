import { describe, expect, it } from 'vitest';
import bank from '../src/content/exercises/l0-m02-c01-l05-v1.json';
import { readFileSync } from 'node:fs';

const lesson = readFileSync('src/content/lessons/l0/hiragana-vowels-ks-reading.mdx','utf8');
describe('L0 M02 C01 L05 evidence-based reading', () => {
  it('has eight stable unique scored reading items with valid answer keys and cited source text', () => {
    expect(bank.items).toHaveLength(8);
    expect(new Set(bank.items.map(q=>q.id)).size).toBe(8);
    for (const q of bank.items) {
      expect(q.id).toMatch(/^ex-l0-m02-c01-l05-\d{2}$/);
      expect(q.options[q.correctIndex]).toBeTruthy();
      expect(q.answerKey.choiceId).toBe(q.choices[q.correctIndex].id);
      expect(q.explanation.length).toBeGreaterThan(20);
      expect(lesson).toContain(q.evidence.phrase);
    }
  });
  it('contains the entire grid and every source word card', () => {
    for (const kana of 'あいうえおかきくけこさしすせそ') expect(lesson).toContain(kana);
    for (const word of ['かさ','すし','いす','ここ','せかい']) expect(lesson).toContain(word);
  });
});
