import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import bank from '../../src/content/exercises/l0-m03-c03-l07-v1.json';
const lesson=readFileSync('src/content/lessons/l0/hiragana-small-tsu-writing.mdx','utf8');
describe('L0-M03-C03-L07 writing',()=>{
 it('has eight unique model-backed stable items',()=>{expect(bank.items).toHaveLength(8);expect(new Set(bank.items.map(q=>q.id)).size).toBe(8);for(const q of bank.items){expect(q.answerKey.accepted).toContain(q.answer);expect(q.explanation.length).toBeGreaterThan(20);expect(lesson).toContain(q.evidence.phrase);}});
 it('teaches both small tsu and written long-vowel distinctions',()=>{for(const s of ['き・っ・て','つき','がっこう','こうえん','おおきい','せんせい','とおい','self-review'])expect(lesson).toContain(s);});
});
