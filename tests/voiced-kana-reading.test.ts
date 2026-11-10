import { describe, expect, it } from 'vitest';
import bank from '../src/content/exercises/l0-m03-c01-l05-v1.json';
import { readFileSync } from 'node:fs';
describe('L0-M03-C01-L05 evidence-backed reading',()=>{
 const mdx=readFileSync('src/content/lessons/l0/hiragana-voiced-reading.mdx','utf8');
 it('has ten stable unique scored items',()=>{expect(bank.items).toHaveLength(10);expect(new Set(bank.items.map(q=>q.id)).size).toBe(10);});
 it('grounds each correct answer in literal Japanese evidence',()=>{for(const q of bank.items){expect(q.options[q.correctIndex]).toBeTruthy();expect(q.answerKey.choiceId).toBe(q.choices[q.correctIndex].id);expect(mdx).toContain(q.evidence.phrase);expect(q.explanation.length).toBeGreaterThan(15);}});
 it('preserves visual contrasts and no fabricated audio',()=>{for(const x of ['**は**','**ば**','**ぱ**','**みず**','**ぱん**','**かぎは １ばん。**'])expect(mdx).toContain(x);expect(mdx).toContain('not** an audio');});
});