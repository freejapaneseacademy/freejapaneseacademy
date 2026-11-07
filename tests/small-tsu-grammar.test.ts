import { describe,it,expect } from 'vitest';
import bank from '../src/content/exercises/l0-m03-c03-l03-v1.json';
import { readFileSync } from 'node:fs';
const source=readFileSync('src/content/lessons/l0/hiragana-small-tsu-grammar.mdx','utf8');
describe('small-tsu grammar lesson',()=>{it('has ten unique keyed evidence-based items',()=>{expect(bank.items).toHaveLength(10);expect(new Set(bank.items.map(x=>x.id)).size).toBe(10);for(const q of bank.items){expect(q.choices[q.correctIndex].id).toBe(q.answerKey.choiceId);expect(q.explanation.length).toBeGreaterThan(12);expect(source).toContain(q.evidence.phrase);expect(q.choices).toHaveLength(q.options.length);}});it('teaches accurate contrasts',()=>{for(const s of ['きって','きて','つき','こうえん','おおきい','せんせい','がっこう'])expect(source).toContain(s);});});