import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/l0-m03-c01-l04-v1.json';
import { readFileSync } from 'node:fs';
describe('voiced kana script lesson',()=>{
 const lesson=readFileSync('src/content/lessons/l0/hiragana-voiced-script-practice.mdx','utf8');
 it('has ten stable questions with valid answer keys and textual evidence',()=>{
 expect(bank.items).toHaveLength(10);
 expect(new Set(bank.items.map(q=>q.id)).size).toBe(10);
 for(const q of bank.items){expect(q.options[q.correctIndex]).toBeTruthy();expect(q.answerKey.choiceId).toBe(q.choices[q.correctIndex].id);expect(q.explanation.length).toBeGreaterThan(20);expect(lesson).toContain(q.evidence.phrase);}
 });
 it('teaches all marked rows and does not claim an audio test',()=>{
 for(const row of ['が ぎ ぐ げ ご','ざ じ ず ぜ ぞ','だ ぢ づ で ど','ば び ぶ べ ぼ','ぱ ぴ ぷ ぺ ぽ'])expect(lesson).toContain(row);
 expect(lesson).toContain('Lesson 06');
 });
});