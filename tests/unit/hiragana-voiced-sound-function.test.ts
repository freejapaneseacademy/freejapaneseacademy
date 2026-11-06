import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/l0-m03-c01-l03-v1.json';
import { readFileSync } from 'node:fs';
describe('voiced kana sound-function assessment',()=>{
 const lesson=readFileSync('src/content/lessons/l0/hiragana-voiced-sound-function.mdx','utf8');
 it('contains ten uniquely identified scored items with coherent keys and grounded evidence',()=>{
 expect(bank.items).toHaveLength(10);
 expect(new Set(bank.items.map(q=>q.id)).size).toBe(10);
 for(const q of bank.items){expect(q.options[q.correctIndex]).toBeTruthy();expect(q.answerKey.choiceId).toBe(q.choices[q.correctIndex].id);expect(q.explanation.length).toBeGreaterThan(20);expect(lesson).toContain(q.evidence.phrase);}
 });
 it('teaches all five marked rows and explicitly limits audio claims',()=>{
 for(const kana of ['が ぎ ぐ げ ご','ざ じ ず ぜ ぞ','だ ぢ づ で ど','ば び ぶ べ ぼ','ぱ ぴ ぷ ぺ ぽ'])expect(lesson).toContain(kana);
 expect(lesson).toContain('Lesson 06');
 });
});
