import { describe, expect, it } from 'vitest';
import bank from '../src/content/exercises/l0-m03-c02-l07-v1.json';
import { readFileSync } from 'node:fs';
describe('L0-M03-C02-L07 writing source',()=>{
 const mdx=readFileSync('src/content/lessons/l0/hiragana-yoon-writing.mdx','utf8');
 it('has stable unique scored IDs and evidence-backed answers',()=>{
  expect(bank.items).toHaveLength(8);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(8);
  for(const q of bank.items){expect(q.answer.length).toBeGreaterThan(0);expect(mdx).toContain(q.evidence.phrase);expect(q.explanation.length).toBeGreaterThan(10);}
 });
 it('teaches the contrast and retains self-review boundaries',()=>{expect(mdx).toContain('きゃ');expect(mdx).toContain('きや');expect(mdx).toContain('self-review');});
});