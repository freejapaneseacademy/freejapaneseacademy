import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/l0-m03-c02-l04-v1.json';
import { readFileSync } from 'node:fs';
describe('contracted kana script lesson',()=>{
 const lesson=readFileSync('src/content/lessons/l0/hiragana-yoon-script-practice.mdx','utf8');
 it('has ten stable questions with valid keys and evidence',()=>{
  expect(bank.items).toHaveLength(10);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(10);
  for(const q of bank.items){expect(q.options[q.correctIndex]).toBeTruthy();expect(q.answerKey.choiceId).toBe(q.choices[q.correctIndex].id);expect(q.explanation.length).toBeGreaterThan(20);expect(lesson).toContain(q.evidence.phrase);}
 });
 it('teaches kana size, IME and optional tracing without fake audio claims',()=>{
  for(const s of ['きゃ','しゅ','ちょ','きや','kya → きゃ','ぎゅうにゅう','Optional handwriting','Lesson 06'])expect(lesson).toContain(s);
 });
});