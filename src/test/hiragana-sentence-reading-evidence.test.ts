import { describe, it, expect } from 'vitest';
import bank from '../src/content/exercises/l0-m03-c04-l05-v1.json';
import { readFileSync } from 'node:fs';
describe('L0-M03-C04-L05 evidence reading',()=>{
 const source=readFileSync('src/content/lessons/l0/hiragana-sentence-reading-evidence.mdx','utf8');
 it('has eight stable, unique answer-keyed questions with evidence in original passage',()=>{
  expect(bank.items).toHaveLength(8);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(8);
  for(const q of bank.items){
   expect(q.id).toMatch(/^ex-l0-m03-c04-l05-/);
   expect(q.choices[q.correctIndex].id).toBe(q.answerKey.choiceId);
   expect(q.evidence.phrase.length).toBeGreaterThan(3);
   expect(source).toContain(q.evidence.phrase);
   expect(q.explanation.length).toBeGreaterThan(15);
   expect(new Set(q.options).size).toBe(q.options.length);
  }
 });
 it('distinguishes reading from audio and preserves connected kana',()=>{
  expect(source).toContain('ねこのほんをみます。');
  expect(source).toContain('あおいほんのとなりです。');
  expect(source).toContain('not a recording');
 });
});
