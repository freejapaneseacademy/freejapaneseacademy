import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/l0-m03-c03-l04-v1.json';
import { readFileSync } from 'node:fs';
describe('small tsu and long vowels script lesson',()=>{
 const lesson=readFileSync('src/content/lessons/l0/hiragana-small-tsu-script-practice.mdx','utf8');
 it('has ten stable questions with correct keys and cited lesson evidence',()=>{
  expect(bank.items).toHaveLength(10);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(10);
  for(const q of bank.items){expect(q.options[q.correctIndex]).toBeTruthy();expect(q.answerKey.choiceId).toBe(q.choices[q.correctIndex].id);expect(q.explanation.length).toBeGreaterThan(20);expect(lesson).toContain(q.evidence.phrase);}
 });
 it('teaches written forms, IME and optional tracing without fake listening',()=>{
  for(const s of ['きって','つき','がっこう','こうえん','おおきい','せんせい','kitte → きって','Optional tracing','Lesson 06'])expect(lesson).toContain(s);
 });
});
